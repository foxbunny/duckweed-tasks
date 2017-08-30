/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const css = require<CSSModule>("./navbar.styl");

import html, {PropsBase} from "runtime/html";
import {go} from "shared/route";

type NavLink = [string, string];

// Action

enum Action {
  Go,
}

const actions = {
  [Action.Go]:
    async (_: any, path: string) => {
      go(path);
    },
};

// View

interface Props extends PropsBase {
  links: NavLink[];
}

const view = ({links, prefix = []}: Props) => {
  return (
    <nav class={css.nav}>
      {links.map(([path, label]) =>
        <a class={css.link} on-click={prefix.concat(Action.Go, path)}>{label}</a>,
      )}
    </nav>
  );
};

export {
  NavLink,
  Action,
  actions,
  Props,
  view,
};
