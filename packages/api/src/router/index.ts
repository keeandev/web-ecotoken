import { router } from "../trpc";
import { adminUsersRouter } from "./admin/admin-users";
import { userAuthRouter } from "./user/user-auth";
import { adminAuthRouter } from "./admin/admin-auth";
import { projectsRouter } from "./ecoprojects/ecoprojects";
import { usersRouter } from "./user/users";

export const appRouter = router({
	adminAuth: adminAuthRouter,
	adminUsers: adminUsersRouter,
	ecoprojects: projectsRouter,
	userAuth: userAuthRouter,
	users: usersRouter
});

export type AppRouter = typeof appRouter;
