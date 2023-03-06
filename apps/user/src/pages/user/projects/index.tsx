import ProjectCard, {
    type ProjectCardProps,
} from "@/components/project/project-card";
import { trpc } from "@/utils/trpc";
import { useEffect } from "react";
import BannerSection from "../sections/bannerSection";

const Projects = () => {
    const { data, hasNextPage, fetchNextPage } =
        trpc.ecoProjects.getAll.useInfiniteQuery({
            benefits: true,
            location: true,
        });

    useEffect(() => {
        const main = document.querySelector("main");
        const handleScroll = async (e: Event) => {
            const target = e.target as Element;
            if (
                target.scrollTop + 2 + window.innerHeight >
                    target.scrollHeight &&
                hasNextPage
            )
                await fetchNextPage();
        };
        main?.addEventListener("scroll", handleScroll);
        return () => main?.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, fetchNextPage]);

    if (!data) return <div>Loading...</div>;
    return (
        <div>
            <BannerSection />
            <div className="mx-auto grid w-full grid-cols-1 content-start gap-8 px-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                            images,
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
                                images={
                                    JSON.parse(
                                        images,
                                    ) as ProjectCardProps["images"]
                                }
                            />
                        ),
                    ),
                )}
            </div>
        </div>
    );
};

export default Projects;
