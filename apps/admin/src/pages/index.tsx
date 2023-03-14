import { type NextPage } from "next";
import FileUpload from "@ecotoken/ui/components/FileUpload";
import ImageGroup from "@ecotoken/ui/components/ImageGroup";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { trpc } from "@/utils/trpc";
import { clientEnv } from "@/env/schema.mjs";

const Home: NextPage = () => {
    const context = trpc.useContext();
    const { data: imageURLs } = trpc.spaces.listObjects.useQuery(
        {
            prefix: "eco-projects/cleqa5ak90000356wgtfk1106",
        },
        {
            retry: false,
            onSuccess() {
                context.spaces.listObjects.setData(
                    { prefix: "eco-projects/cleqa5ak90000356wgtfk1106" },
                    (data) =>
                        data?.map((url) => {
                            return `${clientEnv.NEXT_PUBLIC_CDN_URL}/${url}`;
                        }),
                );
            },
        },
    );

    return (
        <div className="w-full space-y-4">
            <div className="block w-fit bg-cyan-400 p-4">
                Dashboard (index.tsx)
            </div>
            <FileUpload defaultIcon={faImage} />
            {imageURLs && (
                <div className="rounded-lg border border-slate-400 bg-slate-200 p-2 w-fit space-y-2">
                    <div className="text-lg">Project Images</div>
                    <ImageGroup images={imageURLs} />
                </div>
            )}
        </div>
    );
};

export default Home;
