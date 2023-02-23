import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Website = () => {
	const router = useRouter();
	const context = trpc.useContext();
	const { mutateAsync } = trpc.websites.updateSelectedSite.useMutation({
		onSuccess: () => context.websites.getSelectedSite.invalidate()
	});
	const { data: selectedSite } = trpc.websites.getSelectedSite.useQuery();

	useEffect(() => {
		const asyncFunction = async () => {
			let { id } = router.query;
			if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
			if (id && id !== selectedSite) await mutateAsync({ siteID: id });
		};
		asyncFunction();
	}, []);

	return <div>{router.query.id}</div>;
};

export default Website;
