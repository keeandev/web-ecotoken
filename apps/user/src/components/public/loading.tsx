import Image from "next/image";
import LoadingImage from "@ecotoken/ui/assets/brand/logo.png";

const PublicLoading = () => {
    return (
        <div className="fixed z-10 flex h-full w-full items-center justify-center bg-white">
            <Image
                className=""
                src={LoadingImage}
                alt="loading"
                width={200}
                height={200}
                quality={100}
            ></Image>
        </div>
    );
};

export default PublicLoading;
