import Banner from "@/components/layout/public/banner";
import banner_image from "@ecotoken/ui/assets/ecoproject/head_mitchell_pond.png";
import Button from "@ecotoken/ui/components/Button";
import go_icon from "@ecotoken/ui/assets/icons/go.svg";
import Image from "next/image";

const BannerSection = () => {
    return (
        <Banner src={banner_image.src}>
            <div className="absolute top-0 left-0 flex h-full w-3/4 items-center justify-center bg-gradient-to-r from-slate-200 to-transparent">
                <div className="pl-[10%] pr-[30%] font-bold">
                    <h1 className="text-[54px] uppercase leading-normal text-[#00AEEF] ">
                        NFT impact offsetting{" "}
                    </h1>
                    <h1 className="text-[54px] uppercase leading-normal text-black">
                        with Regen ecocredits
                    </h1>
                    <p className="mt-4 text-[28px] leading-normal text-black">
                        Verifiable cross chain ecocredit retirement on Solana
                        with Carbon, Water, and Habitat credits
                    </p>
                    <Button intent={"sky"} className="mt-8">
                        <span className="flex min-w-[70px] items-center gap-3 px-[0.8em] py-1 text-[24px] font-normal">
                            LOG IN
                            <Image src={go_icon} alt="Go Icon" />
                        </span>
                    </Button>
                </div>
            </div>
        </Banner>
    );
};

export default BannerSection;
