import EmailVerificationCard from "@/components/dashboard/email-verification-card";
import { type NextPageWithLayout } from "../_app";

const EmailVerificationNotification: NextPageWithLayout = () => {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <EmailVerificationCard />
        </div>
    );
};

EmailVerificationNotification.getLayout = (page) => <>{page}</>;

export default EmailVerificationNotification;
