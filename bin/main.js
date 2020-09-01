#!/usr/bin/env node
const httpserver = require('./sever')
const build = require('./build').build
const transform = require('../lib/transformjs').transform
const sassTocss = require('../lib/sassTocss').sassTocss
const copy = require('../lib/copyimg').copy
const rmdir = require('../lib/utils').rmdir
const {version} = require('../package.json')
const commander = require('commander'); 
const program = new commander.Command();
const pwd = process.cwd()
program
  .command('start')
  .option('-p,--port <port_number>', 'web port')
  .description('start web site for deployment')
  .action((opts) => {
    if (opts.port !== undefined) console.log(`server on port ${opts.port}`);
    httpserver.start(opts.port,pwd)
  });

program
  .command('transform')
  .description('transform your JavaScript application code from ES6 to ES5 syntax')
  .action((output) => {
    console.log('transform');
    transform(pwd,version,output)
  });

program
  .command('tocss')
  .description('compile sass/scss to css')
  .action(() => {
    console.log('sassTocss');
    sassTocss(pwd)
});
program
  .command('build')
  .option('-o,--output <output>', 'output dir')
  .description('start web site for deployment')
  .action((opts) => {
    if (opts.output !== undefined){
      const clearBuild = async (pwd,version,output)=>{
        await rmdir(`${pwd}/${output}`)
        await build(pwd, version, output)
      }
      clearBuild(pwd,version,opts.output)
      // rmdir(`${pwd}/${opts.output}`).catch(e=>{console.log(e,123);})
      // build(pwd, version, opts.output).catch(e=>{console.log(e);})
    }
    
});
program
  .command('copy <output>')
  .description('copy the img')
  .action((output) => {
    copy(pwd, output)
});

program.parse(process.argv);