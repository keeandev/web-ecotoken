import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import OrderModal from "@/components/eco-project/order-modal";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const OrderCredits = () => {
	const router = useRouter();
	const { mutate, isLoading: isCreatingOrder } =
		trpc.ecoOrders.create.useMutation({
			onSuccess() {
				router.push("/eco-projects/orders");
				toast.success("Order created successfully.");
			}
		});

	return (
		<DefaultCard className="flex flex-col space-y-4" size="xl">
			<div>
				<CardTitle>Purchase Credits</CardTitle>
				<CardDescription>Purchase some carbon credits.</CardDescription>
			</div>
			<OrderModal
				admin
				onOrder={async (order) => {
					await mutate({
						...order,
						payAmount: 0.5,
						payFee: 0.1,
						payHash: "bsmomboisdmfsbosd",
						userWallet: "sdjfldskj"
					});
				}}
				creditType="RH20"
				loading={isCreatingOrder}
			/>
		</DefaultCard>
	);
};

export default OrderCredits;
