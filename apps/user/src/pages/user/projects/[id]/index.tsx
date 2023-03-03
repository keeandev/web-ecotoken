import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import DefaultCard, {
	CardTitle,
	CardDescription
} from "@ecotoken/ui/components/Card";
import Image from "next/image";
import Button from "@ecotoken/ui/components/Button";

const ProjectDetails = () => {
	const router = useRouter();
	const { id } = router.query;

	const { data: project } = trpc.ecoProjects.get.useQuery({
		url: id as string
	});

	if (!project || !project.projectID) return <>Loading...</>;
	console.log(project);

	return (
		<div className="">
			<DefaultCard size="twoThird">
				<div className="relative w-full">
					<div className="absolute bottom-16 flex w-full justify-center">
						<Button
							className=""
							onClick={() => {
								router.push(`/user/projects/${id}/purchase`);
							}}
						>
							Buy Credits
						</Button>
					</div>

					<Image
						src={`/images/${JSON.parse(project.images).listImage}`}
						alt="EcoProject thumbnail image"
						className=" h-60 min-h-[300px] w-full rounded-md object-cover"
						width={300}
						height={200}
					/>
				</div>

				<div className="flex flex-col justify-center text-center">
					<CardTitle>{project?.ecoTitle}</CardTitle>

					<CardDescription className="mt-5">
						{project.intro}
					</CardDescription>
					<h4 className="mt-5">{project.location.location}</h4>
					<div className="mt-3 flex justify-around text-center">
						<div className="">
							<p>Fund Amount</p>
							<p>{project.fundAmount}</p>
						</div>
						<div className="">
							<p>Received Amount</p>
							<p>{project.fundAmount}</p>
						</div>
						<div className="">
							<p>Status</p>
							<p>{project.status}</p>
						</div>
					</div>
				</div>
			</DefaultCard>
		</div>
	);
};

export default ProjectDetails;
