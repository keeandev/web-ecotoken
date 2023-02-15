import { PrismaClient, type Prisma } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

type ProjectImages = {
	listImage: string;
	head1: string;
	head2: string;
	head3: string;
};

type CreateRoleOperation = Omit<
	Prisma.RoleCreateInput,
	"permissions" | "sites"
> & {
	permissions?: string[];
	sites?: string[];
};

type CreateLocationOperation = Omit<Prisma.EcoLocationCreateInput, "site"> & {
	site: string;
};

type CreateProjectOperation = Omit<
	Prisma.EcoProjectCreateInput,
	"site" | "siteID" | "benefits" | "images" | "location" | "locationID"
> & {
	site: string;
	location: string;
	benefits: string[];
	images: Partial<ProjectImages>;
};

const rolesToCreate: CreateRoleOperation[] = [
	{
		role: "Admin",
		domain: "ADMIN",
		permissions: ["ROLES_CONFIG", "PERMISSION_CONFIG"],
		sites: ["ecoToken", "ecoToken Admin"]
	},
	{
		role: "Producer",
		domain: "USER",
		permissions: [],
		sites: ["ecoToken", "ecoToken Admin"]
	},
	{
		role: "Verifier",
		domain: "USER",
		permissions: [],
		sites: ["ecoToken", "ecoToken Admin"]
	},
	{
		role: "User",
		domain: "USER",
		permissions: [],
		sites: ["ecoToken"]
	}
];

const locationsToCreate: CreateLocationOperation[] = [
	{
		location: "Leduc",
		cn: "CA",
		st: "AB",
		site: "ecoToken"
	},
	{
		location: "Calgary",
		cn: "CA",
		st: "AB",
		site: "ecoToken"
	},
	{
		location: "Pincher Creek",
		cn: "CA",
		st: "AB",
		site: "ecoToken"
	},
	{
		location: "Howe Sound",
		cn: "CA",
		st: "BC",
		site: "ecoToken"
	}
];

const projectsToCreate: CreateProjectOperation[] = [
	{
		ecoTitle: "Dairy Manure Remediation in Pincher Creek",
		shortTitle: "Dairy Manure Remediation",
		ecoUrl: "DairyManure001",
		intro: "Manure treatment to tackle Greenhouse Gas, manure odor and groundwater contamination.",
		location: "Leduc, Alberta, Canada",
		benefits: [
			"Animal Welfare",
			"Ecosystem Health",
			"Greenhouse Gas",
			"Groundwater Quality"
		],
		project: "",
		overview: "",
		images: {
			listImage: "ecoproject/head_3m_Lagoon01.jpg",
			head1: "ecoproject/head_dairy_cows01.jpg",
			head2: "ecoproject/head_manure_01.jpg"
		},
		site: "ecoToken",
		status: "OPEN",
		ecoType: "CARBON_CREDIT",
		ecoNftID: 0,
		fundAmount: 80000,
		fundRecieved: 2000,
		payback: "12-48 Months",
		return: 1.5,
		dateStart: new Date("2022-05-01"),
		dateEnd: new Date("2022-09-30")
	},
	{
		ecoTitle: "Green Waste Treatment in Calgary Alberta",
		shortTitle: "Green Waste Treatment",
		ecoUrl: "Organics001",
		intro: "Green waste in landfills generates large quantities of methane. This project will render it into a plant nutrient, while reducing greenhouse gasses and leading to groundwater improvement.",
		location: "Calgary, Alberta, Canada",
		benefits: [
			"Ecosystem Health",
			"Greenhouse Gas",
			"Groundwater Quality",
			"Surface Water"
		],
		project: "",
		overview: `Reduction in methane gas\n
        Reduced organics to landfill\n
        Creation of plant nutrient\n
        Elimination of odor`,
		images: {
			listImage: "ecoproject/head_harvest_recyling.jpg",
			head1: "ecoproject/head_harvest_food01.jpg",
			head2: "ecoproject/head_harvest_frontloader.jpg"
		},
		site: "ecoToken",
		status: "OPEN",
		ecoType: "CARBON_CREDIT",
		ecoNftID: 0,
		fundAmount: 75000,
		fundRecieved: 2500,
		payback: "1-4 Years",
		return: 1.25,
		dateStart: new Date("2022-04-01"),
		dateEnd: new Date("2022-12-31")
	},
	{
		ecoTitle: "Groundwater Treatment in Pincher Creek Alberta",
		shortTitle: "Groundwater Treatment",
		ecoUrl: "Groundwater001",
		intro: "Excessive fecal matter from cattle herds can affect local groundwater, making it unhealthy for the cattle and other animals.",
		location: "Pincher Creek, Alberta, Canada",
		benefits: [
			"Animal Welfare",
			"Ecosystem Health",
			"Greenhouse Gas",
			"Groundwater Quality",
			"Surface Water"
		],
		project: "",
		overview: `Improved surface water quality\n
        Improved health for livestock\n
        Healthy water for downstream interactions`,
		images: {
			listImage: "ecoproject/head_mitchell_pond.jpg",
			head1: "ecoproject/head_mitchell_cows01.jpg",
			head2: "ecoproject/head_mitchell_cows02.jpg"
		},
		site: "ecoToken",
		status: "OPEN",
		ecoType: "CARBON_CREDIT",
		ecoNftID: 0,
		fundAmount: 30000,
		fundRecieved: 1000,
		payback: "1-4 Years",
		return: 0.25,
		dateStart: new Date("2022-11-16"),
		dateEnd: new Date("2022-09-30")
	},
	{
		ecoTitle: "Ocean Wise - Seaforestation in Howe Sound British Columbia",
		shortTitle: "Ocean Wise - Seaforestation",
		ecoUrl: "Oceanwise001",
		intro: "Kelp forests are rich habitat for marine life, including commercially important fish and invertebrates. Kelp naturally capture carbon in large volumes some of which gets trapped in the ocean floor for centuries.",
		location: "Howe Sound, British Columbia, Canada",
		benefits: ["Ecosystem Health", "Greenhouse Gas", "Ocean Health"],
		project: "",
		overview: `5,000ha of kelp will be restored and cultivated\n
        14,600 tonnes of CO2 stored\n
        Restore marine habitat\n
        Combat ocean acidification\n
        Creating economic opportunities for Indigenous and coastal communities`,
		images: {
			listImage: "ecoproject/head_oceanwise_kelp01.jpg",
			head1: "ecoproject/head_oceanwise_kelp02.jpg",
			head2: "ecoproject/head_oceanwise_kelp04.jpg"
		},
		site: "ecoToken",
		status: "PENDING",
		ecoType: "WATER_CREDIT",
		ecoNftID: 0,
		fundAmount: 70000,
		fundRecieved: 8000,
		payback: "24 Months",
		return: 1.5,
		dateStart: new Date("2022-09-07"),
		dateEnd: new Date("2023-12-24")
	}
];

const main = async () => {
	// wipe old data,
	console.log("Deleting data...");
	await prisma.ecoProject.deleteMany();
	await prisma.ecoBenefit.deleteMany();
	await prisma.ecoLocation.deleteMany();
	await prisma.user.deleteMany();
	await prisma.adminUser.deleteMany();
	await prisma.site.deleteMany();
	await prisma.permission.deleteMany();
	await prisma.role.deleteMany();
	console.log("Deleted data.");

	await prisma.$queryRaw`ALTER TABLE eco_location AUTO_INCREMENT = 1`;
	console.log("Reset auto increments.");

	// reseed
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

	await prisma.ecoBenefit.createMany({
		data: [
			{
				bftTitle: "Animal Welfare",
				benefit:
					"Modern farming techniques can negatively impact the environment. This project is designed to bring health to both the environment and as a result the animals that interact with it."
			},
			{
				bftTitle: "Surface Water",
				benefit:
					"Small creeks and river are best suited for sustaining small migrating herds rather than large herds that remain in one place."
			},
			{
				bftTitle: "Ecosystem Health",
				benefit:
					"A healthy ecosystem is one where natural processes are in balance functioning optimally. It has the resilency to respond to changes environment."
			},
			{
				bftTitle: "Ocean Health",
				benefit: ""
			},
			{
				bftTitle: "Greenhouse Gas",
				benefit:
					"This project is designed to reduce the amount of greenhouse gas that is entering the atmosphere."
			},
			{
				bftTitle: "Groundwater Quality",
				benefit:
					"Waste from animal feces and refuse in landfills can seep into the groundwater. This project is designed to reduce the contamination of the water supply."
			}
		]
	});
	console.log("Created ecoBenefits.");

	for (const { site, ...remaining } of locationsToCreate) {
		const selectedSite = await prisma.site.findFirst({
			where: {
				siteName: site
			}
		});
		await prisma.ecoLocation.create({
			data: {
				...remaining,
				siteID: selectedSite?.siteID!
			}
		});
	}
	console.log("Created ecoLocations.");

	for (const {
		site,
		location,
		benefits,
		images,
		...project
	} of projectsToCreate) {
		const selectedSite = await prisma.site.findFirst({
			where: {
				siteName: site
			}
		});
		const selectedLocation = await prisma.ecoLocation.findFirst({
			where: {
				location
			}
		});
		const selectedBenefits = await prisma.ecoBenefit.findMany({
			where: {
				OR: benefits?.map((benefit) => ({
					benefit
				}))
			}
		});
		await prisma.ecoProject.create({
			data: {
				...project,
				images: JSON.stringify(images),
				locationID: selectedLocation?.locationID!,
				siteID: selectedSite?.siteID!,
				benefits: {
					connect: selectedBenefits?.map(({ benefitID }) => ({
						benefitID
					}))
				}
			}
		});
	}
	console.log("Created ecoProjects.");

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

	for (const { permissions, sites, ...role } of rolesToCreate) {
		const selectedSites = await prisma.site.findMany({
			where: {
				OR: sites?.map((site) => ({
					siteID: site
				}))
			}
		});
		await prisma.role.create({
			data: {
				...role,
				permissions: {
					connect: permissions?.map((permission) => ({
						permission
					}))
				},
				sites: {
					connect: selectedSites?.map(({ siteID }) => ({
						siteID
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
