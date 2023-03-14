import Image from "next/image";
import { useRouter } from "next/router";
import type { ProjectStatus } from "@prisma/client";
import Button from "@ecotoken/ui/components/Button";

export type ProjectCardProps = {
    title: string;
    location: string;
    intro?: string;
    listImage?: string;
    headImage?: string;
    identifier: string;
    status: ProjectStatus;
    fundAmount?: number;
    fundRecieved?: number;
};
const ProjectCard: React.FC<ProjectCardProps> = ({
    title,
    location,
    intro,
    listImage,
    identifier,
    // status,
    // fundAmount,
    // fundRecieved
}) => {
    const router = useRouter();

    return (
        <div className="flex max-w-md flex-col rounded-md bg-slate-200 shadow-md">
            <Image
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${listImage}`}
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
                <div>{intro}</div>
                <Button
                    intent="primary"
                    fullWidth
                    onClick={() => router.push(`/stake/${identifier}`)}
                >
                    Stake
                </Button>
                <Button
                    intent="secondary"
                    fullWidth
                    onClick={() => router.push(`/projects/${identifier}`)}
                >
                    Learn More
                </Button>
            </div>
        </div>
    );
};

export default ProjectCard;
