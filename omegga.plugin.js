module.exports = class Eval {
  constructor(omegga, config, store) {
    this.config = config;
    this.store = store;
  }

  init() {
    Omegga
      .on('chat', async (name, message) => {
        try {
          if (message[0] !== ';' && !message.startsWith('&scl;')) return;
          const code = message.slice(message.startsWith('&scl;') ? 5 : 1);
          const player = Omegga.getPlayer(name);
          if (
            this.config['only-authorized'] && !player.isHost() &&
            !this.config['authorized-users'].some(p => player.id === p.id)
          ) return;
          console.info(name, 'eval:', code);
          try {
            const result = eval(code);
            if (result instanceof Promise)
              Omegga.broadcast(`"<code>${await result}</>"`);
            else
              Omegga.broadcast(`"<code>${result}</>"`);
          } catch (e) {
            Omegga.broadcast(`"<code><color=\\"ff5555\\">error: ${e.message || e}</></>"`);
          }
        } catch (e) {
          console.log(e);
        }
      });
  }

  stop() {}
};
