export const transformEnum = (enumValue: string) => {
	const split = enumValue.split("_");
	return split
		.map(
			(piece) =>
				piece.charAt(0).toUpperCase() + piece.substring(1).toLowerCase()
		)
		.join(" ");
};