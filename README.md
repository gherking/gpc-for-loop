# gpc-for-loop

![Downloads](https://img.shields.io/npm/dw/gpc-for-loop?style=flat-square) ![Version@npm](https://img.shields.io/npm/v/gpc-for-loop?label=version%40npm&style=flat-square) ![Version@git](https://img.shields.io/github/package-json/v/gherking/gpc-for-loop/master?label=version%40git&style=flat-square) ![CI](https://img.shields.io/github/workflow/status/gherking/gpc-for-loop/CI/master?label=ci&style=flat-square) ![Docs](https://img.shields.io/github/workflow/status/gherking/gpc-for-loop/Docs/master?label=docs&style=flat-square)

This precompiler is responsible for repeating selected scenarios or scenario outlines.
In case of scenario outlines it copies all rows of examples, resulting iterator*rows number of scenarios when tests are run.

## Usage

Identify scenario or scenario outline to be repeated and mark it with `${loopTag}(${i})` e.g. `@loop(4)` .

The precompiler will then repeat this scenario or scenario outline for `${i}` times, modifying its name according to the format.

Configurable variables and their default options:

|   Option   |      Default       | Description                                            |
| :--------: | :----------------: | :----------------------------------------------------- |
| `maxValue` |         10         | Maximum value of iteration                             |
| `tagName` | `'loop'` | Tag used to mark scenarios or outlines to be repeated  |
| `format` | `'${name} (${i})'` | Format of the scenario or outline name after repeating || `startIndex` | 1 | The first index to use when repeating a scenario |
| `limitToMaxValue` | `true` | Whether higher iteration values than the max should be limited to the max or error should be thrown ( `false` ) |

See examples for the input files and an output in the test/data folder.

```javascript
'use strict';
const compiler = require('gherking');
const ForLoop = require('gpc-for-loop');

let ast = await compiler.load('./features/src/login.feature');
ast = compiler.process(
    ast,
    new ForLoop({
        // config
    })
);
await compiler.save('./features/dist/login.feature', ast, {
    lineBreak: '\r\n'
});
```

```typescript
'use strict';
import {load, process, save} from "gherking";
import ForLoop = require("gpc-for-loop");

let ast = await load("./features/src/login.feature");
ast = process(
    ast,
    new ForLoop({
        // config
    })
);
await save('./features/dist/login.feature', ast, {
    lineBreak: '\r\n'
});
```

## Other

This package uses [debug](https://www.npmjs.com/package/debug) for logging, use `gpc:for-loop` :

```shell
DEBUG=gpc:for-loop* gherking ...
```

For detailed documentation see the [TypeDocs documentation](https://gherking.github.io/gpc-for-loop/).
