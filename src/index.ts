/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import runner from "runtime/runner";

import * as mainModule from "./main";

require.ensure(["./main"], (require) => {
  const {init, actions, view} = require<typeof mainModule>("./main");
  runner(init(), actions, view);
});
