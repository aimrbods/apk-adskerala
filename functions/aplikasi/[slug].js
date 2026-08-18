```javascript
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

		/* =========================
		   SLUG
		========================= */

		let slug = context.params.slug;

		slug = sanitizeSlug(slug);

		if (!slug) {
			return new Response("404 Not Found", {
				status: 404
			});
		}


		/* =========================
		   GET APP
		========================= */

		const app = await getApp(slug);

		if (!app) {
			return new Response("404 Not Found", {
				status: 404
			});
		}


		/* =========================
		   DATA
		========================= */

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

		const pageURL =
			canonical(`/aplikasi/${slug}`);


		/* =========================
		   ICON
		========================= */

		let icon = "";

		if (app.icon) {

			if (
				/^https?:\/\//i.test(app.icon)
			) {

				icon = app.icon;

			} else {

				icon =
					`/images/${encodeURIComponent(app.icon)}`;

			}

		}


		/* =========================
		   SCREENSHOTS
		========================= */

		const screenshots =
			String(app.screenshots || "")
				.split(",")
				.map(x => x.trim())
				.filter(Boolean);


		const screenshotHTML =
			screenshots.length
				? `

<section class="section">

	<div class="section-title">

		<h2>
			Screenshot ${escapeHTML(name)}
		</h2>

		<p>
			Tampilan aplikasi ${escapeHTML(name)}.
		</p>

	</div>

	<div class="screenshots">

		${screenshots.map(file => `

			<div class="screenshot-card">

				<img
					src="/screenshots/${encodeURIComponent(file)}"
					alt="${escapeHTML(name)} screenshot"
					loading="lazy"
					decoding="async"
				>

			</div>

		`).join("")}

	</div>

</section>

`
				: "";


		/* =========================
		   ICON HTML
		========================= */

		const iconHTML =
			icon
				? `

<div class="app-icon">

	<img
		src="${escapeHTML(icon)}"
		alt="${escapeHTML(name)}"
		width="128"
		height="128"
		loading="eager"
		decoding="async"
	>

</div>

`
				: `

<div class="app-icon icon-placeholder">

	<span>
		APK
	</span>

</div>

`;


		/* =========================
		   DOWNLOAD
		========================= */

		const downloadHTML =
			app.apk_file
				? `

<section class="download-box">

	<div class="download-info">

		<span class="download-label">
			READY TO DOWNLOAD
		</span>

		<h2>
			Download ${escapeHTML(name)} APK
		</h2>

		<p>
			Versi ${escapeHTML(version)}
			${size !== "-" ? ` • ${escapeHTML(size)}` : ""}
		</p>

	</div>

	<a
		class="download-btn"
		href="/apk/${encodeURIComponent(app.apk_file)}"
		download
	>
		<span>↓</span>
		Download APK
	</a>

</section>

`
				: "";


		/* =========================
		   BREADCRUMB
		========================= */

		const breadcrumb = `

<nav class="breadcrumb" aria-label="Breadcrumb">

	<a href="/">
		Home
	</a>

	<span>›</span>

	<a href="/kategori/${encodeURIComponent(
		category.toLowerCase()
	)}">
		${escapeHTML(category)}
	</a>

	<span>›</span>

	<span>
		${escapeHTML(name)}
	</span>

</nav>

`;


		/* =========================
		   SOFTWARE APPLICATION SCHEMA
		========================= */

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
		pageURL,

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
			"image":
				icon
		}
		: {})

})}
</script>

`;


		/* =========================
		   UI
		========================= */

		const content = `

${breadcrumb}


<article class="app-page">


	<!-- APP HEADER -->

	<section class="app-hero">

		<div class="app-hero-main">

			${iconHTML}

			<div class="app-info">

				<span class="app-category">
					${escapeHTML(category)}
				</span>

				<h1>
					${escapeHTML(title)}
				</h1>

				<p>
					${escapeHTML(description)}
				</p>

			</div>

		</div>

	</section>


	<!-- INFORMATION -->

	<section class="seo-box">

		<h2>
			Tentang ${escapeHTML(name)}
		</h2>

		<p>
			${escapeHTML(description)}
		</p>

	</section>


	<!-- APP META -->

	<section class="app-meta">

		<div class="meta-item">

			<span class="meta-label">
				Versi
			</span>

			<strong>
				${escapeHTML(version)}
			</strong>

		</div>


		<div class="meta-item">

			<span class="meta-label">
				Ukuran
			</span>

			<strong>
				${escapeHTML(size)}
			</strong>

		</div>


		<div class="meta-item">

			<span class="meta-label">
				Developer
			</span>

			<strong>
				${escapeHTML(developer)}
			</strong>

		</div>


		<div class="meta-item">

			<span class="meta-label">
				Kategori
			</span>

			<strong>
				${escapeHTML(category)}
			</strong>

		</div>


		<div class="meta-item">

			<span class="meta-label">
				Package Name
			</span>

			<strong>
				${escapeHTML(packageName)}
			</strong>

		</div>


		<div class="meta-item">

			<span class="meta-label">
				Diperbarui
			</span>

			<strong>
				${escapeHTML(updated)}
			</strong>

		</div>

	</section>


	<!-- DOWNLOAD -->

	${downloadHTML}


</article>


<!-- SCREENSHOTS -->

${screenshotHTML}


<!-- PAGE STYLE -->

<style>

.app-page{
	display:flex;
	flex-direction:column;
	gap:26px;
}


/* APP HERO */

.app-hero{
	padding:30px;

	border-radius:26px;

	background:
	linear-gradient(
		135deg,
		rgba(99,102,241,.14),
		rgba(139,92,246,.08)
	);

	border:
	1px solid rgba(129,140,248,.20);

	box-shadow:
	0 20px 50px rgba(0,0,0,.20);
}


.app-hero-main{
	display:flex;

	align-items:center;

	gap:26px;
}


.app-icon{
	width:128px;
	height:128px;

	flex:0 0 128px;

	overflow:hidden;

	border-radius:28px;

	background:#111827;

	border:
	1px solid rgba(255,255,255,.10);

	box-shadow:
	0 12px 30px rgba(0,0,0,.25);
}


.app-icon img{
	width:100%;
	height:100%;

	object-fit:cover;
}


.icon-placeholder{
	display:flex;

	align-items:center;
	justify-content:center;

	font-size:30px;
	font-weight:800;

	color:#fff;

	background:
	linear-gradient(
		135deg,
		#4f46e5,
		#7c3aed
	);
}


.app-info{
	min-width:0;
}


.app-category{
	display:inline-flex;

	padding:5px 11px;

	margin-bottom:10px;

	border-radius:999px;

	background:
	rgba(99,102,241,.15);

	color:#a5b4fc;

	font-size:12px;

	font-weight:700;

	text-transform:uppercase;
}


.app-info h1{
	margin:0 0 10px;

	font-size:38px;

	line-height:1.15;

	color:#fff;

	word-break:break-word;
}


.app-info p{
	max-width:760px;

	margin:0;

	color:#cbd5e1;

	font-size:15px;

	line-height:1.7;
}


/* META */

.app-meta{
	display:grid;

	grid-template-columns:
	repeat(3,1fr);

	gap:1px;

	overflow:hidden;

	border-radius:20px;

	background:var(--border);

	border:
	1px solid var(--border);
}


.meta-item{
	padding:18px 20px;

	background:
	rgba(255,255,255,.025);

	display:flex;

	flex-direction:column;

	gap:5px;
}


.meta-label{
	font-size:12px;

	color:var(--muted);

	text-transform:uppercase;

	letter-spacing:.04em;

	font-weight:700;
}


.meta-item strong{
	font-size:15px;

	color:#f8fafc;

	word-break:break-word;
}


/* DOWNLOAD */

.download-box{
	display:flex;

	align-items:center;

	justify-content:space-between;

	gap:25px;

	padding:25px 28px;

	border-radius:22px;

	background:
	linear-gradient(
		135deg,
		rgba(79,70,229,.20),
		rgba(124,58,237,.12)
	);

	border:
	1px solid rgba(99,102,241,.30);
}


.download-label{
	display:block;

	margin-bottom:6px;

	font-size:11px;

	font-weight:800;

	letter-spacing:.08em;

	color:#a5b4fc;
}


.download-box h2{
	margin:0 0 5px;

	font-size:22px;

	color:#fff;
}


.download-box p{
	margin:0;

	font-size:14px;

	color:#cbd5e1;
}


.download-btn{
	display:inline-flex;

	align-items:center;

	justify-content:center;

	gap:8px;

	flex-shrink:0;

	padding:13px 22px;

	border-radius:13px;

	background:#4f46e5;

	color:#fff;

	font-size:14px;

	font-weight:800;

	box-shadow:
	0 8px 20px rgba(79,70,229,.25);

	transition:
	transform .2s ease,
	background .2s ease,
	box-shadow .2s ease;
}


.download-btn:hover{
	background:#6366f1;

	transform:translateY(-2px);

	box-shadow:
	0 12px 25px rgba(79,70,229,.35);
}


.download-btn span{
	font-size:18px;

	line-height:1;
}


/* SCREENSHOT */

.screenshot-card{
	overflow:hidden;

	border-radius:18px;

	background:#111827;

	border:
	1px solid var(--border);

	box-shadow:
	0 10px 25px rgba(0,0,0,.18);
}


.screenshot-card img{
	display:block;

	width:100%;

	height:auto;

	transition:
	transform .3s ease;
}


.screenshot-card:hover img{
	transform:scale(1.02);
}


/* MOBILE */

@media(max-width:768px){

	.app-hero{
		padding:22px;

		border-radius:22px;
	}


	.app-hero-main{
		flex-direction:column;

		align-items:flex-start;

		gap:18px;
	}


	.app-icon{
		width:96px;
		height:96px;

		flex-basis:96px;

		border-radius:22px;
	}


	.app-info h1{
		font-size:29px;
	}


	.app-info p{
		font-size:14px;
	}


	.app-meta{
		grid-template-columns:1fr;
	}


	.meta-item{
		padding:15px 17px;
	}


	.download-box{
		flex-direction:column;

		align-items:flex-start;

		padding:22px;
	}


	.download-btn{
		width:100%;
	}


}

</style>

`;


		/* =========================
		   RENDER
		========================= */

		return layout({

			title,

			description,

			canonical: pageURL,

			image:
				icon || SITE.defaultImage,

			schema,

			content

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
```
