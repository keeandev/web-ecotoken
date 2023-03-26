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

import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import blue_bevel from "@ecotoken/ui/assets/brand/bevel_blue_lg.png";
import bkgdComputer from "@ecotoken/ui/assets/ecoproject/nfts_mint_process.jpg";

const nftsCreated = [
    "Project Supported (Determines Background)",
    "Amount of Credits Purchased (No Minimum)",
    "Currency (USDC or SOL)",
    "Retiree's Names (Chosen)",
];

const CreatedByYou = () => {
    return (
        <div className="relative flex min-h-[400px] w-full justify-center sm:min-h-[340px] md:min-h-[380px] lg:min-h-[400px]">
            <div
                className="absolute top-0 right-0 h-full w-[100%] bg-cover sm:w-[64%] md:w-[62%] lg:w-[60%]"
                style={{ backgroundImage: `url(${bkgdComputer.src})` }}
            ></div>
            <div
                className="absolute left-0 top-0 h-[75%] w-[92%] w-[85%] min-w-[480px] justify-end bg-cover bg-right-top sm:flex  sm:h-full sm:w-[85%] lg:w-[64%]"
                style={{ backgroundImage: `url(${blue_bevel.src})` }}
            ></div>
            <div className="relative flex w-full max-w-[1280px] border-4 pb-[120px] sm:bg-none sm:pt-4 sm:pb-6">
                <div className="relative mr-8 flex h-full w-[98%] items-start pl-4 sm:w-[85%] md:w-[75%] lg:w-[56%] ">
                    <div className="relative flex w-[100%] flex-col pt-2 sm:pt-2">
                        <h2 className="mb-2 font-head text-[1.75rem] font-semibold leading-[.9] text-white sm:mb-2 sm:text-[1.75rem] md:mb-2 md:text-[2rem] lg:text-[2.5rem]">
                            NFTs are created by you
                        </h2>
                        <div className=" mr-6 leading-[1.2]">
                            {nftsCreated.map((desc: string, index: number) => {
                                return (
                                    <div
                                        className="my-2 flex items-start gap-2 text-[1.0rem] text-white sm:items-center sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.4375rem]"
                                        key={`nfts-created ${index}`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faCircleCheck}
                                            size="lg"
                                            className="mt-0.5 text-ecoblue-700"
                                        />
                                        {desc}
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <p className="mr-20 mb-4 mt-3 pl-0.5 text-[1.125rem] leading-[1.25] text-white sm:mt-5 sm:mr-[150px] sm:text-[1.125rem] md:mr-[100px] md:text-[1.375rem] lg:text-[1.4375rem]">
                                The User connects their Wallet and completes
                                the&nbsp;transaction
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatedByYou;
