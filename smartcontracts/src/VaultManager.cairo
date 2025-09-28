use starknet::ContractAddress;
use starknet::storage::Map;
use starknet::storage::StoragePointerReadAccess;
use starknet::storage::StoragePointerWriteAccess;
use starknet::storage::StorageMapReadAccess;
use starknet::storage::StorageMapWriteAccess;

#[derive(Drop, Serde, starknet::Store)]
pub struct VaultPosition {
    pub user: ContractAddress,
    pub token: ContractAddress,
    pub amount: u256,
    pub commitment: felt252,
    pub timestamp: u64,
}

#[starknet::interface]
pub trait IVaultManager<TContractState> {
    fn deposit_to_vault(
        ref self: TContractState, 
        token: ContractAddress,
        amount: u256, 
        commitment: felt252
    ) -> felt252;
    
    fn get_vault_position(
        self: @TContractState,
        position_id: felt252
    ) -> VaultPosition;
}

#[starknet::contract]
pub mod VaultManager {
    use super::{IVaultManager, VaultPosition};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::Map;
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::storage::StorageMapReadAccess;
    use starknet::storage::StorageMapWriteAccess;

    #[storage]
    struct Storage {
        vault_positions: Map<felt252, VaultPosition>,
        position_counter: felt252,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        VaultDeposit: VaultDeposit,
    }

    #[derive(Drop, starknet::Event)]
    pub struct VaultDeposit {
        pub position_id: felt252,
        pub user: ContractAddress,
        pub token: ContractAddress,
        pub amount: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.position_counter.write(1);
    }

    #[abi(embed_v0)]
    impl VaultManagerImpl of IVaultManager<ContractState> {
        fn deposit_to_vault(
            ref self: ContractState,
            token: ContractAddress,
            amount: u256,
            commitment: felt252
        ) -> felt252 {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            
            let position_id = self.position_counter.read();
            self.position_counter.write(position_id + 1);
            
            let position = VaultPosition {
                user: caller,
                token,
                amount,
                commitment,
                timestamp,
            };
            
            self.vault_positions.write(position_id, position);
            
            self.emit(VaultDeposit {
                position_id,
                user: caller,
                token,
                amount,
            });
            
            position_id
        }
        
        fn get_vault_position(
            self: @ContractState,
            position_id: felt252
        ) -> VaultPosition {
            self.vault_positions.read(position_id)
        }
    }
}