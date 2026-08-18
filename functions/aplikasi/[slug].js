import { layout } from "../../lib/render";
import { getApp } from "../../lib/api";
import {
	SITE,
	canonical,
	ogImage,
	escapeHTML,
	sanitizeSlug
} from "../../lib/config";
import { seo } from "../../lib/seo";

export async function onRequest(context) {
	try {
		let { slug } = context.params;

		slug = sanitizeSlug(slug);

		const app = await getApp(slug);

		if (!app) {
			return new Response("404 Not Found", {
				status: 404
			});
		}

		const title =
			app.title ||
			app.name ||
			`${app.name} APK`;

		const description =
			app.description ||
			`Download ${app.name} APK terbaru secara gratis.`;

		const canonicalUrl =
			canonical(`/aplikasi/${slug}`);

		const icon = app.icon
			? `/images/${encodeURIComponent(app.icon)}`
			: ogImage(slug);

		const screenshots = String(
			app.screenshots || ""
		)
			.split(",")
			.map(x => x.trim())
			.filter(Boolean);

		const screenshotsHTML = screenshots.length
			? `
<section class="screenshots">
	<h2>Screenshot ${escapeHTML(app.name)}</h2>

	<div class="grid">
		${screenshots.map(file => `
			<div class="card">
				<img
					src="/screenshots/${encodeURIComponent(file)}"
					alt="Screenshot ${escapeHTML(app.name)}"
					loading="lazy"
				>
			</div>
		`).join("")}
	</div>
</section>
`
			: "";

		return layout({
			title,
			description,
			canonical: canonicalUrl,
			image: icon,
			schema: seo({
				title,
				description,
				slug,
				category: app.category,
				updated: app.updated
			}),

			content: `
<nav class="breadcrumb">
	<a href="/">Home</a>
	<span>›</span>
	<a href="/kategori/${sanitizeSlug(app.category || "apk")}">
		${escapeHTML(app.category || "APK")}
	</a>
	<span>›</span>
	<span>${escapeHTML(app.name || title)}</span>
</nav>

<article class="post">

	<div class="app-header">

		<div class="app-icon">
			<img
				src="${icon}"
				alt="${escapeHTML(app.name || title)}"
				loading="eager"
			>
		</div>

		<div class="app-info">

			<h1>
				${escapeHTML(title)}
			</h1>

			<p>
				${escapeHTML(description)}
			</p>

		</div>

	</div>

	<section class="seo-box">

		<h2>Informasi ${escapeHTML(app.name || "Aplikasi")}</h2>

		<table>
			<tbody>

				<tr>
					<th>Nama</th>
					<td>${escapeHTML(app.name || "-")}</td>
				</tr>

				<tr>
					<th>Versi</th>
					<td>${escapeHTML(app.version || "-")}</td>
				</tr>

				<tr>
					<th>Ukuran</th>
					<td>${escapeHTML(app.size || "-")}</td>
				</tr>

				<tr>
					<th>Developer</th>
					<td>${escapeHTML(app.developer || "-")}</td>
				</tr>

				<tr>
					<th>Kategori</th>
					<td>${escapeHTML(app.category || "-")}</td>
				</tr>

				<tr>
					<th>Package Name</th>
					<td>${escapeHTML(app.package_name || "-")}</td>
				</tr>

				<tr>
					<th>Update</th>
					<td>${escapeHTML(app.updated || "-")}</td>
				</tr>

			</tbody>
		</table>

	</section>

	<section class="post-content">

		<h2>Tentang ${escapeHTML(app.name || "Aplikasi")}</h2>

		<p>
			${escapeHTML(description)}
		</p>

		<p>
			${escapeHTML(app.name || "Aplikasi")} merupakan aplikasi
			Android yang dikembangkan oleh
			${escapeHTML(app.developer || "developer terkait")}.
			Halaman ini menyediakan informasi mengenai versi,
			ukuran file, kategori, package name, serta pembaruan
			aplikasi.
		</p>

	</section>

	${
		app.apk_file
			? `
			<section class="download-box">

				<h2>Download APK</h2>

				<p>
					Download ${escapeHTML(app.name || "aplikasi")}
					dalam format APK.
				</p>

				<a
					class="btn"
					href="/apk/${encodeURIComponent(app.apk_file)}"
					download
				>
					Download APK
				</a>

			</section>
			`
			: ""
	}

</article>

${screenshotsHTML}
`
		});

	} catch (error) {

		return new Response(
			"Error: " + error.message,
			{
				status: 500
			}
		);
	}
}
