const Overview = ({ datas }: { datas?: string }) => {
    return datas ? (
        <div className="my-10">
            <h1 className="mb-5 text-[36px]">About the Project</h1>
            <p className="pl-5" dangerouslySetInnerHTML={{ __html: datas }}></p>
            {/* {overviews.map((item, index) => {
            return (
                <div
                    key={`Overview${index}`}
                    className="flex items-center gap-8 pl-5 pt-3 text-[#7E7E7E]"
                >
                    <Image
                        src={arrow_icon}
                        alt="Arrow icon"
                        width={36}
                        height={36}
                    />
                    <span>{item}</span>
                </div>
            );
        })} */}
        </div>
    ) : (
        <></>
    );
};

export default Overview;
