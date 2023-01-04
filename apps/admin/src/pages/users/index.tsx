import React from "react";
import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";

import { User } from "@prisma/client";
import Button from "@ecotoken/ui/components/Button";
import { useRouter } from "next/router";

const Users = () => {
	const router = useRouter();
	const { data } = trpc.users.getAll.useInfiniteQuery(
		{},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const columnHelper = createColumnHelper<User>();

	const columns = [
		columnHelper.accessor("id", {
			header: "User ID",
			footer: (info) => info.column.id,
			id: "id"
		}),
		columnHelper.accessor("siteID", {
			header: "Site ID",
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("walletAddress", {
			header: "Wallet Address",
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("emailAddress", {
			header: "Email Address",
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("createdAt", {
			header: "Created At",
			cell: (info) => info.getValue().toDateString(),
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("updatedAt", {
			header: "Updated At",
			cell: (info) => info.getValue().toDateString(),
			footer: (info) => info.column.id
		})
	];

	return (
		<div>
			<DefaultCard className="space-y-4">
				<div className="flex w-full">
					<div className="flex flex-col">
						<CardTitle>Users</CardTitle>
						<CardDescription>
							A list of all ecoToken users.
						</CardDescription>
					</div>
					<div className="flex flex-1 items-end justify-end space-x-2">
						<Button
							onClick={() =>
								router.push(`${router.asPath}/create`)
							}
						>
							Add User
						</Button>
					</div>
				</div>
				<Table
					data={data?.pages[0]?.users ?? []}
					columns={columns}
					alternate
					fullWidth
				/>
			</DefaultCard>
		</div>
	);
};

export default Users;
