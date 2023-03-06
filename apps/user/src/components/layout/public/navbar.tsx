import UserDropdown from "@/components/user-dropdown";
// import { getRouteName } from "@/utils/route";
// import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import logo from "@ecotoken/ui/assets/brand/logo-header.png";
import clsx from "clsx";

const PublicNavbar = () => {
    return (
        <div className="fixed top-0 z-30 flex h-16 w-full items-center border-b border-slate-300 bg-slate-200">
            <div className="flex-1 justify-start">
                {/* <div className="capitalize">{getRouteName(router.route)}</div> */}
                {/* <div>
					Wallet Address{" "}
					<span className="rounded-md bg-slate-300 px-2 py-1">
						{web3auth.loginInfo?.walletAddress}
					</span>{" "}
				</div> */}
                <Image
                    src={logo}
                    alt="ecoToken System"
                    className={clsx("h-10 w-auto pl-6 transition-all")}
                />
            </div>
            <div className="flex h-full w-2/3 justify-between bg-[#00AEEF] before:ml-0 before:block before:h-full  before:overflow-hidden  before:border-l-[20px] before:border-t-[31px] before:border-r-[20px]  before:border-b-[32px] before:border-l-slate-200 before:border-r-[#00AEEF] before:border-t-slate-200 before:border-b-[#00AEEF] before:content-['']">
                <ul className="flex w-3/5 items-center justify-around text-white">
                    <li>
                        <Link href="/user">HOME</Link>
                    </li>
                    <li>
                        <Link href="/user/projects">PROJECTS</Link>
                    </li>
                    <li>
                        <Link href="/user/contactus">CONTACT US</Link>
                    </li>
                </ul>
                <div className="px-10">
                    <UserDropdown />
                </div>
            </div>
        </div>
    );
};

export default PublicNavbar;
