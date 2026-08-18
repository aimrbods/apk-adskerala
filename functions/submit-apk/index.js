
import { layout } from "../../lib/render";
import { SITE, escapeHTML } from "../../lib/config";


export async function onRequest(context) {

	return layout({

		title:
			`Submit APK - ${SITE.name}`,

		description:
			"Kirim aplikasi Android untuk ditambahkan ke direktori APK. Semua submission akan melalui proses review.",

		canonical:
			"/submit-apk",

		content: `

<style>

/* =========================================
   SUBMIT APK
========================================= */

.submit-page{
	max-width:820px;
	margin:0 auto;
	padding:10px 0 50px;
}

.submit-header{
	text-align:center;
	margin-bottom:30px;
}

.submit-header .submit-badge{
	display:inline-flex;
	align-items:center;
	gap:7px;
	padding:7px 13px;
	border-radius:999px;
	background:rgba(99,102,241,.12);
	border:1px solid rgba(99,102,241,.25);
	color:#a5b4fc;
	font-size:12px;
	font-weight:700;
	margin-bottom:14px;
}

.submit-header h1{
	font-size:38px;
	line-height:1.2;
	color:#fff;
	margin-bottom:10px;
}

.submit-header p{
	max-width:650px;
	margin:0 auto;
	color:#94a3b8;
	font-size:15px;
}


/* FORM CARD */

.submit-card{
	background:
	linear-gradient(
		180deg,
		rgba(255,255,255,.045),
		rgba(255,255,255,.018)
	);

	border:1px solid #1e293b;

	border-radius:24px;

	padding:28px;

	box-shadow:
	0 20px 50px rgba(0,0,0,.25);
}


/* SECTION */

.form-section{
	margin-bottom:30px;
}

.form-section:last-of-type{
	margin-bottom:0;
}

.form-section-title{
	display:flex;
	align-items:center;
	gap:12px;

	margin-bottom:18px;

	padding-bottom:12px;

	border-bottom:
	1px solid rgba(255,255,255,.06);
}

.form-section-number{
	width:30px;
	height:30px;

	display:flex;
	align-items:center;
	justify-content:center;

	flex-shrink:0;

	border-radius:9px;

	background:
	linear-gradient(
		135deg,
		#4f46e5,
		#7c3aed
	);

	color:#fff;

	font-size:13px;
	font-weight:800;
}

.form-section-title h2{
	font-size:18px;
	color:#fff;
}


/* GRID */

.form-grid{
	display:grid;

	grid-template-columns:
	repeat(2,minmax(0,1fr));

	gap:18px;
}

.form-group{
	display:flex;
	flex-direction:column;
	gap:7px;
}

.form-group.full{
	grid-column:1 / -1;
}


/* LABEL */

.form-group label{
	font-size:13px;
	font-weight:700;
	color:#e2e8f0;
}

.required{
	color:#f87171;
}


/* INPUT */

.form-control{
	width:100%;

	padding:12px 14px;

	border-radius:11px;

	border:
	1px solid #263449;

	background:#0b1220;

	color:#f8fafc;

	font-family:inherit;

	font-size:14px;

	outline:none;

	transition:
		border-color .2s,
		box-shadow .2s,
		background .2s;
}

.form-control::placeholder{
	color:#64748b;
}

.form-control:focus{
	border-color:#6366f1;

	background:#0d1526;

	box-shadow:
	0 0 0 3px
	rgba(99,102,241,.12);
}

textarea.form-control{
	min-height:130px;
	resize:vertical;
	line-height:1.6;
}

.form-help{
	font-size:11px;
	color:#64748b;
	line-height:1.5;
}


/* SUBMITTER */

.submit-notice{
	margin-top:25px;

	padding:15px 16px;

	border-radius:13px;

	background:
	rgba(14,165,233,.06);

	border:
	1px solid rgba(14,165,233,.15);

	color:#94a3b8;

	font-size:13px;

	line-height:1.6;
}

.submit-notice strong{
	color:#e2e8f0;
}


/* BUTTON */

.submit-actions{
	margin-top:28px;
}

.submit-button{
	width:100%;

	border:0;

	padding:14px 20px;

	border-radius:13px;

	background:
	linear-gradient(
		135deg,
		#4f46e5,
		#7c3aed
	);

	color:#fff;

	font-family:inherit;

	font-size:15px;

	font-weight:800;

	cursor:pointer;

	box-shadow:
	0 10px 30px
	rgba(79,70,229,.25);

	transition:
		transform .2s,
		box-shadow .2s,
		opacity .2s;
}

.submit-button:hover{
	transform:translateY(-1px);

	box-shadow:
	0 14px 35px
	rgba(79,70,229,.35);
}

.submit-button:disabled{
	cursor:not-allowed;
	opacity:.6;
	transform:none;
}


/* RESULT */

.submit-result{
	display:none;

	margin-top:18px;

	padding:15px 16px;

	border-radius:12px;

	font-size:13px;

	line-height:1.6;
}

.submit-result.success{
	display:block;

	background:
	rgba(34,197,94,.08);

	border:
	1px solid rgba(34,197,94,.2);

	color:#86efac;
}

.submit-result.error{
	display:block;

	background:
	rgba(239,68,68,.08);

	border:
	1px solid rgba(239,68,68,.2);

	color:#fca5a5;
}


/* MOBILE */

@media(max-width:700px){

	.submit-page{
		padding-bottom:30px;
	}

	.submit-card{
		padding:20px 16px;

		border-radius:20px;
	}

	.submit-header h1{
		font-size:30px;
	}

	.submit-header p{
		font-size:14px;
	}

	.form-grid{
		grid-template-columns:1fr;
	}

	.form-group.full{
		grid-column:auto;
	}

}

</style>


<div class="submit-page">


	<header class="submit-header">

		<div class="submit-badge">
			⚡ Guest Post APK
		</div>

		<h1>
			Submit APK
		</h1>

		<p>
			Punya aplikasi Android?
			Kirim aplikasi kamu untuk ditambahkan
			ke ${escapeHTML(SITE.name)}.
			Setiap submission akan diperiksa terlebih dahulu.
		</p>

	</header>


	<form
		id="submit-apk-form"
		class="submit-card"
		novalidate
	>


		<!-- =========================
		     INFORMASI APLIKASI
		========================== -->

		<section class="form-section">

			<div class="form-section-title">

				<div class="form-section-number">
					1
				</div>

				<h2>
					Informasi Aplikasi
				</h2>

			</div>


			<div class="form-grid">


				<div class="form-group">

					<label for="name">
						Nama Aplikasi
						<span class="required">*</span>
					</label>

					<input
						id="name"
						name="name"
						class="form-control"
						type="text"
						placeholder="Contoh App"
						required
						maxlength="150"
					>

				</div>


				<div class="form-group">

					<label for="title">
						Judul
					</label>

					<input
						id="title"
						name="title"
						class="form-control"
						type="text"
						placeholder="Contoh App APK"
						maxlength="200"
					>

				</div>


				<div class="form-group full">

					<label for="description">
						Deskripsi
						<span class="required">*</span>
					</label>

					<textarea
						id="description"
						name="description"
						class="form-control"
						placeholder="Jelaskan fungsi dan fitur aplikasi..."
						required
						maxlength="5000"
					></textarea>

				</div>


				<div class="form-group">

					<label for="category">
						Kategori
						<span class="required">*</span>
					</label>

					<input
						id="category"
						name="category"
						class="form-control"
						type="text"
						placeholder="Tools"
						required
						maxlength="100"
					>

				</div>


				<div class="form-group">

					<label for="developer">
						Developer
					</label>

					<input
						id="developer"
						name="developer"
						class="form-control"
						type="text"
						placeholder="Nama Developer"
						maxlength="150"
					>

				</div>


			</div>

		</section>


		<!-- =========================
		     DETAIL APK
		========================== -->

		<section class="form-section">

			<div class="form-section-title">

				<div class="form-section-number">
					2
				</div>

				<h2>
					Detail APK
				</h2>

			</div>


			<div class="form-grid">


				<div class="form-group">

					<label for="version">
						Versi
					</label>

					<input
						id="version"
						name="version"
						class="form-control"
						type="text"
						placeholder="1.0.0"
						maxlength="50"
					>

				</div>


				<div class="form-group">

					<label for="size">
						Ukuran
					</label>

					<input
						id="size"
						name="size"
						class="form-control"
						type="text"
						placeholder="25 MB"
						maxlength="50"
					>

				</div>


				<div class="form-group">

					<label for="package_name">
						Package Name
					</label>

					<input
						id="package_name"
						name="package_name"
						class="form-control"
						type="text"
						placeholder="com.example.app"
						maxlength="200"
					>

				</div>


				<div class="form-group">

					<label for="updated">
						Tanggal Update
					</label>

					<input
						id="updated"
						name="updated"
						class="form-control"
						type="date"
					>

				</div>


				<div class="form-group">

					<label for="icon">
						Icon
					</label>

					<input
						id="icon"
						name="icon"
						class="form-control"
						type="text"
						placeholder="contoh.webp atau URL"
						maxlength="500"
					>

					<span class="form-help">
						Nama file icon atau URL gambar.
					</span>

				</div>


				<div class="form-group">

					<label for="screenshots">
						Screenshots
					</label>

					<input
						id="screenshots"
						name="screenshots"
						class="form-control"
						type="text"
						placeholder="screen1.webp, screen2.webp"
						maxlength="2000"
					>

					<span class="form-help">
						Pisahkan beberapa file dengan koma.
					</span>

				</div>


				<div class="form-group full">

					<label for="apk_file">
						File APK
					</label>

					<input
						id="apk_file"
						name="apk_file"
						class="form-control"
						type="text"
						placeholder="Nama file atau URL APK"
						maxlength="1000"
					>

					<span class="form-help">
						Untuk sementara masukkan nama file atau URL APK.
					</span>

				</div>


			</div>

		</section>


		<!-- =========================
		     DATA PENGIRIM
		========================== -->

		<section class="form-section">

			<div class="form-section-title">

				<div class="form-section-number">
					3
				</div>

				<h2>
					Data Pengirim
				</h2>

			</div>


			<div class="form-grid">


				<div class="form-group">

					<label for="submitter_name">
						Nama
						<span class="required">*</span>
					</label>

					<input
						id="submitter_name"
						name="submitter_name"
						class="form-control"
						type="text"
						placeholder="Nama kamu"
						required
						maxlength="150"
					>

				</div>


				<div class="form-group">

					<label for="submitter_email">
						Email
						<span class="required">*</span>
					</label>

					<input
						id="submitter_email"
						name="submitter_email"
						class="form-control"
						type="email"
						placeholder="email@example.com"
						required
						maxlength="200"
					>

				</div>


				<div class="form-group full">

					<label for="notes">
						Catatan
					</label>

					<textarea
						id="notes"
						name="notes"
						class="form-control"
						placeholder="Informasi tambahan mengenai aplikasi..."
						maxlength="2000"
					></textarea>

				</div>


			</div>


			<div class="submit-notice">

				<strong>Catatan:</strong>
				Submission tidak langsung dipublikasikan.
				Tim akan melakukan review terlebih dahulu.
				Aplikasi yang memenuhi ketentuan akan
				diubah menjadi status <strong>publish</strong>.

			</div>


		</section>


		<div class="submit-actions">

			<button
				type="submit"
				id="submit-button"
				class="submit-button"
			>
				<span id="submit-text">
					Kirim APK untuk Review
				</span>
			</button>

		</div>


		<div
			id="submit-result"
			class="submit-result"
			role="status"
			aria-live="polite"
		></div>


	</form>

</div>


<script>

(() => {

	const form =
		document.getElementById(
			"submit-apk-form"
		);

	const button =
		document.getElementById(
			"submit-button"
		);

	const text =
		document.getElementById(
			"submit-text"
		);

	const result =
		document.getElementById(
			"submit-result"
		);


	if (!form) {
		return;
	}


	form.addEventListener(
		"submit",
		async event => {

			event.preventDefault();


			result.className =
				"submit-result";

			result.textContent =
				"";


			if (!form.checkValidity()) {

				form.reportValidity();

				return;

			}


			button.disabled =
				true;

			text.textContent =
				"Mengirim...";


			const formData =
				new FormData(form);


			const data =
				Object.fromEntries(
					formData.entries()
				);


			/*
			 * Slug dibuat server.
			 */

			delete data.slug;


			try {

				const response =
					await fetch(
						"/api/submit-apk",
						{
							method:
								"POST",

							headers: {
								"content-type":
									"application/json",

								"accept":
									"application/json"
							},

							body:
								JSON.stringify(data)
						}
					);


				const json =
					await response.json();


				if (
					!response.ok ||
					!json.success
				) {

					throw new Error(
						json.error ||
						"Submission gagal"
					);

				}


				result.className =
					"submit-result success";

				result.innerHTML =
					`
					<strong>
						✓ Berhasil dikirim
					</strong>
					<br>
					APK kamu sudah diterima
					dan sedang menunggu review.
					`;


				form.reset();


			} catch (error) {

				result.className =
					"submit-result error";

				result.innerHTML =
					`
					<strong>
						✕ Gagal mengirim
					</strong>
					<br>
					${escapeHTML(
						error.message
					)}
					`;

			} finally {

				button.disabled =
					false;

				text.textContent =
					"Kirim APK untuk Review";

			}

		}
	);

})();

</script>

`
	});

}
