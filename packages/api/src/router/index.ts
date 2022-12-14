import { router } from "../trpc";
import { walletAuthRouter, adminAuthRouter } from "./auth";
import { projectsRouter } from "./projects";

export const appRouter = router({
	projects: projectsRouter,
	walletAuth: walletAuthRouter,
	adminAuth: adminAuthRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
