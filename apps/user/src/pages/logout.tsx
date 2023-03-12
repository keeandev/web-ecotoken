import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";

import { type NextPageWithLayout } from "./_app";

const Logout: NextPageWithLayout = () => {
    const router = useRouter();
    trpc.userAuth.logout.useQuery(undefined, {
        async onSuccess() {
            await router.replace("/");
        },
    });
    return <></>;
};

Logout.getLayout = (page) => <>{page}</>;
export default Logout;
