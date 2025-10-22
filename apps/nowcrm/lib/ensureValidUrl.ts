export const ensureValidUrl = (url: string): string => {
	if (!/^https?:\/\//i.test(url)) {
		return `https://${url}`;
	}
	return url;
};
