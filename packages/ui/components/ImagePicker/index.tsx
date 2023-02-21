import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";

export type ImagePickerProps = {
	width?: number;
	height?: number;
};

const ImagePicker: React.FC<ImagePickerProps> = ({ width, height }) => {
	const [source, setSource] = useState<string>();
	const ref = useRef<HTMLInputElement>(null);

	const handleImageLoad = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files[0]) {
			setSource(URL.createObjectURL(files[0]));
		}
	};

	return (
		<div
			className="relative h-96 w-96 overflow-hidden rounded-lg border-2 border-slate-400 bg-slate-200"
			onClick={() => ref.current?.click()}
		>
			<input
				type="file"
				name="Choose image"
				className="absolute hidden"
				onChange={handleImageLoad}
				ref={ref}
			/>
			{source ? (
				<Image
					src={source}
					alt="NFT image"
					// {...(!width && !height
					// 	? { fill: true }
					// 	: { width, height })}
					className="pointer-events-none select-none"
					style={{ objectFit: "cover" }}
					fill
				/>
			) : (
				<FontAwesomeIcon
					icon={faFileImage}
					size="xl"
					className="absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] text-slate-500"
				/>
			)}
		</div>
	);
};

export default ImagePicker;
