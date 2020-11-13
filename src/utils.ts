import {buildWordTrie} from "search-trie";
import * as path from "path";

/**
 * removes nested directories keeping only top level ones
 * @param list
 */
export const removeNestedDirectories = (list: string[]) => {
  const sortedList = list.slice().sort((a, b) => a.length - b.length);
  const trie = buildWordTrie([]);
  const resultList: string[] = [];
  sortedList.forEach(location => {
    const l = location.split(path.sep);
    const candidate = trie.findNearest(l);
    if (candidate.value && candidate.path.length < l.length) {
      return;
    }
    trie.put(l, true);
    resultList.push(location);
  })
  return resultList;
}