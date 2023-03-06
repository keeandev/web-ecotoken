import DashboardLayout from "@/layouts/dashboard";
import PublicLayout from "@/layouts/public";
import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

config.autoAddCss = false;

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
    const router = useRouter();
    const defaultLayout = (page: ReactNode) => {
        if (router.pathname.startsWith("/user"))
            return <DashboardLayout>{page}</DashboardLayout>;
        else return <PublicLayout>{page}</PublicLayout>;
    };
    const getLayout = Component.getLayout ?? defaultLayout;
    return (
        <>
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
        </>
    );
};

export default trpc.withTRPC(App);
