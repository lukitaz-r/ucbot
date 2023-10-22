const Discord = require("discord.js");
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "login",
    aliases: ["entrar", "registro"],
    desc: "Registrate en el torneo",
    run: async (client, message, args, prefix) => {
        const setupData = await setupSchema.findOneAndUpdate({guildID: message.guild.id});
        let canalDatos = message.guild.channels.cache.get(setupData.torneo.canal)
        let msg = args.slice(0).join(" ");
        if(!msg) return message.reply({
            embeds: [new Discord.EmbedBuilder() .setTitle(`❌ Tienes que especificar datos válidos!`)]
        });
        if(msg){
            await message.reply({
                embeds: [new Discord.EmbedBuilder()
                .setTitle(`✅ Te has registrado exitosamente!`)
                .setDescription(`**Tus datos son:** \n\`\`\`yml\n${msg}\`\`\``)
                .setColor(client.color)
                ]
            });
            await canalDatos.send({
                embeds: [new Discord.EmbedBuilder()
                .setTitle(`✅ ${message.author.tag} se ha registrado!`)
                .setDescription(`**Sus datos son:** \n\`\`\`yml\n${msg}\`\`\``)
                .setColor(client.color)
                ]
            });
        }
    }
}