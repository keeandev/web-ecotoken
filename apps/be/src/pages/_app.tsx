import DefaultLayout from "@/layouts/default";
import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

config.autoAddCss = false;

export type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
	const defaultLayout = (page: ReactNode) => {
		return <DefaultLayout>{page}</DefaultLayout>;
	};
	const getLayout = Component.getLayout ?? defaultLayout;
	return <>{getLayout(<Component {...pageProps} />)}</>;
};

export default trpc.withTRPC(App);
