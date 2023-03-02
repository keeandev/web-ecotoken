import { cva, type VariantProps } from "class-variance-authority";
import Image, { ImageProps } from "next/image";

const avatarStyles = cva("overflow-hidden relative", {
	variants: {
		style: {
			rectangle: "rounded-md",
			circle: "rounded-full"
		},
		border: {
			true: "border"
		},
		size: {
			sm: "w-10 h-10",
			md: "w-16 h-16",
			lg: "w-32 h-32"
		}
	},
	defaultVariants: {
		style: "circle",
		border: true,
		size: "sm"
	}
});

export type AvatarProps = Omit<ImageProps, "fill"> &
	VariantProps<typeof avatarStyles>;
const Avatar: React.FC<AvatarProps> = ({ border, style, size, ...props }) => {
	return (
		<div className={avatarStyles({ border, style, size })}>
			<Image {...props} fill style={{ objectFit: "cover" }} />
		</div>
	);
};

export default Avatar;
