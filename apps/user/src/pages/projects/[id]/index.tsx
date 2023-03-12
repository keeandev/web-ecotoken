import Image from "next/image";
import { useRouter } from "next/router";
import DetailCard from "@/components/project/detail-card";
import Overview from "@/components/project/overview";
import ProjectCard from "@/components/project/project-card";
import { trpc } from "@/utils/trpc";
import credit_icon from "@ecotoken/ui/assets/icons/credits.svg";
import Button from "@ecotoken/ui/components/Button";

const ProjectDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data: project } = trpc.ecoProjects.get.useQuery({
        identifier: id as string,
    });

    const { data: projects } = trpc.ecoProjects.getAll.useInfiniteQuery({
        limit: 3,
        benefits: true,
        location: true,
    });
    if (!project) return <div>Loading...</div>;

    console.log(project);

    return (
        <div className="">
            <div className="relative">
                <h1 className="absolute bottom-[1em] left-[2em] text-[48px] font-bold text-white">
                    {project.title}
                </h1>
                <Image
                    src={
                        project.listImage?.startsWith("https")
                            ? project.listImage
                            : `${process.env.NEXT_PUBLIC_CDN_URL}/${project.listImage}`
                    }
                    alt="EcoProject thumbnail image"
                    className=" h-60 min-h-[511px] w-full object-cover"
                    width={300}
                    height={200}
                />
                {project.nftSeries?.isActive && (
                    <Button
                        intent={"sky"}
                        className="mt-10 uppercase"
                        onClick={() => {
                            router.push(`/projects/${id}/purchase`);
                        }}
                    >
                        <Image
                            src={credit_icon}
                            alt="Credit Icon"
                            className="h-[30px] w-[30px]"
                        />
                        Buy Credits
                    </Button>
                )}
            </div>
            <div className="mx-[10em] mt-7 flex gap-10">
                <div>
                    <p className="text-[#7E7E7E]">{project.intro}</p>
                    <Overview />
                    <p className="text-[#7E7E7E]">{project.intro}</p>
                    <div className="mt-[5em] flex w-[300px] justify-between">
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                <span className="text-[#7E7E7E]">
                                    Credit Type
                                </span>
                                <span className="text-[15px] font-semibold">
                                    {project.nftSeries?.seriesType}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#7E7E7E]">
                                    Price Per Ton
                                </span>
                                <span className="text-[15px] font-semibold">
                                    {`$${project.nftSeries?.creditPrice}`}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                <span className="text-[#7E7E7E]">
                                    Credits Available
                                </span>
                                <span className="text-[15px] font-semibold">
                                    {project.nftSeries?.setAmount?.toNumber()}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#7E7E7E]">
                                    Credits Retired
                                </span>
                                <span className="text-[15px] font-semibold">
                                    893.37
                                </span>
                            </div>
                        </div>
                    </div>
                    {project.nftSeries?.isActive && (
                        <Button
                            intent={"sky"}
                            className="mt-10 uppercase"
                            onClick={() => {
                                router.push(`/projects/${id}/purchase`);
                            }}
                        >
                            <Image
                                src={credit_icon}
                                alt="Credit Icon"
                                className="h-[30px] w-[30px]"
                            />
                            Buy Credits
                        </Button>
                    )}
                </div>
                <DetailCard />
            </div>
            {projects && (
                <div className="mt-[13em]">
                    <div className="mx-5 border-8 border-[#D9D9D9]"></div>
                    <h1 className="my-12 text-center text-[36px] uppercase text-[#7E7E7E]">
                        Other projects for you to explore
                    </h1>
                    <div className="grid w-full grid-cols-3 content-start gap-7  py-[5em] px-[7em]">
                        {projects.pages.flatMap(({ projects }) => {
                            // console.log("Projects", projects);
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
                                }) => (
                                    <ProjectCard
                                        key={projectID}
                                        status={status}
                                        title={title}
                                        identifier={identifier}
                                        listImage={listImage ?? undefined}
                                        location={project.location?.location}
                                        intro={intro ?? undefined}
                                        fundAmount={fundAmount ?? undefined}
                                        fundRecieved={fundRecieved ?? undefined}
                                    />
                                ),
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
