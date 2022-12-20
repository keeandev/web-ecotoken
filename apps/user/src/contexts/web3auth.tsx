import React, { createContext, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import {
	CHAIN_NAMESPACES,
	ADAPTER_EVENTS,
	CONNECTED_EVENT_DATA,
	SafeEventEmitterProvider,
	UserAuthInfo,
	UserInfo
} from "@web3auth/base";
import { env } from "@/env/client.mjs";
import logo from "@ecotoken/ui/assets/brand/logo.png";
import { getWalletProvider, IWalletProvider } from "@/providers/wallet";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export type Web3AuthContext = {
	web3auth: Web3Auth | null;
	walletProvider: IWalletProvider | null;
	loginInfo:
		| ((Partial<UserInfo> | Partial<UserAuthInfo>) & {
				walletAddress: string;
		  })
		| null;
	login: () => void;
	logout: () => Promise<void>;
	loading: boolean;
};
type LoginInfo = (Partial<UserInfo> | Partial<UserAuthInfo>) & {
	walletAddress: string;
};
const Web3AuthContext = createContext<Web3AuthContext>({
	walletProvider: null,
	web3auth: null,
	loginInfo: null,
	login() {},
	async logout() {},
	loading: false
});

const Web3AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
	const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
		null
	);
	const [walletProvider, setWalletProvider] =
		useState<IWalletProvider | null>(null);
	const [loginInfo, setLoginInfo] = useState<LoginInfo | null>(null);

	const { mutate, isLoading } = trpc.userAuth.login.useMutation({
		async onSuccess() {
			router.push("/");
		}
	});
	const router = useRouter();
	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		try {
			const web3auth = new Web3Auth({
				clientId: env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID, // Client ID from your Web3Auth Dashboard
				// Additional uiConfig for Whitelabeling can be passed here
				uiConfig: {
					appLogo: logo.src,
					theme: "light"
				},
				chainConfig: {
					chainNamespace: CHAIN_NAMESPACES.SOLANA,
					chainId: "0x3",
					rpcTarget: env.NEXT_PUBLIC_SOLANA_RPC,
					displayName: "Solana",
					ticker: "SOL",
					tickerName: "Solana"
				},
				enableLogging: true
			});
			const openloginAdapter = new OpenloginAdapter({
				adapterSettings: {
					network:
						process.env.NODE_ENV === "production"
							? "mainnet"
							: "testnet",
					clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? ""
				},
				loginSettings: {
					curve: "ed25519" // allowed values "secp256k1" (default) or "ed25519"
				}
			});
			web3auth.configureAdapter(openloginAdapter);
			subscribeEvents(web3auth);
			await web3auth.initModal();
			setWeb3auth(web3auth);
		} catch (error) {
			console.log("error", error);
		}
	};

	const subscribeEvents = (web3auth: Web3Auth) => {
		web3auth.on(
			ADAPTER_EVENTS.CONNECTED,
			async (data: CONNECTED_EVENT_DATA) => {
				if (data.reconnected) toast.success("Wallet reconnected.");
				else toast.success("Wallet connected.");
				if (!walletProvider && web3auth && web3auth.provider) {
					console.log("Creating wallet provider... (ecotoken)");
					const walletProvider = getWalletProvider(web3auth.provider);
					setWalletProvider(walletProvider);
					console.log("Wallet provider created", walletProvider);
					if (walletProvider) {
						console.log("Creating wallet info... (ecotoken)");
						const info = await getUserInfo(
							web3auth,
							walletProvider
						);
						setLoginInfo(info);
						console.log("User info created", walletProvider);
					}
				}
			}
		);
	};

	const login = async () => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}
		try {
			const authProvider = await web3auth.connect();
			if (web3auth.connectedAdapterName !== null && authProvider) {
				setProvider(authProvider);
				if (!walletProvider) {
					const walletProvider = getWalletProvider(authProvider);
					setWalletProvider(walletProvider);
				}
				const idToken = await getIdToken(web3auth);
				const isWalletSocial = await isSocial();
				if (idToken && walletProvider) {
					await mutate({
						idToken: idToken ?? "",
						type: isWalletSocial ? "social" : "external",
						publicAddress:
							(await getPrimaryAddress(
								web3auth,
								walletProvider
							)) ?? "",
						...(isWalletSocial && {
							publicKey: await getPublicKey(
								web3auth,
								walletProvider
							)
						})
					});
				}
			}
		} catch (e) {
			console.log("Web3Auth login error:", e);
		}
	};

	const getType = async () => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}

		const isSocial =
			web3auth.connectedAdapterName !== "phantom" &&
			web3auth.connectedAdapterName !== "torus";
		return isSocial ? "social" : "external";
	};

	const isSocial = async () => (await getType()) === "social";

	const getIdToken = async (web3auth: Web3Auth) => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}
		const isWalletSocial = await isSocial();
		if (isWalletSocial) {
			const userInfo = await web3auth.getUserInfo();
			return userInfo.idToken;
		} else {
			const userInfo = await web3auth.authenticateUser();
			return userInfo.idToken;
		}
	};

	// used to get the address of the wallet
	const getPrimaryAddress = async (
		web3auth: Web3Auth,
		walletProvider: IWalletProvider
	) => {
		if (!web3auth || !walletProvider) {
			console.log("web3auth/walletProvider not initialized yet");
			return;
		}
		const wallets = await walletProvider.getAccounts();
		return wallets[0] as string;
	};

	// used to get the publicKey of the wallet (for social logins)
	const getPublicKey = async (
		web3auth: Web3Auth,
		walletProvider: IWalletProvider
	) => {
		if (!web3auth || !walletProvider) {
			console.log("web3auth/walletProvider not initialized yet");
			return;
		}
		const app_scoped_privkey = await walletProvider.getPrivateKey();

		if (app_scoped_privkey) {
			const ed25519Key = getED25519Key(
				Buffer.from(app_scoped_privkey.padStart(64, "0"), "hex")
			);
			const app_pub_key = ed25519Key.pk.toString("hex");
			return app_pub_key;
		}
	};

	const getUserInfo = async (
		web3auth: Web3Auth,
		walletProvider: IWalletProvider
	): Promise<LoginInfo | null> => {
		if (!web3auth || !walletProvider) {
			console.log("web3auth not initialized yet");
			return null;
		}
		const isWalletSocial = await isSocial();

		let info: Partial<UserAuthInfo> | Partial<UserInfo>;
		if (isWalletSocial) info = await web3auth.getUserInfo();
		else info = await web3auth.authenticateUser();

		return {
			...info,
			walletAddress:
				(await getPrimaryAddress(web3auth, walletProvider)) ?? ""
		};
	};

	const logout = async () => {
		await web3auth?.logout();
		setWalletProvider(null);
		setProvider(null);
		setWeb3auth(null);
		setLoginInfo(null);
		init();
	};

	return (
		<Web3AuthContext.Provider
			value={{
				web3auth,
				walletProvider,
				loginInfo,
				login,
				logout,
				loading: isLoading
			}}
		>
			{children}
		</Web3AuthContext.Provider>
	);
};

const useWeb3Auth = () => {
	const context = useContext(Web3AuthContext);
	if (!context)
		throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
	return context;
};

export { useWeb3Auth, Web3AuthProvider };
