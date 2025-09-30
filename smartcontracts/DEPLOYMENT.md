# Arcanum Protocol - Deployment Guide

## 🚀 Contract Deployment

This guide will help you deploy the Arcanum Protocol smart contracts to Starknet.

## 📋 Prerequisites

1. **Starknet Foundry**: Install sncast for contract deployment
   ```bash
   curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | bash
   ```

2. **Account Setup**: Create a Starknet account for deployment
   ```bash
   sncast account create --name mainuser --add-profile sepolia
   ```

3. **Fund Account**: Add funds to your account for deployment fees
   - Sepolia: Use [Starknet Faucet](https://faucet.quicknode.com/starknet/sepolia)
   - Mainnet: Transfer funds from your wallet

## 🏗️ Contract Architecture

The Arcanum Protocol consists of 4 main contracts:

1. **VaultManager** - Manages private vault deposits
2. **VesuAdapter** - Handles Vesu protocol integration
3. **ComplianceModule** - Enforces compliance rules
4. **ProofVerifier** - Verifies balance proofs

## 📦 Deployment Order

Contracts must be deployed in this order due to dependencies:

1. `ProofVerifier` (no dependencies)
2. `VaultManager` (no dependencies)
3. `ComplianceModule` (no dependencies)
4. `VesuAdapter` (depends on VaultManager and ProofVerifier)

## 🚀 Quick Deployment

### Option 1: Automated Script
```bash
# Deploy to Sepolia (default)
./deploy.sh

# Deploy to specific network
./deploy.sh sepolia mainuser
./deploy.sh mainnet mainuser
```

### Option 2: Manual Deployment
```bash
# 1. Build contracts
scarb build

# 2. Deploy ProofVerifier
sncast --account mainuser --network sepolia declare --contract-name ProofVerifier
sncast --account mainuser --network sepolia deploy --class-hash <CLASS_HASH>

# 3. Deploy VaultManager
sncast --account mainuser --network sepolia declare --contract-name VaultManager
sncast --account mainuser --network sepolia deploy --class-hash <CLASS_HASH>

# 4. Deploy ComplianceModule
sncast --account mainuser --network sepolia declare --contract-name ComplianceModule
sncast --account mainuser --network sepolia deploy --class-hash <CLASS_HASH>

# 5. Deploy VesuAdapter (with constructor arguments)
sncast --account mainuser --network sepolia declare --contract-name VesuAdapter
sncast --account mainuser --network sepolia deploy --class-hash <CLASS_HASH> --constructor-calldata <VAULT_MANAGER_ADDRESS> <PROOF_VERIFIER_ADDRESS>
```

## ⚙️ Post-Deployment Setup

### 1. Configure Vesu Pools
```bash
# Set Vesu pool for a token
sncast --account mainuser --network sepolia call \
  --contract-address <VESU_ADAPTER_ADDRESS> \
  --function set_vesu_pool \
  --calldata <TOKEN_ADDRESS> <POOL_ADDRESS>
```

### 2. Add Compliance Rules
```bash
# Add a compliance rule
sncast --account mainuser --network sepolia call \
  --contract-address <COMPLIANCE_MODULE_ADDRESS> \
  --function add_compliance_rule \
  --calldata <RULE_ID> <RULE_TYPE> <MIN_THRESHOLD> <MAX_THRESHOLD>
```

### 3. Update Lending Rates
```bash
# Update cached lending rate
sncast --account mainuser --network sepolia call \
  --contract-address <VESU_ADAPTER_ADDRESS> \
  --function update_cached_rate \
  --calldata <TOKEN_ADDRESS> <RATE_IN_BASIS_POINTS>
```

## 🔍 Verification

### Check Contract State
```bash
# Get vault position
sncast --account mainuser --network sepolia call \
  --contract-address <VAULT_MANAGER_ADDRESS> \
  --function get_vault_position \
  --calldata <POSITION_ID>

# Get compliance rule
sncast --account mainuser --network sepolia call \
  --contract-address <COMPLIANCE_MODULE_ADDRESS> \
  --function get_compliance_rule \
  --calldata <RULE_ID>

# Get Vesu pool
sncast --account mainuser --network sepolia call \
  --contract-address <VESU_ADAPTER_ADDRESS> \
  --function get_vesu_pool \
  --calldata <TOKEN_ADDRESS>
```

## 🌐 Network Configuration

### Sepolia Testnet
- **RPC URL**: `https://starknet-sepolia.g.alchemy.com/v2/FIQ1qwifmra7ZqdkVHnZ2lHQAKG8j4Yd`
- **Block Explorer**: [StarkScan Sepolia](https://sepolia.starkscan.co/)
- **Faucet**: [QuickNode Faucet](https://faucet.quicknode.com/starknet/sepolia)

### Mainnet
- **RPC URL**: `https://starknet-mainnet.g.alchemy.com/v2/FIQ1qwifmra7ZqdkVHnZ2lHQAKG8j4Yd`
- **Block Explorer**: [StarkScan Mainnet](https://starkscan.co/)

## 🔧 Troubleshooting

### Common Issues

1. **Insufficient Funds**: Ensure your account has enough ETH for deployment fees
2. **Account Not Found**: Run `sncast account create` to set up your account
3. **Network Issues**: Check your RPC URL and network connectivity
4. **Class Hash Errors**: Ensure contracts are built with `scarb build`

### Debug Commands
```bash
# Check account balance
sncast --account mainuser --network sepolia account balance

# Check account details
sncast --account mainuser --network sepolia account show

# Check transaction status
sncast --account mainuser --network sepolia transaction status <TX_HASH>
```

## 📊 Gas Estimation

Approximate deployment costs (as of 2024):
- **ProofVerifier**: ~0.001 ETH
- **VaultManager**: ~0.002 ETH
- **ComplianceModule**: ~0.001 ETH
- **VesuAdapter**: ~0.003 ETH
- **Total**: ~0.007 ETH

## 🔐 Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Account Management**: Use hardware wallets for mainnet deployments
3. **Verification**: Verify all contracts on block explorers
4. **Testing**: Thoroughly test on testnets before mainnet deployment

## 📝 Deployment Checklist

- [ ] Install Starknet Foundry
- [ ] Create and fund deployment account
- [ ] Build contracts successfully
- [ ] Deploy contracts in correct order
- [ ] Verify contracts on block explorer
- [ ] Configure Vesu pools
- [ ] Add compliance rules
- [ ] Test contract interactions
- [ ] Document contract addresses

## 🆘 Support

For deployment issues:
1. Check the [Starknet Foundry Documentation](https://foundry-rs.github.io/starknet-foundry/)
2. Review [Starknet Documentation](https://docs.starknet.io/)
3. Join the [Starknet Discord](https://discord.gg/starknet)

## 📄 License

This deployment guide is part of the Arcanum Protocol project.
