import Button from "@ecotoken/ui/components/Button";
import type { ProjectStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { clientEnv } from "@/env/schema.mjs";
import ReadMore from "@ecotoken/ui/components/ReadMore";

export type ProjectCardProps = {
    title: string;
    location: string;
    intro: string;
    images: {
        listImage: string;
    };
    url: string;
    status: ProjectStatus;
    fundAmount?: number | null;
    fundRecieved?: number | null;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
    title,
    url,
    location,
    intro,
    images,
}) => {
    const router = useRouter();

    return (
        <div className="flex max-w-md flex-col rounded-md bg-slate-200 shadow-md">
            <Image
                src={`${clientEnv.NEXT_PUBLIC_CDN_URL}/${images.listImage}`}
                alt="EcoProject thumbnail image"
                className="h-60 w-full rounded-md object-cover"
                width={300}
                height={200}
            />
            <div className="flex flex-col space-y-2 p-4">
                <div className="flex flex-col">
                    <div className="text-xl font-semibold">{title}</div>
                    <div className="text-normal font-medium text-slate-700">
                        {location}
                    </div>
                </div>
                <ReadMore len={100}>{intro}</ReadMore>
                <div className="flex justify-between">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col">
                            <span className="text-[#7E7E7E]">Credits Type</span>
                            <span className="text-[15px] font-semibold">
                                CO2
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#7E7E7E]">
                                Price Per Ton
                            </span>
                            <span className="text-[15px] font-semibold">
                                $25.43
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col">
                            <span className="text-[#7E7E7E]">
                                Credits Available
                            </span>
                            <span className="text-[15px] font-semibold">
                                CO2
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#7E7E7E]">
                                Credits Retired
                            </span>
                            <span className="text-[15px] font-semibold">
                                893.37
                            </span>
                        </div>
                    </div>
                </div>
                <Button
                    intent="skyfilled"
                    fullWidth
                    onClick={async () => {
                        await router.push(`/stake/${url}`);
                    }}
                >
                    BUY CREDITS
                </Button>
                <Button
                    intent="gray"
                    fullWidth
                    onClick={async () => {
                        await router.push(`/user/projects/${url}`);
                    }}
                >
                    VIEW DETAILS
                </Button>
            </div>
        </div>
    );
};

export default ProjectCard;
