import { router } from "../trpc";
import { userAuthRouter, adminAuthRouter } from "./auth";
import { projectsRouter } from "./projects";
import { usersRouter } from "./users";

export const appRouter = router({
	projects: projectsRouter,
	userAuth: userAuthRouter,
	adminAuth: adminAuthRouter,
	users: usersRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
