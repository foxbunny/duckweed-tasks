/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as always from "ramda/src/always";
import * as assoc from "ramda/src/assoc";
import * as assocPath from "ramda/src/assocPath";
import * as lensPath from "ramda/src/lensPath";
import * as over from "ramda/src/over";

import html from "runtime/html";
import {ModelPatcher, PatchFunction} from "runtime/runner";
import asyncPause from "util/async-pause";

import * as input from "./input";

const scopedPatch = <T, M>(scope: string[], patch: ModelPatcher<M>): ModelPatcher<T> =>
  (fn: PatchFunction<T>) => patch(over(lensPath<any, any>(scope), fn));

// Model

interface Model {
  time: Date;
  input: input.Model;
}

const init = (): Model => ({
  input: input.init("Snabbdom"),
  time: new Date(),
});

// Action

enum Action {
  Reset = "main.Reset",
  Test = "main.Test",
  Init = "main.Init",
}

const actions = {
  [Action.Reset]: async (patch: ModelPatcher<Model>) => {
    patch(always(init()));
  },
  [Action.Test]: async (patch: ModelPatcher<Model>) => {
    let currentName;
    patch((model) => {
      currentName = model.input.value;
      return assocPath(["input", "value"], "Click!", model);
    });
    await asyncPause(500);
    patch(assocPath(["input", "value"], currentName));
  },
  [Action.Init]: async (patch: ModelPatcher<Model>) => {
    // FIXME: This while loop is practically unstoppable, we need a better
    // solution (e.g., stop on destroy, etc)
    while (true) {
      await asyncPause(1000);
      patch(assoc("time", new Date()));
    }
  },
  [input.Action.Update]: async (patch: ModelPatcher<Model>, value: string) => {
    const inputPatch = scopedPatch<input.Model, Model>(["input"], patch);
    await input.actions[input.Action.Update](inputPatch, value);
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
      <p>Hello {model.input.value || "World"}</p>
      <p>
        <input.view model={model.input} />
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
