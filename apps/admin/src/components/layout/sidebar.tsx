import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import type { UrlObject } from "url";

export type SidebarItemProps = {
	expanded?: boolean;
	name?: string;
	icon?: IconProp | (() => JSX.Element);
	path?: string | UrlObject;
};

export const SidebarItem: React.FC<
	React.ComponentProps<"div"> & SidebarItemProps
> = ({ className, path = "", name = "", icon, expanded, ...props }) => {
	return (
		<div
			className={clsx(
				"whitespace-nowrap rounded-md px-4 py-2 transition-all ease-out",
				className
			)}
			{...props}
		>
			<Link href={path} className={`${expanded && "space-x-2"}`}>
				<>
					{typeof icon === "function"
						? icon()
						: icon && <FontAwesomeIcon icon={icon} />}
					<Transition
						as="span"
						show={expanded}
						enter="transition-all ease-in-out duration-200"
						enterFrom="opacity-0 w-0"
						enterTo="opacity-100 w-full"
						leave="transition-all ease-in-out duration-200"
						leaveFrom="opacity-100 w-full"
						leaveTo="opacity-0 w-0"
					>
						{name}
					</Transition>
				</>
			</Link>
		</div>
	);
};

export type SidebarCategoryProps = {
	expanded?: boolean;
	name?: string;
};

export const SidebarCategory: React.FC<
	React.ComponentProps<"div"> & SidebarCategoryProps
> = ({ children, className, name, expanded, ...props }) => {
	return (
		<div
			{...props}
			className={clsx(className, "overflow-y-hidden", {
				"h-fit": expanded
			})}
		>
			<div>
				<span>{name}</span>
				<FontAwesomeIcon
					icon={faChevronDown}
					className={clsx({ "rotate-180": expanded })}
				/>
			</div>
			<Transition
				show={expanded}
				enter="transition-all ease-in-out duration-200"
				enterFrom="opacity-0 w-0"
				enterTo="opacity-100 w-full"
				leave="transition-all ease-in-out duration-200"
				leaveFrom="opacity-100 w-full"
				leaveTo="opacity-0 w-0"
			>
				{children}
			</Transition>
		</div>
	);
};

type SidebarProps = {
	expanded: boolean;
};

const Sidebar: React.FC<React.ComponentProps<"div"> & SidebarProps> = ({
	className,
	children,
	expanded,
	...props
}) => {
	return (
		<div
			className={clsx(
				"relative flex flex-col space-y-2 overflow-hidden bg-slate-200 p-2 transition-all duration-200 ease-in-out",
				{ "w-64": expanded },
				{ "w-16 items-center": !expanded },
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Sidebar;
