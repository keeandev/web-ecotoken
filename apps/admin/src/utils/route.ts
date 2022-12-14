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
	return routeName ?? "";
};
