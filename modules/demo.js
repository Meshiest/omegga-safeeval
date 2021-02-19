module.exports = async (plugin, OMEGGA_UTIL) => {
  const { omegga: Omegga } = plugin;

  // example /me command
  Omegga.on('cmd:me', async (name, ...args) => {
    const player = Omegga.getPlayer(name);
    const color = player.getNameColor();
    const message = OMEGGA_UTIL.chat.sanitize(args.join(' '));
    Omegga.broadcast(`"<i><b><color=\\"${color}\\">${name}</></> ${message}</>`);
  });

  return {
    registeredCommands: ['me'],
    example() {
      Omegga.broadcast('"run this with: <code>;this.modules.demo.example()</>"');
    },
  };
};