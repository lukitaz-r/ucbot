const Discord = require('discord.js')
const  ms = require('ms')
module.exports = {
    name: 'unmute',
    aliases: ['desmutear', 'jajadesmuteao'],
    desc: 'Comando para desmutear a tal usuario por un determinado tiempo',
    permisos: ['BanMembers'],
    permisos_bot: ['BanMembers'],
    run: async (client, message, args, prefix) => {
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first();
        if (!usuario) return message.reply(`❌ **No se ha encontrado al usuario que has especificado!**`);
        if(usuario.id == message.guild.ownerId) return message.reply(`❌ **No puedes mutear al DUEÑO del Servidor!**`);
        
        if (message.guild.members.me.roles.highest.position > usuario.roles.highest.position) {
                    if (message.member.roles.highest.position > usuario.roles.highest.position) {
                        usuario.send({embeds: [
                            new Discord.EmbedBuilder()
                            .setTitle(`Has sido desmuteado de __${message.guild.name}__`)
                            .setColor(client.color)
                            .setTimestamp()
                        ]}).catch(() => {message.reply(`No se le ha podido enviar el DM al usuario!`)});

                        message.reply({embeds: [new Discord.EmbedBuilder()
                            .setTitle(`✅ Usuario desmuteado`)
                            .setDescription(`**Se ha desmuteado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)***`)
                            .setColor(client.color)
                            .setTimestamp()
                            ]})
            
                            usuario.timeout(null).catch(() => {
                                return message.reply({embeds: 
                                [new Discord.EmbedBuilder()
                                .setTitle(`❌ No he podido desmutear al usuario!`)
                                .setColor("FF0000")
                                ]})
                            });
                        } else {
                            return message.reply(`❌ **Tu Rol está por __debajo__ del usuario que quieres desmutear!**`)
                        }
                    } else {
                        return message.reply(`❌ **Mi Rol está por __debajo__ del usuario que quieres desmutear!**`)
                    }
        }
    }