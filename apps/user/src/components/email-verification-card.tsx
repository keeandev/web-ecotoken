import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";
import Spinner from "@ecotoken/ui/components/Spinner";
import { faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type EmailVerificationCardProps = {
	hasToken?: {
		loading: boolean;
		error?: string;
	};
};
const EmailVerificationCard: React.FC<EmailVerificationCardProps> = ({
	hasToken
}) => {
	return (
		<DefaultCard
			size="half"
			className="flex flex-col items-center justify-center space-y-2"
		>
			<FontAwesomeIcon
				icon={faEnvelopeOpen}
				size="3x"
				className="text-slate-600"
			/>
			{hasToken &&
				(hasToken.loading ? (
					<Spinner />
				) : (
					<div className="mx-auto w-full space-y-1 text-center">
						<CardTitle>Email Verification</CardTitle>
						<CardDescription>
							{hasToken.error
								? hasToken.error
								: "Your email has been successfully verified."}
						</CardDescription>
					</div>
				))}
		</DefaultCard>
	);
};

export default EmailVerificationCard;
