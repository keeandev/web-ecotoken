import UserDropdown from "@/components/user-dropdown";
import { getRouteName } from "@/utils/route";
import { useRouter } from "next/router";

const Navbar = () => {
	const router = useRouter();
	return (
		<div className="m-0 flex h-16 w-full items-center border-b border-slate-300 bg-slate-200 px-4">
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
