/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as always from "ramda/src/always";
import * as assoc from "ramda/src/assoc";

import html from "runtime/html";
import {ModelPatcher} from "runtime/runner";
import asyncPause from "util/async-pause";

// Model

interface Model {
  name: string;
  time: Date;
}

const init = (): Model => ({
  name: "Snabbdom",
  time: new Date(),
});

// Action

enum Action {
  Update,
  Reset,
  Test,
  Init,
}

const actions = {
  async *[Action.Update](patch: ModelPatcher<Model>, name: string) {
    yield patch(assoc("name", name));
  },
  async *[Action.Reset](patch: ModelPatcher<Model>) {
    yield patch(always(init()));
  },
  async *[Action.Test](patch: ModelPatcher<Model>) {
    let currentName;
    yield patch((model) => {
      currentName = model.name;
      return assoc("name", "Click!", model);
    });
    await asyncPause(500);
    yield patch(assoc("name", currentName));
  },
  async *[Action.Init](patch: ModelPatcher<Model>) {
    while (true) {
      await asyncPause(1000);
      yield patch(assoc("time", new Date()));
    }
  },
};

// View

interface Props {
  model: Model;
}

const view = ({model}: Props): JSX.Element => {
  return (
    <div
      class="Hello"
      style={style}
      off-click={[Action.Test]}
      hook-insert={[Action.Init]}
    >
      <p>Hello {model.name || "World"}</p>
      <p>
        <input value={model.name} on-input={[Action.Update]} />
        <button on-click={[Action.Reset]}>Reset</button>
      </p>
      <p>
        Current time: {model.time.toLocaleTimeString()}
      </p>
    </div>
  );
};

// Stylesheets

const style = {
  delayed: {
    opacity: 1,
  },
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "16px",
  opacity: 0,
  transition: "opacity 1s",
};

// Component

export {
  Model,
  init,
  Action,
  actions,
  view,
};
