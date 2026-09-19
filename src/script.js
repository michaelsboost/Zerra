/*
 * Zerra — application behavior
 *
 * Vanilla JavaScript keeps the project portable inside kodeWeave and the
 * exported PWA. Content data, SPA routing, modal behavior, search/filtering,
 * and local-resource launchers live here.
 *
 * External links are intentionally opened as external resources. Location
 * searches use browser/Maps behavior and do not claim exhaustive local results.
 */

// -----------------------------------------------------------------------------
// Content data: Essential Viewing
// -----------------------------------------------------------------------------
const films=[
{"t":"The Story of Stuff","p":"CONSUMPTION · WASTE · SYSTEMS","id":"9GorqroigqM","d":"A fast, accessible look at the material economy and what happens before and after the things we buy enter our lives.","embed":true},
{"t":"Plastic Wars","p":"PLASTIC · RECYCLING · ACCOUNTABILITY","id":"-dk3NOEgX7o","d":"FRONTLINE and NPR investigate how the plastics industry promoted recycling while plastic waste continued to grow.","embed":true},
{"t":"How the world is choking on plastic","p":"PLASTIC POLLUTION · GLOBAL IMPACT","id":"QJuBMKgq3pg","d":"A visual introduction to the scale of plastic pollution and the systems that allow disposable material to accumulate across the planet.","embed":true},
{"t":"The Story of Plastic","p":"PLASTIC · LIFECYCLE · CONSEQUENCES","id":"iO3SA4YyEYU","d":"A broader look at plastic across its lifecycle, connecting extraction, production, disposal, pollution and the people affected by it.","embed":true},
{"t":"Closing the Loop","p":"CIRCULAR ECONOMY · WASTE · SOLUTIONS","id":"6g0AYbEoOGk","d":"Explores circular-economy approaches that aim to design waste out of systems rather than treating disposal as the end of the story.","embed":true}
];
// -----------------------------------------------------------------------------
// Content data: common objections and evidence-led responses
// -----------------------------------------------------------------------------
const excuses=[{"icon":"\u267b\ufe0f","q":"\u201cBut I recycle.\u201d","quick":"Good. Keep recycling correctly. But recycling is not the first step in preventing waste.","deeper":"Recycling means collecting and processing material that would otherwise be discarded and turning it into material for new products. In the U.S., the basic loop is collection, processing, and remanufacturing. But all of that happens after the original product was already made.","facts":["EPA's waste hierarchy puts source reduction and reuse ahead of recycling.","Collected recyclables must be sorted, cleaned and processed before they can be used in manufacturing.","What a local program accepts varies, so a recycling symbol does not automatically mean your curbside program can process the item."],"src":"https://www.epa.gov/recycle/recycling-basics-and-benefits","sourceTitle":"EPA \u2014 Recycling Basics and Benefits","next":"Before the next item reaches your recycling bin, ask: Could I have refused it, reused it or chosen less packaging?","film":1},{"icon":"\ud83d\udc64","q":"\u201cOne person can't make a difference.\u201d","quick":"One person cannot fix the whole system. That does not make one person's impact zero.","deeper":"EPA's 2018 U.S. dataset averaged about 4.9 pounds of municipal solid waste per person per day. Annualized, that rate is about 1,789 pounds. It is not your personal measurement, but it shows why repeated behavior multiplied across millions of people becomes a system.","facts":["A national average is not a promise about what you personally can 'save.'","Your own trash audit gives you a better personal baseline.","Individual behavior and upstream producer or policy change can happen at the same time."],"src":"https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/national-overview-facts-and-figures-materials","sourceTitle":"EPA \u2014 National Overview: Facts and Figures","next":"Measure your trash for seven days. Then target one repeated item.","film":1},{"icon":"\ud83d\udcb8","q":"\u201cZero waste is too expensive.\u201d","quick":"Zero waste does not mean buying a matching collection of expensive 'eco' products.","deeper":"Prevention can mean not buying something. Reuse can mean keeping what you already own. Repair can delay replacement. Sharing and borrowing can replace ownership for things you rarely need.","facts":["UNEP explicitly includes prevention, reduction, reuse and repair in a lifecycle approach.","Replacing useful items solely for a greener-looking version can create additional consumption."],"src":"https://www.unep.org/interactives/zero-waste-101/","sourceTitle":"UNEP \u2014 Zero Waste 101","next":"Use what you already have before shopping for a replacement.","film":1},{"icon":"\ud83c\udfed","q":"\u201cCompanies are the real problem.\u201d","quick":"Companies control huge parts of design and production. That doesn't erase every other level of responsibility.","deeper":"A lifecycle approach requires upstream change: better product design, reuse systems, less unnecessary production and stronger waste infrastructure. Individuals cannot manufacture that infrastructure alone\u2014but they can change habits, organize, advocate and support systems that reduce waste.","facts":["UNEP assigns roles to governments, the private sector and individuals.","Producer responsibility and consumer action address different parts of the same material system."],"src":"https://www.unep.org/interactives/zero-waste-101/","sourceTitle":"UNEP \u2014 Zero Waste 101","next":"Change one thing you control and support one upstream change you cannot create alone.","film":4},{"icon":"\ud83d\uddd1\ufe0f","q":"\u201cZero waste is impossible.\u201d","quick":"Perfectly producing zero waste is not the test. Moving the system toward zero waste is the goal.","deeper":"UNEP describes a lifecycle approach that changes what happens from source to end of life: prevention, reduction, reuse, recycling and better design. The useful question isn't 'Can I be perfect?' It's 'What waste can I prevent next?'","facts":["Global municipal solid waste is about 2.1 billion metric tons per year.","Without urgent action, UNEP projects roughly 3.8 billion metric tons annually by 2050."],"src":"https://www.unep.org/interactives/zero-waste-101/","sourceTitle":"UNEP \u2014 Zero Waste 101","next":"Choose the largest repeated waste stream you can realistically change.","film":4}];
// -----------------------------------------------------------------------------
// Home actions: small, immediate steps a visitor can take
// -----------------------------------------------------------------------------
const actions={"trash": ["Do a 7-day trash audit", "For one week, notice what you throw away. Don't judge it. Count repeated categories: food, packaging, paper, plastic, disposable household items. At the end, choose the most common avoidable category."], "refuse": ["Prevent one item before it exists", "Today, refuse one thing you routinely accept but do not need: a bag, utensil, straw, receipt, promotional item or unnecessary package. Prevention happens before the bin."], "reuse": ["Choose access over replacement", "Before buying something today, ask whether you already own something that works, can repair it, borrow it, share it or find it secondhand."], "remainder": ["Learn the correct destination", "Pick one item you normally throw away and check your local rules. Recycling and composting systems vary. Don't wish-cycle: only put an item in a stream that actually accepts it."]};
let filmIndex=0;
// -----------------------------------------------------------------------------
// Essential Viewing UI
// -----------------------------------------------------------------------------
function thumb(f){return "https://img.youtube.com/vi/"+f.id+"/hqdefault.jpg"}
function selectFilm(i){filmIndex=i;const f=films[i];filmProvider.textContent=f.p;filmTitle.textContent=f.t;filmDesc.textContent=f.d;filmImage.src=thumb(f);filmImage.alt=f.t+" preview";watchBtn.hidden=!f.embed;externalBtn.hidden=f.embed;externalBtn.href=f.url||("https://www.youtube.com/watch?v="+f.id);document.querySelectorAll("#filmRail button").forEach((b,n)=>b.classList.toggle("active",n===i));}
filmRail.innerHTML=films.map((f,i)=>`<button data-film="${i}"><img src="${thumb(f)}" alt=""><b>${f.t}</b><small>${f.p}</small></button>`).join("");
filmRail.onclick=e=>{let b=e.target.closest("[data-film]");if(b)selectFilm(+b.dataset.film)};
watchBtn.onclick=()=>openFilm(filmIndex);
// Video lightbox. Playback depends on the embedding environment/provider.
function openFilm(i){
  const f=films[i];
  if(!f.embed){window.open(f.url,"_blank");return}
  filmIndex=i; selectFilm(i);
  modalTitle.textContent=f.t;
  modalExternal.href="https://www.youtube.com/watch?v="+f.id;
  lightbox.hidden=false;
  document.body.style.overflow="hidden";
  filmFrameHost.innerHTML="";
  const iframe=document.createElement("iframe");
  iframe.src=f.embedUrl||("https://www.youtube-nocookie.com/embed/"+f.id+"?rel=0");
  iframe.title=f.t;
  iframe.setAttribute("allow","autoplay; encrypted-media; picture-in-picture; fullscreen");
  iframe.setAttribute("allowfullscreen","");
  iframe.setAttribute("loading","eager");
  iframe.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
  filmFrameHost.appendChild(iframe);
  modalSwitcher.innerHTML=films.map((v,n)=>`<button data-modal-film="${n}" class="${n===i?'active':''}"><span>0${n+1}</span><b>${v.t}</b></button>`).join("");
}
function closeMovie(){
  filmFrameHost.innerHTML="";
  lightbox.hidden=true;
  document.body.style.overflow="";
}
closeFilm.onclick=closeMovie;
lightbox.onclick=e=>{if(e.target===lightbox)closeMovie()};
modalSwitcher.onclick=e=>{const b=e.target.closest("[data-modal-film]");if(b)openFilm(+b.dataset.modalFilm)};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!lightbox.hidden)closeMovie()});
selectFilm(0);

excuseGrid.innerHTML=excuses.map((x,i)=>`<button data-ex="${i}"><span>${x.icon}</span><b>${x.q}</b></button>`).join("");
excuseGrid.onclick=e=>{let b=e.target.closest("[data-ex]");if(!b)return;openExcuse(+b.dataset.ex)};
function openExcuse(i){
  const x=excuses[i];
  if(!x)return;

  // Keep related media optional so a bad film reference can never block the
  // evidence panel itself from rendering.
  const relatedFilm=films[x.film];
  const relatedMarkup=relatedFilm
    ? `<div class="related-film"><small>RELATED VIEWING</small><p>${relatedFilm.t}</p><button data-related="${x.film}">Watch here ▶</button></div>`
    : "";

  document.querySelectorAll("#excuseGrid button").forEach((b,n)=>b.classList.toggle("active",n===i));
  deepDive.hidden=false;
  deepDive.innerHTML=`<button class="back">← Back to excuses</button><span>QUICK ANSWER</span><h3>${x.q}</h3><p>${x.quick}</p><div class="evidence-box"><span>WHAT'S ACTUALLY HAPPENING?</span><p>${x.deeper}</p><ul>${x.facts.map(f=>`<li>${f}</li>`).join("")}</ul><a href="${x.src}" target="_blank" rel="noopener">${x.sourceTitle} ↗</a></div><div class="learn-more"><span>GO DEEPER</span><details><summary>What does this mean in normal English?</summary><p>${x.quick} ${x.next}</p></details><details><summary>What can I do about it?</summary><p>${x.next}</p></details></div>${relatedMarkup}`;

  deepDive.querySelector(".back").onclick=()=>{
    deepDive.hidden=true;
    document.querySelectorAll("#excuseGrid button").forEach(b=>b.classList.remove("active"));
    document.querySelector("#excuses").scrollIntoView({behavior:"smooth"});
  };

  const relatedButton=deepDive.querySelector("[data-related]");
  if(relatedButton)relatedButton.onclick=e=>openFilm(+e.currentTarget.dataset.related);
  deepDive.scrollIntoView({behavior:"smooth",block:"start"});
}

document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>{let a=actions[b.dataset.action];actionPanel.hidden=false;actionPanel.innerHTML=`<button>← Back</button><h3>${a[0]}</h3><p>${a[1]}</p>`;actionPanel.querySelector("button").onclick=()=>actionPanel.hidden=true;actionPanel.scrollIntoView({behavior:"smooth",block:"nearest"})});

menuBtn.onclick=()=>{mobileMenu.hidden=!mobileMenu.hidden;menuBtn.setAttribute("aria-expanded",String(!mobileMenu.hidden))};
mobileMenu.querySelectorAll("a").forEach(a=>a.onclick=()=>{mobileMenu.hidden=true;menuBtn.setAttribute("aria-expanded","false")});

const lbPerSec=(2100000000*2204.6226218)/(365.25*24*60*60),start=performance.now();
function tick(t){counter.textContent=Math.floor((t-start)/1000*lbPerSec).toLocaleString()+" lb";requestAnimationFrame(tick)}requestAnimationFrame(tick);

(function(){
 const pages=[...document.querySelectorAll(".app-page[data-page]")];
 const buttons=[...document.querySelectorAll("[data-route]")];
 function showPage(name,push=true){
   if(!pages.some(p=>p.dataset.page===name)) name="home";
   pages.forEach(p=>p.hidden=p.dataset.page!==name);
   buttons.forEach(b=>b.classList.toggle("active",b.dataset.route===name));
   if(push) history.pushState({page:name},"","#"+name);
   window.scrollTo({top:0,behavior:"instant"});
 }
 buttons.forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.route)));
 window.addEventListener("popstate",()=>showPage(location.hash.slice(1)||"home",false));
 window.addEventListener("hashchange",()=>showPage(location.hash.slice(1)||"home",false));
 showPage(location.hash.slice(1)||"home",false);
 window.zerraNavigate=showPage;
})();

document.addEventListener("click",function(e){
 const route=e.target.closest("[data-route]");
 if(route){
   const menu=document.getElementById("mobileMenu"), btn=document.getElementById("menuBtn");
   if(menu && !menu.hidden){menu.hidden=true;if(btn)btn.setAttribute("aria-expanded","false");document.body.style.overflow="";}
 }
});

(function(){
 const btn=document.getElementById("menuBtn");
 const menu=document.getElementById("mobileMenu");
 const scrim=document.getElementById("menuScrim");
 const close=document.getElementById("drawerClose");
 if(!btn||!menu||!scrim) return;
 function setMenu(open){
   menu.hidden=!open;scrim.hidden=!open;
   btn.setAttribute("aria-expanded",String(open));
   btn.classList.toggle("active",open);
   document.body.classList.toggle("zerra-menu-open",open);
 }
 btn.onclick=function(e){e.preventDefault();e.stopPropagation();setMenu(menu.hidden)};
 if(close) close.onclick=()=>setMenu(false);
 scrim.onclick=()=>setMenu(false);
 menu.addEventListener("click",e=>{if(e.target.closest("[data-route]"))setMenu(false)});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!menu.hidden)setMenu(false)});
})();

(function(){
 const input=document.getElementById("resourceSearch");
 const filters=[...document.querySelectorAll(".resource-filter")];
 const cards=[...document.querySelectorAll(".resource-entry")];
 const empty=document.getElementById("resourceEmpty");
 if(!input||!cards.length)return;
 let cat="all";
 function apply(){
   const q=input.value.trim().toLowerCase();let shown=0;
   cards.forEach(card=>{
     const cats=(card.dataset.cat||"").split(/\s+/);
     const text=((card.dataset.search||"")+" "+card.textContent).toLowerCase();
     const okCat=cat==="all"||cats.includes(cat);
     const okQ=!q||text.includes(q);
     card.hidden=!(okCat&&okQ);if(!card.hidden)shown++;
   });
   document.querySelectorAll(".resource-section").forEach(sec=>{
     const visible=[...sec.querySelectorAll(".resource-entry")].some(c=>!c.hidden);
     sec.hidden=!visible;
   });
   if(empty)empty.hidden=shown!==0;
 }
 input.addEventListener("input",apply);
 filters.forEach(b=>b.addEventListener("click",()=>{cat=b.dataset.resourceFilter;filters.forEach(x=>x.classList.toggle("active",x===b));apply()}));
})();

(function(){
 function bootCleanMenu(){
  const trigger=document.getElementById("menuBtn"), panel=document.getElementById("mobileMenu"),
        scrim=document.getElementById("menuScrim"), close=document.getElementById("drawerClose");
  if(!trigger||!panel||!scrim)return;
  function set(open){
   panel.hidden=!open;scrim.hidden=!open;
   trigger.setAttribute("aria-expanded",open?"true":"false");
   trigger.setAttribute("aria-label",open?"Close navigation":"Open navigation");
   document.body.classList.toggle("zerra-menu-open",open);
  }
  set(false);
  trigger.addEventListener("click",function(e){e.preventDefault();e.stopImmediatePropagation();set(panel.hidden)},true);
  if(close)close.addEventListener("click",function(e){e.preventDefault();e.stopImmediatePropagation();set(false)},true);
  scrim.addEventListener("click",function(e){e.preventDefault();e.stopImmediatePropagation();set(false)},true);
  panel.addEventListener("click",function(e){if(e.target.closest("[data-route]"))set(false)});
  window.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)set(false)});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bootCleanMenu);else bootCleanMenu();
})();

(function(){
 const q=document.getElementById("storeSearch"); if(!q)return;
 const cards=[...document.querySelectorAll(".store-entry")];
 q.addEventListener("input",()=>{const s=q.value.trim().toLowerCase();cards.forEach(c=>c.hidden=!!s&&!((c.dataset.storeSearch||"")+" "+c.textContent).toLowerCase().includes(s));});
})();

(function(){
 const configs={
  thrift:["thrift store","Thrift / secondhand"],
  library:["library","Libraries"],
  repair:["repair shop","Repair"],
  recycling:["recycling centre","Recycling"],
  scrap:["scrap yard","Scrap / salvage"],
  food:["food bank","Food assistance"]
 };
 function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
 async function searchNear(root,key){
  const status=root.querySelector(".nearby-status"), results=root.querySelector(".nearby-results");
  if(!navigator.geolocation){status.textContent="This browser does not provide location access.";return;}
  status.textContent="Getting your location…";results.innerHTML="";
  navigator.geolocation.getCurrentPosition(async pos=>{
   const lat=pos.coords.latitude, lon=pos.coords.longitude, d=.18;
   status.textContent="Searching OpenStreetMap near your location…";
   const q=configs[key][0], viewbox=[lon-d,lat+d,lon+d,lat-d].join(",");
   const url="https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=10&bounded=1&layer=poi&viewbox="+encodeURIComponent(viewbox)+"&q="+encodeURIComponent(q);
   try{
    const r=await fetch(url,{headers:{"Accept":"application/json"}});
    if(!r.ok)throw new Error("search unavailable");
    const data=await r.json();
    if(!data.length){status.textContent="No mapped "+configs[key][1].toLowerCase()+" results were found in this search area. OpenStreetMap may be incomplete here.";return;}
    status.textContent="Found "+data.length+" nearby mapped result"+(data.length===1?"":"s")+".";
    results.innerHTML=data.map(x=>{
      const name=x.name||x.display_name.split(",")[0]||configs[key][1];
      const addr=x.display_name||"";
      const map="https://www.openstreetmap.org/?mlat="+encodeURIComponent(x.lat)+"&mlon="+encodeURIComponent(x.lon)+"#map=17/"+encodeURIComponent(x.lat)+"/"+encodeURIComponent(x.lon);
      return '<div class="nearby-result"><strong>'+esc(name)+'</strong><small>'+esc(addr)+'</small><a target="_blank" rel="noopener" href="'+map+'">View on OpenStreetMap ↗</a></div>';
    }).join("");
   }catch(e){status.textContent="The OpenStreetMap search service could not be reached right now. Try again shortly.";}
  },err=>{status.textContent=err.code===1?"Location permission was not granted. Enable location for this page to search near you.":"Your location could not be determined. Try again when location services are available.";},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
 }
 document.addEventListener("click",e=>{
  const b=e.target.closest("[data-nearby]");if(!b)return;
  const root=b.closest(".nearby-finder");if(root)searchNear(root,b.dataset.nearby);
 });
})();

(function(){
 const labels={
  thrift:"thrift stores near me", library:"public libraries near me", repair:"repair shops near me",
  recycling:"recycling centers near me", scrap:"scrap yards salvage yards near me",
  food:"food pantries near me", tool:"tool libraries near me", refill:"refill stores near me",
  makerspace:"makerspaces near me"
 };
 document.querySelectorAll(".nearby-finder").forEach(root=>{
   let useOSM=false;
   const toggle=root.querySelector(".osm-toggle"), status=root.querySelector(".nearby-status");
   if(toggle)toggle.addEventListener("click",e=>{
     e.preventDefault();e.stopImmediatePropagation();useOSM=!useOSM;
     toggle.classList.toggle("active",useOSM);
     toggle.textContent=useOSM?"Using OpenStreetMap — switch to Google Maps":"Prefer OpenStreetMap?";
     status.textContent=useOSM?"Choose a category. Zerra will use your browser location for a nearby OpenStreetMap search.":"Choose a category to search Google Maps near your current location.";
   },true);
   root.querySelectorAll("[data-nearby]").forEach(btn=>btn.addEventListener("click",e=>{
     e.preventDefault();e.stopImmediatePropagation();
     const key=btn.dataset.nearby, q=labels[key]||"community resources near me";
     if(!useOSM){
       status.textContent="Opening Google Maps search for "+q.replace(" near me","")+"…";
       window.open("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q),"_blank","noopener");
       return;
     }
     // Reuse the existing OSM finder by explicitly requesting location and querying Nominatim.
     if(!navigator.geolocation){status.textContent="This browser does not provide location access.";return;}
     const results=root.querySelector(".nearby-results");results.innerHTML="";status.textContent="Getting your location…";
     navigator.geolocation.getCurrentPosition(async pos=>{
       const lat=pos.coords.latitude,lon=pos.coords.longitude,d=.18;
       const osmQ=q.replace(" near me","").replace("public ","").replace("food pantries","food bank").replace("recycling centers","recycling centre");
       const url="https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=10&bounded=1&layer=poi&viewbox="+encodeURIComponent([lon-d,lat+d,lon+d,lat-d].join(","))+"&q="+encodeURIComponent(osmQ);
       status.textContent="Searching OpenStreetMap near your location…";
       try{
        const r=await fetch(url,{headers:{"Accept":"application/json"}}),data=await r.json();
        if(!data.length){status.textContent="No matching OpenStreetMap listings were found nearby. Try Google Maps for broader local coverage.";return;}
        status.textContent="Found "+data.length+" nearby OpenStreetMap result"+(data.length===1?"":"s")+".";
        results.innerHTML=data.map(x=>'<div class="nearby-result"><strong>'+String(x.name||x.display_name.split(",")[0]).replace(/[&<>"]/g,"")+'</strong><small>'+String(x.display_name||"").replace(/[&<>"]/g,"")+'</small><a target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat='+encodeURIComponent(x.lat)+'&mlon='+encodeURIComponent(x.lon)+'#map=17/'+encodeURIComponent(x.lat)+'/'+encodeURIComponent(x.lon)+'">View on OpenStreetMap ↗</a></div>').join("");
       }catch(_){status.textContent="OpenStreetMap search is unavailable right now. Try Google Maps instead.";}
     },()=>status.textContent="Location access is needed for the OpenStreetMap option.",{timeout:10000,maximumAge:300000});
   },true));
 });
})();

(function(){
 const q=document.getElementById("evidenceSearch"),empty=document.getElementById("evidenceEmpty");if(!q)return;
 const cards=[...document.querySelectorAll(".evidence-record")];
 q.addEventListener("input",()=>{
  const s=q.value.trim().toLowerCase();let shown=0;
  cards.forEach(c=>{const ok=!s||((c.dataset.evidence||"")+" "+c.textContent).toLowerCase().includes(s);c.hidden=!ok;if(ok)shown++;});
  if(empty)empty.hidden=shown!==0;
 });
})();
