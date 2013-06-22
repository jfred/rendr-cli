#!/usr/bin/env node

/*
 * render-cli
 * https://github.com/technicolorenvy/rendr-cli
 *
 * Copyright (c) 2013 Joseph (Jos) Smith
 * Licensed under the MIT license.
 */

var version = require('../package').version,
    cli = require('commander'),
    BaseGenerator = require('./generators/base_generator'),
    generator;

cli
  .version(version)
  .usage('<command> [options]')
  // .option('-c, --coffee', 'generators in Coffeescript') //coming soon!
  .option('-u, --url <url>', 'Set a url (only evaluated when generating a model)')
  .option('-i, --idAttribute <idAttribute>', 'Set an idAttribute (only evaluated when generating a model)')
  .option('-a, --apiHost <apiHost>', 'Set an apiHost (only evaluated when generating a model)')
  .option('--noTemplates', 'Do not generate templates (only evaluated when generating a view)');

cli.on('--help', function(){
  console.log('  Commands: ');
  console.log('     ');
  console.log('     n, new <appName>                           Creates a new Rendr project');
  console.log('     g, generate <component> <name> [options]   Generate a resource with <name>');
  console.log('     ');
  process.exit();
});

cli.parse(process.argv);

// args
var args = cli.args.slice(1);
// command
var cmd = cli.args[0];
// aliases
if ('g' == cmd) cmd = 'generate';
if ('n' == cmd) cmd = 'new';

generator = BaseGenerator.getGenerator(cmd, args, cli);
generator.generate();