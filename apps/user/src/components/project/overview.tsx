import Image from "next/image";
import arrow_icon from "@ecotoken/ui/assets/icons/right-arrow.svg";

const overviews = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Duis aute irure dolor in reprehenderit in voluptate",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa",
    "Ut enim ad minim veniam, quis nostrud exercitation",
];

const Overview = () => {
    return (
        <div className="my-10">
            <h1 className="mb-5 text-[36px]">Overview</h1>
            {overviews.map((item, index) => {
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
            })}
        </div>
    );
};

export default Overview;
