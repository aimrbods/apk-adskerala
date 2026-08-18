const SUBMIT_API =
	"https://script.google.com/macros/s/AKfycbxYhbQZ1FPidOVedmVQeegUk2pZA888NNoBk2qLKF819L1sZ722qmYRHu5834bCTSR6/exec";


export async function onRequestPost(context) {

	try {

		const request =
			context.request;


		const contentType =
			request.headers.get(
				"content-type"
			) || "";


		if (
			!contentType
				.toLowerCase()
				.includes("application/json")
		) {

			return json({

				success: false,

				error:
					"Request harus menggunakan application/json"

			}, 400);

		}


		const body =
			await request.json();


		/*
		 * ========================================
		 * DATA APK
		 * ========================================
		 */

		const name =
			clean(body.name);

		const title =
			clean(body.title);

		const slug =
			sanitizeSlug(
				body.slug || name
			);

		const category =
			clean(body.category);

		const icon =
			clean(body.icon);

		const version =
			clean(body.version);

		const size =
			clean(body.size);

		const developer =
			clean(body.developer);

		const packageName =
			clean(body.package_name);

		const description =
			clean(body.description);

		const screenshots =
			clean(body.screenshots);

		const apkFile =
			clean(body.apk_file);

		const updated =
			clean(body.updated) ||
			getDate();


		/*
		 * ========================================
		 * DATA PENGIRIM
		 * ========================================
		 */

		const submitterName =
			clean(
				body.submitter_name
			);

		const submitterEmail =
			clean(
				body.submitter_email
			);

		const notes =
			clean(
				body.notes
			);


		/*
		 * ========================================
		 * VALIDASI
		 * ========================================
		 */

		if (!name) {

			return json({

				success: false,

				error:
					"Nama aplikasi wajib diisi"

			}, 400);

		}


		if (!title) {

			return json({

				success: false,

				error:
					"Judul aplikasi wajib diisi"

			}, 400);

		}


		if (!slug) {

			return json({

				success: false,

				error:
					"Slug aplikasi tidak valid"

			}, 400);

		}


		if (!category) {

			return json({

				success: false,

				error:
					"Kategori wajib diisi"

			}, 400);

		}


		if (!description) {

			return json({

				success: false,

				error:
					"Deskripsi aplikasi wajib diisi"

			}, 400);

		}


		if (!submitterName) {

			return json({

				success: false,

				error:
					"Nama pengirim wajib diisi"

			}, 400);

		}


		if (!submitterEmail) {

			return json({

				success: false,

				error:
					"Email pengirim wajib diisi"

			}, 400);

		}


		if (
			!isValidEmail(
				submitterEmail
			)
		) {

			return json({

				success: false,

				error:
					"Format email tidak valid"

			}, 400);

		}


		/*
		 * ========================================
		 * ID SUBMISSION
		 * ========================================
		 */

		const id =
			"APK-" +
			Date.now()
				.toString(36)
				.toUpperCase();


		/*
		 * ========================================
		 * PAYLOAD
		 * ========================================
		 *
		 * Nama field dibuat sama dengan
		 * struktur Apps yang digunakan Worker.
		 *
		 */

		const payload = {

			id,

			slug,

			name,

			title,

			category,

			icon,

			version,

			size,

			developer,

			package_name:
				packageName,

			description,

			screenshots,

			apk_file:
				apkFile,

			updated,

			/*
			 * WAJIB pending.
			 *
			 * Jangan menerima status
			 * dari user.
			 */

			status:
				"pending",

			/*
			 * DATA GUEST POST
			 */

			submitter_name:
				submitterName,

			submitter_email:
				submitterEmail,

			notes,

			created_at:
				new Date().toISOString(),

			reviewed_at:
				""

		};


		/*
		 * ========================================
		 * KIRIM KE GOOGLE APPS SCRIPT
		 * ========================================
		 */

		const response =
			await fetch(
				SUBMIT_API,
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
						JSON.stringify(
							payload
						)

				}
			);


		/*
		 * ========================================
		 * CEK RESPONSE
		 * ========================================
		 */

		if (!response.ok) {

			return json({

				success: false,

				error:
					"Google Apps Script gagal menerima submission",

				status:
					response.status

			}, 502);

		}


		let result = null;


		try {

			result =
				await response.json();

		} catch {

			result = null;

		}


		/*
		 * ========================================
		 * RESPONSE BERHASIL
		 * ========================================
		 */

		return json({

			success: true,

			message:
				"APK berhasil dikirim dan sedang menunggu review.",

			id,

			slug,

			status:
				"pending",

			result

		});


	} catch (error) {

		return json({

			success: false,

			error:
				error?.message ||
				"Terjadi kesalahan server"

		}, 500);

	}

}


/*
 * ============================================
 * OPTIONS / CORS
 * ============================================
 */

export async function onRequestOptions() {

	return new Response(
		null,
		{

			status: 204,

			headers: {

				"access-control-allow-origin":
					"*",

				"access-control-allow-methods":
					"POST, OPTIONS",

				"access-control-allow-headers":
					"Content-Type"

			}

		}
	);

}


/*
 * ============================================
 * JSON RESPONSE
 * ============================================
 */

function json(
	data,
	status = 200
) {

	return new Response(

		JSON.stringify(
			data,
			null,
			2
		),

		{

			status,

			headers: {

				"content-type":
					"application/json;charset=UTF-8",

				"cache-control":
					"no-store",

				"access-control-allow-origin":
					"*"

			}

		}

	);

}


/*
 * ============================================
 * CLEAN INPUT
 * ============================================
 */

function clean(
	value = ""
) {

	return String(value)

		.replace(
			/<[^>]*>/g,
			""
		)

		.replace(
			/\s+/g,
			" "
		)

		.trim()

		.slice(
			0,
			5000
		);

}


/*
 * ============================================
 * SANITIZE SLUG
 * ============================================
 */

function sanitizeSlug(
	value = ""
) {

	return String(value)

		.toLowerCase()

		.trim()

		.replace(
			/[^a-z0-9]+/g,
			"-"
		)

		.replace(
			/^-+|-+$/g,
			""
		)

		.slice(
			0,
			100
		);

}


/*
 * ============================================
 * EMAIL VALIDATION
 * ============================================
 */

function isValidEmail(
	email
) {

	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		.test(email);

}


/*
 * ============================================
 * TANGGAL
 * ============================================
 */

function getDate() {

	const date =
		new Date();

	return date
		.toISOString()
		.slice(
			0,
			10
		);

}

