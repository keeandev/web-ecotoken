import Image from "next/image";

const Banner: React.FC<React.PropsWithChildren & { src: string }> = ({
    children,
    src,
}) => {
    return (
        <div className="relative mb-20 w-full">
            <Image
                src={src}
                alt="ecoToken System"
                className={"h-auto w-full transition-all"}
            />
            {children}
        </div>
    );
};

export default Banner;
