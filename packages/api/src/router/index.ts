import { router } from "../trpc";
import { adminAuthRouter } from "./admin/admin-auth";
import { adminUsersRouter } from "./admin/admin-users";
import { coinPriceRouter } from "./crypto";
import { locationsRouter, projectsRouter } from "./eco";
import { ordersRouter } from "./eco/eco-orders";
import { nftBuilderRouter } from "./nft-builder";
import { nftSeriesRouter } from "./nft-series";
import { permissionsRouter } from "./permissions/permissions";
import { rolesRouter } from "./roles/roles";
import { spacesRouter } from "./spaces";
import { userAuthRouter } from "./user/user-auth";
import { usersRouter } from "./user/users";
import { creditRouter } from "./web3/credit";
import { websiteRouter } from "./websites/websites";

export const appRouter = router({
    spaces: spacesRouter,
    adminAuth: adminAuthRouter,
    adminUsers: adminUsersRouter,
    users: usersRouter,
    ecoProjects: projectsRouter,
    ecoLocations: locationsRouter,
    ecoOrders: ordersRouter,
    websites: websiteRouter,
    userAuth: userAuthRouter,
    permissions: permissionsRouter,
    roles: rolesRouter,
    nftBuilder: nftBuilderRouter,
    nftSeries: nftSeriesRouter,
    coinPrice: coinPriceRouter,
    credit: creditRouter,
});

export type AppRouter = typeof appRouter;
