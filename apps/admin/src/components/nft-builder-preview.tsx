import { forwardRef } from "react";
import Image from "next/image";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

type NFTBuilderPreviewProps = {
    image?: string;
    width?: number;
    height?: number;
    credits?: number;
    retiredBy?: string;
    symbol?: string;
    project?: string;
    location?: string;
    producer?: string;
    date?: Date;
    batch?: string;
} & React.ComponentProps<"div">;

// eslint-disable-next-line react/display-name
const NFTBuilderPreview = forwardRef<HTMLDivElement, NFTBuilderPreviewProps>(
    (
        {
            image,
            width,
            height,
            credits,
            retiredBy,
            symbol,
            project,
            location,
            producer,
            date,
            batch,
            className,
            ...props
        },
        ref,
    ) => {
        return image ? (
            <div
                className={clsx(
                    "relative block overflow-hidden rounded-lg border-8 border-yellow-500 shadow-md",
                    className,
                )}
                ref={ref}
                {...props}
            >
                <figure className="relative flex h-[640px] w-[640px] flex-col">
                    <Image
                        src={image}
                        alt="NFT image"
                        {...(!width && !height
                            ? { fill: true }
                            : { width, height })}
                        style={{ objectFit: "cover" }}
                        className="pointer-events-none select-none"
                    />
                    <figcaption className="absolute border border-pink-500">
                        <div className="absolute border border-purple-500 shadow-md">
                            <div className="absolute bottom-4 left-4 inline-block h-[300px] w-[400px] border-4 border-red-700 p-8 text-white">
                                <div className="text-red-500">
                                    Credits: {credits} {symbol}
                                </div>
                                <div>Retired By: {retiredBy}</div>
                                <div>Project: {project}</div>
                                <div>Location: {location}</div>
                                <div>Producer: {producer}</div>
                                <div>Date: {date && date.toDateString()}</div>
                                <div>Batch: {batch}</div>
                            </div>
                        </div>
                    </figcaption>
                </figure>
            </div>
        ) : (
            <div className="relative flex rounded-lg border border-slate-400">
                {}
                <img
                    width={width}
                    height={height}
                    src="/"
                    alt=""
                    className="invisible"
                />

                <FontAwesomeIcon
                    icon={faFileImage}
                    size="xl"
                    className="absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] text-slate-500"
                />
            </div>
        );
    },
);

export default NFTBuilderPreview;
