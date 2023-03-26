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

const Responsive = () => {
    return (
        <div>
            {/* <div className="relative my-1 inline-block h-[24px] w-full overflow-hidden bg-blue-800/70 font-mono text-white">
                <div className="absolute top-0 left-0 h-[24px] w-[1536px]  bg-yellow-800">
                    <div className="absolute top-0 left-0 h-[24px] w-[1280px] bg-blue-800">
                        <div className="absolute top-0 left-0 h-[24px] w-[1024px]  bg-yellow-800">
                            <div className="absolute top-0 left-0 h-[24px] w-[768px]  bg-blue-800">
                                <div className="absolute top-0 left-0 h-[24px] w-[640px] bg-yellow-800">
                                    <div className="absolute top-0 left-0 h-[24px] w-[480px] bg-blue-800 pt-0.5 pr-2 text-right">
                                        <div className="absolute top-0 left-0 h-[24px] w-[414px] bg-yellow-800 pt-0.5 pr-2 text-right">
                                            <div className="absolute top-0 left-0 h-[24px] w-[360px] bg-blue-800 pt-0.5 pr-2 text-right">
                                                360
                                            </div>
                                            <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                                414
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                            480
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                        sm 640px
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                    md 768px
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                lg 1024px
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 pt-0.5 pr-2">
                            xl 1280px
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 pt-0.5 pr-2">
                        2xl 1536px
                    </div>
                </div>
            </div> */}
            <div className="relative my-1 flex h-[24px] w-full overflow-hidden bg-amber-400/40 font-mono text-white">
                <div className="flex h-full w-[5000px]">
                    <div className="inline-block h-full w-[360px] bg-yellow-500/40 pt-0.5 pl-2 text-left"></div>
                    <div className="inline-block h-full w-[54px] bg-green-400/60 pt-0.5 pl-2 text-left">
                        360
                    </div>
                    <div className="inline-block h-full w-[66px] bg-yellow-500/40 pt-0.5 pl-2 text-left">
                        414
                    </div>
                    <div className="inline-block h-full w-[160px] bg-green-400/60 pt-0.5 pl-2 text-left">
                        480
                    </div>

                    <div className="inline-block h-full w-[128px] bg-yellow-500/40 pt-0.5 pl-2 text-left">
                        sm 640px
                    </div>

                    <div className="inline-block h-full w-[256px] bg-green-400/60 pt-0.5 pl-2 text-left">
                        md 768px
                    </div>

                    <div className="inline-block h-full w-[256px] bg-yellow-500/40 pt-0.5 pl-2 text-left">
                        lg 1024px
                    </div>

                    <div className="inline-block h-full w-[256px] bg-green-400/60 pt-0.5 pl-2 text-left">
                        xl 1280px
                    </div>

                    <div className="inline-block h-full w-[384px] bg-yellow-500/40 pt-0.5 pl-2 text-left">
                        2xl 1536px
                    </div>

                    <div className="flex h-full w-[640px] justify-between bg-green-400/60 px-2 pt-0.5">
                        <div className="inline-block">1920px</div>
                        <div className="inline-block">2560px</div>
                    </div>
                </div>
            </div>
            <div className="fixed top-0 left-0 z-[500] flex h-full w-full justify-center text-white ">
                <div className="absolute flex h-full w-full max-w-[1280px] border-l-2 border-r-2 border-lime-500/50">
                    <div className="relative mx-4 flex h-full w-full justify-between  gap-4 sm:hidden">
                        <div className="relative h-full w-full border-l border-r border-dashed  border-lime-500/50">
                            <div className="absolute top-0 -left-[18px] inline-block h-10 w-5 bg-lime-500 text-center ">
                                <span className="hidden text-xs sm:inline">
                                    SM
                                </span>
                                <span className=" text-xs sm:hidden">
                                    M<br />
                                </span>
                                4
                            </div>
                            <div className="relative h-full w-1/2 border-r border-dashed border-amber-500/40"></div>
                            <div className="absolute top-0 -right-[17px] inline-block h-5 w-4 bg-lime-500 text-center ">
                                4
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-5 hidden h-full w-full justify-between gap-5 sm:flex lg:hidden">
                        <div className="relative h-full w-full border-l border-r border-dashed  border-lime-500/50">
                            <div className="absolute top-0 -left-[21px] inline-block h-10 w-5 bg-lime-500 text-center ">
                                <span className="text-xs sm:inline md:hidden">
                                    SM
                                    <br />
                                </span>
                                <span className=" text-xs sm:hidden  md:inline">
                                    MD
                                    <br />
                                </span>
                                5
                            </div>
                            <div className="relative h-full w-1/2 border-r border-dashed border-amber-500/40"></div>
                        </div>
                        <div className="relative h-full w-full border-l border-r border-dashed  border-lime-500/50">
                            <div className="relative h-full w-1/2 border-r border-dashed border-amber-500/40">
                                <div className="absolute top-0 -left-[21px] inline-block h-5 w-5 bg-lime-500 text-center ">
                                    5
                                </div>
                            </div>
                            <div className="absolute top-0 -right-[21px] inline-block h-5 w-5 bg-lime-500 text-center ">
                                5
                            </div>
                        </div>
                    </div>
                    {/* xl:hidden */}
                    <div className="relative mx-[22px] hidden h-full w-full justify-between gap-6 lg:flex">
                        <div className="relative h-full w-1/3 border-l border-r border-dashed  border-lime-500/50">
                            <div className="absolute top-0 -left-6 inline-block h-10 w-6 bg-lime-500 text-center ">
                                <span className="text-xs lg:inline xl:hidden">
                                    LG
                                    <br />
                                </span>
                                <span className=" lg:hidden  xl:inline">
                                    XL
                                    <br />
                                </span>
                                6
                            </div>
                            <div className="relative h-full w-1/2 border-r border-dashed border-amber-500/40"></div>
                        </div>

                        <div className="relative h-full w-1/3 border-l border-r border-dashed  border-lime-500/50">
                            <div className="absolute top-0 -left-[25px] inline-block h-5 w-6 bg-lime-500 text-center ">
                                6
                            </div>
                            <div className="relative h-full w-1/2 border-r border-dashed border-amber-500/40"></div>
                        </div>

                        <div className="relative h-full w-1/3 border-l border-r border-dashed  border-lime-500/50">
                            <div className="absolute top-0 -left-[25px] inline-block h-5 w-6 bg-lime-500 text-center ">
                                6
                            </div>
                            <div className="relative h-full w-1/2 border-r border-dashed border-amber-500/40"></div>
                            <div className="absolute top-0 -right-[25px] inline-block h-5 w-6 bg-lime-500 text-center ">
                                6
                            </div>
                        </div>
                    </div>

                    {/* <div className="relative mx-[34px] hidden h-full w-full justify-between gap-8 xl:flex">
                        <div className="relative h-full w-1/4 border-l border-r border-dashed  border-lime-500/50">
                            <div className="absolute -left-[34px] top-0 inline-block h-5 w-8 bg-lime-500 text-center ">
                                8
                            </div>
                            <div className="relative h-full w-1/2 border-r border-dashed border-amber-500/40"></div>
                        </div>
                        <div className="relative h-full w-1/4 border-l border-r border-dashed  border-lime-500/50">
                            <div className="absolute top-0 -left-[33px] inline-block h-5 w-8 bg-lime-500 text-center ">
                                8
                            </div>
                            <div className="relative h-full w-1/2 border-r border-dashed border-amber-500/40"></div>
                        </div>
                        <div className="relative h-full w-1/4 border-l border-r border-dashed  border-lime-500/50">
                            <div className="absolute top-0 -left-[33px] inline-block h-5 w-8 bg-lime-500 text-center ">
                                8
                            </div>
                            <div className="relative h-full w-1/2 border-r border-dashed border-amber-500/40"></div>
                        </div>
                        <div className="relative h-full w-1/4 border-l border-r border-dashed  border-lime-500/50">
                            <div className="absolute top-0 -left-[33px] inline-block h-5 w-8 bg-lime-500 text-center ">
                                8
                            </div>
                            <div className="relative h-full w-1/2 border-r border-dashed border-amber-500/40"></div>
                            <div className="absolute top-0 -right-[33px] inline-block h-5 w-8 bg-lime-500 text-center ">
                                8
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Responsive;
