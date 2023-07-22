#!/usr/bin/env node
'use strict';
const fs = require("fs");
const UglifyJS = require("uglify-js");

require('toml-require').install();
const wranglerConfig = require('./wrangler.toml')
const { dirname } = require("path");

const hostnamePlaceholder = '{WORKER_HOST}'

const sourceFolder = 'src/';
const captureJs = 'capture.js';
const publicRoot = 'public/'
const captureJsSource = UglifyJS.minify(
  fs.readFileSync(sourceFolder + captureJs, 'utf8')
).code

if (!captureJsSource.includes(hostnamePlaceholder)) {
  throw new Error('Capture.js doesn\'t include placeholder: ' + hostnamePlaceholder);
}

const publicUrlStorageDir = 'public-urls/'
fs.mkdirSync(publicUrlStorageDir, { recursive: true })

for (const envName in wranglerConfig.env) {
  const captureJsPublicUrls = buildPublic(envName)

  fs.writeFileSync(publicUrlStorageDir + envName, captureJsPublicUrls)
}

function buildPublic(env) {
  const workerHostname = wranglerConfig.env[env].route.pattern
  const staticHostname = wranglerConfig.env[env].route.zone_name


  const captureJsPublicPathname = env + '/' + captureJs;
  const captureJsFilepath = publicRoot + captureJsPublicPathname;

  const captureJsBuild = captureJsSource.replaceAll(hostnamePlaceholder, workerHostname)
  fs.mkdirSync(dirname(captureJsFilepath), { recursive: true })
  fs.writeFileSync(captureJsFilepath, captureJsBuild)

  const captureScriptUrl = new URL(captureJsPublicPathname, 'https://' + staticHostname)

  return captureScriptUrl.href;
}
