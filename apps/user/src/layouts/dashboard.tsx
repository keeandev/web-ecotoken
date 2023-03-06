import Navbar from "@/components/layout/navbar";
import Sidebar, { SidebarItem } from "@/components/layout/sidebar";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Footer from "@/components/layout/footer";

const DefaultLayout: NextPage<React.PropsWithChildren> = ({ children }) => {
    const [expanded, setExpanded] = useState(true);

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
            <div className="flex w-full">
                <div className="flex w-full flex-col">
                    <Navbar>
                        <ul className="flex w-3/5 items-center justify-around text-white">
                            <li>
                                <Link href="/user">HOME</Link>
                            </li>
                            <li>
                                <Link href="/user/projects">ALL PROJECTS</Link>
                            </li>
                            <li>
                                <Link href="/user/contactus">CONTACT US</Link>
                            </li>
                        </ul>
                    </Navbar>
                    <main className="mt-16 overflow-y-auto">
                        <div className="">{children}</div>
                        <Footer />
                    </main>
                </div>
            </div>
        </>
    );
};

export default DefaultLayout;
