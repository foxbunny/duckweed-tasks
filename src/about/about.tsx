/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const elements = require<CSSModule>("shared/elements.styl");
const css = require<CSSModule>("./about.styl");

import html from "runtime/html";
import * as fx from "shared/fx";

// View

const view = () => {
  return (
    <div class={elements.wrapper} style={fx.dropInTwistOut()}>
      <main class={elements.main}>
        <h1 class={css.title}>About this app</h1>

        <div class={css.body}>
          <p>
            This app is an experiment bringing Elm-inspired architecture to Snabbdom
            and TypeScript.
          </p>

          <p>
            You can see the source code <a href="https://github.com/foxbunny/selm">on GitHub</a>.
            It is available under the terms of the MIT license.
          </p>

          <p>
            &copy; 2017 Hajime Yamasaki Vukelic.
          </p>
        </div>
      </main>
    </div>
  );
};

export {
  view,
};
