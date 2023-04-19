const { Snake } = require('discord-gamecord');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'snake',
  description: 'Juega al juego de Snake en Discord',
  run: async (message, args) =>  {
    const snakeGame = new Snake({
      title: 'Juego de Snake',
      color: 'GREEN',
      timestamp: true,
      gameOverTitle: 'Juego terminado',
    });
    
    const snakeEmbed = new EmbedBuilder()
      .setDescription('Presiona la reacción para jugar al juego de Snake!')
      .setColor('GREEN');

      const snakeMessage = await message.channel.send({ embeds: [snakeEmbed] });

      await snakeGame.newGame(snakeMessage); // Pasar el mensaje como opción
  
      // Control de reacciones
      const filter = (reaction, user) =>
        ['⬅️', '⬆️', '⬇️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
  
      const collector = snakeMessage.createReactionCollector({
        filter,
        time: 150000,
      });
  
      collector.on('collect', async (reaction, user) => {
        reaction.users.remove(user.id);
  
        if (reaction.emoji.name === '⬅️') await snakeGame.moveLeft();
        if (reaction.emoji.name === '⬆️') await snakeGame.moveUp();
        if (reaction.emoji.name === '⬇️') await snakeGame.moveDown();
        if (reaction.emoji.name === '➡️') await snakeGame.moveRight();
  
        await snakeMessage.edit({ embeds: [snakeGame.currentEmbed] });
      });
  
      collector.on('end', async () => {
        await snakeMessage.reactions.removeAll();
      });
  
      // Añadir las reacciones al mensaje
      await snakeMessage.react('⬅️');
      await snakeMessage.react('⬆️');
      await snakeMessage.react('⬇️');
      await snakeMessage.react('➡️');
    },
  };