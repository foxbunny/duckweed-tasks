/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const css = require<CSSModule>("./main.styl");

import * as adjust from "ramda/src/adjust";
import * as filter from "ramda/src/filter";
import * as lensProp from "ramda/src/lensProp";
import * as map from "ramda/src/map";
import * as over from "ramda/src/over";
import * as pipe from "ramda/src/pipe";
import * as prepend from "ramda/src/prepend";
import * as prop from "ramda/src/prop";
import * as propEq from "ramda/src/propEq";
import * as sum from "ramda/src/sum";
import * as tap from "ramda/src/tap";

import html from "runtime/html";
import {ModelPatcher, PatchFunction} from "runtime/runner";

import * as task from "./task";

// Storage management

const STORAGE_KEY = "tasks";

const retrieve = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const store = pipe(
  JSON.stringify,
  localStorage.setItem.bind(localStorage, STORAGE_KEY),
);

// Model

interface Model {
  tasks: task.Model[];
}

const init = (): Model => {
  const tasks = retrieve();
  return {
    tasks,
  };
};

// Action

enum Action {
  Update,
  Add,
  RecalcHeight,
}

const actions = {
  [Action.Update]:
    async (patch: ModelPatcher<Model>, id: number, taskAction: task.Action, arg?: any) => {
      // The scoped patcher will perform a patch on a particular item in the
      // array. This is how we delegate to the task action.
      const taskPatch = (fn: PatchFunction<task.Model>) =>
        // FIXME: Come up with a nice utility function for creating scoped patchers
        patch(over(
          lensProp("tasks"),
          adjust(fn, id),
        ));

      // FIXME: Temporary workaround until we figure out why we can't just do
      // await task.actions[taskAction](taskPatch, arg)
      await (task.actions[taskAction] as any)(taskPatch, arg);

      patch(pipe(
        // First filter the tasks that are not marked as done
        over(
          lensProp("tasks"),
          filter(propEq("done", false)),
        ),
        // While we're at it, might as well store the tasks in local storage
        tap(pipe(
          prop("tasks"),
          store,
        )),
      ));
    },
  [Action.Add]:
    async (patch: ModelPatcher<Model>) => {
      patch(over(
        lensProp("tasks"),
        prepend(task.init({editing: true, text: "Task"})),
      ));
    },
};

// View

interface Props {
  model: Model;
}

const view = ({model}: Props): JSX.Element => {
  const listHeight = sum(map(prop("itemHeight"), model.tasks)) + model.tasks.length * 10;
  const {offsets: listItemOffsets} = model.tasks.reduce((offsets, {itemHeight}) => {
    (offsets.offsets as number[]).push(offsets.lastValue);
    offsets.lastValue += itemHeight + 10;
    return offsets;
  }, {lastValue: 0, offsets: []});

  return (
    <div>
      <main class={css.main}>
        <h1 class={css.title}>Task list</h1>
        <p class={css.buttonBar}>
          <button class={css.add} on-click={[Action.Add]}>+ Add task</button>
        </p>
        <div class={css.tasks} style={{
          height: `${listHeight}px`,
        }}>
          {model.tasks.map((item: task.Model, index) =>
            <task.view
              model={item}
              prefix={[Action.Update, index]}
              classes={[css.task]}
              styles={{
                delayed: {
                  transform: `translateY(${listItemOffsets[index]}px)`,
                },
                transform: `translateY(0)`,
                transition: "transform 0.5s, opacity 0.5s",
              }}
              />,
          )}
        </div>
      </main>
      <aside class={css.aside}>
        See the source code <a href="https://github.com/foxbunny/selm">on GitHub</a>
      </aside>
    </div>
  );
};

// Component

export {
  Model,
  init,
  Action,
  actions,
  view,
};
