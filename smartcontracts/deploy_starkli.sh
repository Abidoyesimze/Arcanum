#!/bin/bash

# Arcanum Protocol - Smart Contract Deployment Script using Starkli
# This script deploys all contracts in the correct order with proper dependencies

set -e

echo "🚀 Starting Arcanum Protocol Contract Deployment with Starkli..."

# Check if we're in the right directory
if [ ! -f "Scarb.toml" ]; then
    echo "❌ Error: Please run this script from the smartcontracts directory"
    exit 1
fi

# Build contracts first
echo "📦 Building contracts..."
scarb build

# Check if starkli is available
if ! command -v starkli &> /dev/null; then
    echo "❌ Error: starkli not found. Please install Starkli:"
    echo "   cargo install starkli"
    exit 1
fi

# Set deployment parameters
NETWORK=${1:-"sepolia"}
ACCOUNT=${2:-"deployer"}

echo "🌐 Deploying to network: $NETWORK"
echo "👤 Using account: $ACCOUNT"

# Create deployment directory
mkdir -p deployments
DEPLOYMENT_FILE="deployments/deployment_${NETWORK}_$(date +%Y%m%d_%H%M%S).json"

echo "📝 Deployment log: $DEPLOYMENT_FILE"

# Function to deploy contract
deploy_contract() {
    local contract_name=$1
    local constructor_args=$2
    local description=$3
    
    echo "🔨 Deploying $description..."
    
    # Declare the contract
    local declare_output=$(starkli declare target/dev/smartcontracts_${contract_name}.contract_class.json --account $ACCOUNT --rpc $NETWORK --json)
    local class_hash=$(echo $declare_output | jq -r '.class_hash')
    
    echo "   Class Hash: $class_hash"
    
    # Deploy the contract
    if [ -z "$constructor_args" ]; then
        local deploy_output=$(starkli deploy $class_hash --account $ACCOUNT --rpc $NETWORK --json)
    else
        local deploy_output=$(starkli deploy $class_hash $constructor_args --account $ACCOUNT --rpc $NETWORK --json)
    fi
    
    # Extract contract address
    local contract_address=$(echo $deploy_output | jq -r '.contract_address')
    
    echo "✅ $description deployed at: $contract_address"
    
    # Save to deployment file
    echo "  \"$contract_name\": {" >> $DEPLOYMENT_FILE
    echo "    \"address\": \"$contract_address\"," >> $DEPLOYMENT_FILE
    echo "    \"class_hash\": \"$class_hash\"," >> $DEPLOYMENT_FILE
    echo "    \"description\": \"$description\"" >> $DEPLOYMENT_FILE
    echo "  }," >> $DEPLOYMENT_FILE
    
    echo $contract_address
}

# Initialize deployment file
echo "{" > $DEPLOYMENT_FILE
echo "  \"network\": \"$NETWORK\"," >> $DEPLOYMENT_FILE
echo "  \"deployment_date\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"," >> $DEPLOYMENT_FILE
echo "  \"contracts\": {" >> $DEPLOYMENT_FILE

# Deploy contracts in dependency order
echo "📋 Deploying contracts in dependency order..."

# 1. Deploy ProofVerifier (no dependencies)
PROOF_VERIFIER_ADDRESS=$(deploy_contract "ProofVerifier" "" "ProofVerifier Contract")

# 2. Deploy VaultManager (no dependencies)
VAULT_MANAGER_ADDRESS=$(deploy_contract "VaultManager" "" "VaultManager Contract")

# 3. Deploy ComplianceModule (no dependencies)
COMPLIANCE_MODULE_ADDRESS=$(deploy_contract "ComplianceModule" "" "ComplianceModule Contract")

# 4. Deploy VesuAdapter (depends on VaultManager and ProofVerifier)
VESU_ADAPTER_ADDRESS=$(deploy_contract "VesuAdapter" "$VAULT_MANAGER_ADDRESS $PROOF_VERIFIER_ADDRESS" "VesuAdapter Contract")

# Close deployment file
echo "  }" >> $DEPLOYMENT_FILE
echo "}" >> $DEPLOYMENT_FILE

echo ""
echo "🎉 Deployment Complete!"
echo "📊 Deployment Summary:"
echo "   ProofVerifier: $PROOF_VERIFIER_ADDRESS"
echo "   VaultManager: $VAULT_MANAGER_ADDRESS"
echo "   ComplianceModule: $COMPLIANCE_MODULE_ADDRESS"
echo "   VesuAdapter: $VESU_ADAPTER_ADDRESS"
echo ""
echo "📝 Full deployment details saved to: $DEPLOYMENT_FILE"
echo ""
echo "🔗 Next Steps:"
echo "   1. Verify contracts on block explorer"
echo "   2. Set up Vesu pool addresses in VesuAdapter"
echo "   3. Add compliance rules to ComplianceModule"
echo "   4. Test contract interactions"
echo ""
echo "💡 To interact with contracts:"
echo "   starkli call $VAULT_MANAGER_ADDRESS get_vault_position 1 --account $ACCOUNT --rpc $NETWORK"
echo ""
