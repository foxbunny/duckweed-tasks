/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import * as duckweed from "duckweed";
import {ActionTrigger, UpdateFunction} from "duckweed/runner";
import {VNode} from "snabbdom/src/vnode";

import * as route from "shared/route";

import * as navbar from "./navbar";

type ViewFunction = (props: {act: ActionTrigger, model: any, key: string}) => VNode;

interface BasicModule {
  update?: UpdateFunction;
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

const matchRoute = (rm: RouteModule, path: string) =>
  route.match(ROUTE_PREFIX, rm.re, path);

const getMatchingRoute = (routes: RouteModule[], path: string): RouteMatch | void => {
  if (!routes.length) {
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

const update = (model: Model, address: Action, ...args) => {
  switch (address) {
    case Action.ModuleAction:
      const [moduleUpdate, moduleaddress, ...moduleMsg] = args;
      if (typeof moduleUpdate === "undefined") {
        // The module does not define any actions, no point in doing anything
        return model;
      }
      return duckweed.scoped.transform(
        ["model"],
        (moduleModel) => moduleUpdate(moduleModel, moduleaddress, ...moduleMsg),
        model,
      );

    case Action.SwitchRoute:
      const [{pathname}] = args;
      const {mod} = getMatchingRoute(routeTable, pathname) as RouteMatch;
      return {
        ...model,
        model: mod.init ? mod.init() : undefined,
        path: pathname,
      };

    case Action.NavbarAction:
      const [path] = args;
      setTimeout(() => route.go(path));
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

const view = ({model, act}: Props) =>
  (({mod}) =>
    <div route={act(Action.SwitchRoute)}>
      <navbar.view act={act.bind(null, Action.NavbarAction)} links={model.links} />
      <mod.view model={model.model} act={act.bind(null, Action.ModuleAction, mod.update)} key={model.path} />
    </div>
  )(getMatchingRoute(routeTable, model.path) as RouteMatch);

export {
  Model,
  init,
  Action,
  update,
  view,
};
