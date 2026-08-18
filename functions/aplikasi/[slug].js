import { layout } from "../../lib/render";
import { getApp } from "../../lib/api";
import {
	SITE,
	canonical,
	sanitizeSlug,
	escapeHTML
} from "../../lib/config";

export async function onRequest(context) {

	try {

		let slug = context.params.slug;

		slug = sanitizeSlug(slug);

		if (!slug) {
			return new Response("404 Not Found", {
				status: 404
			});
		}

		const app = await getApp(slug);

		if (!app) {
			return new Response("404 Not Found", {
				status: 404
			});
		}

		const name =
			app.name ||
			app.title ||
			slug;

		const title =
			app.title ||
			`${name} APK`;

		const description =
			app.description ||
			`Download ${name} APK gratis.`;

		const version =
			app.version || "-";

		const size =
			app.size || "-";

		const developer =
			app.developer || "-";

		const category =
			app.category || "APK";

		const packageName =
			app.package_name || "-";

		const updated =
			app.updated || "-";

		const url =
			canonical(`/aplikasi/${slug}`);

		/*
		 * ICON
		 *
		 * File icon disimpan di:
		 * /images/
		 *
		 * Kalau API sudah mengirim URL lengkap,
		 * gunakan URL tersebut.
		 */

		let icon = "";

		if (app.icon) {

			if (
				/^https?:\/\//i.test(
					app.icon
				)
			) {

				icon = app.icon;

			} else {

				icon =
					`/images/${encodeURIComponent(app.icon)}`;

			}

		}


		/*
		 * SCREENSHOT
		 */

		const screenshots =
			String(
				app.screenshots || ""
			)
				.split(",")
				.map(x => x.trim())
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
<div class="app-icon">

	<img
		src="${escapeHTML(icon)}"
		alt="${escapeHTML(name)}"
		width="96"
		height="96"
	>

</div>
`
				: `
<div class="app-icon">
	<span>APK</span>
</div>
`;


		/*
		 * DOWNLOAD
		 *
		 * apk_file berasal dari API.
		 *
		 * Untuk sementara diarahkan ke:
		 * /apk/nama-file.apk
		 */

		const downloadHTML =
			app.apk_file
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
		href="/apk/${encodeURIComponent(app.apk_file)}"
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

	<a href="/kategori/${encodeURIComponent(
		category
	)}">
		${escapeHTML(category)}
	</a>

	<span>›</span>

	<span>
		${escapeHTML(name)}
	</span>

</nav>
`;


		/*
		 * SOFTWARE APPLICATION SCHEMA
		 */

		const schema = `
<script type="application/ld+json">
${JSON.stringify({

	"@context":
		"https://schema.org",

	"@type":
		"SoftwareApplication",

	"name":
		name,

	"description":
		description,

	"url":
		url,

	"applicationCategory":
		category,

	"operatingSystem":
		"Android",

	"softwareVersion":
		version,

	"fileSize":
		size,

	"author": {
		"@type":
			"Organization",

		"name":
			developer
	},

	"identifier":
		packageName,

	"dateModified":
		updated,

	...(icon
		? {
			"image": icon
		}
		: {})

})}
</script>
`;


		return layout({

			title:
				title,

			description:
				description,

			canonical:
				url,

			image:
				icon || SITE.defaultImage,

			schema:
				schema,

			content: `

${breadcrumb}


<article class="post">

	<div class="app-detail">

		${iconHTML}

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
			<strong>
				Versi
			</strong>

			<span>
				${escapeHTML(version)}
			</span>
		</div>

		<div>
			<strong>
				Ukuran
			</strong>

			<span>
				${escapeHTML(size)}
			</span>
		</div>

		<div>
			<strong>
				Developer
			</strong>

			<span>
				${escapeHTML(developer)}
			</span>
		</div>

		<div>
			<strong>
				Kategori
			</strong>

			<span>
				${escapeHTML(category)}
			</span>
		</div>

		<div>
			<strong>
				Package Name
			</strong>

			<span>
				${escapeHTML(packageName)}
			</span>
		</div>

		<div>
			<strong>
				Diperbarui
			</strong>

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
