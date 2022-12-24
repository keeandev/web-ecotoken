import AdminUserForm from "@/components/admin-users/form";
import { trpc } from "@/utils/trpc";
import { CardTitle, CardDescription } from "@ecotoken/ui/components/Card";
import { useRouter } from "next/router";

const AdminUserCreate = () => {
	const router = useRouter();
	const { mutate, isLoading } = trpc.adminUsers.create.useMutation({
		onSuccess: () => router.push("/admin-users")
	});
	return (
		<div className="space-y-4">
			<div>
				<CardTitle>Create User</CardTitle>
				<CardDescription>
					Create a user in the database.
				</CardDescription>
			</div>
			<AdminUserForm
				new
				loading={isLoading}
				onCreate={async (adminUser) => {
					await mutate({
						...adminUser
					});
				}}
			/>
		</div>
	);
};

export default AdminUserCreate;
