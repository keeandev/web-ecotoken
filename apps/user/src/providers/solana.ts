import { IWalletProvider } from "@/providers/wallet";
import {
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction
} from "@solana/web3.js";
import { CustomChainConfig, SafeEventEmitterProvider } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

const solanaProvider = (
	provider: SafeEventEmitterProvider
): IWalletProvider => {
	const solanaWallet = new SolanaWallet(provider);

	const getPrivateKey = async () => {
		try {
			const privateKey = await solanaWallet.request({
				method: "solanaPrivateKey"
			});
			return privateKey as string;
		} catch (e) {}
	};

	const getConnection = async (): Promise<Connection> => {
		const connectionConfig = await solanaWallet.request<CustomChainConfig>({
			method: "solana_provider_config",
			params: []
		});
		const conn = new Connection(connectionConfig.rpcTarget);
		return conn;
	};

	const getAccounts = async (): Promise<string[]> => {
		try {
			const acc = await solanaWallet.requestAccounts();
			return acc;
		} catch (error) {
			console.log("error", error);
			return [];
		}
	};

	const getBalance = async () => {
		try {
			const conn = await getConnection();
			const accounts = await solanaWallet.requestAccounts();
			const balance = await conn.getBalance(
				new PublicKey(accounts[0] as string)
			);
			return balance;
		} catch (error) {
			console.log("error", error);
		}
	};

	const signMessage = async (): Promise<void> => {
		try {
			const msg = Buffer.from("Test Signing Message ", "utf8");
			const res = await solanaWallet.signMessage(msg);
			console.log("Solana sign message", res);
		} catch (error) {
			console.log("error", error);
		}
	};

	const signAndSendTransaction = async (): Promise<void> => {
		try {
			const conn = await getConnection();
			const solWeb3 = new SolanaWallet(provider);
			const pubKey = await solWeb3.requestAccounts();
			const blockhash = (await conn.getRecentBlockhash("finalized"))
				.blockhash;
			const TransactionInstruction = SystemProgram.transfer({
				fromPubkey: new PublicKey(pubKey[0] as string),
				toPubkey: new PublicKey(pubKey[0] as string),
				lamports: 0.01 * LAMPORTS_PER_SOL
			});
			const transaction = new Transaction({
				recentBlockhash: blockhash,
				feePayer: new PublicKey(pubKey[0] as string)
			}).add(TransactionInstruction);
			const signature = await solWeb3.signAndSendTransaction(transaction);
			console.log("signature", signature);
		} catch (error) {
			console.log("error", error);
		}
	};

	const signTransaction = async (): Promise<void> => {
		try {
			const conn = await getConnection();
			const solWeb3 = new SolanaWallet(provider);
			const pubKey = await solWeb3.requestAccounts();
			const blockhash = (await conn.getRecentBlockhash("finalized"))
				.blockhash;
			const TransactionInstruction = SystemProgram.transfer({
				fromPubkey: new PublicKey(pubKey[0] as string),
				toPubkey: new PublicKey(pubKey[0] as string),
				lamports: 0.01 * LAMPORTS_PER_SOL
			});
			const transaction = new Transaction({
				recentBlockhash: blockhash,
				feePayer: new PublicKey(pubKey[0] as string)
			}).add(TransactionInstruction);
			const signedTx = await solWeb3.signTransaction(transaction);
			signedTx.serialize();
			console.log("signature", signedTx);
		} catch (error) {
			console.log("error", error);
		}
	};

	return {
		getPrivateKey,
		getConnection,
		getAccounts,
		getBalance,
		signMessage,
		signAndSendTransaction,
		signTransaction,
		solanaWallet
	};
};

export default solanaProvider;
