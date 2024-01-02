const Discord = require('discord.js')
const  ms = require('ms')
module.exports = {
    name: 'mute',
    aliases: ['mutear', 'intenta-hablar', 'jajamuteao', 'timeout', 'stfu', "callao"],
    desc: 'Comando para mutear a tal usuario por un determinado tiempo',
    permisos: ['BanMembers'],
    permisos_bot: ['BanMembers'],
    run: async (client, message, args, prefix) => {
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first();
        if (!usuario) return message.reply(`❌ **No se ha encontrado al usuario que has especificado!**`);

        let tiempo = args[1]
        if(isNaN(tiempo) || !tiempo || tiempo <= 0) { 
            tiempo = 1
        }
        let sas = "";
        if(tiempo > 1) sas = "minutos"; 
        else if (tiempo == 1) sas = "minuto"
        
        let tempo = (tiempo * 60) * (10**3)

        let razon = args.slice(2).join(" ");
        if(!razon) razon = "No se ha especificado ninguna razón!"

        if(usuario.id == message.guild.ownerId) return message.reply(`❌ **No puedes mutear al DUEÑO del Servidor!**`);
        
        if (message.guild.members.me.roles.highest.position > usuario.roles.highest.position) {
                    if (message.member.roles.highest.position > usuario.roles.highest.position) {
            
                            usuario.timeout(tempo, razon).catch(() => {
                                return message.reply({embeds: 
                                [new Discord.EmbedBuilder()
                                .setTitle(`❌ No he podido mutear al usuario!`)
                                .setColor("FF0000")
                                ]})
                            });

                            usuario.send({embeds: [
                                new Discord.EmbedBuilder()
                                .setTitle(`Has sido muteado de __${message.guild.name}__`)
                                .setDescription(`**Razón:** \n\`\`\`yml\n${razon}\`\`\``)
                                .addFields([{name: `Razón`, value: `\n\`\`\`yml\n${tiempo} ${sas}\`\`\``}])
                                .setColor(client.color)
                                .setTimestamp()
                            ]}).catch(() => {message.reply(`No se le ha podido enviar el DM al usuario!`)});

                            message.reply({embeds: [new Discord.EmbedBuilder()
                                .setTitle(`✅ Usuario muteado`)
                                .setDescription(`**Se ha muteado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)***`)
                                .addFields([{name: `Razón`, value: `\n\`\`\`yml\n${razon}\`\`\``}])
                                .addFields([{name: `Tiempo`, value: `\n\`\`\`yml\n${tiempo} ${sas}\`\`\``}])
                                .setColor(client.color)
                                .setTimestamp()
                                ]})

                        } else {
                            return message.reply(`❌ **Tu Rol está por __debajo__ del usuario que quieres mutear!**`)
                        }
                    } else {
                        return message.reply(`❌ **Mi Rol está por __debajo__ del usuario que quieres mutear!**`)
                    }
        }
    }
