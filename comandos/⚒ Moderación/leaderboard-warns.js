
const warnSchema = require(`${process.cwd()}/modelos/warns.js`)
const {asegurar_todo} = require(`${process.cwd()}/utils/funciones.js`)




module.exports = {
    name: "leaderboad-warns",
    aliases: ["warns-g", "server-warns", "warnings-server", "leader-warns"],
    desc: "Sirve para mostrar los warnings del server",
    run: async (client, message, args, prefix) => {
      const leaderboard = await warnSchema.find()
        .sort({ warnings: -1 })
        .limit(10);
  
      const leaderboardMessage = leaderboard
        .map((user, position) => `${position + 1}. <@${user.userID}>: ${user.warnings.length} warnings`)
        .join('\n');
  
      message.reply(`Tabla de clasificación:\n${leaderboardMessage}`);
    }
  }