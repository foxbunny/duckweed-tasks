/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const css = require<CSSModule>("./navbar.styl");

import * as duckweed from "duckweed";
import {ActionTrigger} from "duckweed/runner";

type NavLink = [string, string];

// View

interface Props {
  links: NavLink[];
  act: ActionTrigger;
}

const view = ({links, act}: Props) => {
  return (
    <nav class={css.nav}>
      {links.map(([path, label]) =>
        <a class={css.link} on-click={act(path)}>{label}</a>,
      )}
    </nav>
  );
};

export {
  NavLink,
  Props,
  view,
};
