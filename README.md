# Skeletor Local Server Plugin
The purpose of this plugin is to runu a local server.

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

#### Return Value
A Promise that resolves to a [Status object](#the-status-object).

## Required Add-Ins
