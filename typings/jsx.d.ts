/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import {VNode} from "snabbdom/src/vnode";
import {GenericProps, RenderFunction} from "runtime/html";

declare global {
  namespace JSX {
    interface Element extends VNode {}
    type ElementClass = RenderFunction;
    interface IntrinsicElements {
      [element: string]: GenericProps;
    }
  }
}
