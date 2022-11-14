/*
|--------------------------------------------------------------------------
| Tests
|--------------------------------------------------------------------------
|
| The contents in this file boots the AdonisJS application and configures
| the Japa tests runner.
|
| For the most part you will never edit this file. The configuration
| for the tests can be controlled via ".adonisrc.json" and
| "tests/bootstrap.ts" files.
|
*/

process.env.NODE_ENV = "test";

import "reflect-metadata";

import { Ignitor } from "@adonisjs/core/build/standalone";
import type { RunnerHooksHandler } from "@japa/runner";
import { configure, processCliArgs, run } from "@japa/runner";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install({ handleUncaughtExceptions: false });

const kernel = new Ignitor(__dirname).kernel("test");

kernel
  .boot()
  .then(() => import("./tests/bootstrap"))
  .then(({ runnerHooks, ...config }) => {
    const app: RunnerHooksHandler[] = [() => kernel.start()];

    configure({
      ...kernel.application.rcFile.tests,
      ...processCliArgs(process.argv.slice(2)),
      ...config,
      ...{
        importer: (filePath) => import(filePath),
        setup: app.concat(runnerHooks.setup),
        teardown: runnerHooks.teardown,
      },
      cwd: kernel.application.appRoot,
    });

    run();
  });
