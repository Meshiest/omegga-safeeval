module.exports = class Eval {
  constructor(omegga, config, store) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
    this.modules = {};
  }

  // load a module
  async loadModule(name) {
    return (this.modules[name] = await require('./modules/' + name + '.js')(
      this,
      global.OMEGGA_UTIL
    ));
  }

  // add a module to the ones that will be loaded
  async addModule(name, load = false) {
    await this.store.set(
      'modules',
      ((await this.store.get('modules')) || []).concat([name])
    );
    if (load) return (this.modules[name] = await this.loadModule(name));
    return 'ok';
  }

  // add a module to the ones that will be loaded
  async removeModule(name) {
    await this.store.set(
      'modules',
      ((await this.store.get('modules')) || []).filter(m => m.name !== name)
    );
    return 'ok';
  }

  // clear loaded modules
  async resetModules() {
    await this.store.set('modules', []);
    return 'ok';
  }

  async init() {
    const registeredCommands = [];
    let loaded = 0;

    for (const mod of (await this.store.get('modules')) || []) {
      try {
        const out = await this.loadModule(mod);
        if (typeof out === 'object' && out.registeredCommands instanceof Array)
          registeredCommands.push(...out.registeredCommands);

        this.modules[mod] = out;
        loaded++;
      } catch (err) {
        console.error('error loading module', mod, '-', err);
      }
    }

    if (loaded > 0) console.info('Loaded', loaded, 'modules');

    Omegga.on('chat', async (name, message) => {
      try {
        if (message[0] !== ';' && !message.startsWith('&scl;')) return;
        const code = message.slice(message.startsWith('&scl;') ? 5 : 1);
        const player = Omegga.getPlayer(name);
        if (
          this.config['only-authorized'] &&
          !player.isHost() &&
          !this.config['authorized-users'].some(p => player.id === p.id)
        )
          return;
        console.info(name, 'eval:', code);
        try {
          global.plugin = this;
          eval(code);
          if (result instanceof Promise)
            Omegga.broadcast(`"<code>${await result}</>"`);
          else Omegga.broadcast(`"<code>${result}</>"`);
        } catch (e) {
          Omegga.broadcast(
            `"<code><color=\\"ff5555\\">error: ${e.message || e}</></>"`
          );
        }
      } catch (e) {
        console.log(e);
      }
    });

    return { registeredCommands };
  }

  stop() {}
};
