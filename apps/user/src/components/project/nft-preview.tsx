import { forwardRef } from "react";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

type NFTPreviewProps = {
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
const NftPreview = forwardRef<HTMLDivElement, NFTPreviewProps>(
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
                    "relative flex h-[640px] w-[640px] shadow-md",
                    className,
                )}
                ref={ref}
                {...props}
            >
                <figure
                    className="flex h-full w-full rounded-lg bg-cover"
                    style={{ backgroundImage: `url(${image})` }}
                >
                    {/* <Image
                        src={image}
                        alt="NFT image"
                        {...(!width && !height
                            ? { fill: true }
                            : { width, height })}
                        style={{ objectFit: "cover" }}
                        className="pointer-events-none select-none overflow-hidden"
                    /> */}
                    <figcaption className="text-shadow absolute bottom-0 left-0 inline-block min-h-[200px] w-[100%] p-8 text-xl font-semibold text-white">
                        <div className="inline-block h-[24px] w-full">
                            <div className="float-left w-[110px] font-normal">
                                Credits:
                            </div>
                            <div className="float-left">
                                {credits} {symbol}
                            </div>
                        </div>
                        <div className="inline-block h-[24px] w-full">
                            <div className="float-left w-[110px] whitespace-nowrap font-normal">
                                Retired By:
                            </div>
                            <div className="float-left">{retiredBy}</div>
                        </div>
                        <div className="inline-block h-[24px] w-full">
                            <div className="float-left w-[110px] whitespace-nowrap font-normal">
                                Project:
                            </div>
                            <div className="float-left">{project}</div>
                        </div>
                        <div className="inline-block h-[24px] w-full">
                            <div className="float-left w-[110px] whitespace-nowrap font-normal">
                                Location:
                            </div>
                            <div className="float-left">{location}</div>
                        </div>
                        <div className="inline-block h-[24px] w-full">
                            <div className="float-left w-[110px] whitespace-nowrap font-normal">
                                Producer:
                            </div>
                            <div className="float-left">{producer}</div>
                        </div>
                        <div className="inline-block h-[24px] w-full">
                            <div className="float-left w-[110px] whitespace-nowrap font-normal">
                                Date:
                            </div>
                            <div className="float-left">
                                {date && date.toDateString()}
                            </div>
                        </div>
                        <div className="inline-block h-[24px] w-[100%]">
                            <div className="float-left w-[110px] whitespace-nowrap font-normal">
                                Batch:
                            </div>
                            <div className="float-left">{batch}</div>
                        </div>
                    </figcaption>
                </figure>
            </div>
        ) : (
            <div className="relative flex rounded-lg border border-slate-400">
                {/* eslint-disable-next-line @next/next/no-img-element */}
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

export default NftPreview;
