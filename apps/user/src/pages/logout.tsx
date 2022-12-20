import { useWeb3Auth } from "@/contexts/web3auth";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";

const Logout: NextPageWithLayout = () => {
	const router = useRouter();
	const web3auth = useWeb3Auth();
	trpc.userAuth.logout.useQuery(undefined, {
		async onSuccess() {
			await web3auth.logout();
			router.replace("/login");
		}
	});
	return <></>;
};

Logout.getLayout = (page) => <>{page}</>;
export default Logout;
