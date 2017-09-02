/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const css = require<CSSModule>("./navbar.styl");

import * as duckweed from "duckweed";
import {ActionHandler} from "duckweed/runner";

import {go} from "shared/route";

type NavLink = [string, string];

// Action

enum Action {
  Go = "Go",
}

const actions = {
  [Action.Go]:
    (_: any, path: string) => {
      go(path);
    },
};

// View

interface Props {
  links: NavLink[];
  act: ActionHandler;
}

const view = ({links, act}: Props) => {
  return (
    <nav class={css.nav}>
      {links.map(([path, label]) =>
        <a class={css.link} on-click={act(Action.Go, path)}>{label}</a>,
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
