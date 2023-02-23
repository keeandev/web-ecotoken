import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import OrderModal from "@/components/eco-project/order-modal";
import { trpc } from "@/utils/trpc";

const OrderCredits = () => {
	const { mutate, isLoading: isCreatingOrder } = trpc.ecoOrders.create.useMutation();

	return (
		<DefaultCard className="flex flex-col space-y-4" size="xl">
			<div>
				<CardTitle>Purchase Credits</CardTitle>
				<CardDescription>Purchase some carbon credits.</CardDescription>
			</div>
			<OrderModal
				onOrder={async (order) => {
					await mutate({
						...order,
						payAmount: 0.5,
						payFee: 0.1,
						payHash: "bsmomboisdmfsbosd",
						nftID: "clegmxkcp0000tq2o1732fnjd",
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
