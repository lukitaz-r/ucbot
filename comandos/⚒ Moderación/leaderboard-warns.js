const warnSchema = require(`${process.cwd()}/modelos/warns.js`)
const {asegurar_todo} = require(`${process.cwd()}/utils/funciones.js`)
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "leaderboad-warns",
    aliases: ["warns-g", "server-warns", "warnings-server", "leader-warns"],
    desc: "Sirve para mostrar los warnings del server",
    run: async (client, message, args, prefix) => {
      const topUsers = await warnSchema.aggregate([
        {
          $project: {
            userID: 1,
            warnCount: { $size: { $ifNull: ["$warnings", []] } }
          }
        },
        { $sort: { warnCount: -1 } },
        { $limit: 10 }
      ])
        const rows = topUsers.map((user, index) => `**${index + 1}.** <@${user.userID}> \`${user.userID}\` - ${user.warnCount} warns`).join('\n');

        const embed = new EmbedBuilder()
          .setTitle('Top 10 usuarios con más warns')
          .setDescription(rows || 'No se encontraron usuarios.')
          .setColor(client.color);
  
      message.reply({embeds: [embed]})
    }
  }