import footer_image from "@ecotoken/ui/assets/brand/footer_bg.png";
import Button from "@ecotoken/ui/components/Button";
import Image from "next/image";
import logo from "@ecotoken/ui/assets/brand/logo-header.png";
import footer_white from "@ecotoken/ui/assets/brand/footer_white.png";

const PublicFooter = () => {
    return (
        <>
            <div className="relative mt-[280px] w-full bg-[#7E7E7E] px-[130px]">
                <div className="absolute bottom-[40px] left-0 z-10 h-[130%] w-[60%] pt-[42px] pl-[78px]">
                    <div className="relative z-10">
                        <span className="absolute -right-[20%] top-0 h-full w-[100px]"></span>
                        <Image
                            src={logo}
                            alt="ecoToken System"
                            className={"h-10 w-auto transition-all"}
                        />
                        <p className="mt-[40px] text-[36px] font-bold text-black">
                            SOCIAL MEDIA LINKS
                        </p>
                    </div>
                    <Image
                        src={footer_white}
                        alt="ecoToken System"
                        className={
                            "absolute left-0 top-0 z-0 h-full w-full transition-all"
                        }
                    />
                </div>
                <div className="relative z-10">
                    <div className=" ml-[60%] pt-[48px] pb-[80px] text-white">
                        <h2 className="text-[36px]">Get in touch!</h2>
                        <p className="mt-[18px]">
                            Fusce varius, dolor tempor interdum tristiquei
                            bibendum service life. Fusce varius, dolor tempor
                            interdum tristiquei.
                        </p>
                        <div className="mt-[30px] flex w-full">
                            <input
                                type={"email"}
                                className="w-full border border-[#F5F5F5] bg-transparent px-[18px] py-[12px]"
                                placeholder="Email Address"
                            />
                            <Button
                                className="whitespace-nowrap"
                                intent="destructive"
                            >
                                Subscribe Now
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="absolute left-0 top-0 z-0 h-full w-full">
                    <Image
                        src={footer_image}
                        alt="ecoToken System"
                        className={"h-full w-full border-none"}
                    />
                </div>
            </div>
            <div className="w-full bg-[#00AEEF] py-3 text-center text-white">
                Copyright 2023. All Right Reserved
            </div>
        </>
    );
};

export default PublicFooter;
