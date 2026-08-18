import { layout } from "../../lib/render";
import { getApp } from "../../lib/api";
import {
	SITE,
	canonical,
	imageUrl,
	sanitizeSlug,
	escapeHTML
} from "../../lib/config";

export async function onRequest(context) {

	try {

		let { slug } = context.params;

		slug = sanitizeSlug(slug);

		if (!slug) {
			return new Response(
				"404 Not Found",
				{ status: 404 }
			);
		}

		const app = await getApp(slug);

		if (!app) {
			return new Response(
				"404 Not Found",
				{ status: 404 }
			);
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
			`Download ${name} APK gratis. Informasi lengkap mengenai versi, ukuran, developer, kategori, dan pembaruan aplikasi.`;

		const version =
			app.version ||
			"-";

		const size =
			app.size ||
			"-";

		const developer =
			app.developer ||
			"-";

		const category =
			app.category ||
			"APK";

		const packageName =
			app.package_name ||
			"-";

		const updated =
			app.updated ||
			"-";

		const canonicalUrl =
			canonical(`/aplikasi/${slug}`);

		const iconUrl =
			app.icon
				? imageUrl(app.icon)
				: imageUrl("");

		const screenshots = String(
			app.screenshots || ""
		)
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


		const iconHTML = `
<div class="app-icon">

	<img
		src="${escapeHTML(iconUrl)}"
		alt="${escapeHTML(name)}"
		width="96"
		height="96"
		loading="eager"
		decoding="async"
	>

</div>
`;


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

	<span>
		${escapeHTML(category)}
	</span>

	<span>›</span>

	<span>
		${escapeHTML(name)}
	</span>

</nav>
`;


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
		canonicalUrl,

	"applicationCategory":
		"UtilitiesApplication",

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

	"image":
		iconUrl,

	"dateModified":
		updated,

	"identifier":
		packageName

})}
</script>
`;


		return layout({

			title,

			description,

			canonical:
				canonicalUrl,

			image:
				iconUrl,

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
