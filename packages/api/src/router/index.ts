import { router } from "../trpc";
import { authRouter } from "./auth";
import { projectsRouter } from "./projects";

export const appRouter = router({
	projects: projectsRouter,
	auth: authRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
