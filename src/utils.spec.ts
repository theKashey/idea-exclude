import {removeNestedDirectories} from "./utils";

describe('remove nested folders',() => {
  it('removes nested', () => {
    expect(removeNestedDirectories([
      'root-a',
      'root-a/path',
      'root-a/path/subpath',
      'root-b',
      'root-b/path/subpath',
      'root-c/path',
      'root-c/path/subpath',
      'root-d/path/subpath',
    ])).toEqual([
      'root-a',
      'root-b',
      'root-c/path',
      'root-d/path/subpath',
    ])
  })
});