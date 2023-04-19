const { Client, GatewayIntentBits, EmbedBuilder} = require("discord.js");
const Discord = require('discord.js');
const config = require('./config/config.json')
const fs = require('fs');
require('colors')
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
    ],
    partials: [Discord.Partials.User, Discord.Partials.Channel, Discord.Partials.GuildMember, Discord.Partials.Message, Discord.Partials.Reaction]

})

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.color = config.color;

Object.freeze(client.la);

fs.readdirSync('./handlers').forEach(handler => {
    try {
        require(`./handlers/${handler}`)(client, Discord);
    } catch (e) {
        console.log(`ERROR EN EL HANDLER ${handler}`.red)
        console.log(e)
    }
});

const fetchResponse = require("./helpers/chatgpt-fetch.js");
const cooldowns = require("./helpers/cooldown");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply();

  if (interaction.commandName === "prueba") {
    const userMessage = interaction.options.getString("message");
    const checkCooldown = await cooldowns.getCooldown(interaction.user.id);
if (typeof checkCooldown === 'number') {
  const minutes = Math.floor(checkCooldown / 60000);
  const seconds = ((checkCooldown % 60000) / 1000).toFixed(0);
  const timeLeft =
    minutes + "m " + (seconds < 10 ? "0" : "") + seconds + "s";

  return await interaction.editReply(
    `Tienes un cooldown de **${timeLeft}** aún.`
  );
} else {
  console.log('Error al obtener el cooldown:', checkCooldown);
}

    cooldowns.addCooldown(interaction.user.id);

    const chatGptReply = await fetchResponse(userMessage);

    let fields = [];
    let field = { name: "IA", value: "" };
    for (let i = 0; i < chatGptReply.length; i++) {
      if (field.value.length < 1000) {
        field.value += chatGptReply[i];

        if (i == chatGptReply.length - 1) fields.push(field);
      } else {
        let addValue = chatGptReply[i];

        const hasCodeBlock = field.value.split("```");

        if (hasCodeBlock.length > 1 && hasCodeBlock.length % 3 !== 0) {
          const language = field.value.split("```")[1].split("\n")[0];
          field.value += "```";
          addValue = "```" + language + "\n" + addValue;
        }

        fields.push(field);
        field = { name: "Continued...", value: addValue };
      }
    }

    let embed = new EmbedBuilder()
    .setTitle("IA")
    .addFields(
      { name: interaction.user.username, value: userMessage },
      ...fields
    )
    .setColor("FCDE02")
    .setThumbnail(client.user.avatarURL())
    .setFooter({
      text: `Structure by @samennis1, Developed by @ALEMAN. Powered by ${config.engine}`,
      iconURL: "https://images-ext-2.discordapp.net/external/2_i6MR9rJgm1LV8ZuvV_tw0uX5KfxOKMDk6LVcwa-w8/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/1089057719866101801/f3828b5df06d9a4c519097272237af48.png",
    })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}
});


client.login(config.token).catch(() => console.log(`-[X]- NO HAS ESPECIFICADO UN TOKEN VALIDO O TE FALTAN INTENTOS -[X]-\n [-] ACTIVA LOS INTENTOS EN https://discord.dev [-]`.red))