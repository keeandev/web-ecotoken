import UserCreateForm from "@/components/users/create-form";
import { trpc } from "@/utils/trpc";

const CreateUser = () => {
	const { mutateAsync, isLoading } = trpc.users.create.useMutation();
	return (
		<UserCreateForm
			loading={isLoading}
			onCreate={async (data) => await mutateAsync({ ...data })}
		/>
	);
};

export default CreateUser;
