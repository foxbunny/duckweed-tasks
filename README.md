# Snabbdom-Elm (selm)

This is an experiment replicating the [Elm
architecture](https://guide.elm-lang.org/architecture/) (kind of) using
[Snabbdom](https://github.com/snabbdom/snabbdom) and
[TypeScript](http://www.typescriptlang.org/).

## Getting started

Install yarn globally:

```shell
npm i -g yarn
```

Init the project:

```shell
yarn
```

## TODO

- [ ] Implement routing by letting components 'bind' to routing events
- [ ] Write tests for everything in the `src/runtime`
- [ ] Write a more fully-featured app

## Not strictly functional

This experiement is not intended to adhere to functional programming paradigm.
(After all, there's Elm for that.) Instead, it is solely concerned with bringing
the gist of the Elm architecture to TypeScript. You will see things that are an
anti-pattern in functional programming, such as try-catch and generators.

## Special mentions

The following features deserve a special mention.

### off-events

The off-events (e.g., `off-click`, `off-focus`, etc) are event handlers that are
triggered when the event happens outside an element. These are implemented
through `src/runtime/documentevents.ts`.

### Actions

Rather than using objects to encapsulate the messages, we use simple [TypeScript
enums](https://www.typescriptlang.org/docs/handbook/enums.html). Instead of
using a single update function, we use a mapping from enums to `async`
functions. See `src/main.tsx` for an example.

### Async iterators

We use async iterators for action handlers. This means that a single action may
`yield` multiple model mutations. The reason for this is handling long-running
processes such as XHR reuquests, where we may need to alter the model state
several times (e.g., set "loading" flag before start, clear it afterwards).

For example:

```typescript
const actions = {
  async *[Action.Save](model: Model, credentials: User.Credentials) {
    yield assoc("loading", true, model);
    try {
      await xhr.post("/account", credentials);
      yield merge(model, {
        accountData: credentials,
        loading: false,
      });
    } catch(e) {
      yield merge(model, {
        error: e,
        loading: false
      });
    }
  },
};
```

### Inline styles

We use inline styles in the example code, but there is full support for Stylus
stylesheets (and an intention to switch to them).

## Commands

- `yarn` - install all development dependencies
- `yarn start` - start the webpack dev server on port 8080
- `yarn run build` - to perform a production build
- `yarn run build:profile` - to perform a production build and analyize it
- `yarn test` - run tests
- `yarn run test:watch` - run tests in watch mode

## License

This template is licensed under MIT.

Copyright (c) 2017 Hajime Yamasaki Vukelic

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
