import React, { useEffect, useState } from "react";

const ReadMore: React.FC<React.PropsWithChildren & { len: number }> = ({
    children,
    len,
}) => {
    const text = children as string;
    const [isReadMore, setIsReadMore] = useState(true);
    const [isFlush, setIsFlush] = useState(false);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    useEffect(() => {
        console.log(text.length, len, text.length > len);
        if (text.length > len) setIsFlush(true);
        else setIsFlush(false);
    }, []);

    return (
        <p className="text">
            {isReadMore ? text?.slice(0, len) : text}
            <span onClick={toggleReadMore} className="read-or-hide">
                {isReadMore ? (
                    isFlush && <span className="toggle-show">...See more</span>
                ) : (
                    <span className="toggle-show"> Show less</span>
                )}
            </span>
        </p>
    );
};

export default ReadMore;
