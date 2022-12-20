import UserDropdown from "@/components/user-dropdown";
import { useWeb3Auth } from "@/contexts/web3auth";
import { useMemo } from "react";
// import { getRouteName } from "@/utils/route";
// import { useRouter } from "next/router";

const Navbar = () => {
	// const router = useRouter();
	const web3auth = useWeb3Auth();
	return (
		<div className="flex h-16 items-center border-b border-slate-300 bg-slate-200 px-4">
			<div className="flex-1 justify-start">
				{/* <div className="capitalize">{getRouteName(router.route)}</div> */}
				<div>
					Wallet Address{" "}
					<span className="rounded-md bg-slate-300 px-2 py-1">
						{web3auth.loginInfo?.walletAddress}
					</span>{" "}
				</div>
			</div>
			<div className="flex justify-end space-x-2">
				<UserDropdown />
			</div>
		</div>
	);
};

export default Navbar;
