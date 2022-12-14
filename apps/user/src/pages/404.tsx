import Error from "next/error";
import type { ReactElement } from "react";

const Custom404 = () => {
	return <Error statusCode={404} />;
};

Custom404.getLayout = (page: ReactElement) => {
	return <>{page}</>;
};

export default Custom404;
