/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import {VNode} from "snabbdom/src/vnode";

import * as pipe from "ramda/src/pipe";
import * as prop from "ramda/src/prop";

import html from "runtime/html";
import {ModelPatcher, PatchFunction} from "runtime/runner";
import * as route from "shared/route";

import * as navbar from "./navbar";

type ViewFunction = (props: {prefix: any[], model: any, key: string}) => VNode;

interface BasicModule {
  actions?: any;
  view: ViewFunction;
  init?(...args: any[]): any;
}

interface RouteModule {
  re: RegExp;
  mod: BasicModule;
}

interface RouteMatch {
  args: string[];
  mod: BasicModule;
}

const ROUTE_PREFIX = process.env.ROUTE_PREFIX || "";

// Utility functions

const matchRoute = pipe(prop("re"), route.match(ROUTE_PREFIX));

const getMatchingRoute = (routes: RouteModule[]): RouteMatch | void => {
  if (!routes.length) {
    // tslint:disable:no-console
    console.log("No futher routes found");
    return undefined;
  }
  const [current, ...remaining] = routes;
  const args = matchRoute(current);
  if (args === false) {
    return getMatchingRoute(remaining) || {
      args: [],
      mod: current.mod,
    };
  }
  return {
    args,
    mod: current.mod,
  };
};

// Model

interface Model {
  model: any | void;
  actions: any | void;
  routes: RouteModule[];
  links: navbar.NavLink[];
  path: string;
  view: ViewFunction;
}

const init = (routes: RouteModule[], links: navbar.NavLink[]): Model => {
  if (!routes.length) {
    throw Error("No route definitions found");
  }
  const {mod, args} = getMatchingRoute(routes) as RouteMatch;
  return {
    actions: mod.actions,
    links,
    model: mod.init && mod.init(...args),
    path: location.pathname,
    routes,
    view: mod.view,
  };
};

// Actions

enum Action {
  ModuleAction,
  SwitchRoute,
  Navbar,
}

const actions = {
  [Action.ModuleAction]:
    async (patch: ModelPatcher<Model>, moduleActions: any | void, moduleAction: any, ...args: any[]) => {
      if (!moduleActions) {
        return;
      }
      const modulePatcher = (fn: PatchFunction) => patch((model) => ({
        ...model,
        model: fn(model.model),
      }));
      const action = moduleActions[moduleAction];
      if (action) {
        action(modulePatcher, ...args);
      }
    },
  [Action.SwitchRoute]:
    async (patch: ModelPatcher<Model>) => {
      patch((model) => ({
        ...model,
        ...init(model.routes, model.links),
      }));
    },
  [Action.Navbar]:
    async (_: any, action: any, path: string) => {
      await navbar.actions[action](_, path);
    },
};

// View

interface Props {
  model: Model;
}

const view = ({model}: Props) => {
  return (
    <div route={[Action.SwitchRoute]}>
      <navbar.view prefix={[Action.Navbar]} links={model.links} />
      <model.view model={model.model} prefix={[Action.ModuleAction, model.actions]} key={model.path} />
    </div>
  );
};

export {
  Model,
  init,
  Action,
  actions,
  Props,
  view,
};
