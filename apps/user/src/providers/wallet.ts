import solanaProvider from "@/providers/solana";
import { SafeEventEmitterProvider } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

export interface IWalletProvider {
	getPrivateKey: () => Promise<string>;
	getConnection: () => Promise<any>;
	getAccounts: () => Promise<any>;
	getBalance: () => Promise<any>;
	signAndSendTransaction: () => Promise<void>;
	signTransaction: () => Promise<void>;
	signMessage: () => Promise<void>;
	solanaWallet: SolanaWallet;
}

export const getWalletProvider = (
	provider: SafeEventEmitterProvider
): IWalletProvider => {
	// TODO: add more wallet providers
	return solanaProvider(provider);
};