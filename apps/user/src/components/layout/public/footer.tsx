import footer_image from "@ecotoken/ui/assets/brand/footer_bg.png";
import Button from "@ecotoken/ui/components/Button";
import Image from "next/image";
import logo from "@ecotoken/ui/assets/brand/logo-header.png";
import footer_white from "@ecotoken/ui/assets/brand/footer_white.png";

const PublicFooter = () => {
    return (
        <>
            <div className="relative flex w-full flex-col content-end">
                <div
                    className="relative mt-[100px] h-[240px] w-full bg-slate-600 bg-cover bg-right-bottom"
                    style={{ backgroundImage: `url(${footer_image.src})` }}
                >
                    <div
                        className="absolute left-0 bottom-[20%] flex h-[120%] w-[50%] flex-row justify-end bg-right-top"
                        style={{ backgroundImage: `url(${footer_white.src})` }}
                    >
                        <div className="relative w-[100%] max-w-[600px] bg-teal-200/10 py-8 px-16">
                            <Image
                                src={logo}
                                alt="ecoToken System"
                                className={"w-[50%] transition-all"}
                            />
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
                                className="bg-ecoblue-500 whitespace-nowrap rounded-l-none rounded-r-xl"
                                intent="destructive"
                            >
                                Subscribe Now
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="bg-ecoblue-500 w-full py-3 text-center text-xs text-white">
                    Copyright 2023. All Right Reserved
                </div>
            </div>
        </>
    );
};

export default PublicFooter;
