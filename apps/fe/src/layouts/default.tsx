import logo from "#/logo.png";
import Navbar from "@/components/layout/navbar";
import Sidebar, { SidebarItem } from "@/components/layout/sidebar";
import {
	faArrowLeft,
	faClockRotateLeft,
	faGear,
	faHouse,
	faImage,
	faLeaf,
	faWallet
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

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
			<div className="flex h-full w-full">
				<Sidebar
					expanded={expanded}
					className="border-r border-slate-300 transition-all duration-200 ease-in-out"
				>
					<div
						className={clsx("-mt-2 flex h-16 w-full items-center", {
							"justify-center": !expanded
						})}
					>
						<Image
							src={logo}
							alt="ecoToken System"
							className={clsx("h-10 w-10 transition-all", {
								"ml-2": expanded
							})}
						/>
					</div>
					<div className="transition-all duration-200 ease-in-out">
						<SidebarItem
							path="/"
							name="Dashboard"
							icon={faHouse}
							expanded={expanded}
						/>
						<SidebarItem
							path="/wallet"
							name="Wallet"
							icon={faWallet}
							expanded={expanded}
						/>
						<SidebarItem
							path="/history"
							name="History"
							icon={faClockRotateLeft}
							expanded={expanded}
						/>
						<SidebarItem
							path="/settings"
							name="Settings"
							icon={faGear}
							expanded={expanded}
						/>
						<SidebarItem
							path="/projects"
							name="Projects"
							icon={faLeaf}
							expanded={expanded}
						/>
						<SidebarItem
							path="/collection"
							name="Collection"
							icon={faImage}
							expanded={expanded}
						/>
						<SidebarItem
							name="Collapse Sidebar"
							icon={() => (
								<FontAwesomeIcon
									icon={faArrowLeft}
									className={`transition-all duration-200 ease-out ${
										!expanded && "-rotate-180"
									}`}
								/>
							)}
							expanded={expanded}
							onClick={() => setExpanded(!expanded)}
							className={clsx(
								"-mt-2 opacity-0 delay-75 duration-200 hover:opacity-100 focus:opacity-100"
							)}
						/>
					</div>
				</Sidebar>
				<div className="flex h-full w-full flex-col">
					<Navbar />
					<main className="flex flex-1 overflow-y-auto p-8">
						{children}
					</main>
				</div>
			</div>
		</>
	);
};

export default DefaultLayout;
