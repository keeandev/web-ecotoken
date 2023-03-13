const DetailCard = ({ projectData }: { projectData: any }) => {
    return (
        <div className="flex flex-col gap-5 rounded-md bg-white p-5 shadow-2xl">
            {/* <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    Project Details
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">Overview</span>
            </div> */}
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    project activity
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    {projectData.status}
                </span>
            </div>
            {/* <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    project type
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    Agriculture Forestry and Other Land Use
                </span>
            </div> */}
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    Reference ID (CFC Project id)
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    {projectData.producerID}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    Project Start Date
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    {projectData.dateStart.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    Project End Date
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    {projectData.dateEnd.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
            </div>
        </div>
    );
};
export default DetailCard;
