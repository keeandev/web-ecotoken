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
					username: input.username
				}
			});

			if (!user || !(await verify(user.password, input.password)))
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Username or password is incorrect."
				});

			const currentDate = new Date(Date.now());
			const expireDate = currentDate;
			expireDate.setDate(expireDate.getDate() + 180);

			await ctx.prisma.adminUser.update({
				where: {
					username: input.username
				},
				data: {
					hits: user.hits + 1,
					lastLogin: currentDate,
					expireAt: expireDate
				}
			});

			const firstSite = await ctx.prisma.site.findFirst();
			ctx.adminSession.user = {
				id: user.adminID,
				ipAddress:
					process.env.NODE_ENV === "production"
						? ctx.req.connection.remoteAddress ?? ""
						: undefined,
				lastSite: firstSite?.siteID
			};
			await ctx.adminSession.save();
		}),
	logout: adminAuthedProcedure.query(async ({ ctx }) => {
		await ctx.adminSession.destroy();
		return 200;
	})
});
