/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as curry from "ramda/src/curry";

import * as qs from "query-string";

const go = (path: string, query: {[param: string]: any} = {}): void => {
  // tslint:disable:no-console
  const q = qs.stringify(query);
  const next = ROUTE_PREFIX + path + (q ? `?${q}` : "");
  window.history.pushState(undefined, "", next);
  window.dispatchEvent(new Event("popstate"));
};

const match = curry((prefix: string, re: RegExp): string[] | false => {
  const m = re.exec(location.pathname.slice(prefix.length));
  return m
    ? m.slice(1)
    : false;
});

export {
  go,
  match,
};
