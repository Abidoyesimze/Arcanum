export interface WalletInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  isInstalled: boolean;
}

export class WalletService {
  private static instance: WalletService;
  
  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  async getAvailableWallets(): Promise<WalletInfo[]> {
    // Check if wallets are available in the browser
    const isArgentInstalled = typeof window !== 'undefined' && 
      (window as any).starknet_argentX !== undefined;
    const isBraavosInstalled = typeof window !== 'undefined' && 
      (window as any).starknet_braavos !== undefined;
    
    return [
      {
        id: 'argentX',
        name: 'Argent X',
        description: 'Secure smart wallet',
        icon: '🛡️',
        isInstalled: isArgentInstalled
      },
      {
        id: 'braavos',
        name: 'Braavos',
        description: 'Multi-sig wallet',
        icon: '⚔️',
        isInstalled: isBraavosInstalled
      }
    ];
  }

  // This method is now just a placeholder since we'll use Starknet React hooks
  async connectWallet(walletId: string): Promise<{ success: boolean; account?: any; error?: string }> {
    // The actual connection will be handled by the useConnect hook in the component
    return { success: true };
  }

  // This method is now just a placeholder since we'll use Starknet React hooks
  async disconnectWallet(): Promise<{ success: boolean; error?: string }> {
    // The actual disconnection will be handled by the useDisconnect hook in the component
    return { success: true };
  }

  // These methods are now just placeholders since we'll use Starknet React hooks
  async getConnectedAccount(): Promise<any> {
    return null;
  }

  async getAccountAddress(): Promise<string | null> {
    return null;
  }

  async getChainId(): Promise<string | null> {
    return null;
  }
}
