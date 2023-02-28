import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import OrderModal from "@/components/eco-project/order-modal";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

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
		<Transition
			as={Fragment}
			show
			appear
			enter="ease-out duration-500"
			enterFrom="opacity-0 -translate-y-2"
			enterTo="opacity-100 translate-y-0"
			leave="ease-in duration-500"
			leaveFrom="opacity-100 translate-y-0"
			leaveTo="opacity-0 -translate-y-2"
		>
			<div className="space-y-4">
				<div className="flex space-x-2">
					<Link href="/eco-projects/orders" className="inline-block">
						<FontAwesomeIcon
							icon={faArrowLeft}
							size="lg"
							className="mt-1.5 text-slate-400"
						/>
					</Link>
					<div>
						<CardTitle>Purchase Credits</CardTitle>
						<CardDescription>
							Purchase some carbon credits.
						</CardDescription>
					</div>
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
			</div>
		</Transition>
	);
};

export default OrderCredits;
