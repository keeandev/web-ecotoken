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
			id: "id"
		}),
		columnHelper.accessor("username", {
			header: "Username"
		}),
		columnHelper.accessor("email", {
			header: "Email Address"
		}),
		columnHelper.accessor("firstName", {
			header: "First Name"
		}),
		columnHelper.accessor("lastName", {
			header: "Last Name"
		}),
		columnHelper.accessor("lastLogin", {
			header: "Last Login",
			cell: (info) => info.getValue()?.toDateString(),
            
		}),
		columnHelper.accessor("createdAt", {
			header: "Created At",
			cell: (info) => info.getValue().toDateString()
		}),
		columnHelper.accessor("updatedAt", {
			header: "Updated At",
			cell: (info) => info.getValue().toDateString()
		}),
		columnHelper.accessor("hits", {
			header: "Hits"
		})
	];

	return (
		<div>
			<DefaultCard className="card">
				<div>
					<h3>Admin Users</h3>
					<h5>A list of all ecoToken admin users.</h5>
				</div>
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
