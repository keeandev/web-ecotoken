import React from "react";
import ReactDOMServer from "react-dom/server";
import mailwindTransformer from "../transformer";
import EmailVerificationTemplate, {
	EmailVerificationTemplateProps
} from "./email-verification";

// export * as EmailVerificationTemplate from "./email-verification";

export const renderTemplate = async (
	/** Component you want to render */
	template: React.ReactElement
) => {
	return await mailwindTransformer(
		ReactDOMServer.renderToStaticMarkup(template),
		{
			preOptimizedCSSFile: "../../packages/email/dist/tailwind.email.css",
			reset: false
		}
	);
};

export const renderEmailVerificationTemplate = async (
	props: EmailVerificationTemplateProps
) => renderTemplate(React.createElement(EmailVerificationTemplate, props));
