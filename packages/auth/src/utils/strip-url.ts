export const stripUrl = (url?: string) => {
	return url
		?.replace("https://", "")
		.replace("http://", "")
		.split("/")[0]
		?.trim();
};
