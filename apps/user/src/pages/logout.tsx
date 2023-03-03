import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { type NextPageWithLayout } from "./_app";

const Logout: NextPageWithLayout = () => {
	const router = useRouter();
	trpc.userAuth.logout.useQuery(undefined, {
		async onSuccess() {
			await router.replace("/login");
		}
	});
	return <></>;
};

Logout.getLayout = (page) => <>{page}</>;
export default Logout;
