/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const css = require<CSSModule>("./task.styl");

import {VNode} from "snabbdom/src/vnode";

import * as assoc from "ramda/src/assoc";
import * as lensProp from "ramda/src/lensProp";
import * as not from "ramda/src/not";
import * as over from "ramda/src/over";

import html, {PropsBase} from "runtime/html";
import {ModelPatcher} from "runtime/runner";

// Model

interface Model {
  text: string;
  done: boolean;
  editing: boolean;
  created: number;
  itemHeight: number;
}

const init = (options: any): Model => ({
  created: new Date().getTime(),
  done: options.done || false,
  editing: options.editing || false,
  itemHeight: 0,
  text: options.text || "",
});

// Action

enum Action {
  Toggle,
  ToggleEditing,
  Update,
  Focus,
  RecalcHeight,
}

const actions = {
  [Action.Toggle]:
    async (patch: ModelPatcher<Model>, checked: boolean) => {
      patch((model) => ({
        ...model,
        done: checked,
        editing: checked ? false : model.editing,
      }));
    },
  [Action.ToggleEditing]:
    async (patch: ModelPatcher<Model>) => {
      patch(over(lensProp("editing"), not));
    },
  [Action.Update]:
    async (patch: ModelPatcher<Model>, text: string) => {
      patch(assoc("text", text));
    },
  [Action.Focus]:
    async (patch: ModelPatcher<Model>, vnode: VNode) => {
      (vnode.elm as HTMLInputElement).focus();
    },
  [Action.RecalcHeight]:
    async (patch: ModelPatcher<Model>, vnode: VNode) => {
      const h = (vnode.elm as HTMLElement).offsetHeight;
      patch(assoc("itemHeight", h));
    },
};

// View

interface Props extends PropsBase {
  model: Model;
  classes?: any[];
  styles?: any;
}

const view = ({model, prefix = [], classes = [], styles = {}}: Props) => {
  return (
    <div
      class={classes.concat([css.task])}
      style={Object.assign({}, style, styles)}
      key={model.created}
      hook-insert={prefix.concat(Action.RecalcHeight)}
    >
      <label class={css.toggleDone} for={`task-${prefix.join("-")}`}>
        <input
          class={css.toggleCheckbox}
          id={`task-${prefix.join("-")}`}
          type="checkbox"
          on-change={prefix.concat(Action.Toggle)}
          checked={model.done}
          />
        <span class={css.toggleDoneLabel}>
          {model.done
            ? <span>+</span>
            : <span>&mdash;</span>
          }
        </span>
      </label>
      {model.editing
        ? <input
            class={{[css.editBox]: true, [css.long]: model.text.length > 30}}
            value={model.text}
            placeholder="What would you want to accomplish?"
            on-input={prefix.concat(Action.Update)}
            keys-enter={prefix.concat(Action.ToggleEditing)}
            keys-escape={prefix.concat(Action.ToggleEditing)}
            hook-insert={prefix.concat(Action.Focus)}
            autofocus={true} />
        : <span
            class={{[css.text]: true, [css.long]: model.text.length > 30, [css.done]: model.done}}
            style={{color: model.done ? "grey" : "black"}}
            on-click={model.done ? [] : prefix.concat(Action.ToggleEditing)}
          >
              {model.text}
          </span>
      }
      {model.done || !model.editing
        ? null
        : <button class={css.editButton} on-click={prefix.concat(Action.ToggleEditing)}>
            Save
          </button>
      }
    </div>
  );
};

// Styles

const style = {
  opacity: 1,
  remove: {
    opacity: 0,
  },
};

export {
  Model,
  init,
  Action,
  actions,
  Props,
  view,
};
