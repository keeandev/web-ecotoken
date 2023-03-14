import React from "react";
import { useRouter } from "next/router";
import NftPreview from "@/components/project/nft-preview";
import Stepper from "@/components/project/stepper";
import { trpc } from "@/utils/trpc";

const StepComponent = () => {
    const router = useRouter();
    const { id } = router.query;

    const credits = 20;
    const retiredBy = "asdf";
    const date = new Date();

    const { data: project } = trpc.ecoProjects.get.useQuery(
        {
            identifier: id as string,
            location: true,
            producer: true,
            series: true,
        },
        {
            enabled: !!id,
        },
    );
    if (!project) return <>Loading...</>;
    return (
        <div className="w-full">
            <div
                className="flex h-[280px] w-full items-end px-8  py-10 "
                style={{
                    backgroundImage: `url(${
                        project.listImage?.startsWith("https")
                            ? project.listImage
                            : `${process.env.NEXT_PUBLIC_CDN_URL}/${project.listImage}`
                    })`,
                }}
            >
                <h2 className="font-head text-3xl font-semibold text-white ">
                    {project.title}
                </h2>
            </div>
            <div className=" mx-auto mt-16 flex w-[1400px] flex-col flex-wrap items-start justify-between px-3 lg:flex-row-reverse lg:flex-nowrap">
                <NftPreview
                    image={
                        project.nftSeries.seriesImage?.startsWith("https")
                            ? project.nftSeries.seriesImage
                            : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${project.projectID}/nft-series/${project.nftSeries.nftSeriesID}/baseImage.png`
                    }
                    project={project.shortTitle}
                    location={project.location?.location}
                    producer={project.producer.companyName ?? undefined}
                    batch={project.nftSeries.regenBatch}
                    symbol={project.nftSeries?.seriesType}
                    credits={credits}
                    retiredBy={retiredBy}
                    date={date}
                />
                <div className=" lg:w-[600px]">
                    <p className="text-[24px] font-[500] text-[black]">
                        {project.title} Project
                    </p>
                    <p className="mt-[10px] text-[24px] font-[500] text-[#656565]">
                        {project.location?.location}
                    </p>
                    <p className="mt-[50px] text-[27px] font-[500] text-[#00AEEF]">
                        Credit Retirement Process
                    </p>
                    <div className="w-full">
                        <Stepper title="FUNDS ReCEIVED" status={true} />
                        <Stepper title="REQUEST TO RETIRE SENT" status={true} />
                        <Stepper title="Credits retired" status={true} />
                        <Stepper title="NFT being created" status={true} />
                        <Stepper title="NFT IN YOUR WALLET" status={false} />
                        <Stepper title="order Complete" status={false} />
                        <Stepper
                            title="SHARE your CONTRIBUTION"
                            status={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepComponent;
