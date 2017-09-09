/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as duckweed from "duckweed";
import {ActionHandler, Actions} from "duckweed/runner";
import {VNode} from "snabbdom/src/vnode";

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

const matchRoute = (rm: RouteModule, path: string) => route.match(ROUTE_PREFIX, rm.re, path);

const getMatchingRoute = (routes: RouteModule[], path: string): RouteMatch | void => {
  if (!routes.length) {
    // tslint:disable:no-console
    console.log("No futher routes found");
    return undefined;
  }
  const [current, ...remaining] = routes;
  const args = matchRoute(current, path);
  if (args === false) {
    return getMatchingRoute(remaining, path) || {
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
  links: navbar.NavLink[];
  model: any;
  path: string;
}

let routeTable: RouteModule[] = [];

const init = (links: navbar.NavLink[], routes?: RouteModule[], path: string = location.pathname): Model => {
  routeTable = routes ? routes : routeTable;
  const {mod} = getMatchingRoute(routeTable, path) as RouteMatch;
  if (!routeTable.length) {
    throw Error("No route definitions found");
  }
  return {
    links,
    model: mod.init ? mod.init() : undefined,
    path: location.pathname,
  };
};

// Actions

enum Action {
  SwitchRoute = "SwitchRoute",
  ModuleAction = "ModuleAction",
  NavbarAction = "NavbarAction",
}

const actions: Actions = {
  [Action.ModuleAction]:
    (patch, moduleActions: Actions | void, moduleAction: string, ...args: any[]) => {
      if (!moduleActions) {
        // The module does not define any actions, no point in doing anything
        return;
      }
      const scoped = patch.as(["model"]);
      const action = moduleActions[moduleAction];
      if (action) {
        action(scoped, ...args);
      }
    },
  [Action.SwitchRoute]:
    (patch, {pathname}) => {
      const {mod} = getMatchingRoute(routeTable, pathname) as RouteMatch;
      patch((model) => ({
        ...model,
        model: mod.init ? mod.init() : undefined,
        path: location.pathname,
      }));
    },
  [Action.NavbarAction]:
    (_, action: string, path: string) => {
      // Navbar does not need the patcher, so not passing it
      navbar.actions[action](undefined, path);
    },
};

// View

interface Props {
  model: Model;
  act: ActionHandler;
}

const view = ({model, act}: Props) => {
  const {mod} = getMatchingRoute(routeTable, model.path) as RouteMatch;
  return (
    <div route={act(Action.SwitchRoute)}>
      <navbar.view act={act.as(Action.NavbarAction)} links={model.links} />
      <mod.view model={model.model} act={act.as(Action.ModuleAction, mod.actions)} key={model.path} />
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
