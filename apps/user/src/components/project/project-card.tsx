import Button from "@ecotoken/ui/components/Button";
import type { ProjectStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";

export type ProjectCardProps = {
	title: string;
	location: string;
	intro: string;
	images: {
		listImage: string;
	};
	url: string;
	status: ProjectStatus;
	fundAmount?: number;
	fundRecieved?: number;
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
				src={`/images/${images.listImage}`}
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
					onClick={async () => {
                        await router.push(`/stake/${url}`)
                    }}
				>
					Stake
				</Button>
				<Button
					intent="secondary"
					fullWidth
					onClick={async () => {
                        await router.push(`/projects/${url}`)
                    }}
				>
					Learn More
				</Button>
			</div>
		</div>
	);
};

export default ProjectCard;
