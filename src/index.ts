/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import runner from "runtime/runner";

import * as mainModule from "./main";

// Define a symbol to make iterators work
// See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html
(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");

require.ensure(["./main"], (require) => {
  const {init, actions, view} = require<typeof mainModule>("./main");
  runner<mainModule.Model>(init(), actions, view);
});
