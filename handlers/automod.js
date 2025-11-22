const config = require('../config/config.json');
const { asegurar_todo } = require(`${process.cwd()}/utils/funciones.js`)
const warnSchema = require(`${process.cwd()}/modelos/warns.js`)
const allowedLinks = config.allowedLinks || [];
const whitelistedChannels = config.whitelistedChannels || [];
const privilegedRoleId = config.privilegedRoleId || []

module.exports = client => {
  client.on("messageCreate", async (message) => {	
      if (message.author.bot) return
      if (whitelistedChannels.includes(message.channel.id)) return
      const urlRegex = /(https?:\/\/[\w\.-]+(?:\.[\w\.-]+)+(?:[\w\-\._~:\/?#\[\]@!\$&'\(\)\*\+,;=.]+)?)/gi;
      const foundLinks = message.content.match(urlRegex);
      if (!foundLinks) return;
      const unallowedLinks = foundLinks.filter(link => !allowedLinks.some(keyword => link.includes(keyword)));
      if (unallowedLinks.length === 0) return;
      try {
        await message.delete()
        console.log(`Deleted message from ${message.author.tag} containing unallowed links.`);
      } catch (error) {
        console.error(`Failed to delete message: ${error}`);
      }

      try {
        const member = await message.guild.members.fetch(message.author.id);
        let hasPrivilegedRole
        for (i = 0; i < privilegedRoleId.length; i++) {
          if (member.roles.cache.has(privilegedRoleId[i])) {
            hasPrivilegedRole = true
            break
          } else {
            hasPrivilegedRole = false
          }
        }
        if (hasPrivilegedRole) {
          console.log('No se aplicaron sanciones al usuario privilegiado')
          return
        } 

        await asegurar_todo(message.guild.id, member.id);

        await member.timeout(1000 * 60 * 10, `Enlace no permitido`)
        //creamos el objeto del warn
        let objeto_warn = {
          fecha: Date.now(),
          autor: client.user.id,
          razon: "Enlace no permitido en el servidor!"
        }
      //empujamos el objeto en la base de datos
        await warnSchema.findOneAndUpdate({ guildID: message.guild.id, userID: member.id }, {
          $push: {
              warnings: objeto_warn
          }
        })

        let data = await warnSchema.findOne({ guildID: message.guild.id, userID: member.id })
        if (data.warnings.length > 8) {
          await member.ban({ reason: "Automod" })
          console.log(`Baneado ${member.user.tag} por comportamiento sospechoso`)
        }
      } catch (error) {
        console.error(`Failed to punish user: ${error}`);
      }
    })
}