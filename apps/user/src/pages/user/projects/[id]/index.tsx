import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import DefaultCard, {
    CardTitle,
    CardDescription,
} from "@ecotoken/ui/components/Card";
import Image from "next/image";
import Button from "@ecotoken/ui/components/Button";
import credit_icon from "@ecotoken/ui/assets/icons/credits.svg";
import { clientEnv } from "@/env/schema.mjs";
import Overview from "./overview";
import ProjectCard from "@/components/project/project-card";
import DetailCard from "./DetailCard";
import { useEffect } from "react";

const ProjectDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data: project } = trpc.ecoProjects.get.useQuery({
        url: id as string,
    });

    const { data, hasNextPage, fetchNextPage } =
        trpc.ecoProjects.getAll.useInfiniteQuery({
            limit: 3,
            benefits: true,
            location: true,
        });
    if (!data) return <div>Loading...</div>;

    if (!project || !project.projectID) return <>Loading...</>;
    console.log(project);

    return (
        <div className="">
            <div className="relative">
                <h1 className="absolute bottom-[1em] left-[2em] text-[48px] font-bold text-white">
                    {project.ecoTitle}
                </h1>
                <Image
                    src={`${clientEnv.NEXT_PUBLIC_CDN_URL}/${
                        JSON.parse(project.images).listImage
                    }`}
                    alt="EcoProject thumbnail image"
                    className=" h-60 min-h-[511px] w-full object-cover"
                    width={300}
                    height={200}
                />
                <Button
                    intent={"sky"}
                    className="absolute right-[10em] bottom-[2em] uppercase"
                    onClick={() => {
                        router.push(`/user/projects/${id}/purchase`);
                    }}
                >
                    <Image
                        src={credit_icon}
                        alt="Credit Icon"
                        className="h-[30px] w-[30px]"
                    />
                    Buy Credits
                </Button>
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
                                    Credits Type
                                </span>
                                <span className="text-[15px] font-semibold">
                                    CO2
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#7E7E7E]">
                                    Price Per Ton
                                </span>
                                <span className="text-[15px] font-semibold">
                                    $25.43
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                <span className="text-[#7E7E7E]">
                                    Credits Available
                                </span>
                                <span className="text-[15px] font-semibold">
                                    CO2
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
                    <Button
                        intent={"sky"}
                        className="mt-10 uppercase"
                        onClick={() => {
                            router.push(`/user/projects/${id}/purchase`);
                        }}
                    >
                        <Image
                            src={credit_icon}
                            alt="Credit Icon"
                            className="h-[30px] w-[30px]"
                        />
                        Buy Credits
                    </Button>
                </div>
                <DetailCard />
            </div>
            <div className="mt-[13em]">
                <div className="mx-5 border-8 border-[#D9D9D9]"></div>
                <h1 className="my-12 text-center text-[36px] uppercase text-[#7E7E7E]">
                    Other projects for you to explore
                </h1>
                <div className="grid w-full grid-cols-3 content-start gap-7  py-[5em] px-[7em]">
                    {data.pages.flatMap(({ projects }) => {
                        // console.log("Projects", projects);
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

export default ProjectDetails;
