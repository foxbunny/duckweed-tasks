/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const elements = require<CSSModule>("shared/elements.styl");
const css = require<CSSModule>("./list.styl");

import * as duckweed from "duckweed";
import {ActionTrigger} from "duckweed/runner";

import * as aside from "shared/aside";

import * as fx from "shared/fx";

import * as task from "./task";

// Storage management

const STORAGE_KEY = "tasks";

const retrieve = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const store = (tasks: task.Model[]) => {
  const data = JSON.stringify(tasks);
  localStorage.setItem(STORAGE_KEY, data);
};

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

const sortByDate = (tasks: task.Model[]) =>
  tasks.concat([]).sort((a, b) => b.created - a.created);

const filterDone = (done: boolean, tasks: task.Model[]) =>
  tasks.filter((t) => t.done === done);

const notEmpty = (t: task.Model) => t.text.trim() !== "" || t.editing;

const splitTask = (done: boolean, tasks: task.Model[]) =>
  sortByDate(filterDone(done, tasks));

const splitTasks = (tasks: task.Model[]): [task.Model[], task.Model[]] =>
  [splitTask(false, tasks), splitTask(true, tasks)];

const sortTasks = (tasks: task.Model[]) =>
  ([] as task.Model[]).concat(...splitTasks(tasks));

const raf = (fn: any) => requestAnimationFrame(() => requestAnimationFrame(fn));

const prepend = (x) => (xs) => [x].concat(xs);

const through = (fn) => (x) => {
  fn(x);
  return x;
};

const wrap = (obj) => ({
  map: (fn) => wrap(fn(obj)),
  unwrap: () => obj,
});

const update = (model, address, ...args) => {
  switch (address) {
    case Action.Update:
      const [id, taskAddress, ...taskArgs] = args;
      return wrap(model)
        .map(duckweed.scoped.transform.bind(null,
          ["tasks", id],
          (taskModel) => task.update(taskModel, taskAddress, ...taskArgs)))
        .map(duckweed.scoped.transform.bind(null,
          ["tasks"],
          (tasks) => sortTasks(tasks).filter(notEmpty)))
        .map(through(
          (m: Model) => store(m.tasks)))
        .unwrap();

    case Action.Add:
      return duckweed.scoped.transform(
        ["tasks"],
        prepend(task.init({editing: true})),
        model,
      );

    case Action.ClearDone:
      return duckweed.scoped.transform(
        ["tasks"],
        filterDone.bind(null, false),
        model,
      );

    case Action.SetHeight:
      const vnode = args[1] ? args[1] : args[0];
      const h = vnode.children
        .map((c: any) => c.elm)
        .reduce((n: number, c: HTMLElement) => {
          raf(() => c.style.transform = `translateY(${n}px)`);
          return n + c.offsetHeight + 10;
        }, 0);
      vnode.elm.style.paddingBottom = `${h}px`;
      return model;

    default:
      return model;
  }
};

// View

interface Props {
  model: Model;
  act: ActionTrigger;
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
              act={act.bind(null, Action.Update, index)}
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
  update,
  view,
};
