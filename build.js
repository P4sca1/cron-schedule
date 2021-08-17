const { performance } = require('perf_hooks')
const esbuild = require('esbuild')

function build(opts) {
  const commonBuildOptions = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
  }

  Object.assign(opts, commonBuildOptions)

  const t = performance.now()
  esbuild.buildSync(opts)
  console.log(`Built ${opts.outfile} in ${performance.now() - t}ms`) // eslint-disable-line no-console
}

build({
  outfile: 'dist/cron-schedule.iife.min.js',
  format: 'iife',
  platform: 'browser',
  target: 'es6',
  globalName: 'cronSchedule',
})

build({
  outfile: 'dist/cron-schedule.cjs.min.js',
  format: 'cjs',
  platform: 'node',
  target: 'node10.22',
})

build({
  outfile: 'dist/cron-schedule.esm.min.mjs',
  format: 'esm',
  target: 'es6',
})
