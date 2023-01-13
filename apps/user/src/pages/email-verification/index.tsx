import EmailVerificationCard from "@/components/email-verification-card";
import { NextPageWithLayout } from "../_app";

const EmailVerificationNotification: NextPageWithLayout = () => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<EmailVerificationCard />
		</div>
	);
};

EmailVerificationNotification.getLayout = (page) => <>{page}</>;

export default EmailVerificationNotification;
