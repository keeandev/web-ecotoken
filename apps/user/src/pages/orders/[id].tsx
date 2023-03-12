import Image from "next/image";
import { useRouter } from "next/router";
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

    if (order?.status !== "ORDER_COMPLETE")
        return (
            <div className="relative flex min-h-screen w-full flex-col border-red-600 bg-ecogreen-100">
                <div
                    className="border-6 flex h-[280px] w-full items-end border-purple-500 bg-amber-200 px-8 py-10"
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
                <div className="relative flex h-[200px] w-full justify-center border border-blue-400">
                    Processing...
                </div>
            </div>
        );
    else return <div>Order Details</div>;
};

export default Order;
