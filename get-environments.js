#!/usr/bin/env node
'use strict';
require('toml-require').install();
const wranglerConfig = require('./wrangler.toml')

process.stdout.write(
  JSON.stringify(Object.keys(wranglerConfig.env))
)
