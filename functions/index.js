import { layout } from "../lib/render";
import { API_URL, escapeHTML } from "../lib/config";

export async function onRequest(context) {

	try {

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

		const appsHTML = apps
			.slice(0, 12)
			.map(app => {

				const slug =
					String(app.slug || "").trim();

				const name =
					app.name ||
					app.title ||
					slug ||
					"APK";

				const title =
					app.title ||
					name;

				const description =
					app.description ||
					"Informasi aplikasi Android terbaru.";

				const category =
					app.category ||
					"APK";

				const icon =
					app.icon
						? `
<img
	src="/images/${encodeURIComponent(app.icon)}"
	alt="${escapeHTML(name)}"
	loading="lazy"
	decoding="async"
>
`
						: `
<span>APK</span>
`;

				return `
<article class="card">

	<a href="/aplikasi/${encodeURIComponent(slug)}">

		<div class="thumb">
			${icon}
		</div>

		<div class="body">

			<span class="badge">
				${escapeHTML(category)}
			</span>

			<h3>
				${escapeHTML(title)}
			</h3>

			<p>
				${escapeHTML(description)}
			</p>

		</div>

	</a>

</article>
`;

			})
			.join("");

		const content =
			apps.length
				? appsHTML
				: `
<div class="seo-box">

	<p>
		Belum ada aplikasi yang tersedia.
	</p>

</div>
`;

		return layout({

			title:
				"Download APK Gratis - Aplikasi Android Terbaru",

			description:
				"Download APK gratis untuk berbagai aplikasi Android terbaru. Temukan aplikasi Android berdasarkan kategori, versi, ukuran, developer, dan pembaruan terbaru.",

			canonical: "/",

			content: `

<section class="hero">

	<div class="hero-box">

		<span class="hero-badge">
			⚡ APK DIRECTORY
		</span>

		<h1>
			Download APK Gratis
		</h1>

		<p>
			Temukan berbagai aplikasi Android terbaru
			dengan informasi lengkap mengenai versi,
			ukuran, developer, kategori, dan pembaruan
			aplikasi.
		</p>

	</div>

</section>


<section class="seo-box">

	<h2>
		Direktori Aplikasi Android
	</h2>

	<p>
		Jelajahi koleksi aplikasi Android gratis dari
		berbagai kategori. Temukan informasi lengkap
		mengenai deskripsi, versi APK, ukuran file,
		developer, package name, tanggal pembaruan,
		ikon, dan screenshot aplikasi.
	</p>

</section>


<section class="section">

	<div class="section-title">

		<h2>
			Aplikasi Terbaru
		</h2>

		<p>
			Daftar aplikasi Android terbaru yang tersedia
			di APK Directory.
		</p>

	</div>


	<div class="grid">

		${content}

	</div>

</section>

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
