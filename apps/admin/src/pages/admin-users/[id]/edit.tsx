import AdminUserForm from "@/components/admin-users/form";
import { trpc } from "@/utils/trpc";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import { useRouter } from "next/router";

const AdminUserEdit = () => {
	const router = useRouter();
	const { id } = router.query;
	const { data } = trpc.adminUsers.get.useQuery({
		id: id as string
	}, {
        async onSuccess() {

        }
    });
	const { mutate, isLoading } = trpc.adminUsers.update.useMutation();
	return (
		<div className="space-y-4">
			<div>
				<CardTitle>Edit User</CardTitle>
				<CardDescription>
					Update a user in the database.
				</CardDescription>
			</div>
			<AdminUserForm
				loading={isLoading}
				user={data ?? undefined}
				onSave={async (adminUser) =>
					await mutate({
						...adminUser,
						id: id as string
					})
				}
			/>
		</div>
	);
};

export default AdminUserEdit;
