import ProjectCard from "@/components/project/project-card";
import { trpc } from "@/utils/trpc";
import { useEffect } from "react";

const Projects = () => {
	const { data, hasNextPage, fetchNextPage } =
		trpc.projects.getAll.useInfiniteQuery(
			{
				limit: 10
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor
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
						id,
						title,
						url,
						location,
						outcome,
						status,
						fundAmount,
						fundRecieved,
						images
					}) => (
						<ProjectCard
							key={id}
							title={title}
							url={url}
							location={location}
							outcome={outcome}
							status={status}
							fundAmount={fundAmount}
							fundRecieved={fundRecieved}
							images={JSON.parse(images)}
						/>
					)
				)
			)}
		</div>
	);
};

export default Projects;
