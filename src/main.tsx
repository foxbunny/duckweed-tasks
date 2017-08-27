/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as assoc from "ramda/src/assoc";

import html from "runtime/html";
import asyncPause from "util/async-pause";

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
  async *[Action.Update](model: Model, name: string) {
    yield assoc("name", name, model);
  },
  async *[Action.Reset](model: Model) {
    yield assoc("name", "Snabbdom", model);
  },
  async *[Action.Test](model: Model) {
    const currentName = model.name;
    yield assoc("name", "Click!", model);
    await asyncPause(1000);
    yield assoc("name", currentName, model);
  },
};

// View

interface Props {
  model: Model;
}

const view = ({model}: Props): JSX.Element =>
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
