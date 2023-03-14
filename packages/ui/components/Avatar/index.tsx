import { cva, type VariantProps } from "class-variance-authority";
import Image, { type ImageProps } from "next/image";

const avatarStyles = cva("overflow-hidden relative", {
    variants: {
        style: {
            rectangle: "rounded-md",
            circle: "rounded-full",
        },
        border: {
            true: "border",
        },
        size: {
            sm: "w-10 h-10",
            md: "w-16 h-16",
            lg: "w-24 h-24",
            xl: "w-32 h-32",
        },
    },
    defaultVariants: {
        style: "circle",
        border: true,
        size: "sm",
    },
});

export interface AvatarProps
    extends Omit<ImageProps, "fill" | "style">,
        VariantProps<typeof avatarStyles> {}

const Avatar: React.FC<AvatarProps> = ({
    border,
    style,
    alt,
    size,
    ...props
}) => {
    return (
        <div className={avatarStyles({ border, style, size })}>
            <Image {...props} alt={alt} fill style={{ objectFit: "cover" }} />
        </div>
    );
};

export default Avatar;
