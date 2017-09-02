/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const css = require<CSSModule>("./aside.styl");
const badge = require<string>("./duckweed-badge.svg");

import * as duckweed from "duckweed";

const view = () => {
  return (
    <aside class={css.aside}>
      <p>
        <a href="https://github.com/foxbunny/duckweed">
          <img src={badge} />
        </a>
      </p>
      <p>
        See the source code <a href="https://github.com/foxbunny/selm">on GitHub</a>
      </p>
    </aside>
  );
};

export {
  view,
};
