import { trpc } from "@/utils/trpc";
import ProjectCard from "@/components/project/project-card";

const ProjectsFeatured = () => {
    const { data, hasNextPage, fetchNextPage } =
        trpc.ecoProjects.getAll.useInfiniteQuery({
            limit: 3,
            benefits: true,
            location: true,
        });

    if (!data) return <div>Loading...</div>;
    return (
        <div className="relative flex w-full justify-center">
            <div className="relative flex w-full max-w-[1280px] justify-start">
                <div className="grid w-full grid-cols-3 content-start gap-7 px-5 pb-6 pt-6">
                    {data.pages.flatMap(({ projects }) => {
                        return projects.map(
                            ({
                                projectID,
                                ecoTitle,
                                ecoUrl,
                                intro,
                                images,
                                status,
                                fundAmount,
                                fundRecieved,
                            }) => (
                                <ProjectCard
                                    key={projectID}
                                    status={status}
                                    title={ecoTitle}
                                    url={ecoUrl}
                                    location={"ddd"}
                                    intro={intro}
                                    images={JSON.parse(images)}
                                    fundAmount={fundAmount}
                                    fundRecieved={fundRecieved}
                                />
                            ),
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectsFeatured;
