const ms = require('ms');
const Discord = require('discord.js')
module.exports = {
    name: "giveaway",
    aliases: ["sorteo", "sorteos", "giveaways"],
    desc: "Sirve administrar/crear un sistema de sorteos",
    permisos: ["BanMembers"],
    permisos_bot: ["BanMembers"],
    run: async (client, message, args, prefix) => {
        //definimos los metodos del sorteos
        let metodos = ["start", "reroll", "end"];
        if(!args || !metodos.includes(args[0])) return message.reply({
            embeds: [new Discord.EmbedBuilder()
            .setTitle(`❌ Tienes que especificar un método válido!`)
            .setColor("FF0000")
            .setDescription(`Métodos disponibles: ${metodos.map(metodo => `\`${metodo}\``).join(", ")}`)
            ]
        });

        switch (args[0]) {
            case "start":{
                let embed = new Discord.EmbedBuilder()
                .setDescription(`**Uso:** \`${prefix}sorteo <#canal> <duración> <ganadores> <premio>\``)
                .setColor("FF0000");

                let canal = message.guild.channels.cache.get(args[1]) || message.mentions.channels.filter(c => c.guild.id == message.guild.id).first()
                if(!canal) return message.reply({
                    embeds: [embed.setTitle(`❌ Tienes que especificar un canal válido!`)]
                })
                let tiempo = args[2];
                if(!tiempo) return message.reply({
                    embeds: [embed.setTitle(`❌ Tienes que especificar una duración del sorteo válida!`)]
                })
                let tiempo_en_ms = ms(args[2]);
                if(!tiempo_en_ms || isNaN(tiempo_en_ms) || tiempo_en_ms < 0 || tiempo_en_ms % 1 != 0) return message.reply({
                    embeds: [embed.setTitle(`❌ Tienes que especificar una duración del sorteo válida!`)]
                })
                let ganadores = Number(args[3]);
                if(!ganadores || isNaN(ganadores) || ganadores < 0 || ganadores % 1 != 0) return message.reply({
                    embeds: [embed.setTitle(`❌ Tienes que especificar una cantidad de ganadores válida!`)]
                })
                let premio = args.slice(4).join(" ");
                if(!premio) return message.reply({
                    embeds: [embed.setTitle(`❌ Tienes que especificar un premio válido!`)]
                });

                client.giveawaysManager.start(canal, {
                    duration: tiempo_en_ms,
                    winnerCount: Number(ganadores),
                    prize: premio,
                    hostedBy: message.author,
                    messages: {
                        giveaway: "🎉🎉 **NUEVO SORTEO** 🎉🎉",
                        giveawayEnded: "⌚ **SORTEO FINALIZADO** ⌚",
                        inviteToParticipate: "Reacciona con 🎉 para participar!",
                        winMessage: "🎉 Enhorabuena {winners} has/habéis ganado **{this.prize}**",
                        winners: "Ganador(es)",
                        hostedBy: "Hosteado por {this.hostedBy}",
                        endedAt: "Finalizado el",
                        drawing: "Termina en <t:{Math.round(this.endAt / 1000)}:R>"
                    }
                }).then(() => {
                    return message.reply(`✅ **Sorteo iniciado en ${canal}**`)
                })
            }

                
                break;
        
            default:
                break;
        }
    }
}
