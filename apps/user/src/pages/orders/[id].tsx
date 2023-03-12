import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Spinner from "@ecotoken/ui/components/Spinner";

const Order: React.FC = () => {
    const router = useRouter();

    let { id } = router.query;
    if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
    if (!id) id = "";

    const { data: order, isLoading } = trpc.ecoOrders.get.useQuery({
        ecoOrderID: id,
    });

    if (isLoading) return <Spinner />;
    else if (!order) return <div>No order found.</div>;

    if (order?.status !== "ORDER_COMPLETE") return <div>Processing...</div>;
    else return <div>Order Details</div>;
};

export default Order;
