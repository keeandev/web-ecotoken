import React from "react";
import DefaultCard from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";

import { User } from "@prisma/client";

const Users = () => {
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
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("walletAddress", {
			header: "Wallet Address",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("emailAddress", {
			header: "Email Address",
			cell: (info) => info.getValue(),
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
			<DefaultCard>
				<div className="text-2xl">Users</div>
				<div>A list of all ecoToken users.</div>
				<Table
					data={data?.pages[0]?.users ?? []}
					columns={columns}
					alternate
				/>
			</DefaultCard>
		</div>
	);
};

export default Users;
