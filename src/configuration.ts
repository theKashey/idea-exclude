import fs from "fs";
import {normalize, basename, dirname} from "path";
import {log} from "./logging";

export const getProjectNameFromPath = (root: string): string => basename(root);

export const findIdeaFolder = (root: string): string | undefined => {
    const IDEA_FOLDER = normalize(`${root}/.idea`);
    if (fs.existsSync(IDEA_FOLDER)) {
        return IDEA_FOLDER;
    }
    return undefined;
}


export const createConfigurationFile = (root: string, projectName: string) => {
    const IML_FILE_PATH = normalize(`${findIdeaFolder(root)}/${projectName}.iml`);

    fs.writeFileSync(
        IML_FILE_PATH,
        `<?xml version="1.0" encoding="UTF-8"?>
<module type="WEB_MODULE" version="4">
  <component name="NewModuleRootManager">
    <content url="file://$MODULE_DIR$">      
    </content>
    <orderEntry type="inheritedJdk" />
    <orderEntry type="sourceFolder" forTests="false" />
  </component>
</module>`
    )
}

export const findConfigurationFile = (root: string, projectName: string): string | undefined => {
    const IDEA_FOLDER = findIdeaFolder(root);
    if (!IDEA_FOLDER) {
        return undefined
    }
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
