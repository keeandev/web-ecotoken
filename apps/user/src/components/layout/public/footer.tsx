import bkgd_wave from "@ecotoken/ui/assets/brand/bkgd_wave.png";
import white_bevel from "@ecotoken/ui/assets/brand/layout_whitebevel.png";
import Button from "@ecotoken/ui/components/Button";
import Image from "next/image";
import logo from "@ecotoken/ui/assets/brand/logo_ecotoken-wm-600.png";
import icon_twitter from "@ecotoken/ui/assets/icons/icon_twitter06.png";
import icon_telegram from "@ecotoken/ui/assets/icons/icon_telegram06.png";
import icon_discord from "@ecotoken/ui/assets/icons/icon_discord06.png";
import icon_linkedin from "@ecotoken/ui/assets/icons/icon_linkedin06.png";
import icon_gitcoin from "@ecotoken/ui/assets/icons/icon_gitcoin06.png";
import Link from "next/link";
import {
    faLinkedinIn,
    faTwitter,
    faDiscord,
    faTelegram,
    faTelegramPlane,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PublicFooter = () => {
    return (
        <>
            <div className="relative flex w-full flex-col content-end">
                <div
                    className="relative mt-[100px] h-[240px] w-full bg-slate-600 bg-cover bg-right-bottom"
                    style={{ backgroundImage: `url(${bkgd_wave.src})` }}
                >
                    <div
                        className="absolute left-0 bottom-[20%] flex h-[120%] w-[50%] flex-row justify-end bg-right-top"
                        style={{ backgroundImage: `url(${white_bevel.src})` }}
                    >
                        <div className="relative w-full max-w-[600px] px-16 pt-[40px]">
                            <Image
                                src={logo}
                                alt="ecoToken System"
                                className={"w-[300px] transition-all"}
                            />
                            <div className="w-80% flex gap-4 py-4 pl-2">
                                <Link
                                    href="https://twitter.com/THEecoToken"
                                    target="_new"
                                    className="h-[44px] w-[44px] rounded-[24px] bg-ecoblue-500 pt-[9px] text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        size="2x"
                                        className="text-white"
                                    />
                                </Link>
                                <Link
                                    href="https://t.me/ecosystemtoken"
                                    target="_new"
                                    className="relative h-[44px] w-[44px] rounded-[24px] border-4 border-ecoblue-500 bg-white text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faTelegram}
                                        size="3x"
                                        className="relative -left-[2px] -top-[3px] m-0 text-ecoblue-500"
                                    />
                                </Link>
                                <Link
                                    href="https://discord.gg/wBEBh3FYZ7"
                                    target="_new"
                                    className="h-[44px] w-[44px] rounded-[24px] bg-ecoblue-500 pt-[7px] text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faDiscord}
                                        size="2x"
                                        className="text-white"
                                    />
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/company/the-ecotoken/about/"
                                    target="_new"
                                    className="h-[44px] w-[44px] rounded-[24px] bg-ecoblue-500 pt-[7px] pl-[2px] text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        size="2x"
                                        className="text-white"
                                    />
                                </Link>
                                {/* <Link
                                    href="https://gitcoin.co/grants/5371/ecotoken-pilot-and-protocol-development"
                                    target="_new"
                                    className="h-[42px] w-[42px] rounded-[24px] bg-ecoblue-500 pt-[7px] pl-[2px] text-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        size="2x"
                                        className="text-white"
                                    />
                                </Link> */}
                            </div>
                        </div>
                    </div>
                    <div className="absolute left-[50%] bottom-0 flex h-full w-[50%] max-w-[500px] flex-col justify-start pr-4 pt-8">
                        <h2 className="font- text-[36px] text-white">
                            Get in touch!
                        </h2>
                        <p className="mt-[18px] text-white">
                            If you would like to know more about how the
                            ecoToken System promotes environmental initiatives
                            or other ways you can help us bring health to the
                            planet, please contact us.
                        </p>
                        <div className="mt-4 flex w-full">
                            <input
                                type={"email"}
                                className="w-full rounded-l-xl rounded-r-none border border-r-0 border-slate-300 bg-slate-900/50 px-[18px] py-[12px]"
                                placeholder="Email Address"
                            />
                            <Button
                                className="whitespace-nowrap rounded-l-none rounded-r-xl bg-ecoblue-500"
                                intent="destructive"
                            >
                                Subscribe Now
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-ecoblue-500 py-3 text-center text-xs text-white">
                    Copyright 2023. All Right Reserved
                </div>
            </div>
        </>
    );
};

export default PublicFooter;
