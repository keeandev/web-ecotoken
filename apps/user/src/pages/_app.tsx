/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import DashboardLayout from "@/layouts/dashboard";
import PublicLayout from "@/layouts/public";

import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import { config } from "@fortawesome/fontawesome-svg-core";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { useMemo, type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";
import { type AppProps } from "next/app";
import { useRouter } from "next/router";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, type Cluster } from "@solana/web3.js";
import { Toaster } from "react-hot-toast";

import "@solana/wallet-adapter-react-ui/styles.css";
import { clientEnv } from "@/env/schema.mjs";

config.autoAddCss = false;

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
    const router = useRouter();

    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = clientEnv.NEXT_PUBLIC_SOLANA_NETWORK as Cluster;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/solana-labs/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            new PhantomWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network],
    );

    const defaultLayout = (page: ReactNode) => {
        if (router.pathname.startsWith("/user"))
            return <DashboardLayout>{page}</DashboardLayout>;
        else return <PublicLayout>{page}</PublicLayout>;
    };
    const getLayout = Component.getLayout ?? defaultLayout;

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            duration: 2000,
                            custom: {
                                className: "bg-slate-200 text-black",
                            },
                        }}
                    />
                    {getLayout(<Component {...pageProps} />)}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default trpc.withTRPC(App);
