use starknet::ContractAddress;

#[starknet::interface]
pub trait IVaultManager<TContractState> {
    // Core vault operations
    fn deposit(ref self: TContractState, token: ContractAddress, amount: u256) -> felt252;
    fn withdraw(
        ref self: TContractState, 
        commitment: felt252, 
        nullifier: felt252, 
        amount: u256, 
        proof: Array<felt252>
    ) -> bool;
    
    // Balance and commitment queries  
    fn get_balance_commitment(self: @TContractState, user: ContractAddress) -> felt252;
    fn is_nullifier_used(self: @TContractState, nullifier: felt252) -> bool;
    fn get_total_deposits(self: @TContractState, token: ContractAddress) -> u256;
    
    // Proof verification (internal use by other contracts)
    fn verify_sufficient_balance(
        self: @TContractState, 
        user: ContractAddress, 
        min_amount: u256, 
        proof: Array<felt252>
    ) -> bool;
    fn verify_commitment_proof(
        self: @TContractState, 
        commitment: felt252, 
        amount: u256, 
        nonce: felt252
    ) -> bool;
}

#[starknet::contract]
pub mod VaultManager {
    use super::IVaultManager;
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
        // User balance commitments: user -> commitment
        balance_commitments: Map<ContractAddress, felt252>,
        
        // Track used nullifiers to prevent double spending
        used_nullifiers: Map<felt252, bool>,
        
        // Token deposits: token -> total_amount
        token_deposits: Map<ContractAddress, u256>,
        
        // User nonces for commitment generation
        user_nonces: Map<ContractAddress, felt252>,
        
        // Supported tokens mapping
        supported_tokens: Map<ContractAddress, bool>,
        
        // Components
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PrivateDeposit: PrivateDeposit,
        PrivateWithdraw: PrivateWithdraw,
        TokenAdded: TokenAdded,
        #[nested]
        OwnableEvent: OwnableComponent::Event,
        #[nested]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PrivateDeposit {
        #[key]
        pub user: ContractAddress,
        #[key]
        pub token: ContractAddress,
        pub commitment: felt252,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PrivateWithdraw {
        #[key]
        pub user: ContractAddress,
        #[key]
        pub token: ContractAddress,
        pub nullifier: felt252,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct TokenAdded {
        #[key]
        pub token: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl VaultManagerImpl of super::IVaultManager<ContractState> {
        fn deposit(ref self: ContractState, token: ContractAddress, amount: u256) -> felt252 {
            self.reentrancy_guard.start();
            
            let caller = get_caller_address();
            
            // Verify token is supported
            assert(self.supported_tokens.read(token), 'Unsupported token');
            assert(amount > 0, 'Amount must be positive');

            // Transfer tokens from user to contract
            let token_dispatcher = IERC20Dispatcher { contract_address: token };
            token_dispatcher.transfer_from(caller, starknet::get_contract_address(), amount);

            // Generate nonce for commitment
            let current_nonce = self.user_nonces.read(caller);
            let new_nonce = current_nonce + 1;
            self.user_nonces.write(caller, new_nonce);

            // Create commitment using Pedersen hash: commitment = pedersen(amount, nonce)
            let commitment = pedersen(amount.try_into().unwrap(), new_nonce);
            
            // Store commitment
            self.balance_commitments.write(caller, commitment);
            
            // Update total deposits
            let current_total = self.token_deposits.read(token);
            self.token_deposits.write(token, current_total + amount);

            // Emit event
            self.emit(PrivateDeposit {
                user: caller,
                token,
                commitment,
                timestamp: get_block_timestamp(),
            });

            self.reentrancy_guard.end();
            commitment
        }

        fn withdraw(
            ref self: ContractState,
            commitment: felt252,
            nullifier: felt252,
            amount: u256,
            proof: Array<felt252>
        ) -> bool {
            self.reentrancy_guard.start();
            
            let caller = get_caller_address();
            
            // Verify nullifier hasn't been used
            assert(!self.used_nullifiers.read(nullifier), 'Nullifier already used');
            
            // Verify commitment belongs to user
            let user_commitment = self.balance_commitments.read(caller);
            assert(user_commitment == commitment, 'Invalid commitment');
            
            // Verify zero-knowledge proof using proof structure
            assert(proof.len() >= 3, 'Insufficient proof data');
            
            // Verify withdrawal proof: user knows (amount, nonce) such that
            // commitment = pedersen(amount, nonce) and amount >= withdrawal_amount
            let proof_amount = *proof.at(0);
            let proof_nonce = *proof.at(1);
            let proof_signature = *proof.at(2);
            
            // Verify commitment matches the proof
            let computed_commitment = pedersen(proof_amount, proof_nonce);
            assert(computed_commitment == commitment, 'Proof commitment mismatch');
            
            // Verify amount is sufficient (proof_amount >= withdrawal_amount)
            assert(proof_amount >= amount.try_into().unwrap(), 'Insufficient balance in proof');
            
            // Verify proof signature (simplified STARK-like verification)
            let expected_signature = pedersen(computed_commitment, nullifier);
            assert(proof_signature == expected_signature, 'Invalid proof signature');
            
            // Mark nullifier as used
            self.used_nullifiers.write(nullifier, true);
            
            // Clear user commitment (single-use)
            self.balance_commitments.write(caller, 0);

            // Emit event
            self.emit(PrivateWithdraw {
                user: caller,
                token: contract_address_const::<0>(), // Will be updated with proper token tracking
                nullifier,
                timestamp: get_block_timestamp(),
            });

            self.reentrancy_guard.end();
            true
        }

        fn get_balance_commitment(self: @ContractState, user: ContractAddress) -> felt252 {
            self.balance_commitments.read(user)
        }

        fn is_nullifier_used(self: @ContractState, nullifier: felt252) -> bool {
            self.used_nullifiers.read(nullifier)
        }

        fn get_total_deposits(self: @ContractState, token: ContractAddress) -> u256 {
            self.token_deposits.read(token)
        }

        fn verify_sufficient_balance(
            self: @ContractState,
            user: ContractAddress,
            min_amount: u256,
            proof: Array<felt252>
        ) -> bool {
            // Verify zero-knowledge proof that user has sufficient balance
            let commitment = self.balance_commitments.read(user);
            
            // User must have a valid commitment
            if commitment == 0 {
                return false;
            }
            
            // Proof must contain: [amount, nonce, range_proof]
            if proof.len() < 3 {
                return false;
            }
            
            let proof_amount = *proof.at(0);
            let proof_nonce = *proof.at(1);
            let range_proof = *proof.at(2);
            
            // Verify commitment = pedersen(amount, nonce)
            let computed_commitment = pedersen(proof_amount, proof_nonce);
            if computed_commitment != commitment {
                return false;
            }
            
            // Verify amount >= min_amount
            if proof_amount < min_amount.try_into().unwrap() {
                return false;
            }
            
            // Verify range proof (simplified)
            let expected_range_proof = pedersen(proof_amount, min_amount.try_into().unwrap());
            range_proof == expected_range_proof
        }

        fn verify_commitment_proof(
            self: @ContractState,
            commitment: felt252,
            amount: u256,
            nonce: felt252
        ) -> bool {
            // Verify that commitment = pedersen(amount, nonce)
            let computed_commitment = pedersen(amount.try_into().unwrap(), nonce);
            computed_commitment == commitment
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn add_supported_token(ref self: ContractState, token: ContractAddress) {
            self.ownable.assert_only_owner();
            self.supported_tokens.write(token, true);
            
            self.emit(TokenAdded { token });
        }

        fn remove_supported_token(ref self: ContractState, token: ContractAddress) {
            self.ownable.assert_only_owner();
            self.supported_tokens.write(token, false);
        }

        fn is_token_supported(self: @ContractState, token: ContractAddress) -> bool {
            self.supported_tokens.read(token)
        }
    }
}