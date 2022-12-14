import React, { createContext, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import {
	CHAIN_NAMESPACES,
	SafeEventEmitterProvider,
	UserAuthInfo,
	UserInfo
} from "@web3auth/base";
import { env } from "@/env/client.mjs";
import logo from "@ecotoken/ui/assets/brand/logo.png";
import { getWalletProvider, IWalletProvider } from "@/providers/wallet";
import { trpc } from "@/utils/trpc";

export type Web3AuthContext = {
	web3auth: Web3Auth | null;
	walletProvider: IWalletProvider | null;
	login: () => void;
};
const Web3AuthContext = createContext<Web3AuthContext>({
	walletProvider: null,
	web3auth: null,
	login: () => {}
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

	const { mutate, isLoading } = trpc.walletAuth.login.useMutation();
	useEffect(() => {
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
						chainId: "0x2",
						rpcTarget: env.NEXT_PUBLIC_SOLANA_RPC,
						displayName: "solana",
						ticker: "SOL",
						tickerName: "solana"
					},
					enableLogging: true
				});
				const openloginAdapter = new OpenloginAdapter({
					adapterSettings: {
						network: "testnet",
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
			if (authProvider) {
				console.log("step 1");
				setProvider(authProvider);
				setWalletProvider(getWalletProvider(authProvider));
				console.log("step 2");
				const idToken = await getIdToken();
				console.log("step 3");
				if (idToken) {
					console.log("step 4");
					// const keyInfo = await getPublicKey();
					// if (keyInfo) {
					// 	await mutate({
					// 		idToken: idToken ?? "",
					// 		...keyInfo
					// 	});
					// }
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
		let isSocial = false;
		try {
			await walletProvider?.getPrivateKey();
			isSocial = true;
		} catch (e) {}
		return isSocial;
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

	const getPublicKey = async () => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}
		const isWalletSocial = await isSocial();

		const wallets = await walletProvider?.getAccounts();

		if (!isWalletSocial && wallets) {
			return { type: "external", publicAddress: `${wallets[0].address}` };
		}

		const app_scoped_privkey = await walletProvider?.getPrivateKey();

		if (app_scoped_privkey) {
			const ed25519Key = getED25519Key(
				Buffer.from(app_scoped_privkey.padStart(64, "0"), "hex")
			);
			const app_pub_key = ed25519Key.pk.toString("hex");
			return { type: "social", publicKey: app_pub_key };
		}

		return { type: "social", publicAddress: "" };
	};

	return (
		<Web3AuthContext.Provider value={{ web3auth, walletProvider, login }}>
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
