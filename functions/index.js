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
			Temukan dan download berbagai aplikasi Android terbaru
			dengan informasi lengkap, mulai dari versi, ukuran,
			developer, hingga kategori aplikasi.
		</p>
	</div>
</section>

<section class="seo-box">
	<h2>Direktori Aplikasi Android</h2>

	<p>
		Jelajahi koleksi aplikasi Android gratis dalam berbagai kategori.
		Setiap halaman aplikasi menyediakan informasi seperti deskripsi,
		versi, ukuran file APK, nama developer, package name,
		tanggal pembaruan, ikon, dan screenshot aplikasi.
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
(async function(){

	const container = document.getElementById("apps");

	try {

		const response = await fetch("/api/apps");

		if (!response.ok) {
			throw new Error("API error");
		}

		const data = await response.json();

		const apps = Array.isArray(data)
			? data
			: (data.apps || []);

		if (!apps.length) {

			container.innerHTML = \`
				<div class="seo-box">
					<p>Belum ada aplikasi yang tersedia.</p>
				</div>
			\`;

			return;
		}

		container.innerHTML = apps.map(app => \`

			<article class="card">

				<a href="/app/\${encodeURIComponent(app.slug)}">

					<div class="thumb">

						\${
							app.icon
								? \`<img
									src="/images/\${encodeURIComponent(app.icon)}"
									alt="\${escapeHTML(app.name || app.title || "APK")}"
									loading="lazy"
									>\`
								: \`<span>APK</span>\`
						}

					</div>

					<div class="body">

						<span class="badge">
							\${escapeHTML(app.category || "APK")}
						</span>

						<h3>
							\${escapeHTML(app.title || app.name || app.slug)}
						</h3>

						<p>
							\${escapeHTML(app.description || "")}
						</p>

					</div>

				</a>

			</article>

		\`).join("");

	} catch (error) {

		container.innerHTML = \`
			<div class="seo-box">
				<p>Gagal memuat daftar aplikasi.</p>
			</div>
		\`;

		console.error(error);

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
