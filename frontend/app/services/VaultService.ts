import { Contract, RpcProvider, Account, ProviderInterface, AccountInterface, num } from 'starknet';
import { VaultManagerContract } from '../abi';

export interface VaultPosition {
  user: string;
  token: string;
  amount: string;
  commitment: string;
  timestamp: string;
}

export interface DepositParams {
  token: string; // Contract address
  amount: string; // Amount in human-readable format (e.g., "0.005")
  commitment: string;
}

// Common token addresses on Starknet Sepolia
export const TOKEN_ADDRESSES = {
  ETH: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c7b7f8c8c8c8c8c8c8c8c', // ETH on Sepolia
  USDC: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06b3ad986a', // USDC on Sepolia
};

// Helper function to get token symbol from address
export const getTokenSymbol = (address: string): string => {
  if (address === TOKEN_ADDRESSES.ETH) return 'ETH';
  if (address === TOKEN_ADDRESSES.USDC) return 'USDC';
  return 'UNKNOWN';
};

export class VaultService {
  private contract: Contract;
  private provider: ProviderInterface;
  private account: AccountInterface | null = null;

  constructor(provider: ProviderInterface, account?: AccountInterface) {
    this.provider = provider;
    this.account = account || null;
    
    this.contract = new Contract(
      VaultManagerContract.abi,
      VaultManagerContract.address,
      this.provider
    );
  }

  setAccount(account: AccountInterface) {
    this.account = account;
    this.contract.connect(account);
  }

  /**
   * Convert human-readable amount to contract format
   */
  private convertAmountToContractFormat(amount: string, tokenAddress: string): string {
    const amountFloat = parseFloat(amount);
    
    if (isNaN(amountFloat) || amountFloat <= 0) {
      throw new Error('Invalid amount: must be a positive number');
    }
    
    // Determine decimals based on token
    let decimals = 18; // Default for ETH
    if (tokenAddress === TOKEN_ADDRESSES.USDC) {
      decimals = 6; // USDC has 6 decimals
    }
    
    // Convert to smallest unit
    const amountInSmallestUnit = Math.floor(amountFloat * Math.pow(10, decimals));
    
    if (amountInSmallestUnit === 0) {
      throw new Error('Amount too small: would result in 0 after conversion');
    }
    
    // Convert to hex string for Starknet
    return num.toHex(amountInSmallestUnit);
  }

  /**
   * Deposit tokens to vault with privacy commitment
   */
  async depositToVault(params: DepositParams): Promise<{ success: boolean; positionId?: string; error?: string }> {
    try {
      if (!this.account) {
        return { success: false, error: 'No account connected' };
      }

      // Connect account to contract
      this.contract.connect(this.account);

      // Convert amount to contract format
      const contractAmount = this.convertAmountToContractFormat(params.amount, params.token);
      
      console.log('Deposit parameters:', {
        token: params.token,
        tokenSymbol: getTokenSymbol(params.token),
        originalAmount: params.amount,
        contractAmount: contractAmount,
        commitment: params.commitment
      });

      // Call the deposit function
      const result = await this.contract.deposit_to_vault(
        params.token,
        contractAmount,
        params.commitment
      );

      // Wait for transaction to be mined
      await this.provider.waitForTransaction(result.transaction_hash);

      return { 
        success: true, 
        positionId: result.toString() 
      };
    } catch (error) {
      console.error('Vault deposit error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Get vault position details
   */
  async getVaultPosition(positionId: string): Promise<{ success: boolean; position?: VaultPosition; error?: string }> {
    try {
      const result = await this.contract.get_vault_position(positionId);
      
      const position: VaultPosition = {
        user: result.user.toString(),
        token: result.token.toString(),
        amount: result.amount.toString(),
        commitment: result.commitment.toString(),
        timestamp: result.timestamp.toString(),
      };

      return { success: true, position };
    } catch (error) {
      console.error('Get vault position error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Generate a commitment hash for privacy
   * This is a simplified version - in production, you'd use proper ZK proof generation
   */
  generateCommitment(amount: string, nonce: string): string {
    // Simple hash generation for demo purposes
    // In production, this would be a proper ZK commitment
    const data = `${amount}_${nonce}_${Date.now()}`;
    return `0x${Buffer.from(data).toString('hex').slice(0, 64)}`;
  }

  /**
   * Get user's vault positions (requires tracking position IDs)
   * This would typically be done by listening to events or maintaining a database
   */
  async getUserVaultPositions(userAddress: string, positionIds: string[]): Promise<VaultPosition[]> {
    const positions: VaultPosition[] = [];
    
    for (const positionId of positionIds) {
      const result = await this.getVaultPosition(positionId);
      if (result.success && result.position) {
        positions.push(result.position);
      }
    }
    
    return positions;
  }

  /**
   * Calculate vault statistics
   */
  async calculateVaultStats(positions: VaultPosition[]): Promise<{
    totalPositions: number;
    totalValue: number;
    privacyScore: number;
    tokens: { [token: string]: number };
  }> {
    const stats = {
      totalPositions: positions.length,
      totalValue: 0,
      privacyScore: positions.length > 0 ? 100 : 0, // Privacy score based on number of positions
      tokens: {} as { [token: string]: number }
    };

    for (const position of positions) {
      const amount = parseFloat(position.amount);
      stats.totalValue += amount;
      
      if (stats.tokens[position.token]) {
        stats.tokens[position.token] += amount;
      } else {
        stats.tokens[position.token] = amount;
      }
    }

    return stats;
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return VaultManagerContract.address;
  }

  /**
   * Get contract ABI
   */
  getContractABI() {
    return VaultManagerContract.abi;
  }
}
