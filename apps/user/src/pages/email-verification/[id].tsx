import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import EmailVerificationCard from "@/components/email-verification-card";

const EmailVerification: NextPageWithLayout = () => {
	const router = useRouter();
	let { id } = router.query;
	if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
	const { error, isLoading } = trpc.userAuth.emailVerification.useQuery(
		{
			token: id as string
		},
		{
			enabled: !!id,
			refetchOnWindowFocus: false
		}
	);

	return (
		<div className="flex h-full w-full items-center justify-center">
			<EmailVerificationCard
				hasToken={{
					loading: isLoading,
					error: error?.message
				}}
			/>
		</div>
	);
};

EmailVerification.getLayout = (page) => <>{page}</>;

export default EmailVerification;
