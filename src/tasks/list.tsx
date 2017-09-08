/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const elements = require<CSSModule>("shared/elements.styl");
const css = require<CSSModule>("./list.styl");

import * as duckweed from "duckweed";
import {ActionHandler, Actions} from "duckweed/runner";

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

const actions: Actions<Model> = {
  [Action.Update]:
    (patch, id: number, taskAction: task.Action, arg?: any) => {
      const scoped = patch.as(["tasks", id], (model) => {
        const tasks = sortTasks(model.tasks).filter(notEmpty);
        store(tasks);
        return {
          ...model,
          tasks,
        };
      });
      // FIXME: Temporary workaround until we figure out why we can't just do
      // await task.actions[taskAction](taskPatch, arg)
      (task.actions[taskAction] as any)(scoped, arg);
    },
  [Action.Add]:
    (patch) => {
      patch((model) => ({
        ...model,
        tasks: [task.init({editing: true})].concat(model.tasks),
      }));
    },
  [Action.ClearDone]:
    (patch) => {
      patch((model) => {
        const tasks = filterDone(false, model.tasks);
        store(tasks);
        return {
          ...model,
          tasks,
        };
      });
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
