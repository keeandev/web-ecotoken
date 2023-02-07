import Input from "@ecotoken/ui/components/Input";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { useRouter } from "next/router";

type ProjectImages = {
	listImage: string;
	head1: string;
	head2: string;
	head3: string;
};

const StakeProject = () => {
	const router = useRouter();
	if (router.query.id) {
		const { data } = trpc.ecoProjects.get.useQuery({
			url: router.query.id as string
		});
		if (!data) return <div>Loading...</div>;

		const images = JSON.parse(data?.images) as ProjectImages;
		return (
			<div className="flex w-full flex-col gap-8">
				{/* <div className="text-2xl font-medium">{data.title}</div>
                <div>{data.outcome}</div> */}
				<div className="flex w-full flex-col space-y-2">
					<div className="relative h-64 w-full">
						<Image
							src={`/images/${images.head1}`}
							alt="EcoProject head 1"
							className="w-full rounded-md object-cover"
							fill
						/>
					</div>
					<div className="space-y-2">
						<div className="text-2xl font-semibold">
							{data.ecoTitle}
						</div>
						<div>{data.intro}</div>
					</div>
				</div>
				<div className="h-fit flex-1 rounded-md">
					<div className="text-lg font-semibold">Stake</div>
					<Input />
				</div>
			</div>
		);
	} else {
		return <div>Project not found.</div>;
	}
};

export default StakeProject;
