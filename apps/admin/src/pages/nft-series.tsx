import Button from "@ecotoken/ui/components/Button";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";
import { createNFTSeriesSchema } from "@ecotoken/api/src/schema/nft-series";
import { trpc } from "@/utils/trpc";
import { type ChangeEvent, useMemo, useState } from "react";
import { transformEnum } from "@/utils/transformer";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import { toast } from "react-hot-toast";
import { createId } from "@paralleldrive/cuid2";
import { useMutation } from "@tanstack/react-query";

const NFTSeries: React.FC = () => {
    const [seriesImage, setSeriesImage] = useState<File>();
    const form = useZodForm({
        schema: createNFTSeriesSchema.omit({
            seriesImage: true,
            nftSeriesID: true,
        }),
    });

    const { mutateAsync: createPresignedUrl } =
        trpc.upload.createPresignedUrl.useMutation();

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

    const { data: users, isLoading: fetchingUsers } =
        trpc.users.getAll.useInfiniteQuery({
            role: "Producer",
        });

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

    const cachedUsers = useMemo(
        () => users?.pages.flatMap((page) => page.users),
        [users],
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
                            key={project.projectID}
                            value={project.projectID}
                        >
                            {project.ecoTitle}
                        </option>
                    ))}
                </FormSelect>
                <FormSelect
                    label="Series Type"
                    {...form.register("seriesType")}
                    size="full"
                >
                    {createNFTSeriesSchema.shape.seriesType.options?.map(
                        (type) => (
                            <option key={type} value={type}>
                                {transformEnum(type)}
                            </option>
                        ),
                    )}
                </FormSelect>
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
                <FormSelect
                    label="Producer"
                    size="full"
                    defaultValue=""
                    {...form.register("producerID")}
                >
                    <option value="" hidden></option>
                    {cachedUsers?.map((user) => (
                        <option key={user.userID} value={user.userID}>
                            {user.companyName}
                        </option>
                    ))}
                </FormSelect>
                <FormInput
                    label="Producer Wallet Address"
                    size="full"
                    {...form.register("producerWallet")}
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
                        fetchingEcoProjects ||
                        fetchingUsers ||
                        isCreating ||
                        isUploadingImage
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
