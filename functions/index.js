import { layout } from "../lib/render";

export async function onRequest(context) {
	return layout({
		title: "Download APK Gratis - Aplikasi Android Terbaru",
		description:
			"Download APK gratis untuk berbagai aplikasi Android terbaru. Temukan aplikasi berdasarkan kategori, versi, ukuran, dan developer.",
		canonical: "/",
		content: `
<section class="hero">
	<div class="hero-box">
		<span class="hero-badge">⚡ APK DIRECTORY</span>

		<h1>Download APK Gratis</h1>

		<p>
			Temukan berbagai aplikasi Android terbaru dan populer
			dengan informasi lengkap mengenai versi, ukuran,
			developer, kategori, dan pembaruan aplikasi.
		</p>
	</div>
</section>

<section class="seo-box">
	<h2>Direktori Aplikasi Android</h2>

	<p>
		Jelajahi koleksi aplikasi Android gratis dari berbagai kategori.
		Setiap halaman aplikasi menyediakan informasi lengkap seperti
		deskripsi, versi APK, ukuran file, developer, package name,
		tanggal pembaruan, ikon, dan screenshot.
	</p>
</section>

<section class="section">

	<div class="section-title">
		<h2>Aplikasi Terbaru</h2>

		<p>
			Daftar aplikasi Android terbaru yang tersedia di APK Directory.
		</p>
	</div>

	<div id="apps" class="grid">

		<div class="card">
			<div class="body">
				Memuat aplikasi...
			</div>
		</div>

	</div>

</section>

<script>
(async function () {

	const container = document.getElementById("apps");

	try {

		const response = await fetch("/api/apps");

		if (!response.ok) {
			throw new Error("API error");
		}

		const data = await response.json();

		const apps = Array.isArray(data)
			? data
			: (Array.isArray(data.apps) ? data.apps : []);

		if (!apps.length) {

			container.innerHTML = \`
				<div class="seo-box">
					<p>
						Belum ada aplikasi yang tersedia.
					</p>
				</div>
			\`;

			return;
		}

		container.innerHTML = apps.map(app => {

			const slug = encodeURIComponent(
				String(app.slug || "")
			);

			const name = escapeHTML(
				app.name || app.title || app.slug || "APK"
			);

			const title = escapeHTML(
				app.title || app.name || app.slug || "APK"
			);

			const description = escapeHTML(
				app.description || ""
			);

			const category = escapeHTML(
				app.category || "APK"
			);

			const icon = app.icon
				? \`
					<img
						src="/images/\${encodeURIComponent(app.icon)}"
						alt="\${name}"
						loading="lazy"
						decoding="async"
					>
				\`
				: \`
					<span>APK</span>
				\`;

			return \`

				<article class="card">

					<a href="/aplikasi/\${slug}">

						<div class="thumb">
							\${icon}
						</div>

						<div class="body">

							<span class="badge">
								\${category}
							</span>

							<h3>
								\${title}
							</h3>

							<p>
								\${description}
							</p>

						</div>

					</a>

				</article>

			\`;

		}).join("");

	} catch (error) {

		console.error(error);

		container.innerHTML = \`
			<div class="seo-box">
				<p>
					Gagal memuat daftar aplikasi.
				</p>
			</div>
		\`;

	}

	function escapeHTML(value) {

		return String(value || "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");

	}

})();
</script>
`
	});
}
