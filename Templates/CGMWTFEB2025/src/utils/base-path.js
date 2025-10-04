const externalPattern = /^(?:[a-z0-9+.-]+:|\/\/|data:)/i;

const sanitizeBase = (value) => {
	if (!value || value === "." || value === "./" || value === "/") {
		return "";
	}

	return value.replace(/^\/+|\/+$/g, "");
};

const staticBase = sanitizeBase(
	process.env.NEXT_PUBLIC_BASE_PATH ??
		process.env.NEXT_PUBLIC_ASSET_PREFIX ??
		process.env.NEXT_BASE_PATH ??
		process.env.NEXT_ASSET_PREFIX ??
		""
);

const stripSlashes = (value = "") =>
	value.replace(/^(\.\/)+/, "").replace(/^\/+|\/+$/g, "");

const splitTarget = (input = "") => {
	let path = input;
	let hash = "";
	let query = "";

	const hashIndex = path.indexOf("#");
	if (hashIndex !== -1) {
		hash = path.slice(hashIndex);
		path = path.slice(0, hashIndex);
	}

	const queryIndex = path.indexOf("?");
	if (queryIndex !== -1) {
		query = path.slice(queryIndex);
		path = path.slice(0, queryIndex);
	}

	return { path, query, hash };
};

const getRuntimeBase = () => {
	if (typeof window !== "undefined") {
		const data = window.__NEXT_DATA__;
		if (data?.assetPrefix) {
			return sanitizeBase(data.assetPrefix);
		}
		if (data?.basePath) {
			return sanitizeBase(data.basePath);
		}
	}

	return staticBase;
};

const combinePaths = (base, target) => {
	const segments = [];
	const cleanBase = stripSlashes(base);
	if (cleanBase) segments.push(cleanBase);
	const cleanTarget = stripSlashes(target);
	if (cleanTarget) segments.push(cleanTarget);
	return segments.join("/");
};

const buildUrl = (target, options = {}) => {
	const { trailingSlash } = options;
	const { path, query, hash } = splitTarget(target);
	const base = getRuntimeBase();
	const combined = combinePaths(base, path);
	let pathname = combined ? `/${combined}` : "/";
	const hasExtension = /\.[^/]+$/.test(path);
	const shouldAddSlash =
		typeof trailingSlash === "boolean"
			? trailingSlash
			: (!path || (!hasExtension && !pathname.endsWith("/")));

	if (shouldAddSlash && !pathname.endsWith("/")) {
		pathname += "/";
	}

	return `${pathname}${query}${hash}`;
};

export const resolveAssetPath = (path) => {
	if (!path || externalPattern.test(path)) {
		return path;
	}

	return buildUrl(path, { trailingSlash: false });
};

export const resolvePagePath = (path) => {
	const target = !path || path === "./" || path === "." ? "/" : path;
	const { path: rawPath } = splitTarget(target);
	const hasExtension = /\.[^/]+$/.test(rawPath);
	return buildUrl(target, { trailingSlash: !hasExtension });
};

export const resolveAnchorHref = (path) => {
	if (!path) return path;

	if (path.startsWith("#") || externalPattern.test(path)) {
		return path;
	}

	return resolvePagePath(path);
};
