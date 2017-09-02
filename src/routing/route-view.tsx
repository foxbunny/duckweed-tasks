/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as duckweed from "duckweed";
import {ActionHandler, ModelPatcher, PatchFunction} from "duckweed/runner";
import {VNode} from "snabbdom/src/vnode";

import * as pipe from "ramda/src/pipe";
import * as prop from "ramda/src/prop";

import * as route from "shared/route";

import * as navbar from "./navbar";

type ViewFunction = (props: {act: ActionHandler, model: any, key: string}) => VNode;

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
  SwitchRoute = "SwitchRoute",
  ModuleAction = "ModuleAction",
  NavbarAction = "NavbarAction",
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
  [Action.NavbarAction]:
    async (_: any, action: any, path: string) => {
      await navbar.actions[action](_, path);
    },
};

// View

interface Props {
  model: Model;
  act: ActionHandler;
}

const view = ({model, act}: Props) => {
  return (
    <div route={act(Action.SwitchRoute)}>
      <navbar.view act={act.as(Action.NavbarAction)} links={model.links} />
      <model.view model={model.model} act={act.as(Action.ModuleAction, model.actions)} key={model.path} />
    </div>
  );
};

export {
  Model,
  init,
  Action,
  actions,
  view,
};
