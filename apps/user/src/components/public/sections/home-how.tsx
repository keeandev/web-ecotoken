/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import Image from "next/image";
import { useRouter } from "next/router";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import nftOrlando from "@ecotoken/ui/assets/nft/NFT_WaterCredits.png";
import Button from "@ecotoken/ui/components/Button";

const descriptions = [
    "User chooses a project they want to support by offsetting their environmental impact with and logs in with Solana wallet.",
    "Fill in details on how who is credited offsetting emissions and choose amount of credits to retire.",
    "Pay for credits in USDC or SOL and confirm, this will retire credits on Regen Network, this will mint your NFT on solana with the \
  embedded transaction hash and all details filled in.",
];

const RetireSection = () => {
    const router = useRouter();

    return (
        <div className="relative flex w-full justify-center  bg-slate-50">
            <div className="relative flex w-[100%] max-w-[1280px] flex-col justify-center gap-6  px-5 pb-6 pt-6 sm:px-5 md:flex-row lg:px-6">
                <div className="md:max-w-1/3 relative w-[100%] px-[10%] sm:px-[20%] md:w-[400px] md:px-0">
                    <Image
                        src={nftOrlando}
                        alt="Septic Sewage Treatment, Orlando, Florida"
                        className="w-[100%]"
                    />
                </div>
                <div className="flex flex-wrap justify-center  md:w-2/3">
                    <h2 className="m-0 mt-3 w-full text-center font-head text-2xl font-bold uppercase leading-[1.2] text-slate-500 md:text-left md:text-3xl lg:text-4xl">
                        How users retire ecocredits
                    </h2>
                    <div className="mb-2 mt-5 flex max-w-[520px] flex-col md:w-full md:max-w-[800px] lg:pr-10">
                        {descriptions.map((desc: string, index: number) => (
                            <div
                                key={`desc_${index}`}
                                className="my-1 flex flex-row gap-3"
                            >
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    size="2xl"
                                    className="mt-0.5 text-slate-400"
                                />
                                <p className="max-w-[520px] text-base font-medium text-slate-800 lg:max-w-[800px] lg:text-lg">
                                    {desc}
                                </p>
                            </div>
                        ))}
                        <div className="flex justify-center">
                            <Button
                                intent={"sky"}
                                className="mt-4 w-3/4 !rounded md:w-2/3"
                                size={"lg"}
                                onClick={() => void router.push(`/projects`)}
                            >
                                <span className="px-4 font-head text-lg font-medium uppercase">
                                    EXPLORE ALL PROJECTS
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetireSection;
