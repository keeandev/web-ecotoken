import type { Area } from "react-easy-crop";
import html2canvas from "html2canvas";

export const createImage = (
	url: string
): Promise<HTMLImageElement | ErrorEvent> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.src = url;
	});

const getRadianAngle = (degreeValue: number) => {
	return (degreeValue * Math.PI) / 180;
};

/**
 * Returns the new bounding area of a rotated rectangle.
 */
const rotateSize = (width: number, height: number, rotation: number) => {
	const rotRad = getRadianAngle(rotation);

	return {
		width:
			Math.abs(Math.cos(rotRad) * width) +
			Math.abs(Math.sin(rotRad) * height),
		height:
			Math.abs(Math.sin(rotRad) * width) +
			Math.abs(Math.cos(rotRad) * height)
	};
};

export const cropImage = async (
	src: string,
	cropPixels: Area,
	rotation = 0,
	flip = { horizontal: false, vertical: false }
): Promise<string | Error> => {
	const image = await createImage(src);
	if (image instanceof ErrorEvent) return new Error(image.message);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) return new Error("Canvas context not found.");

	const rotRad = getRadianAngle(rotation);

	// calculate bounding box of the rotated image
	const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
		image.width,
		image.height,
		rotation
	);

	// set canvas size to match the bounding box
	canvas.width = bBoxWidth;
	canvas.height = bBoxHeight;

	// translate canvas context to a central location to allow rotating and flipping around the center
	ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
	ctx.rotate(rotRad);
	ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
	ctx.translate(-image.width / 2, -image.height / 2);

	// draw rotated image
	ctx.drawImage(image, 0, 0);

	// croppedAreaPixels values are bounding box relative
	// extract the cropped image using these values
	const data = ctx.getImageData(
		cropPixels.x,
		cropPixels.y,
		cropPixels.width,
		cropPixels.height
	);

	canvas.width = cropPixels.width;
	canvas.height = cropPixels.height;
    
	ctx.putImageData(data, 0, 0);

	return new Promise((resolve, reject) => {
		canvas.toBlob((file) => {
			if (file) resolve(URL.createObjectURL(file));
			else reject(new Error("Could not create blob from canvas."));
		}, "image/jpeg");
	});
};
