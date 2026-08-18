const API_BASE = "https://api-apk.aimrbods.workers.dev";

async function request(path) {

	const response = await fetch(
		`${API_BASE}${path}`,
		{
			headers: {
				"accept": "application/json"
			}
		}
	);

	if (!response.ok) {
		throw new Error(
			`API request failed: ${response.status}`
		);
	}

	return response.json();
}


export async function getApps() {

	const data = await request("/api/apps");

	if (!data?.success) {
		return [];
	}

	return Array.isArray(data.apps)
		? data.apps
		: [];
}


export async function getApp(slug) {

	if (!slug) {
		return null;
	}

	const apps = await getApps();

	return apps.find(
		app =>
			String(app.slug || "")
				.toLowerCase() ===
			String(slug)
				.toLowerCase()
	) || null;
}
