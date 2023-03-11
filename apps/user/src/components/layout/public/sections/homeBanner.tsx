import banner_image from "@ecotoken/ui/assets/brand/head_nftsite-01.jpg";
import Button from "@ecotoken/ui/components/Button";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProjectsFeatured = () => {
    return (
        <div
            className="relative flex h-[320px] w-full justify-center bg-cover bg-left md:h-[360px] lg:h-[420px]"
            style={{ backgroundImage: `url(${banner_image.src})` }}
        >
            <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-gradient-to-r from-black/70 to-transparent md:w-4/5"></div>
            <div className="relative flex min-h-[100px] w-full max-w-[1280px] justify-start align-bottom">
                <div className="relative flex min-h-[50px] w-[95%] w-full flex-col-reverse md:w-[90%] lg:w-[75%]">
                    <div className="relative inline-block pl-4">
                        <h1 className="text-shadow p-0 text-center font-head text-3xl font-bold uppercase leading-none text-ecoblue-400 md:text-left md:text-5xl lg:text-6xl">
                            NFT impact offsetting
                        </h1>
                        <h1 className="text-shadow m-0 p-0 text-center font-head text-3xl font-bold uppercase leading-normal text-white md:text-left md:text-5xl lg:text-6xl">
                            With Regen ecocredits
                        </h1>
                        <p className="text-shadow mb-0 mt-2 text-center text-xl font-medium leading-[1.2] text-white md:text-left md:text-2xl lg:text-3xl">
                            Verifiable cross chain ecocredit retirement on
                            Solana with Carbon, Water, and Habitat&nbsp;credits
                        </p>
                        <div className="relative flex w-[100%] justify-center md:justify-start">
                            <div className="flex">
                                <Button
                                    intent={"sky"}
                                    className="mt-4 mb-8 w-36 md:w-40 lg:w-44"
                                >
                                    <span className="flex items-center gap-3 px-1 py-1 font-head text-lg font-medium md:text-xl lg:text-2xl">
                                        <span className="whitespace-nowrap">
                                            LOG IN
                                        </span>
                                        <FontAwesomeIcon
                                            icon={faCircleArrowRight}
                                            size="xl"
                                            className="m-0 text-white"
                                        />
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsFeatured;
