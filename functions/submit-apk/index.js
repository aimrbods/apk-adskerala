const GOOGLE_SCRIPT_URL =
	"https://script.google.com/macros/s/AKfycbxYhbQZ1FPidOVedmVQeegUk2pZA888NNoBk2qLKF819L1sZ722qmYRHu5834bCTSR6/exec";

const SITE_NAME = "APK Directory";
const SITE_URL = "https://apk.adskerala.com";


export async function onRequest(context) {

	const request = context.request;

	try {

		if (request.method === "GET") {
			return renderForm();
		}

		if (request.method === "POST") {
			return submitAPK(request);
		}

		return json({
			success: false,
			error: "Method Not Allowed"
		}, 405);

	} catch (error) {

		return json({
			success: false,
			error: error?.message || "Terjadi kesalahan"
		}, 500);

	}
}


/* =====================================================
   SUBMIT APK
===================================================== */

async function submitAPK(request) {

	let body;

	try {

		body = await request.json();

	} catch {

		return json({
			success: false,
			error: "Data form tidak valid"
		}, 400);

	}


	const senderName =
		String(body.sender_name || "").trim();

	const email =
		String(body.email || "").trim();

	const name =
		String(body.name || "").trim();

	const title =
		String(body.title || "").trim();

	const description =
		String(body.description || "").trim();

	const version =
		String(body.version || "").trim();

	const size =
		String(body.size || "").trim();

	const developer =
		String(body.developer || "").trim();

	const category =
		String(body.category || "").trim();

	const packageName =
		String(body.package_name || "").trim();

	const apkFile =
		String(body.apk_file || "").trim();

	const icon =
		String(body.icon || "").trim();

	const screenshots =
		String(body.screenshots || "").trim();


	/* =================================================
	   VALIDATION
	================================================= */

	if (!senderName) {

		return json({
			success: false,
			error: "Nama pengirim wajib diisi"
		}, 400);

	}


	if (!email) {

		return json({
			success: false,
			error: "Email wajib diisi"
		}, 400);

	}


	if (!isValidEmail(email)) {

		return json({
			success: false,
			error: "Format email tidak valid"
		}, 400);

	}


	if (!name) {

		return json({
			success: false,
			error: "Nama aplikasi wajib diisi"
		}, 400);

	}


	if (!title) {

		return json({
			success: false,
			error: "Judul aplikasi wajib diisi"
		}, 400);

	}


	if (!description) {

		return json({
			success: false,
			error: "Deskripsi wajib diisi"
		}, 400);

	}


	if (!category) {

		return json({
			success: false,
			error: "Kategori wajib dipilih"
		}, 400);

	}


	/* =================================================
	   DATA KE APPS SCRIPT
	================================================= */

	const payload = {

		sender_name: senderName,

		email: email,

		name: name,

		title: title,

		description: description,

		version: version,

		size: size,

		developer: developer,

		category: category,

		package_name: packageName,

		updated:
			new Date().toISOString().slice(0, 10),

		apk_file: apkFile,

		icon: icon,

		screenshots: screenshots,

		status: "pending"

	};


	/* =================================================
	   KIRIM KE GOOGLE APPS SCRIPT
	================================================= */

	if (
		!GOOGLE_SCRIPT_URL ||
		GOOGLE_SCRIPT_URL.includes(
			"GANTI_DENGAN_URL"
		)
	) {

		return json({
			success: false,
			error:
				"GOOGLE_SCRIPT_URL belum dikonfigurasi"
		}, 500);

	}


	const response =
		await fetch(
			GOOGLE_SCRIPT_URL,
			{
				method: "POST",

				headers: {
					"content-type":
						"application/json"
				},

				body:
					JSON.stringify(payload)
			}
		);


	let result;

	try {

		result =
			await response.json();

	} catch {

		result = null;

	}


	if (!response.ok) {

		return json({
			success: false,
			error:
				"Google Apps Script gagal menerima data"
		}, 502);

	}


	if (
		result &&
		result.success === false
	) {

		return json({
			success: false,
			error:
				result.error ||
				"Data gagal disimpan"
		}, 400);

	}


	return json({

		success: true,

		message:
			"APK berhasil dikirim dan menunggu moderasi"

	});

}


/* =====================================================
   FORM
===================================================== */

function renderForm() {

	return new Response(

`<!DOCTYPE html>

<html lang="id">

<head>

<meta charset="UTF-8">

<meta
	name="viewport"
	content="width=device-width,initial-scale=1"
>

<title>
Submit APK - ${escapeHTML(SITE_NAME)}
</title>

<meta
	name="description"
	content="Kirim aplikasi Android untuk ditambahkan ke APK Directory."
>

<style>

:root{

	--bg:#020617;
	--card:#0f172a;
	--card2:#111827;
	--text:#f8fafc;
	--muted:#94a3b8;
	--border:#1e293b;
	--primary:#6366f1;
	--primary2:#8b5cf6;
	--success:#22c55e;
	--danger:#ef4444;

}

*{
	box-sizing:border-box;
	margin:0;
	padding:0;
}

body{

	font-family:
	Inter,
	system-ui,
	Arial,
	sans-serif;

	background:

	radial-gradient(
		circle at top left,
		rgba(99,102,241,.14),
		transparent 35%
	),

	radial-gradient(
		circle at bottom right,
		rgba(139,92,246,.10),
		transparent 35%
	),

	var(--bg);

	color:var(--text);

	line-height:1.6;

	min-height:100vh;

}

a{
	color:inherit;
	text-decoration:none;
}


/* HEADER */

.header{

	position:sticky;

	top:0;

	z-index:10;

	background:
	rgba(2,6,23,.86);

	backdrop-filter:
	blur(14px);

	border-bottom:
	1px solid rgba(255,255,255,.06);

}

.header-inner{

	max-width:1000px;

	margin:auto;

	padding:
	16px 20px;

	display:flex;

	align-items:center;

	justify-content:space-between;

}

.logo{

	font-size:20px;

	font-weight:800;

}

.logo span{

	background:
	linear-gradient(
		90deg,
		#8b5cf6,
		#06b6d4
	);

	-webkit-background-clip:text;

	-webkit-text-fill-color:
	transparent;

}

.back{

	font-size:14px;

	color:var(--muted);

}

.back:hover{
	color:#fff;
}


/* CONTAINER */

.container{

	max-width:850px;

	margin:auto;

	padding:
	45px 20px 70px;

}


/* HERO */

.hero{

	text-align:center;

	margin-bottom:30px;

}

.hero-badge{

	display:inline-block;

	padding:
	6px 12px;

	border-radius:999px;

	background:
	rgba(99,102,241,.14);

	border:
	1px solid
	rgba(99,102,241,.25);

	color:#c7d2fe;

	font-size:12px;

	font-weight:700;

	margin-bottom:14px;

}

.hero h1{

	font-size:
	clamp(30px,5vw,44px);

	line-height:1.15;

	margin-bottom:12px;

}

.hero p{

	max-width:650px;

	margin:auto;

	color:var(--muted);

	font-size:15px;

}


/* FORM CARD */

.form-card{

	background:
	linear-gradient(
		180deg,
		rgba(255,255,255,.035),
		rgba(255,255,255,.015)
	);

	border:
	1px solid var(--border);

	border-radius:24px;

	padding:28px;

	box-shadow:
	0 20px 60px
	rgba(0,0,0,.25);

}


/* SECTION */

.form-section{

	margin-bottom:30px;

}

.form-section:last-child{
	margin-bottom:0;
}

.section-heading{

	display:flex;

	align-items:center;

	gap:10px;

	margin-bottom:18px;

	padding-bottom:12px;

	border-bottom:
	1px solid var(--border);

}

.section-number{

	width:28px;

	height:28px;

	display:flex;

	align-items:center;

	justify-content:center;

	border-radius:9px;

	background:
	rgba(99,102,241,.16);

	color:#a5b4fc;

	font-size:13px;

	font-weight:800;

}

.section-heading h2{

	font-size:18px;

}


/* GRID */

.grid{

	display:grid;

	grid-template-columns:
	repeat(2,minmax(0,1fr));

	gap:16px;

}

.full{
	grid-column:1/-1;
}


/* FIELD */

.field{

	display:flex;

	flex-direction:column;

	gap:7px;

}

.field label{

	font-size:13px;

	font-weight:700;

	color:#e2e8f0;

}

.required{
	color:#f87171;
}

.field input,
.field textarea,
.field select{

	width:100%;

	border:
	1px solid #263449;

	border-radius:12px;

	background:
	rgba(15,23,42,.9);

	color:#f8fafc;

	padding:
	12px 13px;

	font:
	inherit;

	font-size:14px;

	outline:none;

	transition:
	border-color .2s,
	box-shadow .2s;

}

.field textarea{

	min-height:130px;

	resize:vertical;

}

.field input::placeholder,
.field textarea::placeholder{
	color:#64748b;
}

.field input:focus,
.field textarea:focus,
.field select:focus{

	border-color:
	#6366f1;

	box-shadow:
	0 0 0 3px
	rgba(99,102,241,.12);

}

.help{

	font-size:11px;

	color:#64748b;

}


/* SUBMIT */

.submit-area{

	margin-top:28px;

	padding-top:24px;

	border-top:
	1px solid var(--border);

}

.submit-btn{

	width:100%;

	border:0;

	border-radius:14px;

	padding:
	14px 20px;

	background:
	linear-gradient(
		135deg,
		#4f46e5,
		#7c3aed
	);

	color:#fff;

	font-size:15px;

	font-weight:800;

	cursor:pointer;

	transition:
	transform .2s,
	opacity .2s;

}

.submit-btn:hover{

	transform:
	translateY(-1px);

}

.submit-btn:disabled{

	opacity:.55;

	cursor:
	not-allowed;

	transform:none;

}

.note{

	margin-top:12px;

	text-align:center;

	font-size:12px;

	color:var(--muted);

}


/* RESULT */

.result{

	display:none;

	margin-bottom:20px;

	padding:15px 17px;

	border-radius:13px;

	font-size:14px;

}

.result.success{

	display:block;

	background:
	rgba(34,197,94,.10);

	border:
	1px solid
	rgba(34,197,94,.25);

	color:#86efac;

}

.result.error{

	display:block;

	background:
	rgba(239,68,68,.10);

	border:
	1px solid
	rgba(239,68,68,.25);

	color:#fca5a5;

}


/* MOBILE */

@media(max-width:700px){

	.container{

		padding:
		30px 14px 50px;

	}

	.form-card{

		padding:20px;

		border-radius:20px;

	}

	.grid{

		grid-template-columns:1fr;

	}

	.full{

		grid-column:auto;

	}

	.header-inner{

		padding:
		14px;

	}

}

</style>

</head>


<body>


<header class="header">

	<div class="header-inner">

		<a
			href="/"
			class="logo"
		>
			⚡
			<span>
				${escapeHTML(SITE_NAME)}
			</span>
		</a>

		<a
			href="/"
			class="back"
		>
			← Kembali
		</a>

	</div>

</header>


<main class="container">


<div class="hero">

	<div class="hero-badge">
		GUEST SUBMISSION
	</div>

	<h1>
		Submit APK
	</h1>

	<p>
		Kirim aplikasi Android Anda ke
		${escapeHTML(SITE_NAME)}.
		Data akan diperiksa terlebih dahulu
		sebelum dipublikasikan.
	</p>

</div>


<div
	id="result"
	class="result"
></div>


<form
	id="submitForm"
	class="form-card"
	novalidate
>


<!-- PENGIRIM -->

<section class="form-section">

	<div class="section-heading">

		<div class="section-number">
			1
		</div>

		<h2>
			Informasi Pengirim
		</h2>

	</div>


	<div class="grid">

		<div class="field">

			<label for="sender_name">
				Nama Pengirim
				<span class="required">*</span>
			</label>

			<input
				id="sender_name"
				name="sender_name"
				type="text"
				placeholder="Nama Anda"
				autocomplete="name"
				required
			>

		</div>


		<div class="field">

			<label for="email">
				Email
				<span class="required">*</span>
			</label>

			<input
				id="email"
				name="email"
				type="email"
				placeholder="email@example.com"
				autocomplete="email"
				required
			>

		</div>

	</div>

</section>


<!-- APLIKASI -->

<section class="form-section">

	<div class="section-heading">

		<div class="section-number">
			2
		</div>

		<h2>
			Informasi Aplikasi
		</h2>

	</div>


	<div class="grid">


		<div class="field">

			<label for="name">
				Nama Aplikasi
				<span class="required">*</span>
			</label>

			<input
				id="name"
				name="name"
				type="text"
				placeholder="Contoh App"
				required
			>

		</div>


		<div class="field">

			<label for="title">
				Judul
				<span class="required">*</span>
			</label>

			<input
				id="title"
				name="title"
				type="text"
				placeholder="Contoh App APK"
				required
			>

		</div>


		<div class="field full">

			<label for="description">
				Deskripsi
				<span class="required">*</span>
			</label>

			<textarea
				id="description"
				name="description"
				placeholder="Jelaskan aplikasi secara singkat..."
				required
			></textarea>

		</div>


		<div class="field">

			<label for="version">
				Versi
			</label>

			<input
				id="version"
				name="version"
				type="text"
				placeholder="1.0.0"
			>

		</div>


		<div class="field">

			<label for="size">
				Ukuran
			</label>

			<input
				id="size"
				name="size"
				type="text"
				placeholder="25 MB"
			>

		</div>


		<div class="field">

			<label for="developer">
				Developer
			</label>

			<input
				id="developer"
				name="developer"
				type="text"
				placeholder="Nama developer"
			>

		</div>


		<div class="field">

			<label for="category">
				Kategori
				<span class="required">*</span>
			</label>

			<select
				id="category"
				name="category"
				required
			>

				<option value="">
					Pilih kategori
				</option>

				<option value="Tools">
					Tools
				</option>

				<option value="Games">
					Games
				</option>

				<option value="Social">
					Social
				</option>

				<option value="Education">
					Education
				</option>

				<option value="Entertainment">
					Entertainment
				</option>

				<option value="Productivity">
					Productivity
				</option>

				<option value="Photography">
					Photography
				</option>

				<option value="Music">
					Music
				</option>

				<option value="Other">
					Other
				</option>

			</select>

		</div>


		<div class="field full">

			<label for="package_name">
				Package Name
			</label>

			<input
				id="package_name"
				name="package_name"
				type="text"
				placeholder="com.example.app"
			>

		</div>

	</div>

</section>


<!-- FILE -->

<section class="form-section">

	<div class="section-heading">

		<div class="section-number">
			3
		</div>

		<h2>
			File & Media
		</h2>

	</div>


	<div class="grid">


		<div class="field full">

			<label for="apk_file">
				APK File
			</label>

			<input
				id="apk_file"
				name="apk_file"
				type="text"
				placeholder="nama-aplikasi.apk"
			>

			<span class="help">
				Nama file atau path Google Drive
				yang digunakan sistem.
			</span>

		</div>


		<div class="field full">

			<label for="icon">
				Icon
			</label>

			<input
				id="icon"
				name="icon"
				type="text"
				placeholder="icon.webp atau URL gambar"
			>

		</div>


		<div class="field full">

			<label for="screenshots">
				Screenshots
			</label>

			<input
				id="screenshots"
				name="screenshots"
				type="text"
				placeholder="screen1.webp, screen2.webp"
			>

			<span class="help">
				Pisahkan beberapa nama file dengan koma.
			</span>

		</div>

	</div>

</section>


<div class="submit-area">

	<button
		type="submit"
		id="submitButton"
		class="submit-btn"
	>
		Kirim APK
	</button>

	<p class="note">
		Submission akan masuk status
		<strong>pending</strong>
		dan diperiksa sebelum dipublikasikan.
	</p>

</div>


</form>


</main>


<script>

const form =
	document.getElementById(
		"submitForm"
	);

const button =
	document.getElementById(
		"submitButton"
	);

const result =
	document.getElementById(
		"result"
	);


form.addEventListener(
	"submit",
	async function(event) {

		event.preventDefault();


		result.className =
			"result";

		result.textContent =
			"";


		if (!form.checkValidity()) {

			form.reportValidity();

			return;

		}


		button.disabled = true;

		button.textContent =
			"Mengirim...";


		const formData =
			new FormData(form);

		const data = {};


		formData.forEach(
			(value, key) => {

				data[key] =
					String(value).trim();

			}
		);


		try {

			const response =
				await fetch(
					"/submit-apk",
					{
						method: "POST",

						headers: {
							"content-type":
								"application/json"
						},

						body:
							JSON.stringify(data)
					}
				);


			const jsonData =
				await response.json();


			if (
				!response.ok ||
				!jsonData.success
			) {

				throw new Error(
					jsonData.error ||
					"Gagal mengirim data"
				);

			}


			result.className =
				"result success";

			result.textContent =
				"Berhasil dikirim. APK akan diperiksa terlebih dahulu sebelum dipublikasikan.";

			form.reset();


		} catch (error) {

			result.className =
				"result error";

			result.textContent =
				error.message ||
				"Gagal mengirim data.";

		} finally {

			button.disabled = false;

			button.textContent =
				"Kirim APK";

			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});

		}

	}
);


/* =====================================================
   EMAIL VALIDATION
===================================================== */

function isValidEmail(value) {

	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
		String(value)
	);

}

</script>


</body>

</html>`,

	{
		status:200,

		headers:{
			"content-type":
				"text/html;charset=UTF-8",

			"cache-control":
				"no-store"
		}
	}

	);

}


/* =====================================================
   EMAIL
===================================================== */

function isValidEmail(value) {

	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
		String(value)
	);

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value = "") {

	return String(value)

		.replace(/&/g, "&amp;")

		.replace(/</g, "&lt;")

		.replace(/>/g, "&gt;")

		.replace(/"/g, "&quot;")

		.replace(/'/g, "&#039;");

}


/* =====================================================
   JSON
===================================================== */

function json(data, status = 200) {

	return new Response(

		JSON.stringify(
			data,
			null,
			2
		),

		{
			status,

			headers:{
				"content-type":
					"application/json;charset=UTF-8",

				"cache-control":
					"no-store"
			}
		}

	);

}
