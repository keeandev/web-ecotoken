import { publicProcedure, router, adminAuthedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { verify } from "argon2";
import { loginAdminUserSchema } from "../../schema/admin-user";

export const adminAuthRouter = router({
    login: publicProcedure
        .input(loginAdminUserSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.adminUser.findUnique({
                where: {
                    username: input.username,
                },
            });
            if (!user)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "A user could not be found.",
                });
            else if (!(await verify(user.password, input.password)))
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Username or password is incorrect.",
                });

            const currentDate = new Date(Date.now());
            const expireDate = currentDate;
            expireDate.setDate(expireDate.getDate() + 180);

            await ctx.prisma.adminUser.update({
                where: {
                    username: input.username,
                },
                data: {
                    hits: user.hits + 1,
                    lastLogin: currentDate,
                    expireAt: expireDate,
                },
            });

            const firstSite = await ctx.prisma.site.findFirst();
            ctx.session!.user = {
                type: "admin",
                id: user.adminID,
                ipAddress:
                    process.env.NODE_ENV === "production"
                        ? ctx.req.connection.remoteAddress ?? ""
                        : undefined,
                selectedSite: firstSite?.siteID,
            };
            console.log("session", ctx.session);
            console.log("redeploy")
            await ctx.session!.save();
        }),
    logout: adminAuthedProcedure.query(async ({ ctx }) => {
        ctx.session.destroy();
        return 200;
    }),
});
