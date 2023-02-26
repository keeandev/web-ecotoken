import Button from "@ecotoken/ui/components/Button";
import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";
import { useRouter } from "next/router";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";
import { EcoOrder } from "@ecotoken/db";

const EcoOrders = () => {
	const router = useRouter();

	const { data: orders } = trpc.ecoOrders.getAll.useInfiniteQuery({});

	const columnHelper = createColumnHelper<EcoOrder>();

	const columns = [
		columnHelper.accessor("projectID", {
			header: "Project ID",
			id: "id"
		}),
		columnHelper.accessor("userID", {
			header: "User ID"
		}),
		columnHelper.accessor("payAmount", {
			header: "Payed"
		}),
		columnHelper.accessor("creditAmount", {
			header: "Credits"
		}),
		columnHelper.accessor("retireBy", {
			header: "Retired By"
		}),
		columnHelper.accessor("userLocation", {
			header: "User Location"
		}),
		columnHelper.accessor("userWallet", {
			header: "User Wallet"
		}),
		columnHelper.accessor("payHash", {
			header: "Tx. Hash"
		}),
		columnHelper.accessor("retireHash", {
			header: "Retire Hash"
		}),
		columnHelper.accessor("createdAt", {
			header: "Created At",
			cell: (info) => <>{info.renderValue()?.toDateString()}</>
		})
	];

	return (
		<div>
			<DefaultCard className="space-y-4">
				<div className="flex w-full">
					<div>
						<CardTitle>Orders</CardTitle>
						<CardDescription>
							A list of all available orders.
						</CardDescription>
					</div>
					<div className="flex flex-1 items-end justify-end space-x-2">
						<Button
							onClick={() =>
								router.push(`${router.asPath}/create`)
							}
						>
							Create an order
						</Button>
					</div>
				</div>
				<Table
					data={orders?.pages[0]?.orders ?? []}
					columns={columns}
					fullWidth
				/>
			</DefaultCard>
		</div>
	);
};

export default EcoOrders;
