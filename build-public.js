#!/usr/bin/env node
'use strict';
const fs = require("fs");
const UglifyJS = require("uglify-js");

require('toml-require').install();
const wranglerConfig = require('./wrangler.toml')

const hostnamePlaceholder = '{WORKER_HOST}'

const sourceFolder = 'src/';
const captureJs = 'capture.js';
const captureJsSource = UglifyJS.minify(
  fs.readFileSync(sourceFolder + captureJs, 'utf8')
).code

if (!captureJsSource.includes(hostnamePlaceholder)) {
  throw new Error('Capture.js doesn\'t include placeholder: ' + hostnamePlaceholder);
}

for (const envName in wranglerConfig.env) {
  buildPublic(
    envName,
    wranglerConfig.env[envName].route.pattern,
    wranglerConfig.env[envName].site.bucket
  )
}

function buildPublic(env, hostname, folder) {
  const captureJsBuild = captureJsSource.replaceAll(hostnamePlaceholder, hostname)
  fs.mkdirSync(folder, { recursive: true })
  fs.writeFileSync(folder + '/' + captureJs, captureJsBuild)
}
