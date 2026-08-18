import { layout } from "../lib/render";

export async function onRequest(context) {

	const slug = context.params.slug;

	if (!slug) {
		return new Response("APK tidak ditemukan", {
			status: 404
		});
	}

	try {

		const apiUrl =
			"https://DOMAIN-WORKER-KAMU.workers.dev/api/app/" +
			encodeURIComponent(slug);

		const response = await fetch(apiUrl);

		if (!response.ok) {
			return new Response("APK tidak ditemukan", {
				status: 404
			});
		}

		const data = await response.json();

		if (!data.success || !data.app) {
			return new Response("APK tidak ditemukan", {
				status: 404
			});
		}

		const app = data.app;

		if (app.status !== "publish") {
			return new Response("APK tidak ditemukan", {
				status: 404
			});
		}

		const title =
			app.title ||
			app.name ||
			`${app.slug} APK`;

		const description =
			app.description ||
			`Download ${app.name || app.slug} APK gratis. Informasi versi, ukuran, developer, dan detail aplikasi Android.`;

		const icon = app.icon
			? `/images/${encodeURIComponent(app.icon)}`
			: "";

		const screenshots = String(app.screenshots || "")
			.split(",")
			.map(x => x.trim())
			.filter(Boolean);

		const screenshotHTML = screenshots.length
			? `
<section class="section">
	<div class="section-title">
		<h2>Screenshot ${escapeHTML(app.name || title)}</h2>
	</div>

	<div class="screenshots">
		${screenshots.map((image, index) => `
			<img
				src="/screenshots/${encodeURIComponent(image)}"
				alt="${escapeHTML(app.name || title)} screenshot ${index + 1}"
				loading="lazy"
			>
		`).join("")}
	</div>
</section>
`
			: "";

		const content = `

<div class="breadcrumb">
	<a href="/">Home</a>
	<span> / </span>
	${escapeHTML(app.category || "APK")}
	<span> / </span>
	${escapeHTML(app.name || title)}
</div>

<section class="app-detail">

	<div class="app-header">

		<div class="app-icon">

			${
				icon
					? `
					<img
						src="${icon}"
						alt="${escapeHTML(app.name || title)}"
						width="128"
						height="128"
					>
					`
					: `<div class="icon-placeholder">APK</div>`
			}

		</div>

		<div class="app-info">

			<span class="badge">
				${escapeHTML(app.category || "APK")}
			</span>

			<h1>
				${escapeHTML(title)}
			</h1>

			<p>
				${escapeHTML(app.description || "")}
			</p>

			<a
				class="download-btn"
				href="/apk/${encodeURIComponent(app.apk_file || "")}"
				download
			>
				Download APK
			</a>

		</div>

	</div>

</section>

<section class="seo-box">

	<h2>Informasi ${escapeHTML(app.name || title)}</h2>

	<div class="app-table">

		<div>
			<strong>Nama</strong>
			<span>${escapeHTML(app.name || "-")}</span>
		</div>

		<div>
			<strong>Versi</strong>
			<span>${escapeHTML(app.version || "-")}</span>
		</div>

		<div>
			<strong>Ukuran</strong>
			<span>${escapeHTML(app.size || "-")}</span>
		</div>

		<div>
			<strong>Developer</strong>
			<span>${escapeHTML(app.developer || "-")}</span>
		</div>

		<div>
			<strong>Kategori</strong>
			<span>${escapeHTML(app.category || "-")}</span>
		</div>

		<div>
			<strong>Package Name</strong>
			<span>${escapeHTML(app.package_name || "-")}</span>
		</div>

		<div>
			<strong>Update</strong>
			<span>${escapeHTML(app.updated || "-")}</span>
		</div>

	</div>

</section>

${screenshotHTML}

<section class="seo-box">

	<h2>Download ${escapeHTML(app.name || title)} APK</h2>

	<p>
		${escapeHTML(description)}
	</p>

	<p>
		Download file APK ${escapeHTML(app.name || title)}
		dan dapatkan informasi lengkap mengenai versi,
		ukuran aplikasi, developer, kategori, serta
		package name aplikasi.
	</p>

</section>

`;

		return layout({
			title: title,
			description: description,
			canonical: `/aplikasi/${encodeURIComponent(slug)}`,
			image: icon,
			content: content
		});

	} catch (error) {

		return new Response(
			"Error: " + error.message,
			{
				status: 500,
				headers: {
					"content-type": "text/plain;charset=UTF-8"
				}
			}
		);

	}
}


function escapeHTML(value) {

	return String(value || "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");

}
