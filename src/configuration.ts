import fs from "fs";
import {normalize, basename, dirname} from "path";
import {log} from "./logging";

export const getProjectNameFromPath = (root: string): string => basename(root);

export const findConfigurationFile = (root: string, projectName: string): string | undefined => {
  const IDEA_FOLDER = normalize(`${root}/.idea`);
  const IML_FILE_PATH = normalize(`${IDEA_FOLDER}/${projectName}.iml`);
  const MODULE_IML_PATH = normalize(`${root}/${projectName}.iml`);

  if (fs.existsSync(MODULE_IML_PATH)) {
    return MODULE_IML_PATH;
  }
  if (fs.existsSync(IML_FILE_PATH)) {
    return IML_FILE_PATH;
  }
  return undefined;
};

/**
 * finds nearest idea project root
 * @param startPath
 */
export const findProjectRoot = (startPath: string) => {
  let currentPath = startPath;
  while (currentPath) {
    log('👀 looking at', currentPath);
    const file = findConfigurationFile(currentPath, getProjectNameFromPath(currentPath));
    if (file) {
      return currentPath;
    }
    currentPath = dirname(currentPath)
  }
  return undefined
}
