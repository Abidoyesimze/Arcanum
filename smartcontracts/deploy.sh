#!/bin/bash

# Arcanum Protocol - Smart Contract Deployment Script
# This script deploys all contracts in the correct order with proper dependencies

set -e

echo "🚀 Starting Arcanum Protocol Contract Deployment..."

# Check if we're in the right directory
if [ ! -f "Scarb.toml" ]; then
    echo "❌ Error: Please run this script from the smartcontracts directory"
    exit 1
fi

# Build contracts first
echo "📦 Building contracts..."
scarb build

# Check if sncast is available
if ! command -v sncast &> /dev/null; then
    echo "❌ Error: sncast not found. Please install Starknet Foundry:"
    echo "   curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | bash"
    exit 1
fi

# Set deployment parameters
NETWORK=${1:-"sepolia"}
ACCOUNT=${2:-"mainuser"}

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
    
    if [ -z "$constructor_args" ]; then
        # Deploy without constructor arguments
        sncast --account $ACCOUNT --network $NETWORK declare --contract-name $contract_name
        local declare_output=$(sncast --account $ACCOUNT --network $NETWORK declare --contract-name $contract_name --json)
    else
        # Deploy with constructor arguments
        sncast --account $ACCOUNT --network $NETWORK declare --contract-name $contract_name
        local declare_output=$(sncast --account $ACCOUNT --network $NETWORK declare --contract-name $contract_name --json)
    fi
    
    # Extract class hash from declare output
    local class_hash=$(echo $declare_output | jq -r '.class_hash')
    
    # Deploy the contract
    if [ -z "$constructor_args" ]; then
        local deploy_output=$(sncast --account $ACCOUNT --network $NETWORK deploy --class-hash $class_hash --json)
    else
        local deploy_output=$(sncast --account $ACCOUNT --network $NETWORK deploy --class-hash $class_hash --constructor-calldata $constructor_args --json)
    fi
    
    # Extract contract address
    local contract_address=$(echo $deploy_output | jq -r '.contract_address')
    
    echo "✅ $description deployed at: $contract_address"
    echo "   Class Hash: $class_hash"
    
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
echo "   sncast --account $ACCOUNT --network $NETWORK call --contract-address $VAULT_MANAGER_ADDRESS --function get_vault_position --calldata 1"
echo ""
