const Discord = require('discord.js')
const  ms = require('ms')
module.exports = {
    name: 'mute',
    aliases: ['mutear', 'intenta-hablar', 'jajamuteao', 'timeout'],
    desc: 'Comando para mutear a tal usuario por un determinado tiempo',
    permisos: ['BanMembers'],
    permisos_bot: ['BanMembers'],
    run: async (client, message, args, prefix) => {
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first();
        if (!usuario) return message.reply(`❌ **No se ha encontrado al usuario que has especificado!**`);

        let razon = args.slice(1).join(" ");
        if(!razon) razon = "No se ha especificado ninguna razón!"
        
        if(usuario.id == message.guild.ownerId) return message.reply(`❌ **No puedes mutear al DUEÑO del Servidor!**`);
        
        if (message.guild.members.me.roles.highest.position > usuario.roles.highest.position) {
                    if (message.member.roles.highest.position > usuario.roles.highest.position) {
                        usuario.send({embeds: [
                            new Discord.EmbedBuilder()
                            .setTitle(`Has sido muteado de __${message.guild.name}__`)
                            .setDescription(`**Razón:** \n\`\`\`yml\n${razon}\`\`\``)
                            .addFields([{name: `Razón`, value: `\n\`\`\`yml\n1 hora\`\`\``}])
                            .setColor(client.color)
                            .setTimestamp()
                        ]}).catch(() => {message.reply(`No se le ha podido enviar el DM al usuario!`)});

                        message.reply({embeds: [new Discord.EmbedBuilder()
                            .setTitle(`✅ Usuario baneado`)
                            .setDescription(`**Se ha muteado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)***`)
                            .addFields([{name: `Razón`, value: `\n\`\`\`yml\n${razon}\`\`\``}])
                            .addFields([{name: `Tiempo`, value: `\n\`\`\`yml\n1 hora\`\`\``}])
                            .setColor(client.color)
                            .setTimestamp()
                            ]})
            
                            usuario.timeout(3600_000, razon).catch(() => {
                                return message.reply({embeds: 
                                [new Discord.EmbedBuilder()
                                .setTitle(`❌ No he podido mutear al usuario!`)
                                .setColor("FF0000")
                                ]})
                            });
                        } else {
                            return message.reply(`❌ **Tu Rol está por __debajo__ del usuario que quieres mutear!**`)
                        }
                    } else {
                        return message.reply(`❌ **Mi Rol está por __debajo__ del usuario que quieres mutear!**`)
                    }
        }
    }