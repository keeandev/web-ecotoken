import Image from "next/image";
import desc_image from "@ecotoken/ui/assets/ecoproject/NOAH-Lapin 1.png";
import check_icon from "@ecotoken/ui/assets/icons/check.svg";
import Button from "@ecotoken/ui/components/Button";
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
        <div className="relative flex gap-10">
            <div className="flex-1">
                <Image src={desc_image} alt="Description thumbail image" />
            </div>
            <div className="flex-1">
                <h2 className="pt-8 text-[36px] font-bold uppercase leading-9">
                    How users retire ecocredits
                </h2>
                <div>
                    {descriptions.map((desc: string, index: number) => (
                        <div
                            key={"desc" + index}
                            className="my-4 flex items-center gap-3 pr-10"
                        >
                            <Image
                                src={check_icon}
                                alt="check icon"
                                className="h-[28px] w-[27px]"
                            />
                            <p className="text-[14px] font-medium text-[#7E7E7E]">
                                {desc}
                            </p>
                        </div>
                    ))}
                    <Button
                        intent={"sky"}
                        className="mt-8 !rounded font-semibold uppercase"
                        size={"lg"}
                        onClick={() => router.push(`/user/projects`)}
                    >
                        <span className="m-2 text-[24px]">
                            EXPLORE ALL PROJECTS
                        </span>
                    </Button>
                </div>
            </div>

            <h3 className="absolute bottom-4  w-full text-center text-[28px] font-semibold">
                NFT Artwork
            </h3>
        </div>
    );
};

export default RetireSection;
