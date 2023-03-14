import { useMemo, useState, type ChangeEvent } from "react";
import { trpc } from "@/utils/trpc";
import { createId } from "@paralleldrive/cuid2";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createNFTSeriesSchema } from "@ecotoken/api/src/schema/nft-series";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";

const NFTSeries: React.FC = () => {
    const [seriesImage, setSeriesImage] = useState<File>();
    const form = useZodForm({
        schema: createNFTSeriesSchema.omit({
            seriesImage: true,
            nftSeriesID: true,
        }),
    });

    const { mutateAsync: createPresignedUrl } =
        trpc.spaces.createPresignedUrls.useMutation();

    const { mutateAsync, isLoading: isCreating } =
        trpc.nftSeries.create.useMutation({
            onSuccess() {
                toast.success("NFT Series created successfully.");
            },
            onError() {
                toast.error("NFT Series failed to create.");
            },
        });
    const { data: ecoProjects, isLoading: fetchingEcoProjects } =
        trpc.ecoProjects.getAll.useInfiniteQuery({});

    const uploadMutation = async ({
        url,
        seriesImage,
    }: {
        url: string;
        seriesImage: File;
    }) => {
        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "image/png",
                "x-amz-acl": "public-read",
            },
            mode: "cors",
            body: seriesImage,
        });
    };

    const { mutateAsync: uploadImage, isLoading: isUploadingImage } =
        useMutation({
            mutationKey: ["uploadSeriesImage"],
            mutationFn: uploadMutation,
        });

    const cachedProjects = useMemo(
        () => ecoProjects?.pages.flatMap((page) => page.projects),
        [ecoProjects],
    );

    const handleImageLoad = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        // we have one file
        if (files && files[0]) {
            setSeriesImage(files[0]);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <CardTitle>NFT Series</CardTitle>
                <CardDescription>Create a NFT series.</CardDescription>
            </div>
            <Form
                form={form}
                onSubmit={async (data) => {
                    if (!seriesImage) return;
                    const nftSeriesID = createId();
                    const imageKey = `eco-projects/${data.projectID}/nft-series/${nftSeriesID}/seriesImage.png`;
                    const url = await createPresignedUrl({
                        contentType: "image/png",
                        key: imageKey,
                        acl: "public-read",
                    });
                    await uploadImage({
                        url: url as string,
                        seriesImage,
                    });
                    await mutateAsync({
                        ...data,
                        nftSeriesID,
                        seriesImage: `${process.env.NEXT_PUBLIC_CDN_URL}/${imageKey}`,
                    });
                }}
                className="flex w-full flex-col gap-4"
            >
                <FormInput
                    name="seriesImage"
                    label="Series Image"
                    size="full"
                    type="file"
                    onChange={handleImageLoad}
                />
                <FormSelect
                    label="Project"
                    size="full"
                    defaultValue=""
                    {...form.register("projectID")}
                >
                    <option value="" hidden></option>
                    {cachedProjects?.map((project) => (
                        <option
                            key={project?.projectID}
                            value={project?.projectID}
                        >
                            {project?.title}
                        </option>
                    ))}
                </FormSelect>
                <FormInput
                    label="Series Type"
                    size="full"
                    {...form.register("seriesType")}
                />
                <FormInput
                    label="Series Name"
                    size="full"
                    {...form.register("seriesName")}
                />
                <FormInput
                    label="Series Number"
                    type="number"
                    size="full"
                    defaultValue={1}
                    {...form.register("seriesNumber", {
                        valueAsNumber: true,
                    })}
                />
                <FormInput
                    label="Retirement Wallet Address"
                    size="full"
                    {...form.register("retireWallet")}
                />
                <FormInput
                    label="Recieving Wallet Address"
                    size="full"
                    {...form.register("recieveWallet")}
                />
                <FormInput
                    label="Credit Wallet Address"
                    size="full"
                    {...form.register("creditWallet")}
                />
                <FormInput
                    label="Credit Wallet Private Key"
                    size="full"
                    {...form.register("creditKey")}
                />
                <Button
                    loading={
                        fetchingEcoProjects || isCreating || isUploadingImage
                    }
                    fullWidth
                >
                    Create
                </Button>
            </Form>
        </div>
    );
};

export default NFTSeries;
