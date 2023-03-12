import { trpc } from "@/utils/trpc";
import ProjectCard from "@/components/project/project-card";

const ProjectsFeatured = () => {
    const { data } = trpc.ecoProjects.getAll.useInfiniteQuery({
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
                                title,
                                identifier,
                                intro,
                                listImage,
                                status,
                                fundAmount,
                                fundRecieved,
                                location,
                            }) => (
                                <ProjectCard
                                    key={projectID}
                                    status={status}
                                    title={title}
                                    identifier={identifier}
                                    location={location?.location}
                                    intro={intro ?? undefined}
                                    listImage={listImage ?? undefined}
                                    fundAmount={fundAmount ?? undefined}
                                    fundRecieved={fundRecieved ?? undefined}
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
