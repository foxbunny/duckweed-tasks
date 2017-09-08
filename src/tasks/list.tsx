/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const elements = require<CSSModule>("shared/elements.styl");
const css = require<CSSModule>("./list.styl");

import * as duckweed from "duckweed";
import {ActionHandler, Actions} from "duckweed/runner";

import * as aside from "shared/aside";

import * as apply from "ramda/src/apply";
import * as concat from "ramda/src/concat";
import * as descend from "ramda/src/descend";
import * as filter from "ramda/src/filter";
import * as lensProp from "ramda/src/lensProp";
import * as over from "ramda/src/over";
import * as pipe from "ramda/src/pipe";
import * as prepend from "ramda/src/prepend";
import * as prop from "ramda/src/prop";
import * as propEq from "ramda/src/propEq";
import * as sort from "ramda/src/sort";
import * as tap from "ramda/src/tap";

import * as fx from "shared/fx";

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
  Update = "Update",
  Add = "Add",
  ClearDone = "ClearDone",
  SetHeight = "SetHeight",
}

const sortByDate = sort<task.Model>(descend(prop("created")));

const filterDone = (done: boolean) => filter<task.Model>(pipe(propEq("done", done)));

const notEmpty = (t: task.Model) => t.text.trim() !== "" || t.editing;

const splitTask = (done: boolean) => pipe(filterDone(done), sortByDate);

const splitTasks = (tasks: task.Model[]): [task.Model[], task.Model[]] =>
  [splitTask(false)(tasks), splitTask(true)(tasks)];

const sortTasks = pipe(splitTasks, apply(concat)) as (tasks: task.Model[]) => task.Model[];

const raf = (fn: any) => requestAnimationFrame(() => requestAnimationFrame(fn));

const actions: Actions<Model> = {
  [Action.Update]:
    (patch, id: number, taskAction: task.Action, arg?: any) => {
      const scoped = patch.as<task.Model>(["tasks", id], over(
        lensProp("tasks"),
        pipe(
          sortTasks,
          filter(notEmpty),
          tap(store),
        ),
      ));
      // FIXME: Temporary workaround until we figure out why we can't just do
      // await task.actions[taskAction](taskPatch, arg)
      (task.actions[taskAction] as any)(scoped, arg);
    },
  [Action.Add]:
    (patch) => {
      patch(over(
        lensProp("tasks"),
        prepend(task.init({editing: true})),
      ));
    },
  [Action.ClearDone]:
    (patch) => {
      patch(pipe(over(
        lensProp("tasks"),
        pipe(
          filterDone(false),
          tap(store),
        ),
      )));
    },
  [Action.SetHeight]:
    (patch, vnode, newVnode?) => {
      if (newVnode) {
        vnode = newVnode;
      }
      const h = vnode.children
        .map((c: any) => c.elm)
        .reduce((n: number, c: HTMLElement) => {
        raf(() => c.style.transform = `translateY(${n}px)`);
        return n + c.offsetHeight + 10;
      }, 0);
      vnode.elm.style.paddingBottom = `${h}px`;
    },
};

// View

interface Props {
  model: Model;
  act: ActionHandler;
}

const view = ({model, act}: Props): JSX.Element => {
  return (
    <div
      class={elements.wrapper}
      style={fx.dropInTwistOut()}
    >
      <main class={elements.main}>
        <h1 class={css.title}>Task list</h1>
        <p class={css.buttonBar}>
          <button class={css.actionButton} on-click={act(Action.Add)}>+ Add task</button>
          <button class={css.actionButton} on-click={act(Action.ClearDone)}>Clear done</button>
        </p>
        <div
          class={css.tasks}
          hook-insert={act(Action.SetHeight)}
          hook-postpatch={act(Action.SetHeight)}
          >
          {model.tasks.map((item: task.Model, index) =>
            <task.view
              model={item}
              act={act.as(Action.Update, index)}
              classes={[css.task]}
              styles={{
                delayed: {
                  opacity: 1,
                },
                opacity: 0,
                remove: {
                  opacity: 0,
                  transform: `translateX(-100vw)`,
                },
                transform: `translateY(0)`,
                transition: "transform 1s, opacity ease-out 0.5s",
              }}
              />,
          )}
        </div>
      </main>
      <aside.view />
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
