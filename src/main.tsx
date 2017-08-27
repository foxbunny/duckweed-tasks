/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as assoc from "ramda/src/assoc";

import html from "runtime/html";

// Model

interface Model {
  name: string;
}

const init = (): Model => ({
  name: "Snabbdom",
});

// Action

enum Action {
  Update,
  Reset,
  Test,
}

const actions = {
  [Action.Update]: async (model: Model, name: string) => assoc("name", name, model),
  [Action.Reset]: async (model: Model) => assoc("name", "Snabbdom", model),
  [Action.Test]: async (model: Model) => assoc("name", "Click!", model),
};

// View

const view = (model: Model): JSX.Element =>
  <div class="Hello" style={style} off-click={[Action.Test]}>
    <p>Hello {model.name || "World"}</p>
    <p>
      <input value={model.name} on-input={[Action.Update]} />
      <button on-click={[Action.Reset]}>Reset</button>
    </p>
  </div>;

// Stylesheets

const style = {
  background: "grey",
  delayed: {
    background: "white",
  },
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "16px",
  transition: "background 0.2s",
};

// Component

export {
  Model,
  init,
  Action,
  actions,
  view,
};
