# idea-exclude
Some your .ideas better be excluded, especially in monorepos
> It just updates your IDEA settings. Work with a whole JetBrains product family

🤷‍♂️ why? Cause WebStorm just hangs on a medium size monorepo and you need help it a little

`yarn add idea-exclude`

```sh
# usage
idea-exclude group glob

# exclude all node_modules in the "packages"
idea-exclude node_modules "packages/**/node_modules"

# exclude all node_modules but not in some root directories
idea-exclude node_modules "!(build|node_modules)/**/node_modules"

# can accept a list of files to exclude
idea-exclude custom-files this and this

```

This project removes own dist folder, having .idea configuration a few levels above
```sh
idea-exclude build dist --lookabove
```


# API
Exclusion API requires 3 arguments:
- `project root`, where your settings (`.idea/project.iml`) can be found
- a `group name` - custom (even empty) string to "scope" changes - you can remove all 
`node_modules` as one group, and remove all `other products` you are not interested in as another.
- `list of files` as an array of strings or a glob.

```js
import {exclude, excludeByGlob} from 'idea-exclude';

// excludes
excludeByGlob(process.cwd(), 'all my node_modules', '**/node_modules');
exclude(process.cwd(), 'named-group', ['list', 'of', 'files'])
```

## Example with bolt
```js
const workspaces = await bolt.getWorkspaces();
// as a list of files
exclude(process.cwd(), "monorepo", workspaces.map(({ dir }) => `${dir}/node_modules`));
// or as a glob
excludeByGlob(process.cwd(), "monorepo", `{${workspaces.map(({ dir }) => dir).join(",")}}/node_modules`);
```

# Prior art
The original version created by [Aleksandr "Sasha" Motsjonov](https://twitter.com/soswow).


# Licence
MIT