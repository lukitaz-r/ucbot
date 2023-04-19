const config = require(`${process.cwd()}/config/config.json`);
const { SlashCommandBuilder, REST, Routes } = require("discord.js");


const chatCommand = new SlashCommandBuilder()
  .setName("prueba")
  .setDescription("Envia el mensaje a la Inteligencia Artificial (Bob Lee) para que te responda")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("El mensaje que quieres que responda la IA")
      .setRequired(true)
  );

const rest = new REST({ version: "10" }).setToken(config.token);



(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    const commands = [];
    commands.push(chatCommand.toJSON());

    if (config.guild_id) {
      await rest.put(
        Routes.applicationGuildCommands(config.client_id, config.guild_id),
        {
          body: commands,
        }
      );
    } else {
      await rest.put(Routes.applicationCommands(config.client_id), {
        body: commands,
      });
    }

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();