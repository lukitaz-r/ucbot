const Discord = require("discord.js")
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);


module.exports = {
    name: "datos",
    aliases: ["data"],
    desc: "Inserta los datos del torneo",
    run: async (client, message, args, prefix) => {
        var objeto = {
            canal: "",
        }
        if(!args.length) return message.reply("❌ **Tienes que especificar el canal de la base de datos!**")
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.filter(c => c.guild.id == message.guild.id).first()
        if(!channel || channel.type !== 0) return message.reply("❌ **El canal de datos que has mencionado no existe!**");
        if(channel){
            objeto.canal = channel.id;
            await message.reply({
                embeds: [new Discord.EmbedBuilder()
                .setTitle(`Canal Seteado en <#${objeto.canal}>!`)
                .setDescription(`usa \`${prefix}login\` para registrarte en el torneo!`)
                .setColor(client.color)
                ]
            });
        }
        await setupSchema.findOneAndUpdate({guildID: message.guild.id}, {
            torneo: objeto
        });
    }
}