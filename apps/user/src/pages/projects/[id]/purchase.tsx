import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useWallet } from "@solana/wallet-adapter-react";
import Decimal from "decimal.js";
import { createEcoOrderSchema } from "@ecotoken/api/src/schema/order";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, { CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";

import NFTBuilderPreview from "../../../../../admin/src/components/nft-builder-preview";

const PurchaseProject = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data: project } = trpc.ecoProjects.get.useQuery(
        {
            identifier: id as string,
            location: true,
            producer: true,
        },
        {
            enabled: !!id,
        },
    );

    const { mutateAsync, isLoading: isOrdering } =
        trpc.ecoOrders.create.useMutation({
            async onSuccess(data) {
                await router.push(`/orders/${data.ecoOrderID}`);
            },
        });

    const { data: price } = trpc.coinPrice.get.useQuery();

    const form = useZodForm({
        schema: createEcoOrderSchema.omit({
            nftSeriesID: true,
            userWallet: true,
            payAmount: true,
            payFee: true,
            payHash: true,
            userID: true,
        }),
        defaultValues: {
            creditsPurchased: new Decimal(0),
        },
    });

    const { publicKey } = useWallet();

    const date = useMemo(() => new Date(), []);

    const currency = form.getValues("currency");
    const credits = form.getValues("creditsPurchased");
    const retiredBy = form.getValues("retireBy");

    if (!project || !price) return <>Loading...</>;

    if (!project.nftSeries)
        return <div>No NFT series are attached to this project.</div>;
    else
        return (
            <div className="mx-2 mt-6 w-full">
                <DefaultCard size="full">
                    <CardTitle className="text-center">
                        {project.title}
                    </CardTitle>
                    <div className="mt-10 grid w-full grid-cols-2 space-x-4 px-2 py-5">
                        <div className="w-full">
                            <Form
                                className="space-y-4"
                                form={form}
                                onSubmit={async (data) => {
                                    // TODO: order
                                    if (!publicKey) return;
                                    await mutateAsync({
                                        ...data,
                                        nftSeriesID:
                                            project.nftSeries?.nftSeriesID ??
                                            "",
                                        userWallet: publicKey?.toBase58(),
                                        payFee: 0,
                                        payAmount: 10,
                                        payHash: "asasas",
                                    });
                                }}
                            >
                                <FormInput
                                    className="mt-3"
                                    label={
                                        project.creditType
                                            ? `Credits (${project.nftSeries.seriesType})`
                                            : "Credits"
                                    }
                                    type="number"
                                    size="full"
                                    defaultValue={100}
                                    {...form.register("creditsPurchased", {
                                        setValueAs: (value: string) =>
                                            new Decimal(value),
                                    })}
                                />
                                <FormSelect
                                    label="Currency"
                                    className="mt-3"
                                    size="full"
                                    {...form.register("currency")}
                                >
                                    {createEcoOrderSchema.shape.currency.options.map(
                                        (type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ),
                                    )}
                                </FormSelect>
                                {/* <p className="py-5">
                                Purchase Price:{" "}
                                {Number(
                                    credits.times(1.5).dividedBy(
                                        currency === "SOL"
                                            ? // @ts-ignore eslint-disable-next-line
                                              (price.solana.usd as number)
                                            : 1,
                                    ),
                                ).toFixed(2)}
                            </p> */}
                                {/* <div>
                                {project.nftSeries?.creditPrice &&
                                    `Purchase Price: $${project.nftSeries?.creditPrice.times(
                                        credits,
                                    )}`}
                            </div> */}
                                <FormInput
                                    size="full"
                                    label="Retired By"
                                    className="mt-3"
                                    {...form.register("retireBy")}
                                />
                                <Button
                                    className="mt-4"
                                    fullWidth
                                    loading={isOrdering}
                                >
                                    Purchase Credits
                                </Button>
                            </Form>
                        </div>
                        <NFTBuilderPreview
                            className="h-96 w-96"
                            image={
                                project.nftSeries.seriesImage?.startsWith(
                                    "https",
                                )
                                    ? project.nftSeries.seriesImage
                                    : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${project.projectID}/nft-series/${project.nftSeries.nftSeriesID}/baseImage.png`
                            }
                            project={project.shortTitle}
                            location={project.location?.location}
                            producer={project.producer.companyName ?? undefined}
                            batch={project.nftSeries.regenBatch}
                            symbol={project.nftSeries?.seriesType}
                            credits={credits.toNumber()}
                            retiredBy={retiredBy}
                            date={date}
                        />
                        {/* <Preview
                            image={{
                                src: `/images/${
                                    JSON.parse(project.images).listImage
                                }`,
                            }}
                            displayData={{ location }}
                        /> */}
                        {/* <Image
							src={`/images/${
								JSON.parse(project.images).listImage
							}`}
							alt="EcoProject thumbnail image"
							className=" h-60 min-h-[300px] w-full rounded-md object-cover"
							width={300}
							height={200}
						/> */}
                    </div>
                </DefaultCard>
            </div>
        );
};

export default PurchaseProject;
