# Skeletor Express Plugin
[![Build Status](https://travis-ci.org/deg-skeletor/skeletor-plugin-express.svg?branch=master)](https://travis-ci.org/deg-skeletor/skeletor-plugin-express)

The purpose of this plugin is to runu a local Express server.

This is a functioning plugin that can be installed as-is to a Skeletor-equipped project. 

To learn more about Skeletor, [go here](https://github.com/deg-skeletor/skeletor-core).

## Getting Started
After you have cloned this repository, run `npm install` in a terminal to install some necessary tools, including a testing framework (Jest) and a linter (ESLint). 

## Source Code
The primary source code for this sample plugin is located in the `index.js` file.

## Running Tests
This sample plugin is pre-configured with the [Jest testing framework](https://facebook.github.io/jest/) and an example test. 

From a terminal, run `npm test`. You should see one test pass and feel pleased.

Test code can be found in the `index.test.js` file.

## Skeletor Plugin API

For a Skeletor plugin to function within the Skeletor ecosystem, it must expose a simple API that the Skeletor task runner will interact with.
The method signatures of the API are as follows:

### run(config)

The `run()` method executes a plugin's primary task. It is the primary way (and, currently, the *only* way) that the Skeletor task runner interacts with a plugin.

#### Config Options

```
{
    "port": 3001,
    "entry": '../dist',
    "currentDirectory": __dirname,
    "middleware": [{
        "route": "",
        "fn": () => {}
    }]
}
```

**port**

Type: `Number`

Default: `3000`

The port that the server should use. *This is an optional config*

**entry**

Type: `String`

The relative path to the directory or file that will be the entry point to the server. This path should be relative to the config file.

**currentDirectory**

Type: `String`

Value: `__dirname`

The path to the project directory on the user's machine. This should always be the node variable `__dirname`.

**middleware**

Type: `Object[]`

A list of middleware objects to be used for server. See [middleware](#middleware) for more details.

#### Middleware

**route**

Type: `String`

Default: `/`

The route for which the middleware function applies.

**fn**

Type: `Function` or `Array`

The middleware function or an array of functions. Usually loaded from a separate file using the `require()` syntax

Example middleware obj:
```
{
    "route": "/hello",
    "fn": require('../source/middleware/testMiddleware')
}
```

where the `testMiddleware` file looks like this:
```
const middleware = function(req, res, next) {
    req.greeting = 'Hello World';

    res.send(req.greeting);
}

module.exports = middleware;
```

For more information about writing middleware for Express, see their [documentation](https://expressjs.com/en/guide/writing-middleware.html)

#### Return Value
A Promise that resolves to a Status object.

**status**

Type: `String`

Possible Values: `'running'`, `'error'`

Contains the status of the plugin.

**message**

Type: `String`

Contains any additional information regarding the status of the plugin.

## Required Add-Ins

[path](https://nodejs.org/docs/latest/api/path.html)

a module that provides utilities for working with file and directory paths

[express](https://expressjs.com/)

A minimal and flexible Node.js framework with HTTP utility methods and middleware support

[opn](https://github.com/sindresorhus/opn)

A node module that opens websites, files, and executables. Has cross-platform support
