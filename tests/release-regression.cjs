const fs=require('fs'),vm=require('vm');
const code=fs.readFileSync('src/script.js','utf8');
function storage(seed={}){const m=new Map(Object.entries(seed));return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),clear:()=>m.clear(),_m:m};}
function boot(seed={}){const ls=storage(seed); const quiet={log:()=>{},warn:()=>{},error:()=>{},info:()=>{}}; const ctx={console:quiet,Set,Map,Object,Array,JSON,Date,Math,Number,String,Boolean,RegExp,Intl,URLSearchParams,localStorage:ls,window:{localStorage:ls,matchMedia:()=>({matches:false}),addEventListener:()=>{}},document:{documentElement:{dataset:{},classList:{toggle:()=>{},add:()=>{},remove:()=>{}}},getElementById:()=>null,addEventListener:()=>{},visibilityState:'visible'},setTimeout:()=>0,clearTimeout:()=>{}};ctx.window.window=ctx.window;ctx.window.document=ctx.document;vm.createContext(ctx);vm.runInContext(code,ctx);const app=ctx.window.zerraApp();app.$watch=()=>{};app.init();return {app,ls};}
const tests=[]; const t=(n,f)=>{try{f();tests.push([n,true])}catch(e){tests.push([n,false,e.message])}};
let b;
t('clean boot',()=>{b=boot(); if(!b.app)throw Error('no app')});
t('dataset integrity',()=>{if(b.app.swapItems.length!==822)throw Error('items '+b.app.swapItems.length);if(b.app.swapAlternatives.length!==3207)throw Error('alts '+b.app.swapAlternatives.length);if(b.app.swapIntegrityReport.releaseBlockerCount!==0)throw Error('blockers '+b.app.swapIntegrityReport.releaseBlockerCount)});
t('unique item ids',()=>{if(new Set(b.app.swapItems.map(x=>x.id)).size!==b.app.swapItems.length)throw Error('duplicates')});
t('unique alt ids',()=>{if(new Set(b.app.swapAlternatives.map(x=>x.id)).size!==b.app.swapAlternatives.length)throw Error('duplicates')});
t('all item categories valid',()=>{let cats=new Set(b.app.swapCategories.map(x=>x.id));let bad=b.app.swapItems.filter(x=>!cats.has(x.categoryId));if(bad.length)throw Error(bad.length+' invalid')});
t('all alternatives linked',()=>{let ids=new Set(b.app.swapItems.map(x=>x.id));let bad=b.app.swapAlternatives.filter(x=>!ids.has(x.itemId));if(bad.length)throw Error(bad.length+' orphan')});
t('all items have recommendations',()=>{let ids=new Set(b.app.swapAlternatives.map(x=>x.itemId));let bad=b.app.swapItems.filter(x=>!ids.has(x.id));if(bad.length)throw Error(bad.length+' uncovered')});
t('search paper towels',()=>{b.app.swapsSearch='paper towels';let r=b.app.filteredSwapItems();if(!r.some(x=>x.id==='paper-towels'))throw Error('not found')});
t('search stainless scrubber',()=>{b.app.swapsSearch='stainless steel scrubber';let r=b.app.filteredSwapItems();if(!r.length)throw Error('no result')});
t('default authored ordering',()=>{b.app.swapsSelectedItem='dish-brush';b.app.swapsPriority='';let r=b.app.sortedSwapAlternatives();if(r.length<2)throw Error('missing dish brush'); for(let i=1;i<r.length;i++){if((r[i-1].priority??999)>(r[i].priority??999))throw Error('priority inversion')}});
t('no-purchase lens',()=>{b.app.swapsSelectedItem='paper-towels';b.app.swapsPriority='no-purchase';let r=b.app.sortedSwapAlternatives();if(!r.length)throw Error('none');let first=r[0];if(!((first.tags||[]).includes('No Purchase')||first.type==='No Purchase'||first.type==='Use Existing'||first.attrs?.upfrontCost==='Free'))throw Error('lens failed')});
t('persistence bounded',()=>{b.app.impact=Array.from({length:1200},(_,i)=>({id:i}));b.app.activity=Array.from({length:1200},(_,i)=>({id:i}));b.app.reflections=Array.from({length:600},(_,i)=>({id:i}));b.app.persist();let d=JSON.parse(b.ls.getItem('zerra-app'));if(d.impact.length>1000||d.activity.length>1000||d.reflections.length>500)throw Error('bounds failed')});
t('corrupt localStorage boot',()=>{let x=boot({'zerra-app':'{bad'});if(!x.app)throw Error('failed')});
for(const [n,ok,msg] of tests)console.log((ok?'PASS':'FAIL'),n,msg||'');if(tests.some(x=>!x[1]))process.exit(1);
