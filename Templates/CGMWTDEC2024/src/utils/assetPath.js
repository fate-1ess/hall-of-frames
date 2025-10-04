const computeAssetBase = () => {
	if (typeof window !== "undefined") {
		const { pathname } = window.location;
		const directory = pathname.replace(/[^/]*$/, "");
		if (!directory) {
			return "/";
		}
		return directory.endsWith("/") ? directory : `${directory}/`;
	}

	const fallback = import.meta.env.BASE_URL || "/";
	if (fallback === "." || fallback === "./") {
		return "/";
	}
	return fallback.endsWith("/") ? fallback : `${fallback}/`;
};

const assetBase = computeAssetBase();

export const withBase = (relativePath = "") => {
	const normalized = relativePath.replace(/^\/+/g, "");
	if (!normalized) {
		return assetBase;
	}
	return `${assetBase}${normalized}`;
};

export default withBase;
