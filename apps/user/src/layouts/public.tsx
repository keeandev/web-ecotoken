import PublicNavbar from "@/components/layout/public/navbar";
import PublicFooter from "@/components/layout/public/footer";
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";

const DefaultLayout: NextPage<React.PropsWithChildren> = ({ children }) => {
    const { data: credits, isLoading: fetchingCredits } =
    trpc.credit.getSellOrderByBatch.useQuery(
        {
            batch: "C50-001-20230301-20230401-001",
        }
    );
    console.log("users",credits, fetchingCredits)

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

            <div className="grid h-full w-full grid-flow-col grid-rows-[minmax(0,max-content)_auto_minmax(0,max-content)] bg-slate-200/75">
                <div className="flex w-full flex-col">
                    <PublicNavbar />
                </div>
                <main className="mt-16 flex justify-center overflow-y-auto">
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
