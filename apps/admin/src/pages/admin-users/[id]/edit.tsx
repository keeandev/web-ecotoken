import { useRouter } from "next/router";

const AdminUserEdit = () => {
	const router = useRouter();
	const { id } = router.query;
	return <>{id}</>;
};

export default AdminUserEdit;
