import Form from "@/components/admin-users/form";
import { trpc } from "@/utils/trpc";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const AdminUserEdit = () => {
	const router = useRouter();
	const context = trpc.useContext();
	const { id } = router.query;
	const { data: user } = trpc.adminUsers.get.useQuery(
		{
			id: id as string
		},
		{
			refetchOnWindowFocus: false,
			enabled: !!id
		}
	);

	const { mutate, isLoading } = trpc.adminUsers.update.useMutation({
		onSuccess: async () => {
			await context.adminUsers.invalidate();
			router.push("/admin-users");
			toast.success("Admin user has been edited.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});

	const { mutate: deleteMutate } = trpc.adminUsers.delete.useMutation({
		onSuccess: async () => {
			await context.adminUsers.invalidate();
			router.push("/admin-users");
			toast.success("Admin user has been deleted.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});
	return (
		<div className="space-y-4">
			<div>
				<CardTitle>Edit User</CardTitle>
				<CardDescription>
					Update a user in the database.
				</CardDescription>
			</div>
			<Form
				loading={isLoading}
				{...(user && { user })}
				onSave={async (adminUser) =>
					await mutate({
						...adminUser,
						id: id as string
					})
				}
				onDelete={async () =>
					await deleteMutate({
						id: id as string
					})
				}
			/>
		</div>
	);
};

export default AdminUserEdit;
