import Image from "next/image";
import nfts_created_image from "@ecotoken/ui/assets/ecoproject/nfts_created.png";
import sky_triangle_image from "@ecotoken/ui/assets/ecoproject/triangle-sky.png";
import check_white_icon from "@ecotoken/ui/assets/icons/check_white.svg";
const nftsCreated = [
    "Project Supported (Determines Background)",
    "Amount of Credits Purchased (No Minimum)",
    "Currency (USDC or SOL)",
    "Retiree's Names (Chosen)",
    "Retiree's Location (Chosen)",
];

const CreatedByYou = () => {
    return (
        <div className="relative flex w-full justify-center border-2 border-red-500">
            <div className="relative flex w-[100%] max-w-[1280px] justify-center border-2 border-teal-500">
                <div className="relative flex h-[565px]">
                    <div className="absolute left-0 z-20 h-[565px] w-[60%]">
                        <Image
                            src={sky_triangle_image}
                            alt="Sky triangled image"
                            className="h-full w-full"
                        />
                    </div>
                    <div className="absolute right-0 z-10 h-[565px] w-[50%]">
                        <Image
                            src={nfts_created_image}
                            alt="Browser Image"
                            className="h-full w-full"
                        />
                    </div>
                    <div className="z-30 py-[5em] px-[9em]">
                        <h2 className="my-10 text-[32px] font-semibold text-white">
                            NFTs are created by you
                        </h2>
                        <div>
                            {nftsCreated.map((desc: string, index: number) => {
                                return (
                                    <div
                                        className="my-5 flex items-center gap-5 text-[18px] text-white"
                                        key={"nfts-created" + index}
                                    >
                                        <Image
                                            src={check_white_icon}
                                            alt="Check_white Icon"
                                        />
                                        {desc}
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <p className="mt-10 text-[24px]   text-white">
                                The User connects their Wallet and completes the
                                transaction
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatedByYou;
