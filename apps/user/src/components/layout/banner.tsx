import Image from "next/image";

const Banner = ({ children, src }: { children: any; src: any }) => {
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
