import Form from "@/components/admin-users/form";
import { trpc } from "@/utils/trpc";
import { CardTitle, CardDescription } from "@ecotoken/ui/components/Card";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const AdminUserCreate = () => {
	const router = useRouter();
	const context = trpc.useContext();
	const { mutate, isLoading } = trpc.adminUsers.create.useMutation({
		onSuccess: async () => {
			await context.adminUsers.invalidate();
			router.push("/admin-users");
			toast.success("Admin user has been created.");
		},
		onError(e) {
			toast.error(e.message);
		}
	});
	return (
		<div className="space-y-4">
			<div>
				<CardTitle>Create User</CardTitle>
				<CardDescription>
					Create a user in the database.
				</CardDescription>
			</div>
			<Form
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
