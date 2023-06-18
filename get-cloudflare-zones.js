#!/usr/bin/env node
'use strict';
require('toml-require').install();
const wranglerConfig = require('./wrangler.toml')

process.stdout.write(
  JSON.stringify(
    [...new Set(Object.values(wranglerConfig.env).map(item => item.route.zone_name))]
  )
)
