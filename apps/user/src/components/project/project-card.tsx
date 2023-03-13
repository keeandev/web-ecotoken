import Image from "next/image";
import { useRouter } from "next/router";
import type { ProjectStatus } from "@prisma/client";
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
        <div className=" flex max-w-md flex-col overflow-hidden rounded-md bg-white shadow-md">
            <Image
                src={
                    listImage?.startsWith("https")
                        ? listImage
                        : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${listImage}`
                }
                alt="EcoProject thumbnail image"
                className="h-60 w-full object-cover shadow-lg"
                width={300}
                height={200}
            />
            <div className="flex flex-col space-y-2 p-4">
                <div className="flex flex-col">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-semibold">
                        {title}
                    </div>
                    <div className="text-normal font-medium text-slate-700">
                        {location}
                    </div>
                </div>
                <div className="floor-text-three-line h-[70px]">{intro}</div>
                <Button
                    intent="gray"
                    fullWidth
                    onClick={() => router.push(`/projects/${identifier}`)}
                >
                    View Detail
                </Button>
                {hasSeries && (
                    <Button
                        intent="skyfilled"
                        fullWidth
                        onClick={() =>
                            router.push(`/projects/${identifier}/purchase`)
                        }
                    >
                        Buy Credits
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
