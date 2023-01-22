import { PrismaClient, type Prisma } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

type CreateRoleOperation = Omit<Prisma.RoleCreateInput, "permissions"> & {
	permissions?: string[];
};

const rolesToCreate: CreateRoleOperation[] = [
	{
		role: "Admin",
		domain: "ADMIN",
		permissions: ["ROLES_CONFIG", "PERMISSION_CONFIG"]
	},
	{
		role: "User",
		domain: "USER",
		permissions: []
	}
];

const main = async () => {
	// wipe old data,
	console.log("Deleting data...");
	await prisma.ecoProject.deleteMany();
	await prisma.user.deleteMany();
	await prisma.adminUser.deleteMany();
	await prisma.site.deleteMany();
	await prisma.permission.deleteMany();
	await prisma.role.deleteMany();
	console.log("Deleted data.");

	// reseed
	await prisma.ecoProject.createMany({
		data: [
			{
				title: "Dairy Manure Remediation",
				url: "DairyManure001",
				fundAmount: 85000,
				fundRecieved: 16100,
				location: "Leduc, Alberta, Canada",
				status: "OPEN",
				images: JSON.stringify({
					listImage: "ecoproject/head_dairy_cows01.jpg",
					head1: "ecoproject/head_3m_Lagoon01.jpg",
					head2: "ecoproject/head_dairy_cows01.jpg",
					head3: "ecoproject/head_manure_01.jpg"
				}),
				outcome: "Design and test remediation technology",
				ord: 0
			},
			{
				title: "Dairy Manure Remediation",
				url: "DairyManure002",
				fundAmount: 28000,
				fundRecieved: 28000,
				location: "Deroche, British Columbia, Canada",
				status: "OPEN",
				images: JSON.stringify({
					listImage: "ecoproject/head_manure_01.jpg",
					head1: "ecoproject/head_harvest_recyling.jpg",
					head2: "ecoproject/head_harvest_food01.jpg",
					head3: "ecoproject/head_harvest_frontloader.jpg"
				}),
				outcome: "Establish Protocols for GHGe Reduction",
				ord: 1
			},
			{
				title: "Green Waste Treatment",
				url: "Organics001",
				fundAmount: 125000,
				fundRecieved: 125000,
				location: "Calgary, Alberta, Canada",
				status: "OPEN",
				images: JSON.stringify({
					listImage: "ecoproject/head_harvest_recyling.jpg",
					head1: "ecoproject/head_mitchell_pond.jpg",
					head2: "ecoproject/head_mitchell_cows01.jpg",
					head3: "ecoproject/head_mitchell_cows02.jpg"
				}),
				outcome: "Determine potential throughput of organic waste",
				ord: 2
			},
			{
				title: "Groundwater Treatment",
				url: "Groundwater001",
				fundAmount: 45000,
				fundRecieved: 100,
				location: "Pincher Creek, Alberta, Canada",
				status: "OPEN",
				images: JSON.stringify({
					listImage: "ecoproject/head_mitchell_pond.jpg"
				}),
				outcome: "Improved groundwater health for cattle",
				ord: 3
			},
			{
				title: "Ocean Wise - Seaforestation",
				url: "Oceanwise001",
				fundAmount: 85000,
				fundRecieved: 14000,
				location: "Howe Sound, British Columbia",
				status: "OPEN",
				images: JSON.stringify({
					listImage: "ecoproject/head_oceanwise_kelp01.jpg"
				}),
				outcome: "14,600 GHGe reduction over 5 years",
				ord: 4
			}
		]
	});
	console.log("Created projects.");
	await prisma.site.createMany({
		data: [
			{
				siteName: "ecoToken",
				legalName: "ecoToken System Inc.",
				devUrl: "localhost:3000",
				stageUrl: "smy.eco-token.io",
				prodUrl: "my.ecotoken.io"
			},
			{
				siteName: "ecoToken Admin",
				devUrl: "localhost:3001",
				stageUrl: "admin.eco-token.io",
				prodUrl: "admin.ecotoken.io"
			},
			{
				siteName: "ecoWarriors",
				devUrl: "localhost:3004",
				stageUrl: "stg.ecowarriors.com",
				prodUrl: "www.ecowarriors.com"
			}
		]
	});
	console.log("Created sites.");
	await prisma.permission.createMany({
		data: [
			{
				domain: "ADMIN",
				permission: "ADMIN_LEVEL01",
				description: "Admin can view basic admin data, minimal editing."
			},
			{
				domain: "ADMIN",
				permission: "ADMIN_LEVEL02",
				description:
					"Admin can view and edit low level administration components."
			},
			{
				domain: "ADMIN",
				permission: "ADMIN_LEVEL03",
				description:
					"Admin can view and edit medium level administration components."
			},
			{
				domain: "ADMIN",
				permission: "ADMIN_LEVEL04",
				description:
					"Admin can view and edit top level administration components, that are in Beta or Above."
			},
			{
				domain: "ADMIN",
				permission: "ADMIN_LEVEL05",
				description: "Developer level access to everything."
			},
			{
				domain: "ADMIN",
				permission: "ADMIN_USER_VIEW",
				description: "Can see current admin users."
			},
			{
				domain: "ADMIN",
				permission: "ADMIN_USER_EDIT",
				description: "Can add and edit admin users."
			},
			{
				domain: "ADMIN",
				permission: "USER_EDIT_FULL",
				description: "Admin can edit full user account."
			},
			{
				domain: "ADMIN",
				permission: "USER_EDIT_KYC",
				description: "Admin can edit KYC components of user account."
			},
			{
				domain: "ADMIN",
				permission: "USER_EDIT_PRODUCER",
				description:
					"Admin can edit Producer components of user account."
			},
			{
				domain: "ADMIN",
				permission: "PROJECT_VIEW",
				description: "Admin can view existing projects."
			},
			{
				domain: "ADMIN",
				permission: "PROJECT_EDIT",
				description: "Admin can add new and edit existing projects."
			},
			{
				domain: "ADMIN",
				permission: "PROJECT_ACCOUNTING",
				description:
					"Admin manage the money transfers between ecoToken and projects."
			},
			{
				domain: "ADMIN",
				permission: "ROLES_CONFIG",
				description: "Admin can create and manage roles."
			},
			{
				domain: "ADMIN",
				permission: "PERMISSION_CONFIG",
				description: "Admin can create and manage permissions."
			},
			{
				domain: "USER",
				permission: "USER_PARTNER",
				description: "User has been accepted as a Partner."
			},
			{
				domain: "USER",
				permission: "USER_PARTNER_APP",
				description: "User has applied to become a Partner."
			},
			{
				domain: "USER",
				permission: "USER_REGISTERED",
				description:
					"User has logged in after receiving email from Registration form."
			},
			{
				domain: "USER",
				permission: "USER_REWARDS",
				description:
					"User can manage ecoRewards (convert to ecoTokens and send to Wallet)."
			},
			{
				domain: "USER",
				permission: "USER_SUSPENDED",
				description: "User can view, no editing."
			},
			{
				domain: "USER",
				permission: "USER_VERIFIED",
				description:
					"User has full permission to access for planting, staking, claiming rewards, and managing accounts."
			}
		]
	});
	console.log("Created permissions.");
	for (const { permissions, ...role } of rolesToCreate) {
		await prisma.role.create({
			data: {
				...role,
				permissions: {
					connect: permissions?.map((permission) => ({
						permission
					}))
				}
			}
		});
	}
	console.log("Created roles.");
	const roles = await prisma.role.findMany();
	await prisma.adminUser.createMany({
		data: [
			{
				username: "Randalf",
				email: "randy@eco-token.io",
				firstName: "Randy",
				lastName: "Christie",
				password: await hash("password123"),
				roleID: roles.find((role) => role.role === "Admin")!.roleID
			},
			{
				username: "dingo",
				email: "keean@eco-token.io",
				firstName: "Ean",
				lastName: "Last",
				password: await hash("password123"),
				roleID: roles.find((role) => role.role === "Admin")!.roleID
			},
			{
				username: "dozata",
				email: "dozataio@gmail.com",
				firstName: "Graham",
				lastName: "Fleming",
				password: await hash("password123"),
				roleID: roles.find((role) => role.role === "Admin")!.roleID
			}
		]
	});
	console.log("Created admin users.");
};

main();
