import PublicNavbar from "@/components/public/layout/navbar";
import { type NextPage } from "next";
import Head from "next/head";

const PublicLayout: NextPage<React.PropsWithChildren> = ({ children }) => {
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

            <div id="grid">
                <PublicNavbar />
                <main id="main">{children}</main>
            </div>
        </>
    );
};

export default PublicLayout;
