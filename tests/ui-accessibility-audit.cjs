const fs=require('fs');
const read=f=>fs.readFileSync(f,'utf8');
const index=read('index.html'), source=read('src/source.html');
const css=read('src/style.css'), distCss=read('dist/bundle.css');
let failures=0;
function check(name,ok){console.log(`${ok?'PASS':'FAIL'} ${name}`); if(!ok) failures++;}
check('responsive viewport', /name="viewport"[^>]*width=device-width/.test(index));
check('skip link and main target', /class="skip-link" href="#main-content"/.test(index) && /<main id="main-content"[^>]*tabindex="-1"/.test(index));
check('visible keyboard focus', /:focus-visible\s*\{[^}]*outline:/s.test(css));
check('44px base buttons', /\.btn\s*\{[^}]*min-height:\s*44px/s.test(css));
check('44px mobile header actions', /Phase 7 Pass 16:[\s\S]*?width:\s*2\.75rem[\s\S]*?height:\s*2\.75rem/.test(css));
check('mobile nav horizontal guard', /grid-template-columns:\s*repeat\(6,\s*minmax\(0,\s*1fr\)\)\s*!important/.test(css));
check('safe-area bottom padding', /env\(safe-area-inset-bottom\)/.test(css));
check('reduced motion support', /prefers-reduced-motion:\s*reduce/.test(css));
check('dark loader support', /data-theme="dark"[^\n]*zerra-boot/.test(css));
check('approved V7 loader in source template', source.includes('zerra-boot-ripple-3') && source.includes('viewBox="0 0 165 191"') && !source.includes('zerra-boot-spinner'));
check('approved V7 loader in production', index.includes('zerra-boot-ripple-3') && index.includes('viewBox="0 0 165 191"') && !index.includes('zerra-boot-spinner'));
check('approved V7 boot shell remains full-screen and centered', /\.zerra-boot-shell\s*\{[^}]*position\s*:\s*fixed[^}]*inset\s*:\s*0[^}]*display\s*:\s*grid[^}]*place-content\s*:\s*center[^}]*justify-items\s*:\s*center/s.test(css));
check('approved V7 wordmark and tagline styles are present', /\.zerra-boot-wordmark\s*\{/.test(css) && /\.zerra-boot-tagline\s*\{/.test(css));
check('production CSS contains accessibility override', distCss.includes('Phase 7 Pass 16: mobile accessibility target sizing'));
check('boot progress indicator is present', index.includes('id="zerra-boot-progress"') && source.includes('id="zerra-boot-progress"'));
check('boot reaches 100 only after app init', index.includes('init(); window.zerraBootComplete?.()') && index.includes('window.zerraBootProgress(100)'));
if(failures){console.error(`\n${failures} UI/accessibility check(s) failed.`);process.exit(1)}
console.log('\nAll UI/accessibility release checks passed.');
