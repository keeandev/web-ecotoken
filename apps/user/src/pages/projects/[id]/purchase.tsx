import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Responsive from "@/components/dev-responsive";
import { trpc } from "@/utils/trpc";
import { useWallet } from "@solana/wallet-adapter-react";
import Decimal from "decimal.js";
import { createEcoOrderSchema } from "@ecotoken/api/src/schema/order";
import Button from "@ecotoken/ui/components/Button";
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
            series: true,
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
            <div className="relative mb-8 flex min-h-screen w-full flex-wrap justify-center ">
                <div
                    className="flex h-[280px] w-full items-end px-8 py-10  "
                    style={{
                        backgroundImage: `url(${
                            project.listImage?.startsWith("https")
                                ? project.listImage
                                : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${project.projectID}/listImage.png`
                        })`,
                    }}
                >
                    <h2 className="font-head text-3xl font-semibold text-white ">
                        {project.title}
                    </h2>
                </div>
                {/* 
                <div className="relative flex h-[200px] w-full border border-red-500">
                    <Image
                        src={
                            project.listImage?.startsWith("https")
                                ? project.listImage
                                : `${process.env.NEXT_PUBLIC_CDN_URL}/eco-projects/${project.projectID}/listImage.png`
                        }
                        style={{ objectFit: "cover" }}
                        alt="EcoProject list image"
                        fill
                    />
                </div> */}
                <div className="mt-4 w-[1024px] border-2 border-purple-500 px-4">
                    {/* <div className="mt-10 grid w-full grid-cols-2 space-x-4 border-2 border-red-500 px-2 py-5"> */}
                    <div className="flex flex-row justify-between border-2 border-red-500">
                        <div className="min-h-32 flex w-[300px] flex-col border-2 border-green-500 px-2 py-5">
                            <div className="w-full">
                                <h3>{project.title}</h3>
                                <h4>{project.location?.location}</h4>
                                <Form
                                    className="space-y-4"
                                    form={form}
                                    onSubmit={async (data) => {
                                        // TODO: order
                                        if (!publicKey) return;
                                        await mutateAsync({
                                            ...data,
                                            nftSeriesID:
                                                project.nftSeries
                                                    ?.nftSeriesID ?? "",
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
                    </div>
                    <div className="min-h-32 flex w-[600px] flex-col border-2 border-amber-500 px-0 py-0">
                        <NFTBuilderPreview
                            className="h-[600px] w-[600px]"
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
                    </div>
                </div>
                <Responsive />
            </div>
        );
};

export default PurchaseProject;
