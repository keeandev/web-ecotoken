import UserDropdown from "@/components/user-dropdown";
// import { getRouteName } from "@/utils/route";
// import { useRouter } from "next/router";

const Navbar = () => {
	return (
		<div className="flex h-16 items-center border-b border-slate-300 bg-slate-200 px-4">
			<div className="flex-1 justify-start">
				{/* <div className="capitalize">{getRouteName(router.route)}</div> */}
				{/* <div>
					Wallet Address{" "}
					<span className="rounded-md bg-slate-300 px-2 py-1">
						{web3auth.loginInfo?.walletAddress}
					</span>{" "}
				</div> */}
			</div>
			<div className="flex justify-end space-x-2">
				<UserDropdown />
			</div>
		</div>
	);
};

export default Navbar;
