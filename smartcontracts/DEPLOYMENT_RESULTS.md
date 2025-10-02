# Arcanum Protocol - Deployment Results

## 🚀 Deployment Summary

**Network**: Starknet Sepolia Testnet  
**Deployment Date**: $(date -u +%Y-%m-%dT%H:%M:%SZ)  
**Deployer Account**: deployer  

## 📋 Contract Addresses

### 1. ProofVerifier
- **Address**: `0x079fb38dc187909d0c007171bde05eef19596a8ab74928e8cfcd9aaa25a649e9`
- **Class Hash**: `0x06a9f782aa2d17d57a613a2f5339303c72054a0fbed218af1701fbea3c945291`
- **Transaction**: [View on StarkScan](https://sepolia.starkscan.co/contract/0x079fb38dc187909d0c007171bde05eef19596a8ab74928e8cfcd9aaa25a649e9)
- **Purpose**: Verifies balance proofs for private transactions

### 2. VaultManager
- **Address**: `0x05ec8dd7f2fc86736db19922d510ed984efbf8adaddc731c0e6d7ea6311e6ee3`
- **Class Hash**: `0x03fe153cbbee7748cb361d65b08180e449a360aa93799c342fc789c6d8f284d5`
- **Transaction**: [View on StarkScan](https://sepolia.starkscan.co/contract/0x05ec8dd7f2fc86736db19922d510ed984efbf8adaddc731c0e6d7ea6311e6ee3)
- **Purpose**: Manages private vault deposits and withdrawals

### 3. ComplianceModule
- **Address**: `0x070c6ea945565a17021114249b3b30753fec6d9017c8b60340dc4ddfc14af1d6`
- **Class Hash**: `0x025a211d6bd046f71b35f1b472901d2e06b051ae20b1f6a54c842e489dc20c19`
- **Transaction**: [View on StarkScan](https://sepolia.starkscan.co/contract/0x070c6ea945565a17021114249b3b30753fec6d9017c8b60340dc4ddfc14af1d6)
- **Purpose**: Enforces compliance rules and regulations

### 4. VesuAdapter
- **Address**: `0x042231282ee5e009a0260342bd6ddaa36ec91e644520488890e69813191b638a`
- **Class Hash**: `0x04e11b2d2527f0fdd122d4e65a06a3eef07f522bfff27c4e646631c46b72a7c6`
- **Transaction**: [View on StarkScan](https://sepolia.starkscan.co/contract/0x042231282ee5e009a0260342bd6ddaa36ec91e644520488890e69813191b638a)
- **Constructor Args**: VaultManager + ProofVerifier addresses
- **Purpose**: Handles Vesu protocol integration for lending

## 🔗 Contract Interactions

The VesuAdapter contract is connected to:
- **VaultManager**: `0x05ec8dd7f2fc86736db19922d510ed984efbf8adaddc731c0e6d7ea6311e6ee3`
- **ProofVerifier**: `0x079fb38dc187909d0c007171bde05eef19596a8ab74928e8cfcd9aaa25a649e9`

## 📊 Deployment Statistics

- **Total Contracts Deployed**: 4
- **Total Transactions**: 8 (4 declarations + 4 deployments)
- **Network**: Starknet Sepolia Testnet
- **Status**: ✅ All contracts successfully deployed

## 🔧 Next Steps

1. **Verify Contracts**: All contracts are automatically verified on StarkScan
2. **Set Up Vesu Pools**: Configure Vesu pool addresses in VesuAdapter
3. **Add Compliance Rules**: Set up compliance rules in ComplianceModule
4. **Test Interactions**: Test contract functions and interactions
5. **Update Frontend**: Update frontend to use new contract addresses

## 🧪 Testing Commands

```bash
# Test VaultManager
sncast --account deployer call --contract-address 0x05ec8dd7f2fc86736db19922d510ed984efbf8adaddc731c0e6d7ea6311e6ee3 --function get_vault_position --calldata 1

# Test ComplianceModule
sncast --account deployer call --contract-address 0x070c6ea945565a17021114249b3b30753fec6d9017c8b60340dc4ddfc14af1d6 --function get_compliance_rule --calldata 1

# Test VesuAdapter
sncast --account deployer call --contract-address 0x042231282ee5e009a0260342bd6ddaa36ec91e644520488890e69813191b638a --function get_vault_manager
```

## 🔍 Block Explorer Links

- **StarkScan Sepolia**: https://sepolia.starkscan.co/
- **All Contracts**: https://sepolia.starkscan.co/accounts/0x079fb38dc187909d0c007171bde05eef19596a8ab74928e8cfcd9aaa25a649e9

---

**Deployment completed successfully! 🎉**
