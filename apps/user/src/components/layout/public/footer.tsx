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
                                >
                                    <Image
                                        src={icon_twitter}
                                        alt="Contact us on Twitter"
                                        className={
                                            "h-[40px] w-[40px] transition-all"
                                        }
                                    />
                                </Link>
                                <Link
                                    href="https://t.me/ecosystemtoken"
                                    target="_new"
                                >
                                    <Image
                                        src={icon_telegram}
                                        alt="Contact us on Telegram"
                                        className={
                                            "h-[40px] w-[40px] transition-all"
                                        }
                                    />
                                </Link>
                                <Link
                                    href="https://discord.gg/wBEBh3FYZ7"
                                    target="_new"
                                >
                                    <Image
                                        src={icon_discord}
                                        alt="Contact us on Discord"
                                        className={
                                            "h-[40px] w-[40px] transition-all"
                                        }
                                    />
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/company/the-ecotoken/about/"
                                    target="_new"
                                >
                                    <Image
                                        src={icon_linkedin}
                                        alt="Contact us on LinkIn"
                                        className={
                                            "h-[40px] w-[40px] transition-all"
                                        }
                                    />
                                </Link>
                                <Link
                                    href="https://gitcoin.co/grants/5371/ecotoken-pilot-and-protocol-development"
                                    target="_new"
                                >
                                    <Image
                                        src={icon_gitcoin}
                                        alt="Contact us on GitCoin"
                                        className={
                                            "h-[40px] w-[40px] transition-all"
                                        }
                                    />
                                </Link>
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
