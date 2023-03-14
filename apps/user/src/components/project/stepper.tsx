import React from "react";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Stepper = ({ title, status }: { title: string; status: boolean }) => {
    return (
        <div
            className={`stepper mt-[18px] flex w-full max-w-[450px] cursor-pointer items-center rounded-md py-[12px] pl-[10px] text-[20px] text-black ${
                status
                    ? "bg-[#92C83E] hover:bg-[#6F9D02] hover:text-[white] "
                    : "unactive bg-[#D2D2D2]"
            }`}
        >
            <FontAwesomeIcon icon={faCaretRight} size="xl" className="mr-4 " />{" "}
            {title}
        </div>
    );
};

export default Stepper;
