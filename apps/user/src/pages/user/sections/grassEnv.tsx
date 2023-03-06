import Image from "next/image";
import grass_env_image from "@ecotoken/ui/assets/ecoproject/grassEnv.png";
import grass_decorate_white_image from "@ecotoken/ui/assets/brand/grass_decorate.png";
import check_icon from "@ecotoken/ui/assets/icons/check.svg";
import Button from "@ecotoken/ui/components/Button";
import { useRouter } from "next/router";

const leftItems = [
    "Open ecocredit markets",
    "Incentive local action",
    "Co-benefits",
];
const rightItems = [
    "High verification standards",
    "More than just carbon",
    "Incredible opportunity for real change",
];
const GrassEnv = () => {
    const router = useRouter();

    return (
        <div className="mt-[7em] flex pl-10">
            <div className="flex-1">
                <Image src={grass_env_image} alt="Grass Env Image" />
            </div>
            <div className="relative flex-1 pt-[10em]">
                <Image
                    className="absolute right-0 top-0"
                    src={grass_decorate_white_image}
                    alt="Grass Envronment Decorate"
                />

                <h1 className="w-[80%] text-[36px]  font-semibold leading-10">
                    Support decentralized grass roots environmental innovation
                </h1>
                <div className="flex gap-3">
                    <div>
                        {leftItems.map((item, index) => {
                            return (
                                <div
                                    key={"left-items" + index}
                                    className="my-3 flex items-center gap-2 text-[18px] text-[#7E7E7E]"
                                >
                                    <Image
                                        src={check_icon}
                                        alt="checkIcon"
                                        className="h-[30px] w-[30px]"
                                    />
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        {rightItems.map((item, index) => {
                            return (
                                <div
                                    key={"right-items" + index}
                                    className="my-3 flex items-center gap-2  text-[18px] text-[#7E7E7E]"
                                >
                                    <Image
                                        src={check_icon}
                                        alt="checkIcon"
                                        className="h-[30px] w-[30px]"
                                    />
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="mt-5">
                    <Button
                        intent="sky"
                        className="p-5"
                        onClick={() => router.push(`/user/projects`)}
                    >
                        <span className="m-2 text-[24px]">
                            EXPLORE ALL PROJECTS
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GrassEnv;
