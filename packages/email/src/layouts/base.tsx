import logo from "@ecotoken/ui/assets/brand/logo.png";
import { getBaseUrl } from "@ecotoken/user/src/utils/trpc";
import React from "react";

export const BaseEmailLayout: React.FC<React.ComponentProps<"div">> = ({
	children,
	...props
}) => (
	<div {...props}>
		<nav>
			<a href="https://eco-token.io">
				<img src={`${getBaseUrl()}${logo.src}`} alt="ecoToken Logo" />
			</a>
		</nav>
		{children}
	</div>
);
