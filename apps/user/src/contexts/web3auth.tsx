import React, { createContext, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import {
	CHAIN_NAMESPACES,
	WALLET_ADAPTERS,
	SafeEventEmitterProvider,
	UserAuthInfo,
	UserInfo
} from "@web3auth/base";
import { env } from "@/env/client.mjs";
import logo from "@ecotoken/ui/assets/brand/logo.png";
import { getWalletProvider, IWalletProvider } from "@/providers/wallet";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export type Web3AuthContext = {
	web3auth: Web3Auth | null;
	walletProvider: IWalletProvider | null;
	login: () => void;
	logout: () => Promise<void>;
	loading: boolean;
};
const Web3AuthContext = createContext<Web3AuthContext>({
	walletProvider: null,
	web3auth: null,
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
	const [loginInfo, setLoginInfo] = useState<
		(Partial<UserInfo> | Partial<UserAuthInfo>) | null
	>(null);

	const { mutate, isLoading } = trpc.userAuth.login.useMutation({
		onSuccess() {
			router.push("/");
		}
	});
	const router = useRouter();
	useEffect(() => {
		console.log(logo.src);
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
						clientId:
							process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? ""
					},
					loginSettings: {
						curve: "ed25519" // allowed values "secp256k1" (default) or "ed25519"
					}
				});
				web3auth.configureAdapter(openloginAdapter);
				await web3auth.initModal();
				setWeb3auth(web3auth);
			} catch (error) {
				console.log("error", error);
			}
		};
		init();
	}, []);

	const login = async () => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}
		try {
			const authProvider = await web3auth.connect();
			if (web3auth.connectedAdapterName !== null && authProvider) {
				console.log("step 1", "provider: " + authProvider);
				setProvider(authProvider);
				const walletProvider = getWalletProvider(authProvider);
				setWalletProvider(walletProvider);
				console.log(
					"step 2",
					"accounts: " + (await walletProvider.getAccounts())
				);
				const idToken = await getIdToken();
				const isWalletSocial = await isSocial();
				console.log("step 3", "idToken: " + idToken);
				if (idToken && walletProvider) {
					await mutate({
						idToken: idToken ?? "",
						type: isWalletSocial ? "social" : "external",
						publicAddress:
							(await getPrimaryAddress(walletProvider)) ?? "",
						...(isWalletSocial && {
							publicKey: await getPublicKey(walletProvider)
						})
					});
				}
			}
		} catch (e) {
			console.log("Web3Auth login error:", e);
		}
	};

	const isSocial = async () => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}
		return (
			web3auth.connectedAdapterName !== "phantom" &&
			web3auth.connectedAdapterName !== "torus"
		);
	};

	const getIdToken = async () => {
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
	const getPrimaryAddress = async (walletProvider: IWalletProvider) => {
		if (!web3auth) {
			console.log("web3auth/walletProvider not initialized yet");
			return;
		}
		const wallets = await walletProvider.getAccounts();
		return wallets[0] as string;
	};

	// used to get the publicKey of the wallet (for social logins)
	const getPublicKey = async (walletProvider: IWalletProvider) => {
		if (!web3auth) {
			console.log("web3auth/walletProvider not initialized yet");
			return;
		}
		const app_scoped_privkey = await walletProvider?.getPrivateKey();

		if (app_scoped_privkey) {
			const ed25519Key = getED25519Key(
				Buffer.from(app_scoped_privkey.padStart(64, "0"), "hex")
			);
			const app_pub_key = ed25519Key.pk.toString("hex");
			return app_pub_key;
		}
	};

	const logout = async () => {
		await web3auth?.logout();
	};

	return (
		<Web3AuthContext.Provider
			value={{
				web3auth,
				walletProvider,
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
