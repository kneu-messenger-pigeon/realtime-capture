#!/usr/bin/env node
'use strict';
const fs = require("fs");
const UglifyJS = require("uglify-js");

require('toml-require').install();
const wranglerConfig = require('./wrangler.toml')

const envPlaceholder = '{ENV}'
const hostnamePlaceholder = '{WORKER_HOST}'

const sourceFolder = 'src/';
const captureJs = 'capture.js';
const captureJsSource = UglifyJS.minify(
  fs.readFileSync(sourceFolder + captureJs, 'utf8')
).code

if (!wranglerConfig?.site?.bucket || !wranglerConfig.site.bucket.includes(envPlaceholder)) {
  throw new Error('wrangler.toml [site] bucket doesn\'t include placeholder: ' + envPlaceholder);
}

if (!captureJsSource.includes(hostnamePlaceholder)) {
  throw new Error('Capture.js doesn\'t include placeholder: ' + hostnamePlaceholder);
}

for (const envName in wranglerConfig.env) {
  buildPublic(
    envName,
    wranglerConfig.env[envName].route.pattern
  )
}

function buildPublic(env, hostname) {
  const folder = wranglerConfig.site.bucket.replaceAll(envPlaceholder, env)
  const captureJsBuild = captureJsSource.replaceAll(hostnamePlaceholder, hostname)
  fs.mkdirSync(folder, { recursive: true })
  fs.writeFileSync(folder + '/' + captureJs, captureJsBuild)
}
