/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { adminAuthRouter } from "./router/admin/admin-auth";
import { adminUsersRouter } from "./router/admin/admin-users";
import { creditRouter } from "./router/credit";
import { locationsRouter, ordersRouter, projectsRouter } from "./router/eco";
import { nftBuilderRouter } from "./router/nft-builder";
import { nftSeriesRouter } from "./router/nft-series";
import { permissionsRouter } from "./router/permissions";
import { rolesRouter } from "./router/roles";
import { spacesRouter } from "./router/spaces";
import { userAuthRouter } from "./router/user/user-auth";
import { usersRouter } from "./router/user/users";
import { websiteRouter } from "./router/websites";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
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
    credit: creditRouter,
});

export type AppRouter = typeof appRouter;
