import { useEffect } from "react";
import ProjectCard from "@/components/project/project-card";
import { trpc } from "@/utils/trpc";
import banner_image from "@ecotoken/ui/assets/brand/head_nftsite-01.jpg";

// import BannerSection from "../sections/bannerSection";

const Projects = () => {
    const { data, hasNextPage, fetchNextPage } =
        trpc.ecoProjects.getAll.useInfiniteQuery({
            benefits: true,
            location: true,
            series: true,
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
            {/* <BannerSection /> */}
            <div
                className="relative flex h-[320px] w-full justify-center bg-cover bg-left md:h-[360px] lg:h-[420px]"
                style={{ backgroundImage: `url(${banner_image.src})` }}
            >
                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-gradient-to-r from-black/70 to-transparent md:w-4/5"></div>
            </div>
            <div className="mx-auto my-5 grid w-full grid-cols-1 content-start gap-8 px-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.pages.flatMap(({ projects }) =>
                    projects.map(
                        ({
                            projectID,
                            title,
                            identifier,
                            location,
                            intro,
                            status,
                            fundAmount,
                            fundRecieved,
                            listImage,
                            nftSeries,
                        }) => (
                            <ProjectCard
                                key={projectID}
                                title={title}
                                identifier={identifier}
                                location={location?.location}
                                intro={intro ?? undefined}
                                status={status}
                                fundAmount={fundAmount ?? undefined}
                                fundRecieved={fundRecieved ?? undefined}
                                listImage={listImage ?? undefined}
                                hasSeries={nftSeries?.isActive}
                            />
                        ),
                    ),
                )}
            </div>
        </div>
    );
};

export default Projects;
