import UserDropdown from "@/components/user-dropdown";
import { getRouteName } from "@/utils/route";
import clsx from "clsx";
import { useRouter } from "next/router";

const Navbar: React.FC<React.ComponentProps<"div">> = ({
	className,
	...props
}) => {
	const router = useRouter();
	return (
		<div
			id="navbar"
			className={clsx("m-0 items-center", className)}
			{...props}
		>
			<div className="flex-1 justify-start">
				<div className="capitalize">{getRouteName(router.route)}</div>
			</div>
			<div className="flex justify-end space-x-2">
				<UserDropdown />
			</div>
		</div>
	);
};

export default Navbar;
