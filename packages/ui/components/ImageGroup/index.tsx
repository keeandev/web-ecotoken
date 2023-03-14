import clsx from "clsx";
import Avatar from "../Avatar";

const ImageGroup: React.FC<{
    images: string[];
    vertical?: boolean;
}> = ({ images, vertical }) => {
    return (
        <div
            className={clsx("flex", {
                "flex-col space-y-2": vertical,
                "space-x-2": !vertical,
            })}
        >
            {images.map((image) => (
                <Avatar
                    key={image}
                    src={image}
                    alt="Image preview"
                    style="rectangle"
                    size="lg"
                />
            ))}
        </div>
    );
};

export default ImageGroup;
