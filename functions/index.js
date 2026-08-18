import { layout } from "../lib/render";
import { getPosts } from "../lib/api";
import {
	SITE,
	canonical,
	sanitizeSlug,
	cardImage,
	ogImage,
	escapeHTML
} from "../lib/config";
import { seo } from "../lib/seo";
import { withCache } from "../lib/cache";

export async function onRequest(context){
	return withCache(
		context,
		300,
		async()=>{

			try{
				const reqUrl=new URL(context.request.url);

				const page=parseInt(reqUrl.searchParams.get("page"))||1;

				const posts=await getPosts();

				const perPage=12;

				const totalPage=Math.ceil(posts.length/perPage);

				const start=(page-1)*perPage;

				const currentPosts=posts.slice(start,start+perPage);

				const grid=currentPosts.map(p=>`
<div class="card">
<a href="/${sanitizeSlug(p.slug)}">
<div class="thumb">
${cardImage(ogImage(p.slug),p.title)}
</div>
<div class="body">
<span class="badge">
${escapeHTML(p.kategori||"ARTIKEL")}
</span>
<h3>
${escapeHTML(p.title)}
</h3>
</div>
</a>
</div>
`).join("");

				const robots=page>1
					?'<meta name="robots" content="noindex,follow">'
					:"";

				return layout({
					title:SITE.name,

					description:SITE.description,

					canonical:canonical(
						page>1
							?"/?page="+page
							:"/"
					),

					schema:`
${robots}

${seo({
	title:SITE.name,
	description:SITE.description
})}

<script type="application/ld+json">
{
	"@context":"https://schema.org",
	"@type":"WebSite",
	"name":"${SITE.name}",
	"url":"${SITE.domain}",
	"potentialAction":{
		"@type":"SearchAction",
		"target":"${SITE.domain}/api/search?q={search_term_string}",
		"query-input":"required name=search_term_string"
	}
}
</script>
`,

					content:`

<section class="hero">

<div class="hero-box">

<span class="hero-badge">
⚡ AI MODERN
</span>

<h1>
${SITE.name}
</h1>

<p>
Panduan SEO, AI, blogging, teknologi digital, dan strategi website dari AI Mr Ferdy untuk membantu membangun serta meningkatkan visibilitas online di Indonesia.
</p>

<div class="hero-btns">

<a
href="https://apk.aimrFerdy.workers.dev/"
class="btn"
>
Aktivasi
</a>

<a
href="https://app.aimrferdy.workers.dev/"
class="btn btn2"
>
Alternatif
</a>

</div>

</div>

</section>


<section class="seo-box">

<h2>
Informasi Aplikasi Penghasil Cuan
</h2>

<p>
Update aplikasi penghasil uang, AI modern, platform auto cuan, tips saldo digital, dan tren teknologi viral terbaru dengan informasi ringan dan mudah dipahami.
</p>

</section>


<input
class="search"
type="search"
placeholder="Cari artikel..."
>

<div id="results"></div>


<h2>
Artikel Terbaru
</h2>

<div class="grid">

${grid}

</div>


<section class="section">

<h2>
Aplikasi Terbaru
</h2>

<p>
Temukan aplikasi Android terbaru dengan informasi lengkap mengenai versi, ukuran, developer, kategori, dan pembaruan aplikasi.
</p>

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


${pagination(page,totalPage)}

${searchScript()}

${apkScript()}

`
				});

			}catch(e){

				return new Response(
					"Error: "+e.message,
					{status:500}
				);

			}

		}
	);
}


function pagination(current,total){

	if(total<=1)return "";

	let html=`<div class="pagination">`;

	const group=Math.floor((current-1)/5);

	const start=group*5+1;

	const end=Math.min(
		start+4,
		total
	);

	if(start>1){

		html+=`
<a href="/?page=${start-1}">
«
</a>
`;

	}

	for(
		let i=start;
		i<=end;
		i++
	){

		html+=`
<a
href="/?page=${i}"
class="${i===current?"active":""}"
>
${i}
</a>
`;

	}

	if(end<total){

		html+=`
<a href="/?page=${end+1}">
»
</a>
`;

	}

	html+=`</div>`;

	return html;
}


function searchScript(){

	return `
<script>

const input=document.querySelector(".search");

const results=document.getElementById("results");

let timer;

input?.addEventListener("input",e=>{

	clearTimeout(timer);

	timer=setTimeout(async()=>{

		const q=e.target.value.trim();

		if(q.length<2){

			results.innerHTML="";

			return;

		}

		try{

			const res=await fetch(
				"/api/search?q="+
				encodeURIComponent(q)
			);

			const data=await res.json();

			results.innerHTML=data.map(d=>\`

<a
class="search-item"
href="/\${d.slug}"
>
\${d.title}
</a>

\`).join("");

		}catch{

			results.innerHTML="";

		}

	},300);

});

</script>
`;
}


function apkScript(){

	return `
<script>

(async function(){

	const container=
		document.getElementById("apk-apps");

	if(!container)return;

	try{

		const response=
			await fetch("/api/apps");

		if(!response.ok){

			throw new Error(
				"APK API error"
			);

		}

		const data=
			await response.json();

		const apps=
			Array.isArray(data)
				? data
				: (
					Array.isArray(data.apps)
						? data.apps
						: []
				);

		if(!apps.length){

			container.innerHTML=`
				<div class="seo-box">
					<p>
						Belum ada aplikasi tersedia.
					</p>
				</div>
			`;

			return;
		}

		container.innerHTML=
			apps
			.slice(0,12)
			.map(app=>{

				const slug=
					encodeURIComponent(
						app.slug||""
					);

				const name=
					escapeHTML(
						app.name||
						app.title||
						"APK"
					);

				const title=
					escapeHTML(
						app.title||
						app.name||
						app.slug||
						"APK"
					);

				const description=
					escapeHTML(
						app.description||""
					);

				const category=
					escapeHTML(
						app.category||
						"APK"
					);

				const icon=
					app.icon
						? \`
<img
src="/images/\${encodeURIComponent(app.icon)}"
alt="\${name}"
loading="lazy"
decoding="async"
>
\`
						: "";

				return \`

<article class="card">

<a
href="/aplikasi/\${slug}"
>

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

			})
			.join("");

	}catch(error){

		console.error(
			"APK API:",
			error
		);

		container.innerHTML="";

	}

	function escapeHTML(value){

		return String(value||"")
			.replace(
				/&/g,
				"&amp;"
			)
			.replace(
				/</g,
				"&lt;"
			)
			.replace(
				/>/g,
				"&gt;"
			)
			.replace(
				/"/g,
				"&quot;"
			)
			.replace(
				/'/g,
				"&#039;"
			);

	}

})();

</script>
`;
}
