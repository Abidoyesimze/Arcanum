use starknet::ContractAddress;
use starknet::storage::Map;
use starknet::storage::StorageMapReadAccess;
use starknet::storage::StorageMapWriteAccess;

#[derive(Drop, Serde, starknet::Store)]
pub struct ComplianceRule {
    pub rule_id: felt252,
    pub rule_type: felt252,
    pub min_threshold: u256,
    pub max_threshold: u256,
    pub is_active: bool,
}

#[starknet::interface]
pub trait IComplianceModule<TContractState> {
    fn add_compliance_rule(
        ref self: TContractState,
        rule_id: felt252,
        rule_type: felt252,
        min_threshold: u256,
        max_threshold: u256
    );
    
    fn get_compliance_rule(
        self: @TContractState,
        rule_id: felt252
    ) -> ComplianceRule;
}

#[starknet::contract]
pub mod ComplianceModule {
    use super::{IComplianceModule, ComplianceRule};
    use starknet::storage::Map;
    use starknet::storage::StorageMapReadAccess;
    use starknet::storage::StorageMapWriteAccess;

    #[storage]
    struct Storage {
        compliance_rules: Map<felt252, ComplianceRule>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        ComplianceRuleAdded: ComplianceRuleAdded,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ComplianceRuleAdded {
        pub rule_id: felt252,
        pub rule_type: felt252,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[abi(embed_v0)]
    impl ComplianceModuleImpl of IComplianceModule<ContractState> {
        fn add_compliance_rule(
            ref self: ContractState,
            rule_id: felt252,
            rule_type: felt252,
            min_threshold: u256,
            max_threshold: u256
        ) {
            let rule = ComplianceRule {
                rule_id,
                rule_type,
                min_threshold,
                max_threshold,
                is_active: true,
            };
            
            self.compliance_rules.write(rule_id, rule);
            
            self.emit(ComplianceRuleAdded {
                rule_id,
                rule_type,
            });
        }

        fn get_compliance_rule(
            self: @ContractState,
            rule_id: felt252
        ) -> ComplianceRule {
            self.compliance_rules.read(rule_id)
        }
    }
}