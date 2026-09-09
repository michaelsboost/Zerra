const fs = require('fs');
const assert = require('assert');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
const lock = JSON.parse(fs.readFileSync('package-lock.json','utf8'));
let passed=0;
function check(name, fn){ fn(); console.log(`PASS ${name}`); passed++; }
check('package and lock versions agree',()=>assert.strictEqual(lock.version,pkg.version));
check('lock root version agrees',()=>assert.strictEqual(lock.packages[''].version,pkg.version));
check('CSS build uses local PostCSS CLI',()=>assert.strictEqual(pkg.scripts['build:css'],'postcss src/bundle.css -o dist/bundle.css'));
check('JS build uses Rollup config',()=>assert.strictEqual(pkg.scripts['build:js'],'rollup -c'));
check('combined build is deterministic sequence',()=>assert.strictEqual(pkg.scripts.build,'npm run build:css && npm run build:js'));
for (const dep of ['postcss','postcss-cli','postcss-import','autoprefixer','tailwindcss','cssnano','rollup','@rollup/plugin-terser']) {
  check(`${dep} declared and locked`,()=>{
    assert(pkg.devDependencies[dep],`${dep} missing from package.json`);
    assert(lock.packages[`node_modules/${dep}`],`${dep} missing from lockfile`);
  });
}
check('portable build script installs from lockfile',()=>{
  const s=fs.readFileSync('build.sh','utf8');
  assert(s.includes('npm ci --no-audit --no-fund'));
  assert(s.includes('npm run build'));
  assert(s.includes('/data/data/com.termux/files/usr'));
});
check('build inputs exist',()=>{
  for(const f of ['src/bundle.css','src/script.js','postcss.config.cjs','rollup.config.js']) assert(fs.existsSync(f),`${f} missing`);
});
console.log(`\n${passed}/${passed} build configuration checks passed.`);
