import ProjectCard from "@/components/project/project-card";
import { trpc } from "@/utils/trpc";
import { useEffect } from "react";

const Projects = () => {
	const { data, hasNextPage, fetchNextPage } =
		trpc.ecoProjects.getAll.useInfiniteQuery(
			{
				limit: 10,
				benefits: true,
				location: true
			}
		);

	useEffect(() => {
		const main = document.querySelector("main");
		const handleScroll = (e: Event) => {
			const target = e.target as Element;
			if (
				target.scrollTop + 2 + window.innerHeight >
					target.scrollHeight &&
				hasNextPage
			)
				fetchNextPage();
		};
		main?.addEventListener("scroll", handleScroll);
		return () => main?.removeEventListener("scroll", handleScroll);
	}, [hasNextPage, fetchNextPage]);

	if (!data) return <div>Loading...</div>;
	return (
		<div className="grid w-full grid-cols-1 content-start gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{data.pages.flatMap(({ projects }) =>
				projects.map(
					({
						projectID,
						ecoTitle,
						ecoUrl,
                        intro,
						location,
						status,
						fundAmount,
						fundRecieved,
						images
					}) => (
						<ProjectCard
							key={projectID}
							title={ecoTitle}
							url={ecoUrl}
							location={location.location}
							intro={intro}
							status={status}
							fundAmount={fundAmount ?? undefined}
							fundRecieved={fundRecieved ?? undefined}
							images={JSON.parse(images)}
						/>
					)
				)
			)}
		</div>
	);
};

export default Projects;
