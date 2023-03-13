import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Responsive from "@/components/dev-responsive";
// import NFTBuilderPreview from "../../../../../admin/src/components/nft-builder-preview";
import NftPreview from "@/components/project/nft-preview";
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

    const currency = form.watch("currency");
    let credits;
    try {
        credits = form.watch("creditsPurchased").toNumber();
        console.log(credits);
    } catch (error) {
        credits = form.watch("creditsPurchased") as number;
    }
    const retiredBy = form.watch("retireBy");

    if (!project || !price) return <>Loading...</>;

    if (!project.nftSeries)
        return <div>No NFT series are attached to this project.</div>;
    else
        return (
            <div className="relative mb-8 flex min-h-screen w-full flex-wrap justify-center ">
                <div
                    className="flex h-[280px] w-full items-end px-8  py-10 "
                    style={{
                        backgroundImage: `url(${
                            project.listImage?.startsWith("https")
                                ? project.listImage
                                : `${process.env.NEXT_PUBLIC_CDN_URL}/${project.listImage}`
                        })`,
                    }}
                >
                    <h2 className="font-head text-3xl font-semibold text-white ">
                        {project.title}
                    </h2>
                </div>
                <div className="mt-16 flex w-[1024px] flex-wrap items-start justify-between px-3 lg:flex-row-reverse lg:flex-nowrap">
                    <div className="flex w-full justify-center px-0 py-0 lg:w-[600px]">
                        <NftPreview
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
                            credits={credits}
                            retiredBy={retiredBy}
                            date={date}
                        />
                        {/* <NFTBuilderPreview
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
                        /> */}
                    </div>

                    <div className="flex w-full justify-center py-5 pr-2 lg:w-[380px]">
                        <div className="flex w-screen max-w-[500px] flex-col  px-4 lg:px-0">
                            <h3 className="text-lg font-bold leading-[1.25] text-slate-700">
                                {project.title}
                            </h3>
                            <h4 className="text-lg text-slate-600">
                                {project.location?.location}
                            </h4>
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
                                <div className="mt-4 flex items-end justify-start">
                                    <FormInput
                                        className="float-left mt-3 mr-0 w-48"
                                        id="creditamt"
                                        type="number"
                                        label="Amount of Credits to Purchase"
                                        defaultValue={100}
                                        step="any"
                                        {...form.register("creditsPurchased")}
                                    />
                                    <div className="float-left mb-2 inline-block border">
                                        {project.nftSeries.seriesType}
                                    </div>
                                </div>
                                <FormSelect
                                    label="Currency"
                                    className="mt-3 w-48"
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

                                <div className="inline-block w-[100%] py-2">
                                    Purchase Price:{" "}
                                    {Number(
                                        (Number(credits) * 1.5) /
                                            (currency === "SOL"
                                                ? // @ts-ignore eslint-disable-next-line
                                                  (price.data.solana
                                                      .usd as number)
                                                : 1),
                                    ).toFixed(2)}
                                </div>
                                {/* <div>
                                    {project.nftSeries?.creditPrice &&
                                        `Purchase Price: $${project.nftSeries?.creditPrice.times(
                                            credits,
                                        )}`}
                                </div> */}
                                <FormInput
                                    size="full"
                                    label="Retired By"
                                    className="mt-3 mb-3"
                                    {...form.register("retireBy")}
                                />
                                <Button
                                    className="mt-8"
                                    fullWidth
                                    loading={isOrdering}
                                >
                                    Purchase Credits
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default PurchaseProject;
