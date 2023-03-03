import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef } from "react";
import Image from "next/image";

type NFTBuilderPreviewProps = {
	image?: string;
	width?: number;
	height?: number;
	credits: number;
	symbol: string;
	project: string;
	location: string;
	producer: string;
	date: Date;
	id: string;
};

// eslint-disable-next-line react/display-name
const NFTBuilderPreview = forwardRef<HTMLDivElement, NFTBuilderPreviewProps>(
	(
		{
			image,
			width,
			height,
			credits,
			symbol,
			project,
			location,
			producer,
			date,
			id
		},
		ref
	) => {
		return image ? (
			<div
				className="relative overflow-hidden rounded-lg shadow-md"
				ref={ref}
			>
				<Image
					src={image}
					alt="NFT image"
					{...(!width && !height
						? { fill: true }
						: { width, height })}
					className="pointer-events-none select-none"
				/>
				<div className="absolute bottom-4 left-4 text-white">
					<div>
						Credits: {credits} {symbol}
					</div>
					<div>Project: {project}</div>
					<div>Location: {location}</div>
					<div>Producer: {producer}</div>
					<div>Date: {date && date.toDateString()}</div>
					<div>ID: {id}</div>
				</div>
			</div>
		) : (
			<div className="relative flex rounded-lg border border-slate-400">
				{/* eslint-disable @next/next/no-img-element */}
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
	}
);

export default NFTBuilderPreview;
