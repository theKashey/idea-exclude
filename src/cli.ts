#!/usr/bin/env node

import sade from "sade";

import { exclude, excludeByGlob, findProjectRoot } from "./index";

const program = sade("idea-exclude <group> [...globs]", true);

program
    .version(require("../package.json").version);

program
  .option("--lookabove", "allows looking up the current folder in search of idea root")
  .option("-i, --ignore <glob>", "glob ignore mask")
  .option("-r, --root <path>", "root folder, defaults to process.cwd", process.cwd())
  .example('node_modules "packages/**/node_modules"')
  .example('node_modules "!(build|node_modules)/**/node_modules"')
  .action(async (group, glob, { lookabove, root, ignore, _: globs }) => {
    globs = [].concat(glob || [], globs);

    if (glob.length === 0) throw Error("nothing matched");

    root = lookabove ? findProjectRoot(root) : root;

    if (!root) {
      console.error("no configuration file found", {
        root: root,
        lookabove: lookabove,
      });
      process.exit(1);
      return;
    }

    try {
      const filesMatched = await (glob.length === 1
        ? excludeByGlob(root, group, glob[0], ignore)
        : exclude(root, group, glob));
      console.log(filesMatched.length, "entities added");
      return;
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  });

program.parse(process.argv)
