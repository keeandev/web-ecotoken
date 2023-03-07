import PublicNavbar from "@/components/layout/public/navbar";
import PublicFooter from "@/components/layout/public/footer";
import type { NextPage } from "next";
import Head from "next/head";

const DefaultLayout: NextPage<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Head>
                <title>EcoToken</title>
                <meta name="description" content="The EcoToken system." />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="gap-4border-4 grid h-full w-full grid-flow-col grid-rows-[minmax(0,max-content)_auto_minmax(0,max-content)] border-red-500  bg-slate-100">
                <div className="flex w-full flex-col border-4 border-blue-500 ">
                    <PublicNavbar />
                </div>
                <main className="mt-16 overflow-y-auto border-4 border-yellow-500 ">
                    {children}
                </main>
                <div className="flex w-full auto-rows-max flex-col">
                    <PublicFooter />
                </div>
            </div>
        </>
    );
};

export default DefaultLayout;
