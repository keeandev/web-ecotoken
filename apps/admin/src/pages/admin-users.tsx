import React from "react";
import DefaultCard from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";

import { AdminUser } from "@prisma/client";

const AdminUsers = () => {
	const { data } = trpc.adminUsers.getAll.useInfiniteQuery(
		{},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const columnHelper = createColumnHelper<AdminUser>();

	const columns = [
		columnHelper.accessor("adminID", {
			header: "Admin ID",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("username", {
			header: "Username",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("email", {
			header: "Email Address",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("firstName", {
			header: "First Name",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("lastName", {
			header: "Last Name",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		}),
		columnHelper.accessor("lastLogin", {
			header: "Last Login",
			cell: (info) => info.getValue()?.toDateString(),
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
		}),
		columnHelper.accessor("hits", {
			header: "Hits",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		})
	];

	return (
		<div>
			<DefaultCard>
				<div className="text-2xl">Admin Users</div>
				<div>A list of all ecoToken admin users.</div>
				<Table
					data={data?.pages[0]?.adminUsers ?? []}
					columns={columns}
					alternate
					fullWidth
				/>
			</DefaultCard>
		</div>
	);
};

export default AdminUsers;
