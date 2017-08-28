/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as assoc from "ramda/src/assoc";

import html from "runtime/html";
import {ModelPatcher} from "runtime/runner";

// Model

interface Model {
  value: string;
}

const init = (defaultValue: string = ""): Model => ({
  value: defaultValue,
});

// Action

enum Action {
  Update = "input.Update",
}

const actions = {
  [Action.Update]: async (patch: ModelPatcher<Model>, val: string) => {
    patch(assoc("value", val));
  },
};

// View

interface Props {
  model: Model;
}

const view = ({model}: Props) => {
  return <input value={model.value} on-input={[Action.Update]} />;
};

export {
  Model,
  init,
  Action,
  actions,
  Props,
  view,
};
