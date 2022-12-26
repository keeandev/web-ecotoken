import React from "react";
import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import Table from "@ecotoken/ui/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { trpc } from "@/utils/trpc";

import { AdminUser } from "@prisma/client";
import Button from "@ecotoken/ui/components/Button";
import { useRouter } from "next/router";

const AdminUsers = () => {
	const { data } = trpc.adminUsers.getAll.useInfiniteQuery(
		{},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);
	const router = useRouter();
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
			cell: (info) => info.getValue()?.toDateString()
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
			<DefaultCard className="space-y-4">
				<div className="flex w-full">
					<div className="flex flex-col">
						<CardTitle>Admin Users</CardTitle>
						<CardDescription>
							A list of all ecoToken admin users.
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