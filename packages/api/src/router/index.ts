import { router } from "../trpc";
import { adminUsersRouter } from "./admin/admin-users";
import { userAuthRouter } from "./user/user-auth";
import { adminAuthRouter } from "./admin/admin-auth";
import { projectsRouter, locationsRouter } from "./eco";
import { usersRouter } from "./user/users";
import { websiteRouter } from "./websites/websites";
import { rolesRouter } from "./roles/roles";
import { permissionsRouter } from "./permissions/permissions";
import { nftBuilderRouter } from "./nft-builder/nft-builder";
import { nftSeriesRouter } from "./nft-series";
import { ordersRouter } from "./eco/eco-orders";

export const appRouter = router({
	adminAuth: adminAuthRouter,
	adminUsers: adminUsersRouter,
	ecoProjects: projectsRouter,
	ecoLocations: locationsRouter,
	ecoOrders: ordersRouter,
	websites: websiteRouter,
	userAuth: userAuthRouter,
	permissions: permissionsRouter,
	users: usersRouter,
	roles: rolesRouter,
	nftBuilder: nftBuilderRouter,
	nftSeries: nftSeriesRouter
});

export type AppRouter = typeof appRouter;
