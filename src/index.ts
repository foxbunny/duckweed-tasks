/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as duckweed from "duckweed";

import * as mainModule from "./main";

import * as aboutModule from "about/about";
import * as taskListModule from "tasks/list";

require.ensure([
  "about/about",
  "tasks/list",
  "./main",
], (require) => {

  const ROUTES = [
    {re: /\/about$/,  mod: require<typeof aboutModule>("about/about")},
    {re: /^\/$/,      mod: require<typeof taskListModule>("tasks/list")},
  ];

  const LINKS: Array<[string, string]> = [
    ["/", "Tasks"],
    ["/about", "About"],
  ];

  const {init, actions, view} = require<typeof mainModule>("./main");
  duckweed.runner<mainModule.Model>(init(ROUTES, LINKS), actions, view);
});
