/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as snabbdom from "snabbdom";
import {VNode} from "snabbdom/src/vnode";

import classes from "snabbdom/modules/class";
import events from "snabbdom/modules/eventlisteners";
import props from "snabbdom/modules/props";
import style from "snabbdom/modules/style";

import documentevents from "runtime/documentevents";
import html, {RenderFunction, setActionHandler} from "runtime/html";

type PatchFunction<T = any> = (model: T) => T;

type ModelPatcher<T = any> = (fn: PatchFunction<T>) => void;

interface Actions<T = any> {
  [action: number]: (patch: ModelPatcher<T>, ...args: any[]) => AsyncIterableIterator<any>;
}

const patch = snabbdom.init([classes, style, events, props, documentevents]);

const isInput = (target: any): target is HTMLInputElement =>
  typeof target.value !== "undefined";

const isEvent = (event: any): event is Event =>
  event instanceof Event;

const isVNnode = (vnode: any): vnode is VNode =>
  typeof vnode === "object" && "sel" in vnode;

const runner = async <T = any> (model: T, actions: Actions<T>, view: RenderFunction, root: string = "#app") => {
  let currentVNodes: HTMLElement | VNode = document.querySelector(root) as HTMLElement;
  let currentModel = model;

  // Prepare helpers

  const render = () => currentVNodes = patch(currentVNodes, html(view, {model: currentModel}));

  const patchModel: ModelPatcher<T> = (fn) => {
    currentModel = fn(currentModel);
  };

  const actionHandler = (action: any, ...args: any[]) => async (e?: Event | VNode, ...eventArgs: any[]) => {
    const actionFn = actions[action];

    if (isVNnode(e)) {
      // This is mostly for hooks. We add the vnode object to args.
      args = args.concat(e);
      args = args.concat(eventArgs);
    } else if (isEvent(e) && e.type === "input" && isInput(e.target)) {
      // For convenience, process events and extract implied arguments
      args = [e.target.value].concat(args);
    }

    for await (const __ of actionFn(patchModel, ...args)) {
      render();
    }
  };

  setActionHandler(actionHandler);

  // Start

  render();
};

export {
  PatchFunction,
  ModelPatcher,
  Actions,
};
export default runner;
