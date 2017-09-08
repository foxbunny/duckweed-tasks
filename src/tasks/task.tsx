/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const css = require<CSSModule>("./task.styl");

import * as duckweed from "duckweed";
import * as E from "duckweed/events";
import {ActionHandler, Actions} from "duckweed/runner";
import * as assoc from "ramda/src/assoc";
import * as lensProp from "ramda/src/lensProp";
import * as not from "ramda/src/not";
import * as over from "ramda/src/over";
import {VNode} from "snabbdom/src/vnode";

// Model

interface Model {
  text: string;
  done: boolean;
  editing: boolean;
  created: number;
}

const init = (options: any): Model => ({
  created: new Date().getTime(),
  done: options.done || false,
  editing: options.editing || false,
  text: options.text || "",
});

// Action

enum Action {
  Toggle = "Toggle",
  ToggleEditing = "ToggleEditing",
  Update = "Update",
  Focus = "Focus",
}

const actions: Actions<Model> = {
  [Action.Toggle]:
    (patch, checked: boolean) => {
      patch((model) => ({
        ...model,
        done: checked,
        editing: checked ? false : model.editing,
      }));
    },
  [Action.ToggleEditing]:
    (patch) => {
      patch(over(lensProp("editing"), not));
    },
  [Action.Update]:
    (patch, text: string) => {
      patch(assoc("text", text));
    },
  [Action.Focus]:
    (patch, vnode: VNode) => {
      (vnode.elm as HTMLInputElement).focus();
    },
};

// View

interface Props {
  model: Model;
  classes?: any[];
  styles?: any;
  act: ActionHandler;
}

const view = ({model, act, classes = [], styles = {}}: Props) => {
  return (
    <div
      class={classes.concat([css.task])}
      style={Object.assign({}, style, styles)}
      key={model.created}
    >
      <label class={css.toggleDone} for={`task-${model.created}`}>
        <input
          class={css.toggleCheckbox}
          id={`task-${model.created}`}
          type="checkbox"
          on-change={E.from(E.checkboxEvent, act(Action.Toggle))}
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
            on-input={E.from(E.inputEvent, act(Action.Update))}
            keys-enter={act(Action.ToggleEditing)}
            keys-escape={act(Action.ToggleEditing)}
            hook-insert={act(Action.Focus)}
            autofocus={true} />
        : <span
            class={{[css.text]: true, [css.long]: model.text.length > 30, [css.done]: model.done}}
            style={{color: model.done ? "grey" : "black"}}
            on-click={model.done ? act(null) : act(Action.ToggleEditing)}
          >
              {model.text}
          </span>
      }
      {model.done || !model.editing
        ? null
        : <button class={css.editButton} on-click={act(Action.ToggleEditing)}>
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
