#!/usr/bin/env node
import commander from 'commander';
import {exclude, excludeByGlob, findProjectRoot} from "./index";

const program = new commander.Command();

program
  .version('0.0.1')
  .option('--lookabove', 'allows looking up the current folder in search of idea root')
  .option('-i, --ignore <glob>', 'glob ignore mask')
  .option('-r, --root <path>', 'root folder, defaults to process.cwd', process.cwd())
  .arguments('<group> [glob...]')
  .description('idea-exclude', {
    group: 'an exclude group, for example all-node-modules',
    glob: 'a selection glob'
  })
  .action(async function (group, glob) {
    if (glob.length === 0) {
      throw Error('nothing matched')
    }
    const root = program.lookabove ? findProjectRoot(program.root) : program.root
    if (!root) {
      console.error('no configuration file found', {root: program.root, lookabove: program.lookabove})
      return;
    }

    try {
      const filesMatched = await (
        glob.length === 1
          ? excludeByGlob(root, group, glob[0], program.ignore)
          : exclude(root, group, glob)
      )
      console.log(filesMatched.length, 'entities added');
      return
    } catch (e) {
      console.error(e.message);
    }
  });

program.parse(process.argv);
