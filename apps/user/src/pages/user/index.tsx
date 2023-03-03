import { type NextPage } from "next";
import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import Button from "@ecotoken/ui/components/Button";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { useRouter } from "next/router";

const Home: NextPage = () => {
	const router = useRouter();

	const { data, hasNextPage, fetchNextPage } =
		trpc.ecoProjects.getAll.useInfiniteQuery({
			limit: 3,
			benefits: true,
			location: true
		});
	if (!data) return <div>Loading...</div>;
	return (
		<div className="w-full">
			<div className="grid w-full grid-cols-3 content-start gap-4">
				{data.pages.flatMap(({ projects }) =>
					projects.map(
						({ projectID, ecoTitle, ecoUrl, intro, images }) => (
							<DefaultCard
								className="relative space-y-4"
								size={"full"}
								key={projectID}
							>
								<div className="flex w-full flex-col">
									<div className="mb-8 flex w-full flex-col">
										<CardTitle>{ecoTitle}</CardTitle>
										<CardDescription>
											<p>{intro}</p>
											<Image
												src={`${
													process.env
														.NEXT_PUBLIC_CDN_URL
												}/${
													JSON.parse(images).listImage
												}`}
												alt="EcoProject thumbnail image"
												className="h-60 min-h-[300px] w-full rounded-md object-cover"
												width={300}
												height={200}
											/>
										</CardDescription>
									</div>
									<div className="absolute bottom-4 flex flex-1 items-end justify-end space-x-2">
										<Button
											onClick={() =>
												router.push(
													`/user/projects/${ecoUrl}`
												)
											}
										>
											Go to project
										</Button>
									</div>
								</div>
							</DefaultCard>
						)
					)
				)}
			</div>
			<div className="mt-4 flex w-full justify-center">
				<Button onClick={() => router.push(`/user/projects`)}>
					Read All Projects
				</Button>
			</div>
		</div>
	);
};

export default Home;
