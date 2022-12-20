import { router } from "../trpc";
import { userAuthRouter, adminAuthRouter } from "./auth";
import { projectsRouter } from "./projects";

export const appRouter = router({
	projects: projectsRouter,
	userAuth: userAuthRouter,
	adminAuth: adminAuthRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
