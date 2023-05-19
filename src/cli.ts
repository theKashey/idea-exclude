#!/usr/bin/env node

import sade from "sade";

import {
    exclude,
    excludeByGlob,
    findProjectRoot,
    setSourceRoots,
    setSourceRootsByGlob,
    setTestRoots,
    setTestRootsByGlob
} from "./index";

const program = sade("idea-exclude <group> [...globs]", true);

program
  .version(require("../package.json").version);

const OPERATIONS = {
    'excluded roots':[exclude, excludeByGlob],
    'test roots':[setTestRoots, setTestRootsByGlob],
    'source roots':[setSourceRoots, setSourceRootsByGlob],
} as const

const getOperation = (mode:Record<'testRoot'| 'sourceRoot', boolean>): keyof typeof OPERATIONS => {
    if(mode.testRoot){
        return 'test roots';
    }
    if(mode.sourceRoot){
        return 'source roots';
    }
    return 'excluded roots'
}

program
  .option("--lookabove", "allows looking up the current folder in search of idea root")
  .option("--test-root", "marks matched folders as test roots")
  .option("--source-root", "marks matched folders as source roots")
  .option("-i, --ignore <glob>", "glob ignore mask")
  .option("-r, --root <path>", "root folder, defaults to process.cwd", process.cwd())
  .example('node_modules "packages/**/node_modules"')
  .example('node_modules "!(build|node_modules)/**/node_modules"')
  .action(async (group, glob, {lookabove, root, ignore, 'test-root':testRoot, 'source-root':sourceRoot, _: globs}) => {
    globs = [].concat(glob || [], globs);
    
    if (glob.length === 0) throw Error("nothing matched");

    root = lookabove ? findProjectRoot(root) : root;

    if (!root) {
      console.error("no configuration file found", {
        root: root,
        lookabove: lookabove,
      });
      return;
    }

    const operation = getOperation({testRoot, sourceRoot})
      const [performAction, performActionByGlob] = OPERATIONS[operation];

    try {
      const filesMatched = await (globs.length === 1
        ? performActionByGlob(root, group, globs[0], ignore)
        : performAction(root, group, globs));

      console.log(`👻 '${globs}' matched ${filesMatched.length} items. Information about '${operation}' added to ${root}`);
      return;
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  });

program.parse(process.argv)
