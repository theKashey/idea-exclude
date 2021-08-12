import {relative} from "path";
import {promisify} from "util";

import {glob} from "glob";

import {findConfigurationFile, getProjectNameFromPath} from "./configuration";
import {readFile, writeFile} from "./fs";
import {injectExcludes, prepareIml} from "./iml-utills";
import {removeNestedDirectories} from "./utils";
import {log, debug as enableDebug, error} from "./logging";

export {findProjectRoot} from './configuration';
export {enableDebug}

const excludeFiles = async (root: string, group: string, files: string[], mask: string): Promise<string[]> => {
  const baseName = getProjectNameFromPath(root);
  const ideaFile = findConfigurationFile(root, baseName);
  if (!ideaFile) {
    error(`💥 no .idea configuration file found at ${root} ~ ${baseName}`);
    return [];
  }

  log('excluding %s with %f files', relative(baseName, ideaFile), files.length, 'matching', mask);

  const originalConfiguration: string =
    prepareIml(
      (await readFile(ideaFile)).toString("utf-8")
    );

  const finalConfiguration = injectExcludes(
    originalConfiguration,
    group,
    files.map((file) => relative(root, file))
  );

  if (finalConfiguration !== originalConfiguration) {
    await writeFile(ideaFile, finalConfiguration);
  }

  return files;
}

/**
 * Excludes list of files creating a named group
 * @param root
 * @param group
 * @param files
 */
export const exclude = async (root: string, group: string, files: string[]): Promise<string[]> => {
  return excludeFiles(root, group, files, 'given set');
}


/**
 * excludes locations by a glob match
 * @param root - project root
 * @param group - exclude group
 * @param pattern - glob pattern
 * @param [ignore] - glob ignore pattern
 *
 * just executes the glob and calls {@link exclude} under the hood
 */
export const excludeByGlob = async (root: string, group: string, pattern: string, ignore?: string) => {
  const files: string[] = (await promisify(glob)(pattern, {ignore})).sort();

  return excludeFiles(root, group, removeNestedDirectories(files), pattern);
};
