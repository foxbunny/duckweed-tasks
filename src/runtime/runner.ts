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

interface Actions {
  [action: number]: (model: any, ...args: any[]) => AsyncIterableIterator<any>;
}

const patch = snabbdom.init([classes, style, events, props, documentevents]);

const isInput = (target: any): target is HTMLInputElement =>
  typeof target.value !== "undefined";

const runner = async (model: any, actions: Actions, view: RenderFunction, root: string = "#app") => {
  let currentVNodes: HTMLElement | VNode = document.querySelector(root) as HTMLElement;
  let currentModel = model;

  // Prepare helpers

  const render = () => currentVNodes = patch(currentVNodes, html(view, currentModel));

  const actionHandler = (action: any, ...args: any[]) => async (e?: Event) => {
    const actionFn = actions[action];

    // For convenience, process events and extract implied arguments
    if (e && e.type === "input" && isInput(e.target)) {
      args = [e.target.value].concat(args);
    }

    for await (const updatedModel of actionFn(currentModel, ...args)) {
      currentModel = updatedModel;
      render();
    }
  };

  setActionHandler(actionHandler);

  // Start

  render();
};

export {
  Actions,
};
export default runner;
