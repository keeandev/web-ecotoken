import UserDropdown from "@/components/user-dropdown";
// import { getRouteName } from "@/utils/route";
// import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import white_bevel_sm from "@ecotoken/ui/assets/brand/bevel_white_sm.png";
import wordmark from "@ecotoken/ui/assets/brand/logo_ecotoken-wm-600.png";
import logo from "@ecotoken/ui/assets/brand/logo_ecotoken-300.png";
// import clsx from "clsx";

const PublicNavbar = () => {
    return (
        <div className="fixed top-0 z-30 flex h-16 w-full items-start border-b border-slate-400 bg-ecoblue-500">
            <div
                className="flex h-full w-1/4 min-w-[120px] items-center justify-end bg-right-top md:w-1/3"
                style={{ backgroundImage: `url(${white_bevel_sm.src})` }}
            >
                <Link href="/" className="w-full">
                    <div className="flex w-full justify-center pr-4 md:hidden">
                        <Image
                            src={logo}
                            alt="ecoToken System"
                            className="h-auto w-[75%] max-w-[54px]"
                        />
                    </div>
                    <div className="p relative hidden w-full max-w-[360px] px-16 md:flex ">
                        <Image
                            src={wordmark}
                            alt="ecoToken System"
                            className="w-full min-w-[150px] max-w-[200px]"
                        />
                    </div>
                </Link>
            </div>
            <div className="flex h-full w-3/4 justify-between md:w-2/3">
                <nav className="flex w-3/5 items-end justify-around text-center leading-4 text-white">
                    <Link
                        href="/"
                        className="mb-4 inline hidden border-b-4 border-ecoblue-500 px-1 py-1 hover:border-ecogreen-500 sm:inline"
                    >
                        HOME
                    </Link>

                    <Link
                        href="/project"
                        className="ml-2 mb-4 inline border-b-4 border-ecoblue-500 px-1 py-1 hover:border-ecogreen-500"
                    >
                        PROJECTS
                    </Link>

                    <Link
                        href="/contactus"
                        className="ml-2 mb-4 inline border-b-4 border-ecoblue-500 px-1 py-1 hover:border-ecogreen-500"
                    >
                        CONTACT US
                    </Link>

                    <Link
                        href="/projects"
                        className="ml-2 mb-4 inline border-b-4 border-ecoblue-500 px-1 py-1 hover:border-ecogreen-500"
                    >
                        CONNECT WALLET
                    </Link>
                </nav>
                <div className="px-10">
                    <UserDropdown />
                </div>
            </div>
        </div>
    );
};

export default PublicNavbar;
