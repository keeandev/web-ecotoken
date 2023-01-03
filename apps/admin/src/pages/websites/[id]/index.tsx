import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Website = () => {
	const router = useRouter();
	const { mutateAsync } = trpc.websites.updateCurrent.useMutation();

	useEffect(() => {
		const asyncFunction = async () => {
			let { id } = router.query;
			if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
			if (id) await mutateAsync({ siteID: id });
		};
		asyncFunction();
	}, [mutateAsync, router.query]);

	return <div>{router.query.id}</div>;
};

export default Website;
