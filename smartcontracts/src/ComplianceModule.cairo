use starknet::ContractAddress;

#[derive(Drop, Serde)]
pub struct ComplianceRule {
    pub rule_id: felt252,
    pub rule_type: felt252,
    pub min_threshold: u256,
    pub max_threshold: u256,
    pub is_active: bool,
    pub description: ByteArray,
}

#[derive(Drop, Serde)]
pub struct ComplianceProof {
    pub user: ContractAddress,
    pub rule_id: felt252,
    pub proof_data: Array<felt252>,
    pub is_compliant: bool,
    pub timestamp: u64,
}

#[derive(Drop, Serde)]
pub struct ComplianceAttestation {
    pub attestation_id: felt252,
    pub user: ContractAddress,
    pub rules_checked: Array<felt252>,
    pub all_compliant: bool,
    pub validity_period: u64,
    pub issued_at: u64,
}

#[starknet::interface]
pub trait IComplianceModule<TContractState> {
    // Compliance proof generation and verification
    fn generate_compliance_proof(
        ref self: TContractState,
        rule_id: felt252,
        user_commitment: felt252,
        proof_data: Array<felt252>
    ) -> felt252;
    
    fn verify_compliance(
        self: @TContractState,
        attestation_id: felt252
    ) -> bool;
    
    fn batch_verify_compliance(
        ref self: TContractState,
        user: ContractAddress,
        rule_ids: Array<felt252>,
        proofs: Array<Array<felt252>>
    ) -> felt252;
    
    // Rule management
    fn add_compliance_rule(
        ref self: TContractState,
        rule_type: felt252,
        min_threshold: u256,
        max_threshold: u256,
        description: ByteArray
    ) -> felt252;
    
    fn update_compliance_rule(
        ref self: TContractState,
        rule_id: felt252,
        min_threshold: u256,
        max_threshold: u256,
        is_active: bool
    );
    
    fn get_compliance_rule(
        self: @TContractState,
        rule_id: felt252
    ) -> ComplianceRule;
    
    // Compliance status queries
    fn get_compliance_status(
        self: @TContractState,
        user: ContractAddress,
        rule_id: felt252
    ) -> bool;
    
    fn get_user_attestations(
        self: @TContractState,
        user: ContractAddress
    ) -> Array<felt252>;
    
    fn get_attestation(
        self: @TContractState,
        attestation_id: felt252
    ) -> ComplianceAttestation;
    
    // Regulatory reporting
    fn generate_audit_report(
        self: @TContractState,
        user: ContractAddress,
        from_timestamp: u64,
        to_timestamp: u64
    ) -> Array<felt252>;
}

#[starknet::contract]
pub mod ComplianceModule {
    use super::{
        IComplianceModule, 
        ComplianceRule, 
        ComplianceProof, 
        ComplianceAttestation
    };
    use super::super::interfaces::{
        IProofVerifierDispatcher, 
        IProofVerifierDispatcherTrait,
        IVaultManagerDispatcher,
        IVaultManagerDispatcherTrait,
        BalanceProofData,
        RangeProofData
    };
    use starknet::{
        ContractAddress, 
        get_caller_address, 
        get_block_timestamp,
        contract_address_const
    };
    use starknet::storage::{
        StoragePointerReadAccess, 
        StoragePointerWriteAccess,
        Map
    };
    use core::pedersen::pedersen;
    use core::traits::Into;
    use openzeppelin::access::ownable::OwnableComponent;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // Compliance rule types
    const PORTFOLIO_VALUE_RULE: felt252 = 'PORTFOLIO_VALUE';
    const TRANSACTION_LIMIT_RULE: felt252 = 'TRANSACTION_LIMIT';
    const HOLDING_PERIOD_RULE: felt252 = 'HOLDING_PERIOD';
    const KYC_VERIFICATION_RULE: felt252 = 'KYC_VERIFICATION';
    const SANCTION_CHECK_RULE: felt252 = 'SANCTION_CHECK';

    #[storage]
    struct Storage {
        // Compliance rules: rule_id -> rule
        compliance_rules: Map<felt252, ComplianceRule>,
        
        // User compliance proofs: (user, rule_id) -> proof
        user_compliance_proofs: Map<(ContractAddress, felt252), ComplianceProof>,
        
        // Compliance attestations: attestation_id -> attestation
        compliance_attestations: Map<felt252, ComplianceAttestation>,
        
        // User attestation lists: user -> Array<attestation_id>
        user_attestation_ids: Map<ContractAddress, Array<felt252>>,
        
        // Rule counters and IDs
        rule_counter: felt252,
        attestation_counter: felt252,
        
        // Compliance status cache: (user, rule_id) -> (is_compliant, last_check)
        compliance_status_cache: Map<(ContractAddress, felt252), (bool, u64)>,
        
        // Audit trail: (user, timestamp) -> audit_data
        audit_trail: Map<(ContractAddress, u64), Array<felt252>>,
        
        // Integration contracts
        vault_manager_address: ContractAddress,
        proof_verifier_address: ContractAddress,
        
        // Component storage
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        ComplianceProofGenerated: ComplianceProofGenerated,
        ComplianceRuleAdded: ComplianceRuleAdded,
        ComplianceRuleUpdated: ComplianceRuleUpdated,
        ComplianceAttestationIssued: ComplianceAttestationIssued,
        ComplianceStatusUpdated: ComplianceStatusUpdated,
        AuditTrailUpdated: AuditTrailUpdated,
        #[nested]
        OwnableEvent: OwnableComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ComplianceProofGenerated {
        #[key]
        pub user: ContractAddress,
        #[key]
        pub rule_id: felt252,
        pub is_compliant: bool,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ComplianceRuleAdded {
        #[key]
        pub rule_id: felt252,
        pub rule_type: felt252,
        pub min_threshold: u256,
        pub max_threshold: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ComplianceRuleUpdated {
        #[key]
        pub rule_id: felt252,
        pub is_active: bool,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ComplianceAttestationIssued {
        #[key]
        pub user: ContractAddress,
        #[key]
        pub attestation_id: felt252,
        pub all_compliant: bool,
        pub validity_period: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ComplianceStatusUpdated {
        #[key]
        pub user: ContractAddress,
        #[key]
        pub rule_id: felt252,
        pub is_compliant: bool,
    }

    #[derive(Drop, starknet::Event)]
    pub struct AuditTrailUpdated {
        #[key]
        pub user: ContractAddress,
        pub timestamp: u64,
        pub data_length: u32,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        vault_manager: ContractAddress,
        proof_verifier: ContractAddress
    ) {
        self.ownable.initializer(owner);
        self.vault_manager_address.write(vault_manager);
        self.proof_verifier_address.write(proof_verifier);
        self.rule_counter.write(1);
        self.attestation_counter.write(1);
        
        // Initialize default compliance rules
        self._initialize_default_rules();
    }

    #[abi(embed_v0)]
    impl ComplianceModuleImpl of super::IComplianceModule<ContractState> {
        fn generate_compliance_proof(
            ref self: ContractState,
            rule_id: felt252,
            user_commitment: felt252,
            proof_data: Array<felt252>
        ) -> felt252 {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Verify rule exists and is active
            let rule = self.compliance_rules.read(rule_id);
            assert(rule.is_active, 'Rule not active');
            
            // Verify proof data
            let is_compliant = self._verify_compliance_proof(
                rule_id, 
                user_commitment, 
                proof_data.clone()
            );
            
            // Create compliance proof
            let proof = ComplianceProof {
                user: caller,
                rule_id,
                proof_data: proof_data.clone(),
                is_compliant,
                timestamp,
            };
            
            // Store proof
            self.user_compliance_proofs.write((caller, rule_id), proof);
            
            // Update compliance status cache
            self.compliance_status_cache.write((caller, rule_id), (is_compliant, timestamp));
            
            // Update audit trail
            self._update_audit_trail(caller, timestamp, proof_data);
            
            // Emit events
            self.emit(ComplianceProofGenerated {
                user: caller,
                rule_id,
                is_compliant,
                timestamp,
            });
            
            self.emit(ComplianceStatusUpdated {
                user: caller,
                rule_id,
                is_compliant,
            });
            
            rule_id
        }

        fn verify_compliance(
            self: @ContractState,
            attestation_id: felt252
        ) -> bool {
            let attestation = self.compliance_attestations.read(attestation_id);
            let current_time = get_block_timestamp();
            
            // Check if attestation exists
            if attestation.attestation_id == 0 {
                return false;
            }
            
            // Check if attestation is still valid
            let is_valid = current_time <= attestation.issued_at + attestation.validity_period;
            
            is_valid && attestation.all_compliant
        }

        fn batch_verify_compliance(
            ref self: ContractState,
            user: ContractAddress,
            rule_ids: Array<felt252>,
            proofs: Array<Array<felt252>>
        ) -> felt252 {
            assert(rule_ids.len() == proofs.len(), 'Array length mismatch');
            
            let mut all_compliant = true;
            let mut i = 0;
            
            while i < rule_ids.len() {
                let rule_id = *rule_ids.at(i);
                let proof_data = proofs.at(i).clone();
                
                // Generate compliance proof for each rule
                let commitment = pedersen(user.into(), rule_id); // Simplified commitment
                let compliance_result = self.generate_compliance_proof(
                    rule_id, 
                    commitment, 
                    proof_data
                );
                
                if compliance_result == 0 {
                    all_compliant = false;
                }
                
                i += 1;
            };
            
            // Generate attestation
            let attestation_id = self.attestation_counter.read();
            self.attestation_counter.write(attestation_id + 1);
            
            let attestation = ComplianceAttestation {
                attestation_id,
                user,
                rules_checked: rule_ids.clone(),
                all_compliant,
                validity_period: 2592000, // 30 days
                issued_at: get_block_timestamp(),
            };
            
            // Store attestation
            self.compliance_attestations.write(attestation_id, attestation);
            
            // Update user attestation list
            let mut user_attestations = self.user_attestation_ids.read(user);
            user_attestations.append(attestation_id);
            self.user_attestation_ids.write(user, user_attestations);
            
            // Emit event
            self.emit(ComplianceAttestationIssued {
                user,
                attestation_id,
                all_compliant,
                validity_period: 2592000,
            });
            
            attestation_id
        }

        fn add_compliance_rule(
            ref self: ContractState,
            rule_type: felt252,
            min_threshold: u256,
            max_threshold: u256,
            description: ByteArray
        ) -> felt252 {
            self.ownable.assert_only_owner();
            
            let rule_id = self.rule_counter.read();
            self.rule_counter.write(rule_id + 1);
            
            let rule = ComplianceRule {
                rule_id,
                rule_type,
                min_threshold,
                max_threshold,
                is_active: true,
                description,
            };
            
            self.compliance_rules.write(rule_id, rule);
            
            self.emit(ComplianceRuleAdded {
                rule_id,
                rule_type,
                min_threshold,
                max_threshold,
            });
            
            rule_id
        }

        fn update_compliance_rule(
            ref self: ContractState,
            rule_id: felt252,
            min_threshold: u256,
            max_threshold: u256,
            is_active: bool
        ) {
            self.ownable.assert_only_owner();
            
            let mut rule = self.compliance_rules.read(rule_id);
            assert(rule.rule_id != 0, 'Rule does not exist');
            
            rule.min_threshold = min_threshold;
            rule.max_threshold = max_threshold;
            rule.is_active = is_active;
            
            self.compliance_rules.write(rule_id, rule);
            
            self.emit(ComplianceRuleUpdated {
                rule_id,
                is_active,
            });
        }

        fn get_compliance_rule(
            self: @ContractState,
            rule_id: felt252
        ) -> ComplianceRule {
            self.compliance_rules.read(rule_id)
        }

        fn get_compliance_status(
            self: @ContractState,
            user: ContractAddress,
            rule_id: felt252
        ) -> bool {
            let (is_compliant, _) = self.compliance_status_cache.read((user, rule_id));
            is_compliant
        }

        fn get_user_attestations(
            self: @ContractState,
            user: ContractAddress
        ) -> Array<felt252> {
            self.user_attestation_ids.read(user)
        }

        fn get_attestation(
            self: @ContractState,
            attestation_id: felt252
        ) -> ComplianceAttestation {
            self.compliance_attestations.read(attestation_id)
        }

        fn generate_audit_report(
            self: @ContractState,
            user: ContractAddress,
            from_timestamp: u64,
            to_timestamp: u64
        ) -> Array<felt252> {
            assert(from_timestamp <= to_timestamp, 'Invalid timestamp range');
            
            // Simplified audit report generation
            // In production, this would compile comprehensive audit data
            let mut report_data = ArrayTrait::new();
            
            // Add user identifier
            report_data.append(user.into());
            
            // Add timestamp range
            report_data.append(from_timestamp.into());
            report_data.append(to_timestamp.into());
            
            // Add compliance summary (simplified)
            let portfolio_compliant = self.get_compliance_status(user, 1); // Portfolio rule
            let kyc_compliant = self.get_compliance_status(user, 2); // KYC rule
            
            report_data.append(if portfolio_compliant { 1 } else { 0 });
            report_data.append(if kyc_compliant { 1 } else { 0 });
            
            report_data
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _verify_compliance_proof(
            self: @ContractState,
            rule_id: felt252,
            user_commitment: felt252,
            proof_data: Array<felt252>
        ) -> bool {
            let rule = self.compliance_rules.read(rule_id);
            
            // Basic proof validation
            if proof_data.len() == 0 || user_commitment == 0 {
                return false;
            }
            
            // Get ProofVerifier contract
            let proof_verifier_address = self.proof_verifier_address.read();
            let proof_verifier = IProofVerifierDispatcher { contract_address: proof_verifier_address };
            
            // Rule-specific verification logic
            if rule.rule_type == PORTFOLIO_VALUE_RULE {
                let balance_proof = BalanceProofData {
                    commitment: user_commitment,
                    min_amount: rule.min_threshold,
                    proof: proof_data,
                };
                proof_verifier.verify_balance_proof(balance_proof)
            } else if rule.rule_type == KYC_VERIFICATION_RULE {
                // For KYC, use range proof to verify identity attestation
                let range_proof = RangeProofData {
                    commitment: user_commitment,
                    min_value: rule.min_threshold,
                    max_value: rule.max_threshold,
                    proof: proof_data,
                };
                proof_verifier.verify_range_proof(range_proof)
            } else if rule.rule_type == SANCTION_CHECK_RULE {
                // For sanctions, verify no interaction with blacklisted addresses
                let balance_proof = BalanceProofData {
                    commitment: user_commitment,
                    min_amount: 0, // Just verify commitment validity
                    proof: proof_data,
                };
                proof_verifier.verify_balance_proof(balance_proof)
            } else {
                // For unknown rule types, use basic balance proof
                let balance_proof = BalanceProofData {
                    commitment: user_commitment,
                    min_amount: rule.min_threshold,
                    proof: proof_data,
                };
                proof_verifier.verify_balance_proof(balance_proof)
            }
        }

        fn _initialize_default_rules(ref self: ContractState) {
            // Portfolio value compliance rule
            let portfolio_rule = ComplianceRule {
                rule_id: 1,
                rule_type: PORTFOLIO_VALUE_RULE,
                min_threshold: 100000_u256, // $100k minimum
                max_threshold: 10000000_u256, // $10M maximum
                is_active: true,
                description: "Portfolio value compliance",
            };
            self.compliance_rules.write(1, portfolio_rule);
            
            // KYC verification rule
            let kyc_rule = ComplianceRule {
                rule_id: 2,
                rule_type: KYC_VERIFICATION_RULE,
                min_threshold: 1_u256,
                max_threshold: 1_u256,
                is_active: true,
                description: "KYC verification compliance",
            };
            self.compliance_rules.write(2, kyc_rule);
            
            // Sanction check rule
            let sanction_rule = ComplianceRule {
                rule_id: 3,
                rule_type: SANCTION_CHECK_RULE,
                min_threshold: 0_u256,
                max_threshold: 0_u256,
                is_active: true,
                description: "Sanction list compliance",
            };
            self.compliance_rules.write(3, sanction_rule);
            
            // Update rule counter
            self.rule_counter.write(4);
        }

        fn _update_audit_trail(
            ref self: ContractState,
            user: ContractAddress,
            timestamp: u64,
            audit_data: Array<felt252>
        ) {
            self.audit_trail.write((user, timestamp), audit_data.clone());
            
            self.emit(AuditTrailUpdated {
                user,
                timestamp,
                data_length: audit_data.len(),
            });
        }

        fn get_cached_compliance_status(
            self: @ContractState,
            user: ContractAddress,
            rule_id: felt252
        ) -> (bool, u64) {
            self.compliance_status_cache.read((user, rule_id))
        }

        fn clear_expired_attestations(ref self: ContractState, user: ContractAddress) {
            // Helper function to clean up expired attestations
            // In production, this could be called periodically
            let current_time = get_block_timestamp();
            let user_attestations = self.user_attestation_ids.read(user);
            let mut valid_attestations = ArrayTrait::new();
            
            let mut i = 0;
            while i < user_attestations.len() {
                let attestation_id = *user_attestations.at(i);
                let attestation = self.compliance_attestations.read(attestation_id);
                
                if current_time <= attestation.issued_at + attestation.validity_period {
                    valid_attestations.append(attestation_id);
                }
                
                i += 1;
            };
            
            self.user_attestation_ids.write(user, valid_attestations);
        }
    }
}