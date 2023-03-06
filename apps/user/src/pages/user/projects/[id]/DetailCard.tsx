const DetailCard = () => {
    return (
        <div className="flex flex-col gap-5 rounded-md bg-white p-5 shadow-2xl">
            <h1 className="mb-5 text-[20px] font-semibold">Project Details</h1>
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    project activity
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    Tree Preservation
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    project type
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    Agriculture Forestry and Other Land Use
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    Reference ID (CFC Project id)
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">75</span>
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    project start date
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    December 6, 2021
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-[18px] font-semibold uppercase">
                    Project End Date
                </h1>
                <span className="text-[16px] text-[#7E7E7E]">
                    December 6, 2026
                </span>
            </div>
        </div>
    );
};
export default DetailCard;
