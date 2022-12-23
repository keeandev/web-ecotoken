import UserDropdown from "@/components/user-dropdown";
import { getRouteName } from "@/utils/route";
import { useRouter } from "next/router";

const Navbar = () => {
	const router = useRouter();
	return (
		<div id="navbar" className="m-0 items-center">
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
