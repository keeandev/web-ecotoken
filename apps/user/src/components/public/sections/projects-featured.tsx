import ProjectCard from "@/components/project/project-card";
import { trpc } from "@/utils/trpc";

import { formatCountryAndState } from "../../../../../admin/src/utils/formatter";

const ProjectsFeatured = () => {
    const { data } = trpc.ecoProjects.getAll.useInfiniteQuery({
        limit: 3,
        benefits: true,
        location: true,
        series: true,
    });

    if (!data) return <div>Loading...</div>;
    return (
        <div className="relative flex w-full justify-center">
            <div className="relative flex w-full max-w-[1280px] justify-center">
                <div className="mx-auto grid w-full grid-cols-1 content-center gap-7 px-5 pb-6 pt-6 md:grid-cols-3">
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
                                nftSeries,
                            }) => (
                                <ProjectCard
                                    key={projectID}
                                    status={status}
                                    title={title}
                                    identifier={identifier}
                                    location={formatCountryAndState(
                                        location?.location ?? "",
                                        location?.cn ?? "",
                                        location?.st ?? "",
                                    )}
                                    intro={intro ?? undefined}
                                    listImage={listImage ?? undefined}
                                    fundAmount={fundAmount ?? undefined}
                                    fundRecieved={fundRecieved ?? undefined}
                                    hasSeries={nftSeries?.isActive}
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
