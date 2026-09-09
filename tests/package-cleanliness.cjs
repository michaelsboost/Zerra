const fs=require('fs'); const path=require('path');
const root=path.resolve(__dirname,'..'); let failures=0;
function check(name,fn){try{fn();console.log('✓',name)}catch(e){failures++;console.error('✗',name,'—',e.message)}}
function assert(v,m='assertion failed'){if(!v)throw new Error(m)}
const exists=p=>fs.existsSync(path.join(root,p));
const css=fs.readFileSync(path.join(root,'dist/bundle.css'),'utf8');
check('development-only HTML is absent',()=>{assert(!exists('test.html'));assert(!exists('single-indexed.html'))});
check('obsolete promo asset is absent',()=>assert(!exists('imgs/promo-old.png')));
check('approved V7 loader is present',()=>assert(css.includes('Phase 7 Pass 12 fallback V7')));
check('legacy spinner loader CSS is absent',()=>{assert(!css.includes('zerra-boot-spinner'));assert(!css.includes('zerra-boot-spin'))});
check('no malformed historical +:root selector',()=>assert(!css.includes('+:root')));
check('release tests remain packaged',()=>{assert(exists('tests/release-regression.cjs'));assert(exists('tests/ui-accessibility-audit.cjs'));assert(exists('tests/pwa-offline-audit.cjs'))});
if(failures){console.error(`\n${failures} package-cleanliness check(s) failed.`);process.exit(1)}
console.log('\nProduction package cleanliness checks passed.');
