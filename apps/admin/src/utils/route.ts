export const getRouteName = (route: string) => {
	let routeName = route === "/" ? "Dashboard" : undefined;
	if (route !== "/") {
		const strippedDynamicRoutes = route.split("[")[0];
		if (strippedDynamicRoutes) {
			const pathNestedRoutes = strippedDynamicRoutes
				.split("/")
				.filter((v) => v.length > 0);
			routeName = pathNestedRoutes[pathNestedRoutes.length - 1];
		}
	}
	return routeName?.replaceAll("-", " ") ?? "";
};

// export const parseRouteData = (router: NextRouter) => {
// 	const placeholderRouterPieces = router.route.split("/");
// 	let dynamicUrls = placeholderRouterPieces.filter((urlPiece) =>
// 		urlPiece.includes("[")
// 	);
// 	dynamicUrls = dynamicUrls.map((dynamicUrl) =>
// 		dynamicUrl.replace("[", "").replace("]", "")
// 	);

// 	dynamicUrls = dynamicUrls.map((dynamicUrl) => {
// 		if (dynamicUrl === "id") {
// 			return (
// 				trpc.websites.get.useQuery({
// 					siteID: router.query[dynamicUrl] as string
// 				}).data?.siteName ?? dynamicUrl
// 			);
// 		} else return dynamicUrl;
// 	});

// 	return dynamicUrls.join(", ");
// };
