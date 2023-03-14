import Image from "next/image";
import { useRouter } from "next/router";
import NftPreview from "@/components/project/nft-preview";
import Stepper from "@/components/project/stepper";
import { trpc } from "@/utils/trpc";
import Spinner from "@ecotoken/ui/components/Spinner";

const Order: React.FC = () => {
    const router = useRouter();

    let { id } = router.query;
    if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
    if (!id) id = "";

    const { data: order, isLoading } = trpc.ecoOrders.get.useQuery(
        {
            ecoOrderID: id,
            project: true,
        },
        {
            retry: false,
        },
    );

    if (isLoading) return <Spinner />;
    else if (!order) return <div>No order found.</div>;

    const imageUrl = order.nftSeries.project.headImage?.startsWith("https")
        ? order.nftSeries.project?.headImage
        : `${process.env.NEXT_PUBLIC_CDN_URL}/${order.nftSeries.project?.headImage}`;
    console.log(order);
    if (order?.status !== "ORDER_COMPLETE")
        return (
            <div className="relative flex min-h-screen w-full flex-col border-red-600 ">
                <div
                    className="border-6 flex h-[280px] w-full items-end border-purple-500 px-8 py-10"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                >
                    <h2 className="font-head text-3xl font-semibold text-white ">
                        {order.nftSeries.project.title}
                    </h2>
                </div>
                {/* <div className="relative h-96 w-full rounded-lg">
                    <Image
                        src={imageUrl}
                        alt="EcoProject thumbnail image"
                        className=" h-60 min-h-[200px] w-full object-cover"
                        fill
                    />
                </div> */}
                <div className=" mx-auto mt-16 flex w-[1400px] flex-col flex-wrap items-start justify-between px-3 lg:flex-row-reverse lg:flex-nowrap">
                    <NftPreview
                        image={imageUrl}
                        project={order.nftSeries.project.shortTitle}
                        location={order.nftSeries.project.location?.location}
                        producer={
                            order.nftSeries.project.companyName ?? undefined
                        }
                        batch={order.nftSeries.regenBatch}
                        symbol={order.currency}
                        credits={Number(order.creditsPurchased)}
                        retiredBy={order.retireBy}
                        date={new Date(order.createdAt)}
                    />
                    <div className=" lg:w-[600px]">
                        <p className="text-[24px] font-[500] text-[black]">
                            {order.nftSeries.project.title} Project
                        </p>
                        <p className="mt-[10px] text-[24px] font-[500] text-[#656565]">
                            {order.nftSeries.project.location?.location}
                        </p>
                        <p className="mt-[50px] text-[27px] font-[500] text-[#00AEEF]">
                            Credit Retirement Process
                        </p>
                        <div className="w-full">
                            <Stepper title="FUNDS ReCEIVED" status={true} />
                            <Stepper
                                title="REQUEST TO RETIRE SENT"
                                status={true}
                            />
                            <Stepper title="Credits retired" status={true} />
                            <Stepper title="NFT being created" status={true} />
                            <Stepper
                                title="NFT IN YOUR WALLET"
                                status={false}
                            />
                            <Stepper title="order Complete" status={false} />
                            <Stepper
                                title="SHARE your CONTRIBUTION"
                                status={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    else return <div>Order Details</div>;
};

export default Order;
