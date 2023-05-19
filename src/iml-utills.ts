export const FILE_MODULE_PREFIX = "file://$MODULE_DIR$";
export const ALT_FILE_MODULE_PREFIX = "file://$MODULE_DIR$/";

export const CONTENT_END_TAG = "</content>";

const createSelfEnclosedTag = (prefix: string) => `<content url="${prefix}" />`;

export const prepareIml = (originalContent: string): string => {
  let imlContents = originalContent.replace(`url="${ALT_FILE_MODULE_PREFIX}"`, `url="${FILE_MODULE_PREFIX}"`);

  const selfEnclosedTag = createSelfEnclosedTag(FILE_MODULE_PREFIX);
  if (imlContents.includes(selfEnclosedTag)) {
    imlContents = imlContents.replace(
      selfEnclosedTag,
      `<content url="${FILE_MODULE_PREFIX}">\n${CONTENT_END_TAG}`
    );
  }

  return imlContents;
};

export const injectToGroup = (imlContents: string, group: string, content: string): string => {
  const START_TAG = `<!-- group:${group} -->`;
  const END_TAG = `<!-- /group:${group} -->`;

  const startIndex = imlContents.indexOf(START_TAG);
  const endIndex = imlContents.lastIndexOf(END_TAG);

  const hasPrevGeneratedExcludes = startIndex !== -1 && endIndex !== -1;

  let beforeContent;
  let afterContent;

  if (hasPrevGeneratedExcludes) {
    beforeContent = imlContents.substr(0, startIndex);
    afterContent = imlContents.substr(endIndex + END_TAG.length);
  } else {
    const contentEndTagIndex = imlContents.lastIndexOf(CONTENT_END_TAG);
    beforeContent = imlContents.substr(0, contentEndTagIndex);
    afterContent = imlContents.substr(contentEndTagIndex);
  }

  if(!beforeContent || !afterContent){
    throw new Error('💥 failed to parse configuration file - content marker not found')
  }

  return [
    //
    beforeContent,
    //
    START_TAG,
    content,
    END_TAG,
    //
    afterContent,
  ].join("\n");
};

export const injecter = (content: string, group: string, excludes: string[], mapper:(match:string) => string): string =>
    injectToGroup(
        content,
        group,
        excludes.map(mapper).join("\n")
    );

export const injectExcludes = (content: string, group: string, excludes: string[]): string =>
    injecter(
    content,
    group,
    excludes,
    (exclude) => `<excludeFolder url="${FILE_MODULE_PREFIX}/${exclude}" />`
  );

export const injectTestRoots = (content: string, group: string, excludes: string[]): string =>
    injecter(
        content,
        group,
        excludes,
        (exclude) => `<sourceFolder url="${FILE_MODULE_PREFIX}/${exclude}" isTestSource="true" />`
    );

export const injectSourceRoots = (content: string, group: string, excludes: string[]): string =>
    injecter(
        content,
        group,
        excludes,
        (exclude) => `<sourceFolder url="${FILE_MODULE_PREFIX}/${exclude}" isTestSource="false" />`
    );