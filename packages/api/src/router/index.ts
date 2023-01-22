import { router } from "../trpc";
import { adminUsersRouter } from "./admin/admin-users";
import { userAuthRouter } from "./user/user-auth";
import { adminAuthRouter } from "./admin/admin-auth";
import { projectsRouter } from "./ecoprojects/ecoprojects";
import { usersRouter } from "./user/users";
import { websiteRouter } from "./websites/websites";
import { rolesRouter } from "./roles/roles";
import { permissionsRouter } from "./permissions/permissions";

export const appRouter = router({
	adminAuth: adminAuthRouter,
	adminUsers: adminUsersRouter,
	ecoprojects: projectsRouter,
	websites: websiteRouter,
	userAuth: userAuthRouter,
	users: usersRouter,
	roles: rolesRouter,
	permissions: permissionsRouter
});

export type AppRouter = typeof appRouter;
