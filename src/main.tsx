/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const css = require<CSSModule>("./main.styl");

import * as adjust from "ramda/src/adjust";
import * as apply from "ramda/src/apply";
import * as concat from "ramda/src/concat";
import * as descend from "ramda/src/descend";
import * as filter from "ramda/src/filter";
import * as lensProp from "ramda/src/lensProp";
import * as map from "ramda/src/map";
import * as over from "ramda/src/over";
import * as pipe from "ramda/src/pipe";
import * as prepend from "ramda/src/prepend";
import * as prop from "ramda/src/prop";
import * as propEq from "ramda/src/propEq";
import * as sort from "ramda/src/sort";
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
  try {
    const tasks = retrieve();
    return {
      tasks,
    };
  } catch (e) {
    // tslint:disable:no-console
    console.error("Cannot parse stored data");
    return {
      tasks: [],
    };
  }
};

// Action

enum Action {
  Update,
  Add,
  ClearDone,
}

const sortByDate = sort<task.Model>(descend(prop("created")));

const filterDone = (done: boolean) => filter<task.Model>(pipe(propEq("done", done)));

const splitTask = (done: boolean) => pipe(filterDone(done), sortByDate);

const splitTasks = (tasks: task.Model[]): [task.Model[], task.Model[]] =>
  [splitTask(false)(tasks), splitTask(true)(tasks)];

const sortTasks = pipe(splitTasks, apply(concat)) as (tasks: task.Model[]) => task.Model[];

const actions = {
  [Action.Update]:
    async (patch: ModelPatcher<Model>, id: number, taskAction: task.Action, arg?: any) => {
      // The scoped patcher will perform a patch on a particular item in the
      // array. This is how we delegate to the task action.
      const taskPatch = (fn: PatchFunction<task.Model>) =>
        // FIXME: Come up with a nice utility function for creating scoped patchers
        patch(over(
          lensProp("tasks"),
          pipe(
            adjust(fn, id),
            sortTasks,
            tap(store),
          ),
        ));

      // FIXME: Temporary workaround until we figure out why we can't just do
      // await task.actions[taskAction](taskPatch, arg)
      await (task.actions[taskAction] as any)(taskPatch, arg);
    },
  [Action.Add]:
    async (patch: ModelPatcher<Model>) => {
      patch(over(
        lensProp("tasks"),
        prepend(task.init({editing: true, text: "Task"})),
      ));
    },
  [Action.ClearDone]:
    async (patch: ModelPatcher<Model>) => {
      patch(pipe(over(
        lensProp("tasks"),
        pipe(
          filterDone(false),
          tap(store),
        ),
      )));
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
          <button class={css.actionButton} on-click={[Action.Add]}>+ Add task</button>
          <button class={css.actionButton} on-click={[Action.ClearDone]}>Clear done</button>
        </p>
        <div class={css.tasks} style={{
          delayed: {
            paddingBottom: `${listHeight}px`,
          },
          paddingBottom: "40px",
          transition: "padding-bottom 1s",
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
                transition: "transform 1s, opacity 0.5s",
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
