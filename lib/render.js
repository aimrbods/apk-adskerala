import { SITE, escapeHTML, url } from "./config";

export function layout({
	title = SITE.name,
	description = SITE.description,
	canonical = "/",
	image = "",
	content = "",
	schema = "",
	robots = ""
} = {}) {

	const canonicalUrl = url(canonical);

	const ogImage = image
		? (/^https?:\/\//i.test(image) ? image : url(image))
		: url(SITE.defaultImage);

	return new Response(`<!DOCTYPE html>
<html lang="id">

<head>

<meta charset="UTF-8">

<meta
	name="viewport"
	content="width=device-width,initial-scale=1"
>

<title>${escapeHTML(title)}</title>

<meta
	name="description"
	content="${escapeHTML(description)}"
>

<meta
	name="robots"
	content="${robots || "index,follow,max-image-preview:large"}"
>

<link
	rel="canonical"
	href="${escapeHTML(canonicalUrl)}"
>

<meta
	name="theme-color"
	content="#020617"
>

<meta
	name="author"
	content="${escapeHTML(SITE.name)}"
>

<!-- OPEN GRAPH -->

<meta
	property="og:type"
	content="website"
>

<meta
	property="og:site_name"
	content="${escapeHTML(SITE.name)}"
>

<meta
	property="og:title"
	content="${escapeHTML(title)}"
>

<meta
	property="og:description"
	content="${escapeHTML(description)}"
>

<meta
	property="og:url"
	content="${escapeHTML(canonicalUrl)}"
>

<meta
	property="og:image"
	content="${escapeHTML(ogImage)}"
>

<!-- TWITTER -->

<meta
	name="twitter:card"
	content="summary_large_image"
>

<meta
	name="twitter:title"
	content="${escapeHTML(title)}"
>

<meta
	name="twitter:description"
	content="${escapeHTML(description)}"
>

<meta
	name="twitter:image"
	content="${escapeHTML(ogImage)}"
>

<link
	rel="alternate"
	type="application/rss+xml"
	title="${escapeHTML(SITE.name)}"
	href="${url("/rss.xml")}"
>

${schema || ""}

<style>

:root{
	--bg:#020617;
	--card:#0f172a;
	--text:#e5e7eb;
	--muted:#94a3b8;
	--primary:#6366f1;
	--border:#1e293b;
	--shadow:0 10px 30px rgba(0,0,0,.30);
}

*{
	box-sizing:border-box;
	margin:0;
	padding:0;
}

html{
	scroll-behavior:smooth;
}

body{
	font-family:
	Inter,
	Arial,
	sans-serif;

	background:
	radial-gradient(
		circle at top left,
		rgba(99,102,241,.12),
		transparent 30%
	),
	radial-gradient(
		circle at bottom right,
		rgba(139,92,246,.10),
		transparent 30%
	),
	var(--bg);

	color:var(--text);
	line-height:1.7;

	-webkit-font-smoothing:antialiased;
}

a{
	color:inherit;
	text-decoration:none;
}

img{
	display:block;
	max-width:100%;
	height:auto;
}

/* HEADER */

.header{
	position:sticky;
	top:0;
	z-index:999;

	backdrop-filter:blur(16px);

	background:
		rgba(2,6,23,.82);

	border-bottom:
		1px solid rgba(255,255,255,.06);
}

.header-wrap{
	max-width:1200px;
	margin:auto;

	padding:15px 20px;

	display:flex;
	align-items:center;
	justify-content:space-between;

	gap:20px;
}

.logo{
	font-size:22px;
	font-weight:800;
	color:#fff;
}

.logo span{
	background:
	linear-gradient(
		90deg,
		#8b5cf6,
		#06b6d4
	);

	-webkit-background-clip:text;
	-webkit-text-fill-color:transparent;
}

.nav{
	display:flex;
	gap:20px;
}

.nav a{
	font-size:14px;
	color:var(--muted);

	transition:.2s;
}

.nav a:hover{
	color:#fff;
}

/* CONTAINER */

.container{
	max-width:1100px;
	margin:auto;
	padding:30px 20px;
}

/* HERO */

.hero{
	padding:20px 0 30px;
}

.hero-box{
	position:relative;
	overflow:hidden;

	padding:55px 30px;

	border-radius:26px;

	text-align:center;

	background:
	linear-gradient(
		135deg,
		#4f46e5,
		#7c3aed
	);

	box-shadow:
	0 20px 60px
	rgba(79,70,229,.30);
}

.hero-box h1{
	font-size:46px;
	line-height:1.15;

	margin-bottom:16px;

	color:#fff;
}

.hero-box p{
	max-width:760px;
	margin:auto;

	font-size:17px;
	color:#e0e7ff;
}

.hero-badge{
	display:inline-block;

	margin-bottom:16px;

	padding:7px 13px;

	border-radius:999px;

	background:
	rgba(255,255,255,.14);

	font-size:12px;
	font-weight:700;

	color:#fff;
}

/* SECTION */

.section{
	padding:10px 0 40px;
}

.section-title{
	margin-bottom:20px;
}

.section-title h2{
	font-size:27px;
	color:#fff;
}

.section-title p{
	margin-top:6px;
	font-size:14px;
	color:var(--muted);
}

/* SEO BOX */

.seo-box{
	margin-bottom:30px;
	padding:24px;

	border-radius:22px;

	background:
	rgba(255,255,255,.025);

	border:
	1px solid rgba(255,255,255,.06);

	box-shadow:var(--shadow);
}

.seo-box h2{
	margin-bottom:10px;
	font-size:23px;
	color:#fff;
}

.seo-box p{
	margin:10px 0;
	color:#cbd5e1;
}

/* GRID */

.grid{
	display:grid;

	grid-template-columns:
	repeat(
		auto-fit,
		minmax(240px,1fr)
	);

	gap:20px;
}

/* CARD */

.card{
	overflow:hidden;

	border-radius:20px;

	background:
	linear-gradient(
		180deg,
		rgba(255,255,255,.035),
		rgba(255,255,255,.015)
	);

	border:
	1px solid var(--border);

	box-shadow:var(--shadow);

	transition:
		transform .2s ease,
		border-color .2s ease;
}

.card:hover{
	transform:translateY(-5px);

	border-color:
	rgba(99,102,241,.55);
}

.thumb{
	width:100%;

	aspect-ratio:16/9;

	display:flex;
	align-items:center;
	justify-content:center;

	overflow:hidden;

	background:#111827;
}

.thumb img{
	width:100%;
	height:100%;

	object-fit:contain;
}

.body{
	padding:16px;
}

.badge{
	display:inline-block;

	margin-bottom:10px;

	padding:5px 10px;

	border-radius:999px;

	background:#312e81;

	color:#c7d2fe;

	font-size:11px;
	font-weight:700;
}

.card h3{
	font-size:18px;
	line-height:1.45;

	color:#f8fafc;
}

.card p{
	margin-top:8px;

	font-size:14px;

	color:var(--muted);

	display:
	-webkit-box;

	-webkit-line-clamp:3;
	-webkit-box-orient:vertical;

	overflow:hidden;
}

/* APP DETAIL */

.app-detail{
	margin-bottom:30px;
}

.app-header{
	display:flex;
	align-items:center;

	gap:25px;

	padding:28px;

	border-radius:24px;

	background:
	rgba(255,255,255,.025);

	border:
	1px solid var(--border);

	box-shadow:var(--shadow);
}

.app-icon{
	width:128px;
	height:128px;

	flex-shrink:0;

	border-radius:24px;

	overflow:hidden;

	background:#111827;
}

.app-icon img{
	width:100%;
	height:100%;

	object-fit:cover;
}

.icon-placeholder{
	width:100%;
	height:100%;

	display:flex;
	align-items:center;
	justify-content:center;

	font-weight:800;

	color:#fff;
}

.app-info h1{
	font-size:36px;
	line-height:1.2;

	margin:8px 0 10px;

	color:#fff;
}

.app-info p{
	color:#cbd5e1;
	max-width:700px;
}

/* DOWNLOAD */

.download-btn{
	display:inline-block;

	margin-top:20px;

	padding:12px 20px;

	border-radius:12px;

	background:#4f46e5;

	color:#fff;

	font-size:14px;
	font-weight:700;

	transition:.2s;
}

.download-btn:hover{
	background:#6366f1;

	transform:translateY(-1px);
}

/* APP TABLE */

.app-table{
	display:grid;

	gap:0;

	border:
	1px solid var(--border);

	border-radius:16px;

	overflow:hidden;
}

.app-table div{
	display:grid;

	grid-template-columns:180px 1fr;

	padding:13px 15px;

	border-bottom:
	1px solid var(--border);
}

.app-table div:last-child{
	border-bottom:0;
}

.app-table strong{
	color:#fff;
}

.app-table span{
	color:#cbd5e1;
}

/* SCREENSHOTS */

.screenshots{
	display:grid;

	grid-template-columns:
	repeat(
		auto-fit,
		minmax(180px,1fr)
	);

	gap:16px;
}

.screenshots img{
	width:100%;

	border-radius:16px;

	border:
	1px solid var(--border);

	background:#111827;
}

/* BREADCRUMB */

.breadcrumb{
	margin-bottom:22px;

	font-size:14px;

	color:var(--muted);
}

.breadcrumb a{
	color:#a5b4fc;
}

/* FOOTER */

.footer{
	margin-top:50px;

	padding:45px 20px;

	border-top:
	1px solid rgba(255,255,255,.06);

	background:
	rgba(255,255,255,.02);
}

.footer-wrap{
	max-width:1100px;

	margin:auto;

	display:grid;

	grid-template-columns:
	2fr 1fr 1fr;

	gap:35px;
}

.footer h3{
	font-size:22px;

	color:#fff;

	margin-bottom:10px;
}

.footer h4{
	margin-bottom:12px;

	color:#fff;
}

.footer p,
.footer a{
	font-size:14px;

	color:var(--muted);
}

.footer-menu{
	display:flex;
	flex-direction:column;

	gap:8px;
}

.footer a:hover{
	color:#fff;
}

.footer-bottom{
	max-width:1100px;

	margin:35px auto 0;

	padding-top:18px;

	border-top:
	1px solid rgba(255,255,255,.06);

	text-align:center;

	font-size:13px;

	color:var(--muted);
}

/* MOBILE */

@media(max-width:768px){

	.container{
		padding:22px 14px;
	}

	.nav{
		display:none;
	}

	.hero-box{
		padding:40px 20px;
		border-radius:22px;
	}

	.hero-box h1{
		font-size:32px;
	}

	.hero-box p{
		font-size:15px;
	}

	.grid{
		grid-template-columns:1fr;
	}

	.app-header{
		flex-direction:column;

		align-items:flex-start;

		padding:22px;
	}

	.app-info h1{
		font-size:30px;
	}

	.app-table div{
		grid-template-columns:1fr;

		gap:4px;
	}

	.footer-wrap{
		grid-template-columns:1fr;
	}

}

</style>

</head>

<body>

<header class="header">

	<div class="header-wrap">

		<a href="/" class="logo">
			⚡ <span>${escapeHTML(SITE.name)}</span>
		</a>

		<nav class="nav">

			<a href="/">
				Home
			</a>

			<a href="/kategori/">
				Kategori
			</a>

			<a href="/tentang">
				Tentang
			</a>

			<a href="/contact">
				Contact
			</a>

		</nav>

	</div>

</header>

<main class="container">

${content}

</main>

<footer class="footer">

	<div class="footer-wrap">

		<div>

			<h3>
				⚡ ${escapeHTML(SITE.name)}
			</h3>

			<p>
				Direktori aplikasi Android dengan informasi
				lengkap mengenai aplikasi, versi, developer,
				kategori, ukuran, dan pembaruan terbaru.
			</p>

		</div>

		<div class="footer-menu">

			<h4>
				Navigasi
			</h4>

			<a href="/">
				Home
			</a>

			<a href="/kategori/">
				Kategori
			</a>

			<a href="/tentang">
				Tentang
			</a>

			<a href="/contact">
				Contact
			</a>

		</div>

		<div class="footer-menu">

			<h4>
				Informasi
			</h4>

			<a href="/privacy-policy">
				Privacy Policy
			</a>

			<a href="/terms">
				Terms
			</a>

			<a href="/disclaimer">
				Disclaimer
			</a>

		</div>

	</div>

	<div class="footer-bottom">

		© ${new Date().getFullYear()}
		${escapeHTML(SITE.name)}
		• All Rights Reserved

	</div>

</footer>

</body>

</html>`, {
		status: 200,
		headers: {
			"content-type":
				"text/html;charset=UTF-8",

			"cache-control":
				"public,max-age=300"
		}
	});
}
