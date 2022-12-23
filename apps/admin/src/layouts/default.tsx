import logo from "@ecotoken/ui/assets/brand/logo.png";
import Navbar from "@/components/layout/navbar";
import Sidebar, {
	SidebarItem,
	SidebarItemProps,
	SidebarCategoryProps
} from "@/components/layout/sidebar";
import {
	faArrowLeft,
	faClockRotateLeft,
	faGear,
	faUser,
	faHouse,
	faImage,
	faLeaf,
	faGlobe,
	faWallet
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const sidebarCategories: Readonly<SidebarCategoryProps>[] = [
	{
		name: "Admin"
	}
];

const sidebarItems: (SidebarItemProps & { category?: string })[] = [
	{
		path: "/",
		name: "Dashboard",
		icon: faHouse
	},
	{
		path: "/administration",
		name: "Administration",
		icon: faWallet
	},
	{
		path: "/users",
		name: "Users",
		icon: faUser
	},
	{
		path: "/settings",
		name: "Settings",
		icon: faGear
	},
	{
		path: "/projects",
		name: "ecoProjects",
		icon: faLeaf
	},
	{
		path: "/configuration",
		name: "Configuration",
		icon: faImage,
		category: "Admin"
	},
	{
		path: "/admin-users",
		name: "Admin Users",
		icon: faUser
	},
	{
		path: "/websites",
		name: "Websites",
		icon: faGlobe
	}
];

const DefaultLayout: NextPage<React.PropsWithChildren> = ({ children }) => {
	const [expanded, setExpanded] = useState(true);

	return (
		<>
			{
				<Head>
					<title>EcoToken</title>
					<meta name="description" content="The EcoToken system." />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1"
					/>
					<link rel="icon" href="/favicon.ico" />
				</Head>
			}

			<div id="grid">
				<Sidebar
					id="sidebar"
					expanded={expanded}
					className=" transition-all duration-200 ease-in-out"
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
						{/* {sidebarCategories.map(({ name }) => {
								const childItems = sidebarItems.filter(
									(sidebarItem) =>
										sidebarItem.category === name
								);
								return childItems.map(
									({ path, name, icon }, index) => (
										<SidebarItem
											key={index}
											path={path}
											name={name}
											icon={icon}
											expanded={expanded}
										/>
									)
								);
							})} */}
						{sidebarItems.map(({ name, path, icon }, index) => (
							<SidebarItem
								key={index}
								path={path}
								name={name}
								icon={icon}
								expanded={expanded}
							/>
						))}
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

				<Navbar />
				<main id="main" className="">
					{children}
				</main>
			</div>
		</>
	);
};

export default DefaultLayout;
