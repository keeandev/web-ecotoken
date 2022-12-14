import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";

const Logout: NextPageWithLayout = () => {
	const router = useRouter();
	trpc.adminAuth.logout.useQuery(undefined, {
		onSuccess() {
			router.replace("/login");
		}
	});
	return <></>;
};

Logout.getLayout = (page) => <>{page}</>;
export default Logout;
