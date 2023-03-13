import Image from "next/image";
import { useRouter } from "next/router";
import Responsive from "@/components/dev-responsive";
import DetailCard from "@/components/project/detail-card";
import Overview from "@/components/project/overview";
import ProjectCard from "@/components/project/project-card";
import PublicLoading from "@/components/public/loading";
import { trpc } from "@/utils/trpc";
import credit_icon from "@ecotoken/ui/assets/icons/credits.svg";
import Button from "@ecotoken/ui/components/Button";

const ProjectDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data: project } = trpc.ecoProjects.get.useQuery(
        {
            identifier: id as string,
            series: true,
        },
        { enabled: !!id },
    );

    const { data: projects } = trpc.ecoProjects.getAll.useInfiniteQuery({
        limit: 3,
        benefits: true,
        location: true,
        series: true,
    });
    if (!project) return <PublicLoading />;

    return (
        <div className="w-full">
            <div className="relative">
                {/* <Image
                    src={
                        project.listImage?.startsWith("https")
                            ? project.headImage
                            : `${process.env.NEXT_PUBLIC_CDN_URL}/${project.listImage}`
                    }
                    alt="EcoProject thumbnail image"
                    className=" h-60 min-h-[511px] w-full object-cover"
                    width={300}
                    height={200}
                /> */}
                <div
                    className="h-100 min-h-[600px] w-full object-cover"
                    style={{
                        backgroundImage: `url(
                            ${
                                project.listImage?.startsWith("https")
                                    ? project.listImage
                                    : `${process.env.NEXT_PUBLIC_CDN_URL}/${project.listImage}`
                            }
                        )`,
                        backgroundSize: "cover",
                    }}
                ></div>
                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-gradient-to-r from-black/70 to-transparent md:w-4/5"></div>
                {project.nftSeries?.isActive && (
                    <Button
                        intent={"sky"}
                        className="absolute bottom-10 right-6 uppercase"
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

            <h1 className="mx-2 mt-7 text-[48px] font-bold leading-none text-slate-800 sm:mx-[3em]">
                {project.title}
            </h1>

            <div className="mx-4 mt-7 flex flex-col gap-10 sm:mx-[10em] md:flex-row">
                <div className="w-full md:w-2/3">
                    <p className="text-[#7E7E7E]">{project.intro}</p>
                    <p className="mt-5 text-[1.25rem] text-slate-700">
                        {project.location.location +
                            ", " +
                            project.location.st +
                            ", " +
                            project.location.cn}
                    </p>
                    {console.log("**************", project)}
                    <Overview datas={project.overview} />
                    <div className="mt-[5em] flex w-[300px] justify-between">
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                <span className="text-[#7E7E7E]">
                                    Credit Type
                                </span>
                                <span className="text-[18px] font-semibold">
                                    {project.nftSeries?.seriesType}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#7E7E7E]">
                                    Price Per Ton
                                </span>
                                <span className="text-[18px] font-semibold">
                                    {`$${project.nftSeries?.creditPrice}`}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                <span className="text-[#7E7E7E]">
                                    Credits Available
                                </span>
                                <span className="text-[18px] font-semibold">
                                    {project.nftSeries?.setAmount?.toString() ??
                                        0}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#7E7E7E]">
                                    Credits Retired
                                </span>
                                <span className="text-[18px] font-semibold">
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
                <div className="w-full md:w-1/3">
                    {" "}
                    <DetailCard projectData={project} />
                </div>
            </div>
            {/* <Responsive /> */}
            {projects && (
                <div className="mt-[13em]">
                    <div className="mx-5 border-4 border-slate-300"></div>
                    <h1 className="mt-8 text-center font-head text-[36px] font-semibold uppercase leading-none text-slate-600">
                        Other projects for you to explore
                    </h1>
                    <div className="grid w-full grid-cols-1 content-start gap-7 py-[5em]  px-8 sm:grid-cols-3 sm:px-[7em]">
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
                                    nftSeries,
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
                                        hasSeries={nftSeries?.isActive}
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
