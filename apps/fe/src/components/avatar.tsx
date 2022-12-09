import dingo from "#/dingo.png";
import clsx from "clsx";
import type { ImageProps } from "next/image";
import Image from "next/image";

type AvatarProps = Omit<ImageProps, "src" | "alt">;
const Avatar: React.FC<AvatarProps> = ({ className, ...props }) => {
	return (
		<Image
			src={dingo}
			alt="User profile picture"
			className={clsx("rounded-full", className)}
			{...props}
		/>
	);
};

export default Avatar;
