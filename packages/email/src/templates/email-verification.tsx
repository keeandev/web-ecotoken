import { BaseEmailLayout } from "../layouts/base";

export type EmailVerificationTemplateProps = {
	link: string;
};

const EmailVerificationTemplate: React.FC<EmailVerificationTemplateProps> = ({
	link
}) => (
	<BaseEmailLayout>
		<h1 className="mb-2">Verify your email address</h1>
		<h3 className="mb-2">
			To continue setting up your ecoToken account, please verify your
			email address.
		</h3>
		<a href={link}>Verify email address</a>
	</BaseEmailLayout>
);

export default EmailVerificationTemplate;
