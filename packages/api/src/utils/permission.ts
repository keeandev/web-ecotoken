import { Permission } from "@ecotoken/db";

export const hasPermission = (
	permissions: Permission[],
	roles: string | string[]
) => {
	if (permissions.length === 0) return true;
	if (typeof roles === "string")
		return permissions.find((permission) =>
			roles.includes(permission.permission)
		);
	else
		return roles.every((identifer) =>
			permissions
				.map((permission) => permission.permission)
				.includes(identifer)
		);
};
