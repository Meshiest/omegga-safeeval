# safe eval plugin

This eval does not access to any node modules and can only shut your server down by certain memory leaks, though not all.

## Install

Easy: `omegga install gh:Meshiest/safeeval`

Manual:

* `git clone https://github.com/meshiest/omegga-safeeval safeeval` in `plugins` directory

## Commands

 * `;code` - run code

## Modules

You can write your own modules in the `modules` directory. Check out the `modules/demo.js` module for some boilerplate code.

This feature is more powerful when paired with the [reloader plugin](https://github.com/Meshiest/omegga-reloader) (`omegga install gh:meshiest/reloader`) so modules are reloaded when you save.

Modules can be loaded in chat with the following api (ran in chat eval)

* `;this.loadModule('modulename')` - load `modules/modulename.js`
* `;this.addModule('modulename')` - enable loading of `modules/modulename.js` on plugin init
* `;this.addModule('modulename', true)` - enable loading of `modules/modulename.js` on plugin init and run it (will not register commands)
* `;this.removeModule('modulename')` - disable loading of `modules/modulename.js` on plugin init
* `;this.resetModules()` - disable all modules from loading on init

The result of a module's exported function can be referenced by `;this.modules.modulename`, though the eval plugin itself or `global` can be modified to run things easier.