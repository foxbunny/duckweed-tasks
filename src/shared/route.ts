/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as qs from "query-string";

const go = (path: string, query: {[param: string]: any} = {}): void => {
  // tslint:disable:no-console
  const q = qs.stringify(query);
  const next = ROUTE_PREFIX + path + (q ? `?${q}` : "");
  window.history.pushState(undefined, "", next);
  try {
    window.dispatchEvent(new Event("popstate"));
  } catch (e) {
    // This is probably IE, where event constructor cannot be used
    const ev = document.createEvent("PopStateEvent");
    ev.initPopStateEvent("popstate", true, true, {});
    window.dispatchEvent(ev);
  }
};

const match = (prefix: string, re: RegExp, path = location.pathname): string[] | false => {
  const m = re.exec(path.slice(prefix.length));
  return m
    ? m.slice(1)
    : false;
};

export {
  go,
  match,
};
