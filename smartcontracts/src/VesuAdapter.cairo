use starknet::ContractAddress;
use starknet::get_caller_address;
use starknet::get_block_timestamp;
use starknet::storage::Map;
use starknet::storage::StoragePointerReadAccess;
use starknet::storage::StoragePointerWriteAccess;
use starknet::storage::StorageMapReadAccess;
use starknet::storage::StorageMapWriteAccess;

#[derive(Drop, Serde, starknet::Store)]
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
    
    fn get_user_position_count(
        self: @TContractState,
        user: ContractAddress
    ) -> u256;
    
    fn get_user_position_id(
        self: @TContractState,
        user: ContractAddress,
        index: u256
    ) -> felt252;
    
    // Pool management
    fn set_vesu_pool(
        ref self: TContractState,
        token: ContractAddress,
        pool_address: ContractAddress
    );
    
    fn get_vesu_pool(
        self: @TContractState,
        token: ContractAddress
    ) -> ContractAddress;
    
    fn get_private_pool_liquidity(
        self: @TContractState,
        token: ContractAddress
    ) -> u256;
    
    // Rate management
    fn update_cached_rate(
        ref self: TContractState,
        token: ContractAddress,
        new_rate: u256
    );
    
    fn get_cached_rate(
        self: @TContractState,
        token: ContractAddress
    ) -> u256;
    
    // Contract management
    fn set_vault_manager_address(
        ref self: TContractState,
        address: ContractAddress
    );
    
    fn set_proof_verifier_address(
        ref self: TContractState,
        address: ContractAddress
    );
}

#[starknet::contract]
pub mod VesuAdapter {
    use super::{IVesuAdapter, PrivateLendingPosition, LendingProofData};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::Map;
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::storage::StorageMapReadAccess;
    use starknet::storage::StorageMapWriteAccess;

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
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PrivateLendingCreated: PrivateLendingCreated,
        PrivateLendingWithdrawn: PrivateLendingWithdrawn,
        VesuPoolUpdated: VesuPoolUpdated,
        RateUpdated: RateUpdated,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PrivateLendingCreated {
        pub position_id: felt252,
        pub user: ContractAddress,
        pub token: ContractAddress,
        pub amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PrivateLendingWithdrawn {
        pub position_id: felt252,
        pub user: ContractAddress,
        pub amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct VesuPoolUpdated {
        pub token: ContractAddress,
        pub pool_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    pub struct RateUpdated {
        pub token: ContractAddress,
        pub new_rate: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        vault_manager_address: ContractAddress,
        proof_verifier_address: ContractAddress
    ) {
        self.vault_manager_address.write(vault_manager_address);
        self.proof_verifier_address.write(proof_verifier_address);
        self.position_counter.write(1);
    }

    #[abi(embed_v0)]
    impl VesuAdapterImpl of IVesuAdapter<ContractState> {
        fn private_lend(
            ref self: ContractState,
            token: ContractAddress,
            lending_proof: LendingProofData
        ) -> felt252 {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            
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
            
            // Update user position count
            let user_count = self.user_position_counts.read(caller);
            self.user_position_ids.write((caller, user_count), position_id);
            self.user_position_counts.write(caller, user_count + 1);
            
            // Update liquidity
            let current_liquidity = self.private_pool_liquidity.read(token);
            self.private_pool_liquidity.write(token, current_liquidity + lending_proof.amount);
            
            // Emit event
            self.emit(PrivateLendingCreated {
                position_id,
                user: caller,
                token,
                amount: lending_proof.amount,
            });
            
            position_id
        }
        
        fn private_withdraw_lending(
            ref self: ContractState,
            position_id: felt252,
            withdrawal_proof: Array<felt252>
        ) -> bool {
            let caller = get_caller_address();
            let position = self.lending_positions.read(position_id);
            
            // Verify caller owns the position
            assert(position.user == caller, 'Not position owner');
            
            // Calculate total amount (principal + interest)
            let total_amount = position.interest_accrued;
            
            // Update liquidity
            let current_liquidity = self.private_pool_liquidity.read(position.lending_pool);
            self.private_pool_liquidity.write(position.lending_pool, current_liquidity - total_amount);
            
            // Emit event
            self.emit(PrivateLendingWithdrawn {
                position_id,
                user: caller,
                amount: total_amount,
            });
            
            true
        }
        
        fn calculate_private_interest(
            self: @ContractState,
            position_id: felt252
        ) -> u256 {
            let position = self.lending_positions.read(position_id);
            let current_time = get_block_timestamp();
            let time_elapsed = (current_time - position.timestamp).into();
            
            // Simple interest calculation (rate per second)
            let rate = self.cached_lending_rates.read(position.lending_pool);
            let interest = (rate * time_elapsed) / 10000; // Convert basis points
            
            interest
        }
        
        fn get_lending_rate(
            self: @ContractState,
            token: ContractAddress
        ) -> u256 {
            let cached_rate = self.cached_lending_rates.read(token);
            let last_update = self.rate_update_timestamps.read(token);
            let current_time = get_block_timestamp();
            
            // If cache is stale (older than 1 hour), return 0
            if current_time - last_update > 3600 {
                0
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
        
        fn get_user_position_count(
            self: @ContractState,
            user: ContractAddress
        ) -> u256 {
            self.user_position_counts.read(user)
        }
        
        fn get_user_position_id(
            self: @ContractState,
            user: ContractAddress,
            index: u256
        ) -> felt252 {
            self.user_position_ids.read((user, index))
        }
        
        fn set_vesu_pool(
            ref self: ContractState,
            token: ContractAddress,
            pool_address: ContractAddress
        ) {
            let old_pool = self.vesu_pools.read(token);
            self.vesu_pools.write(token, pool_address);
            
            self.emit(VesuPoolUpdated {
                token,
                pool_address,
            });
        }
        
        fn get_vesu_pool(
            self: @ContractState,
            token: ContractAddress
        ) -> ContractAddress {
            self.vesu_pools.read(token)
        }
        
        fn get_private_pool_liquidity(
            self: @ContractState,
            token: ContractAddress
        ) -> u256 {
            self.private_pool_liquidity.read(token)
        }
        
        fn update_cached_rate(
            ref self: ContractState,
            token: ContractAddress,
            new_rate: u256
        ) {
            self.cached_lending_rates.write(token, new_rate);
            self.rate_update_timestamps.write(token, get_block_timestamp());
            
            self.emit(RateUpdated {
                token,
                new_rate,
            });
        }
        
        fn get_cached_rate(
            self: @ContractState,
            token: ContractAddress
        ) -> u256 {
            self.cached_lending_rates.read(token)
        }
        
        fn set_vault_manager_address(
            ref self: ContractState,
            address: ContractAddress
        ) {
            self.vault_manager_address.write(address);
        }
        
        fn set_proof_verifier_address(
            ref self: ContractState,
            address: ContractAddress
        ) {
            self.proof_verifier_address.write(address);
        }
    }
}