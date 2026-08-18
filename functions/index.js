import { layout } from "../lib/render";

export async function onRequest(context) {

	try {

		return layout({

			title: "Download APK Gratis - Aplikasi Android Terbaru",

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
			Temukan berbagai aplikasi Android terbaru dengan
			informasi lengkap mengenai versi, ukuran,
			developer, kategori, dan pembaruan aplikasi.
		</p>

	</div>

</section>


<section class="seo-box">

	<h2>
		Direktori Aplikasi Android
	</h2>

	<p>
		Jelajahi koleksi aplikasi Android gratis dari berbagai
		kategori. Setiap halaman aplikasi menyediakan informasi
		lengkap seperti deskripsi, versi APK, ukuran file,
		developer, package name, tanggal pembaruan, ikon,
		dan screenshot aplikasi.
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


	<div
		id="apk-apps"
		class="grid"
	>

		<div class="card">

			<div class="body">
				Memuat aplikasi...
			</div>

		</div>

	</div>

</section>


<script>

(async function(){

	const container =
		document.getElementById("apk-apps");

	if(!container) return;

	try {

		const response =
			await fetch("/api/apps");

		if(!response.ok){

			throw new Error(
				"API error: " + response.status
			);

		}

		const data =
			await response.json();

		const apps =
			Array.isArray(data)
				? data
				: (
					Array.isArray(data.apps)
						? data.apps
						: []
				);


		if(!apps.length){

			container.innerHTML = \`
				<div class="seo-box">

					<p>
						Belum ada aplikasi yang tersedia.
					</p>

				</div>
			\`;

			return;

		}


		container.innerHTML =
			apps.slice(0,12).map(app => {

				const slug =
					encodeURIComponent(
						app.slug || ""
					);

				const name =
					escapeHTML(
						app.name ||
						app.title ||
						"APK"
					);

				const title =
					escapeHTML(
						app.title ||
						app.name ||
						app.slug ||
						"APK"
					);

				const description =
					escapeHTML(
						app.description || ""
					);

				const category =
					escapeHTML(
						app.category ||
						"APK"
					);


				const icon =
					app.icon
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


	} catch(error) {

		console.error(
			"APK API error:",
			error
		);

		container.innerHTML = \`
			<div class="seo-box">

				<p>
					Gagal memuat daftar aplikasi.
				</p>

			</div>
		\`;

	}


	function escapeHTML(value){

		return String(value || "")
			.replace(/&/g,"&amp;")
			.replace(/</g,"&lt;")
			.replace(/>/g,"&gt;")
			.replace(/"/g,"&quot;")
			.replace(/'/g,"&#039;");

	}

})();

</script>

`

		});

	} catch(error) {

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
