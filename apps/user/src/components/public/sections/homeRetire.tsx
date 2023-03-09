import Image from "next/image";
// import nftOrlando from "@ecotoken/ui/assets/nft/NFT_WaterCredits.png";
import nftOrlando from "@ecotoken/ui/assets/nft/NFT_WaterCredits.png";
import check_icon from "@ecotoken/ui/assets/icons/check.svg";
import Button from "@ecotoken/ui/components/Button";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

const descriptions = [
    "User chooses a project they want to support by offsetting their environmental impact with and logs in with Solana wallet.",
    "Fill in details on how who is credited offsetting emissions and choose amount of credits to retire.",
    "Pay for credits in USDC or SOL and confirm, this will retire credits on Regen Network, this will mint your NFT on solana with the \
  embedded transaction hash and all details filled in.",
];

const RetireSection = () => {
    const router = useRouter();

    return (
        <div className="relative flex w-full justify-center border-2 border-red-500 bg-slate-50">
            <div className="relative flex w-[100%] max-w-[1280px] flex-col justify-center gap-10 border-2 border-teal-500 px-5 pb-6 pt-6 md:flex-row">
                <div className=" w-1/3 border-2 border-amber-500">
                    <Image
                        src={nftOrlando}
                        alt="Septic Sewage Treatment, Orlando, Florida"
                    />
                </div>
                <div className="w-2/3 border-2 border-lime-500">
                    <h2 className="pt-8 text-4xl font-bold uppercase leading-[1.2] text-slate-700">
                        How users retire ecocredits
                    </h2>
                    <div className="my-4 flex flex-col gap-3 border-2  border-blue-500  pr-10 align-top">
                        {descriptions.map((desc: string, index: number) => (
                            <div
                                key={"desc" + index}
                                className="my-4 flex flex-row gap-3 border-2 border-pink-500 pr-10  align-top"
                            >
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    size="2xl"
                                    className="mt-0.5 text-slate-400"
                                />
                                <p className="text-lg font-medium text-slate-800">
                                    {desc}
                                </p>
                            </div>
                        ))}
                        <Button
                            intent={"sky"}
                            className="mt-8 !rounded "
                            size={"lg"}
                            onClick={() => router.push(`/projects`)}
                        >
                            <span className="px-4 text-lg font-semibold uppercase">
                                EXPLORE ALL PROJECTS
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetireSection;
