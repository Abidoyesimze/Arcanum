use starknet::ContractAddress;

#[derive(Drop, Serde)]
pub struct PrivateLendingPosition {
    pub user: ContractAddress,
    pub commitment: felt252,
    pub interest_accrued: u256,
    pub lending_pool: ContractAddress,
    pub timestamp: u64,
}

#[derive(Drop, Serde)]
pub struct LendingProofData {
    pub balance_commitment: felt252,
    pub amount_commitment: felt252,
    pub amount: u256,
    pub proof: Array<felt252>,
}

#[starknet::interface]
pub trait IVesuAdapter<TContractState> {
    // Private lending operations
    fn private_lend(
        ref self: TContractState,
        token: ContractAddress,
        lending_proof: LendingProofData
    ) -> felt252;
    
    fn private_withdraw_lending(
        ref self: TContractState,
        position_id: felt252,
        withdrawal_proof: Array<felt252>
    ) -> bool;
    
    // Interest and rate calculations
    fn calculate_private_interest(
        self: @TContractState,
        position_id: felt252
    ) -> u256;
    
    fn get_lending_rate(
        self: @TContractState,
        token: ContractAddress
    ) -> u256;
    
    // Position management
    fn get_private_position(
        self: @TContractState,
        position_id: felt252
    ) -> PrivateLendingPosition;
    
    fn get_user_positions_count(
        self: @TContractState,
        user: ContractAddress
    ) -> u256;
    
    // Vesu integration
    fn get_vesu_pool_address(
        self: @TContractState,
        token: ContractAddress
    ) -> ContractAddress;
    
    fn update_vesu_pool(
        ref self: TContractState,
        token: ContractAddress,
        pool_address: ContractAddress
    );
}

#[starknet::contract]
pub mod VesuAdapter {
    use super::{IVesuAdapter, PrivateLendingPosition, LendingProofData};
    use super::super::interfaces::{
        IVaultManagerDispatcher, 
        IVaultManagerDispatcherTrait,
        IProofVerifierDispatcher, 
        IProofVerifierDispatcherTrait,
        IVesuPoolDispatcher,
        IVesuPoolDispatcherTrait,
        BalanceProofData
    };
    use starknet::{
        ContractAddress, 
        get_caller_address, 
        get_block_timestamp,
        get_contract_address,
        contract_address_const
    };
    use starknet::storage::{
        StoragePointerReadAccess, 
        StoragePointerWriteAccess,
        Map
    };
    use core::pedersen::pedersen;
    use core::traits::Into;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::security::reentrancyguard::ReentrancyGuardComponent;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl ReentrancyGuardImpl = ReentrancyGuardComponent::ReentrancyGuardImpl<ContractState>;
    impl ReentrancyGuardInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        // Private lending positions: position_id -> position
        lending_positions: Map<felt252, PrivateLendingPosition>,
        
        // User position counters: user -> count
        user_position_counts: Map<ContractAddress, u256>,
        
        // User position IDs: (user, index) -> position_id
        user_position_ids: Map<(ContractAddress, u256), felt252>,
        
        // Vesu pool mappings: token -> pool_address
        vesu_pools: Map<ContractAddress, ContractAddress>,
        
        // Private pool aggregated liquidity: token -> total_amount
        private_pool_liquidity: Map<ContractAddress, u256>,
        
        // Interest rate cache: token -> rate (in basis points)
        cached_lending_rates: Map<ContractAddress, u256>,
        
        // Rate update timestamps: token -> timestamp
        rate_update_timestamps: Map<ContractAddress, u64>,
        
        // Position counter for generating unique IDs
        position_counter: felt252,
        
        // VaultManager contract address
        vault_manager_address: ContractAddress,
        
        // ProofVerifier contract address
        proof_verifier_address: ContractAddress,
        
        // Components
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PrivateLendingStarted: PrivateLendingStarted,
        PrivateLendingWithdrawn: PrivateLendingWithdrawn,
        InterestAccrued: InterestAccrued,
        VesuPoolUpdated: VesuPoolUpdated,
        LiquidityAdded: LiquidityAdded,
        #[nested]
        OwnableEvent: OwnableComponent::Event,
        #[nested]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PrivateLendingStarted {
        #[key]
        pub user: ContractAddress,
        #[key]
        pub token: ContractAddress,
        pub position_id: felt252,
        pub commitment: felt252,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PrivateLendingWithdrawn {
        #[key]
        pub user: ContractAddress,
        #[key]
        pub position_id: felt252,
        pub interest_earned: u256,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct InterestAccrued {
        #[key]
        pub position_id: felt252,
        pub interest_amount: u256,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct VesuPoolUpdated {
        #[key]
        pub token: ContractAddress,
        pub old_pool: ContractAddress,
        pub new_pool: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    pub struct LiquidityAdded {
        #[key]
        pub token: ContractAddress,
        pub amount: u256,
        pub total_liquidity: u256,
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
        self.position_counter.write(1);
    }

    #[abi(embed_v0)]
    impl VesuAdapterImpl of super::IVesuAdapter<ContractState> {
        fn private_lend(
            ref self: ContractState,
            token: ContractAddress,
            lending_proof: LendingProofData
        ) -> felt252 {
            self.reentrancy_guard.start();
            
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Verify the lending proof
            assert(self._verify_lending_proof(lending_proof.clone()), 'Invalid lending proof');
            
            // Get current position counter and increment
            let position_id = self.position_counter.read();
            self.position_counter.write(position_id + 1);
            
            // Create private lending position
            let position = PrivateLendingPosition {
                user: caller,
                commitment: lending_proof.amount_commitment,
                interest_accrued: 0,
                lending_pool: self.vesu_pools.read(token),
                timestamp,
            };
            
            // Store position
            self.lending_positions.write(position_id, position);
            
            // Update user position tracking
            let user_count = self.user_position_counts.read(caller);
            self.user_position_ids.write((caller, user_count), position_id);
            self.user_position_counts.write(caller, user_count + 1);
            
            // Update private pool liquidity
            let current_liquidity = self.private_pool_liquidity.read(token);
            self.private_pool_liquidity.write(token, current_liquidity + lending_proof.amount);
            
            // Interact with Vesu protocol (simplified for MVP)
            self._interact_with_vesu_pool(token, lending_proof.amount, true);
            
            // Emit event
            self.emit(PrivateLendingStarted {
                user: caller,
                token,
                position_id,
                commitment: lending_proof.amount_commitment,
                timestamp,
            });
            
            self.emit(LiquidityAdded {
                token,
                amount: lending_proof.amount,
                total_liquidity: current_liquidity + lending_proof.amount,
            });

            self.reentrancy_guard.end();
            position_id
        }

        fn private_withdraw_lending(
            ref self: ContractState,
            position_id: felt252,
            withdrawal_proof: Array<felt252>
        ) -> bool {
            self.reentrancy_guard.start();
            
            let caller = get_caller_address();
            let position = self.lending_positions.read(position_id);
            
            // Verify ownership
            assert(position.user == caller, 'Not position owner');
            assert(position.commitment != 0, 'Position not found');
            
            // Verify withdrawal proof (simplified)
            assert(withdrawal_proof.len() > 0, 'Withdrawal proof required');
            
            // Calculate accrued interest
            let interest_earned = self._calculate_interest_internal(position_id);
            
            // Update interest accrued
            let mut updated_position = position;
            updated_position.interest_accrued = interest_earned;
            self.lending_positions.write(position_id, updated_position);
            
            // Clear position (for simplicity, positions are single-use in MVP)
            // In production, this would support partial withdrawals
            
            // Emit events
            self.emit(PrivateLendingWithdrawn {
                user: caller,
                position_id,
                interest_earned,
                timestamp: get_block_timestamp(),
            });

            self.reentrancy_guard.end();
            true
        }

        fn calculate_private_interest(
            self: @ContractState,
            position_id: felt252
        ) -> u256 {
            self._calculate_interest_internal(position_id)
        }

        fn get_lending_rate(
            self: @ContractState,
            token: ContractAddress
        ) -> u256 {
            let cached_rate = self.cached_lending_rates.read(token);
            let last_update = self.rate_update_timestamps.read(token);
            let current_time = get_block_timestamp();
            
            // Cache rates for 1 hour (3600 seconds)
            if current_time - last_update > 3600 {
                // In production, fetch from Vesu oracle
                self._get_fresh_lending_rate(token)
            } else {
                cached_rate
            }
        }

        fn get_private_position(
            self: @ContractState,
            position_id: felt252
        ) -> PrivateLendingPosition {
            self.lending_positions.read(position_id)
        }

        fn get_user_positions_count(
            self: @ContractState,
            user: ContractAddress
        ) -> u256 {
            self.user_position_counts.read(user)
        }

        fn get_vesu_pool_address(
            self: @ContractState,
            token: ContractAddress
        ) -> ContractAddress {
            self.vesu_pools.read(token)
        }

        fn update_vesu_pool(
            ref self: ContractState,
            token: ContractAddress,
            pool_address: ContractAddress
        ) {
            self.ownable.assert_only_owner();
            
            let old_pool = self.vesu_pools.read(token);
            self.vesu_pools.write(token, pool_address);
            
            self.emit(VesuPoolUpdated {
                token,
                old_pool,
                new_pool: pool_address,
            });
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _verify_lending_proof(
            self: @ContractState,
            lending_proof: LendingProofData
        ) -> bool {
            // Call ProofVerifier contract to verify balance proof
            let proof_verifier_address = self.proof_verifier_address.read();
            let proof_verifier = IProofVerifierDispatcher { contract_address: proof_verifier_address };
            
            // Create balance proof data for verification
            let balance_proof_data = BalanceProofData {
                commitment: lending_proof.balance_commitment,
                min_amount: lending_proof.amount,
                proof: lending_proof.proof.clone(),
            };
            
            // Verify the balance proof through ProofVerifier
            let balance_proof_valid = proof_verifier.verify_balance_proof(balance_proof_data);
            
            // Additional verification: Check commitment consistency
            let computed_commitment = pedersen(
                lending_proof.amount.try_into().unwrap(), 
                lending_proof.balance_commitment
            );
            let commitment_valid = computed_commitment == lending_proof.amount_commitment;
            
            // Call VaultManager to verify user has sufficient balance
            let vault_manager_address = self.vault_manager_address.read();
            let vault_manager = IVaultManagerDispatcher { contract_address: vault_manager_address };
            
            let caller = get_caller_address();
            let sufficient_balance = vault_manager.verify_sufficient_balance(
                caller,
                lending_proof.amount,
                lending_proof.proof.clone()
            );
            
            balance_proof_valid && commitment_valid && sufficient_balance
        }

        fn _calculate_interest_internal(
            self: @ContractState,
            position_id: felt252
        ) -> u256 {
            let position = self.lending_positions.read(position_id);
            if position.commitment == 0 {
                return 0;
            }
            
            let current_time = get_block_timestamp();
            let time_elapsed = current_time - position.timestamp;
            
            // Simplified interest calculation
            // In production, this would use actual Vesu lending rates
            let annual_rate = 500; // 5% APY in basis points
            let seconds_per_year = 31536000_u64; // 365 * 24 * 60 * 60
            
            // Calculate pro-rata interest
            // For simplicity, assume position amount is derivable from commitment
            let estimated_principal = 1000_u256; // Placeholder - would be derived from ZK proof
            let interest = (estimated_principal * annual_rate.into() * time_elapsed.into()) / 
                          (10000_u256 * seconds_per_year.into());
            
            position.interest_accrued + interest
        }

        fn _get_fresh_lending_rate(
            self: @ContractState,
            token: ContractAddress
        ) -> u256 {
            let pool_address = self.vesu_pools.read(token);
            if pool_address.is_zero() {
                return 300; // Default 3% if no pool
            }
            
            // Query actual Vesu protocol for current rates
            let vesu_pool = IVesuPoolDispatcher { contract_address: pool_address };
            let supply_rate = vesu_pool.get_supply_rate();
            
            // Cache the rate
            self.update_cached_rate(token, supply_rate);
            
            supply_rate
        }

        fn _interact_with_vesu_pool(
            ref self: ContractState,
            token: ContractAddress,
            amount: u256,
            is_deposit: bool
        ) {
            let pool_address = self.vesu_pools.read(token);
            if pool_address.is_zero() {
                return; // No pool configured
            }
            
            // Create dispatcher for Vesu pool
            let vesu_pool = IVesuPoolDispatcher { contract_address: pool_address };
            
            if is_deposit {
                // Call Vesu's supply function to lend assets
                let success = vesu_pool.supply(amount);
                assert(success, 'Vesu supply failed');
            } else {
                // Call Vesu's withdraw function
                let contract_address = get_contract_address();
                let shares_withdrawn = vesu_pool.withdraw(amount, contract_address, contract_address);
                assert(shares_withdrawn > 0, 'Vesu withdrawal failed');
            }
        }

        fn update_cached_rate(
            ref self: ContractState,
            token: ContractAddress,
            new_rate: u256
        ) {
            self.cached_lending_rates.write(token, new_rate);
            self.rate_update_timestamps.write(token, get_block_timestamp());
        }

        fn get_position_by_user_index(
            self: @ContractState,
            user: ContractAddress,
            index: u256
        ) -> felt252 {
            self.user_position_ids.read((user, index))
        }

        fn get_total_private_liquidity(
            self: @ContractState,
            token: ContractAddress
        ) -> u256 {
            self.private_pool_liquidity.read(token)
        }
    }
}