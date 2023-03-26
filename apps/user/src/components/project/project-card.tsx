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
import { type ProjectStatus } from "@prisma/client";
import Button from "@ecotoken/ui/components/Button";

export type ProjectCardProps = {
    title: string;
    location?: string;
    intro?: string;
    listImage?: string;
    headImage?: string;
    identifier: string;
    status: ProjectStatus;
    fundAmount?: number;
    fundRecieved?: number;
    hasSeries?: boolean;
};
const ProjectCard: React.FC<ProjectCardProps> = ({
    title,
    location,
    intro,
    listImage,
    identifier,
    hasSeries,
    // status,
    // fundAmount,
    // fundRecieved
}) => {
    const router = useRouter();

    return (
        <div className="flex w-full justify-center">
            <div className=" flex max-w-[420px] flex-col overflow-hidden rounded-md bg-white shadow-md">
                <div className="relative inline-block aspect-[3/2] w-full">
                    <Image
                        src={
                            listImage?.startsWith("https")
                                ? listImage
                                : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${listImage}`
                        }
                        alt="EcoProject thumbnail image"
                        className=" h-full w-full object-cover shadow-lg"
                        width={300}
                        height={200}
                    />
                    <div className="absolute bottom-0 left-0 flex h-2/3 w-full items-end bg-gradient-to-b from-transparent to-black/25">
                        <h4 className="text-normal text-shadow px-4 pb-3 text-base font-medium text-white">
                            {location}
                        </h4>
                    </div>
                </div>

                <div className="flex flex-col px-4 pb-4">
                    <h3 className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-xl font-semibold text-slate-700">
                        {title}
                    </h3>
                    <div className="floor-text-three-line mt-1 h-[75px] overflow-hidden text-ellipsis">
                        {intro}
                    </div>
                    <Button
                        className="mt-2"
                        intent="gray"
                        fullWidth
                        onClick={() =>
                            void router.push(`/projects/${identifier}`)
                        }
                    >
                        View Detail
                    </Button>
                    {hasSeries && (
                        <Button
                            className="mt-2"
                            intent="skyfilled"
                            fullWidth
                            onClick={() =>
                                void router.push(
                                    `/projects/${identifier}/purchase`,
                                )
                            }
                        >
                            Buy Credits
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
