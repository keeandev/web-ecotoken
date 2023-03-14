import { useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/router";
import ProjectTabPanel from "@/components/eco-project/project-tab-panel";
import { formatCountryAndState } from "@/utils/formatter";
import { trpc } from "@/utils/trpc";
import { createId } from "@paralleldrive/cuid2";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
    createNFTSeriesSchema,
    editNFTSeriesSchema,
} from "@ecotoken/api/src/schema/nft-series";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Form, { FormInput, useZodForm } from "@ecotoken/ui/components/Form";
import Spinner from "@ecotoken/ui/components/Spinner";

import NFTPreview from "../../../../../../user/src/components/project/nft-preview";

const EditSeries = () => {
    const router = useRouter();
    const context = trpc.useContext();
    const { id } = router.query;

    const createForm = useZodForm({
        schema: createNFTSeriesSchema.omit({
            nftSeriesID: true,
        }),
    });

    const editForm = useZodForm({
        schema: editNFTSeriesSchema.omit({
            nftSeriesID: true,
        }),
    });

    const { data: fetchedProject, isLoading: fetchingProject } =
        trpc.ecoProjects.get.useQuery(
            {
                projectID: id as string,
                series: true,
                producer: true,
            },
            {
                enabled: !!id,
                onSuccess(data) {
                    if (data?.nftSeries) {
                        const {
                            seriesName,
                            seriesType,
                            retireWallet,
                            creditWallet,
                            recieveWallet,
                            regenBatch,
                            setAmount,
                            totalCredits,
                            creditPrice,
                            isActive,
                        } = data.nftSeries;
                        editForm.reset({
                            seriesName,
                            seriesType,
                            retireWallet,
                            creditWallet,
                            recieveWallet,
                            regenBatch,
                            setAmount: setAmount ?? undefined,
                            totalCredits,
                            creditPrice,
                            isActive,
                        });
                    }
                },
            },
        );

    const { mutateAsync: createMutate, isLoading: isCreating } =
        trpc.nftSeries.create.useMutation({
            onSuccess: async ({ nftSeriesID }) => {
                await context.nftSeries.get.invalidate({
                    nftSeriesID,
                });
                toast.success("NFT Series has been created.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    const { mutateAsync: editMutate, isLoading: isUpdating } =
        trpc.nftSeries.update.useMutation({
            onSuccess: async ({ nftSeriesID }) => {
                await context.nftSeries.get.invalidate({
                    nftSeriesID,
                });
                toast.success("NFT Series has been edited.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    const { mutateAsync: createPresignedUrl } =
        trpc.spaces.createPresignedUrls.useMutation();

    const [seriesImage, setSeriesImage] = useState<File>();
    const [displayImage, setDisplayImage] = useState<string>();
    const date = useMemo(() => new Date(), []);
    const createSeriesType = createForm.watch("seriesType");
    const createRegenBatch = createForm.watch("regenBatch");
    const editSeriesType = editForm.watch("seriesType");
    const editRegenBatch = editForm.watch("regenBatch");

    const handleImageLoad = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        // we have one file
        if (files && files[0]) {
            setSeriesImage(files[0]);
            setDisplayImage(URL.createObjectURL(files[0]));
        }
    };

    const { mutateAsync: uploadImage, isLoading: isUploadingImage } =
        useMutation({
            mutationKey: ["uploadSeriesImage"],
            mutationFn: async ({
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
            },
        });

    const createImage = async (nftSeriesID: string) => {
        if (!seriesImage) return;
        const imageKey = `eco-projects/${fetchedProject?.projectID}/nft-series/${nftSeriesID}/seriesImage.png`;
        const url = await createPresignedUrl({
            contentType: "image/png",
            key: imageKey,
            acl: "public-read",
        });
        await uploadImage({
            url: url as string,
            seriesImage,
        });
        return imageKey;
    };

    if (!fetchedProject) {
        if (fetchingProject) return <Spinner />;
        else {
            toast.error("Project does not exist.");
            router.push("/eco-projects");
            return null;
        }
    } else
        return (
            <ProjectTabPanel index={7} projectId={id}>
                <div className="space-y-4 p-5">
                    <div>
                        <CardTitle>NFT Series</CardTitle>
                        <CardDescription>
                            {fetchedProject.shortTitle}
                        </CardDescription>
                    </div>
                    <div className="flex items-start gap-4">
                        {fetchedProject.nftSeries ? (
                            <Form
                                form={editForm}
                                onSubmit={async (project) => {
                                    const imageKey = await createImage(
                                        fetchedProject?.nftSeries
                                            ?.nftSeriesID ?? "",
                                    );
                                    await editMutate({
                                        ...project,
                                        nftSeriesID:
                                            fetchedProject?.nftSeries
                                                ?.nftSeriesID ?? "",
                                        seriesImage: imageKey,
                                    });
                                }}
                                className="flex w-fit flex-col gap-4"
                            >
                                <FormInput
                                    name="Image"
                                    label="Series Image"
                                    type="file"
                                    onChange={handleImageLoad}
                                    size="xl"
                                />
                                <FormInput
                                    label={"Series Name"}
                                    type="text"
                                    size="xl"
                                    {...editForm.register("seriesName")}
                                />
                                <FormInput
                                    label={"Series Type"}
                                    type="text"
                                    size="xl"
                                    {...editForm.register("seriesType")}
                                />
                                <FormInput
                                    label={"Retirement Wallet Address"}
                                    type="text"
                                    size="xl"
                                    {...editForm.register("retireWallet")}
                                />
                                <FormInput
                                    label={"Receiving Wallet Address"}
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...editForm.register("recieveWallet")}
                                />
                                <FormInput
                                    label={"Credit Wallet Address"}
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...editForm.register("creditWallet")}
                                />
                                <FormInput
                                    label={"Credit Wallet Private Key"}
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...editForm.register("creditKey")}
                                />
                                <FormInput
                                    label={"Regen Batch Denomination"}
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...editForm.register("regenBatch")}
                                />
                                <FormInput
                                    label="Sellable Amount"
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...createForm.register("setAmount")}
                                />
                                <FormInput
                                    label="Total Credits"
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...createForm.register("totalCredits")}
                                />
                                <FormInput
                                    label="Credit Price"
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...createForm.register("creditPrice")}
                                />
                                <FormInput
                                    label="Active"
                                    type="checkbox"
                                    size="xl"
                                    wrapperClass="w-fit flex space-x-2"
                                    className="w-fit"
                                    {...editForm.register("isActive")}
                                />
                                <Button
                                    fullWidth
                                    loading={
                                        fetchingProject ||
                                        isUpdating ||
                                        isUploadingImage
                                    }
                                >
                                    Update
                                </Button>
                            </Form>
                        ) : (
                            <Form
                                form={createForm}
                                onSubmit={async (project) => {
                                    const nftSeriesID = createId();
                                    const imageKey = await createImage(
                                        nftSeriesID,
                                    );
                                    await createMutate({
                                        ...project,
                                        nftSeriesID,
                                        seriesImage: `${process.env.NEXT_PUBLIC_CDN_URL}/${imageKey}`,
                                    });
                                }}
                                className="flex w-fit flex-col gap-4"
                            >
                                <FormInput
                                    name="Image"
                                    label="Series Image"
                                    type="file"
                                    onChange={handleImageLoad}
                                    size="xl"
                                />
                                <FormInput
                                    label={"Series Name"}
                                    type="text"
                                    size="xl"
                                    {...createForm.register("seriesName")}
                                />
                                <FormInput
                                    label={"Series Type"}
                                    type="text"
                                    size="xl"
                                    {...createForm.register("seriesType")}
                                />
                                <FormInput
                                    label={"Retirement Wallet Address"}
                                    type="text"
                                    size="xl"
                                    {...createForm.register("retireWallet")}
                                />
                                <FormInput
                                    label={"Receiving Wallet Address"}
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...createForm.register("recieveWallet")}
                                />
                                <FormInput
                                    label="Credit Wallet Address"
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...createForm.register("creditWallet")}
                                />
                                <FormInput
                                    label="Credit Wallet Private Key"
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...createForm.register("creditKey")}
                                />
                                <FormInput
                                    label="Regen Batch Denomination"
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...createForm.register("regenBatch")}
                                />
                                <FormInput
                                    label="Sellable Amount"
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...createForm.register("setAmount")}
                                />
                                <FormInput
                                    label="Total Credits"
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...createForm.register("totalCredits")}
                                />
                                <FormInput
                                    label="Credit Price"
                                    type="text"
                                    wrapperClass="w-fit"
                                    size="xl"
                                    {...createForm.register("creditPrice")}
                                />
                                <FormInput
                                    label="Active"
                                    type="checkbox"
                                    size="xl"
                                    wrapperClass="w-fit flex space-x-2"
                                    className="w-fit"
                                    {...createForm.register("isActive")}
                                />
                                <Button
                                    fullWidth
                                    loading={
                                        fetchingProject ||
                                        isCreating ||
                                        isUploadingImage
                                    }
                                >
                                    Create
                                </Button>
                            </Form>
                        )}
                        <NFTPreview
                            width={600}
                            height={600}
                            image={displayImage}
                            onLoad={() => {
                                if (displayImage)
                                    URL.revokeObjectURL(displayImage);
                            }}
                            date={date}
                            credits={100}
                            symbol={
                                fetchedProject?.nftSeries
                                    ? editSeriesType
                                    : createSeriesType
                            }
                            project={fetchedProject?.shortTitle}
                            location={formatCountryAndState(
                                fetchedProject?.location?.location ?? "",
                                fetchedProject?.location?.cn ?? "",
                                fetchedProject?.location?.st ?? "",
                            )}
                            producer={
                                fetchedProject?.producer.companyName ??
                                undefined
                            }
                            batch={
                                fetchedProject?.nftSeries
                                    ? editRegenBatch
                                    : createRegenBatch
                            }
                        />
                    </div>
                    {/* <div>
                    <div>
                        <StatusSelector
                            label="Credits Available: "
                            datas={[
                                { key: "credits1", title: "SET AMOUNT" },
                                { key: "credits2", title: "READ WALLET" },
                            ]}
                            multiSelect={false}
                            getSelectedStatuses={(
                                selectedStatuses: string[],
                            ) => {}}
                        />
                        <Form
                            form={form}
                            onSubmit={async () => {}}
                            className="flex w-fit flex-col gap-4"
                        >
                            <FormInput
                                label={"Set Amount:"}
                                type="text"
                                size="full"
                                {...form.register("setAmount")}
                            />
                            <FormInput
                                label={"Total Project Credits"}
                                type="text"
                                size="full"
                                {...form.register("totalprojectAmount")}
                            />
                            <div className="flex items-end gap-5">
                                <FormInput
                                    label={"Price per Credit"}
                                    type="text"
                                    size="full"
                                    {...form.register("pricePerCredits")}
                                />
                                <label>USDC</label>
                            </div>
                        </Form>
                    </div>
                </div> */}
                </div>
            </ProjectTabPanel>
        );
};

export default EditSeries;
