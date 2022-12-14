import type { NextPageContext } from "next";
import Error, { type ErrorProps } from "next/error";
import type { ReactElement } from "react";

function CustomError({ statusCode }: ErrorProps) {
	return <Error statusCode={statusCode} />;
}

CustomError.getInitialProps = ({ res, err }: NextPageContext) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};

CustomError.getLayout = (page: ReactElement) => {
	return <>{page}</>;
};

export default CustomError;
