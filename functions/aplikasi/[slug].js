import { layout } from "../../lib/render";
import { API_URL, escapeHTML } from "../../lib/config";

export async function onRequest(context) {

	try {

		let { slug } = context.params;

		slug = String(slug || "")
			.trim()
			.toLowerCase();

		if (!slug) {
			return new Response("404 Not Found", {
				status: 404
			});
		}

		/*
		 * Ambil seluruh data aplikasi
		 * dari API Worker yang sudah ada.
		 */
		const response = await fetch(
			`${API_URL}/api/apps`
		);

		if (!response.ok) {
			throw new Error(
				`API error: ${response.status}`
			);
		}

		const data = await response.json();

		const apps = Array.isArray(data)
			? data
			: Array.isArray(data.apps)
				? data.apps
				: [];

		const app = apps.find(item =>
			String(item.slug || "")
				.trim()
				.toLowerCase() === slug
		);

		if (!app) {

			return new Response(
				"404 Not Found",
				{
					status: 404,
					headers: {
						"Content-Type":
							"text/plain; charset=UTF-8"
					}
				}
			);

		}

		const name =
			app.name ||
			app.title ||
			app.slug ||
			"APK";

		const title =
			app.title ||
			`${name} APK`;

		const description =
			app.description ||
			`Download ${name} APK gratis. Informasi lengkap mengenai versi, ukuran, developer, kategori, package name, dan pembaruan aplikasi.`;

		const category =
			app.category ||
			"APK";

		const version =
			app.version ||
			"-";

		const size =
			app.size ||
			"-";

		const developer =
			app.developer ||
			"-";

		const packageName =
			app.package_name ||
			"-";

		const updated =
			app.updated ||
			"-";

		const icon =
			app.icon
				? `/images/${encodeURIComponent(app.icon)}`
				: "";

		const apkFile =
			app.apk_file ||
			"";

		const screenshots =
			String(app.screenshots || "")
				.split(",")
				.map(item => item.trim())
				.filter(Boolean);

		const screenshotHTML =
			screenshots.length
				? `
<section class="section">

	<h2>
		Screenshot ${escapeHTML(name)}
	</h2>

	<div class="screenshots">

		${screenshots.map(file => `
			<img
				src="/screenshots/${encodeURIComponent(file)}"
				alt="${escapeHTML(name)} screenshot"
				loading="lazy"
				decoding="async"
			>
		`).join("")}

	</div>

</section>
`
				: "";

		const iconHTML =
			icon
				? `
<img
	src="${icon}"
	alt="${escapeHTML(name)}"
	width="96"
	height="96"
	loading="eager"
	decoding="async"
>
`
				: `
<div class="app-icon-placeholder">
	APK
</div>
`;

		const downloadHTML =
			apkFile
				? `
<section class="download-box">

	<h2>
		Download ${escapeHTML(name)} APK
	</h2>

	<p>
		Versi:
		<strong>
			${escapeHTML(version)}
		</strong>
	</p>

	<p>
		Ukuran:
		<strong>
			${escapeHTML(size)}
		</strong>
	</p>

	<a
		class="btn"
		href="/apk/${encodeURIComponent(apkFile)}"
		download
	>
		Download APK
	</a>

</section>
`
				: "";

		const breadcrumb = `
<nav class="breadcrumb">

	<a href="/">
		Home
	</a>

	<span>›</span>

	<span>
		${escapeHTML(category)}
	</span>

	<span>›</span>

	<span>
		${escapeHTML(name)}
	</span>

</nav>
`;

		return layout({

			title,

			description,

			canonical:
				`/aplikasi/${encodeURIComponent(slug)}`,

			image: icon,

			content: `

${breadcrumb}

<article class="post">

	<div class="app-detail">

		<div class="app-icon">

			${iconHTML}

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

		<h2>
			Informasi ${escapeHTML(name)}
		</h2>

		<p>
			${escapeHTML(description)}
		</p>

	</section>


	<section class="app-meta">

		<div>
			<strong>Versi</strong>
			<span>
				${escapeHTML(version)}
			</span>
		</div>

		<div>
			<strong>Ukuran</strong>
			<span>
				${escapeHTML(size)}
			</span>
		</div>

		<div>
			<strong>Developer</strong>
			<span>
				${escapeHTML(developer)}
			</span>
		</div>

		<div>
			<strong>Kategori</strong>
			<span>
				${escapeHTML(category)}
			</span>
		</div>

		<div>
			<strong>Package Name</strong>
			<span>
				${escapeHTML(packageName)}
			</span>
		</div>

		<div>
			<strong>Diperbarui</strong>
			<span>
				${escapeHTML(updated)}
			</span>
		</div>

	</section>


	${downloadHTML}

</article>


${screenshotHTML}

`
		});

	} catch (error) {

		return new Response(
			"Error: " + error.message,
			{
				status: 500,
				headers: {
					"Content-Type":
						"text/plain; charset=UTF-8"
				}
			}
		);

	}

}
