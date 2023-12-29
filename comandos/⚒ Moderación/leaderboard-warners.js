const warnSchema = require(`${process.cwd()}/modelos/warns.js`);
module.exports = {
  name: "leaderboard-warners",
  aliases: ["warners-g", "warners-server", "leader-warners", "staff"],
  desc: "Muestra la tabla de clasificación de los usuarios que dieron más warns en el servidor",
  run: async (client, message, args, prefix) => {
    // Obtener todos los documentos de warnSchema
    const allWarns = await warnSchema.find();

    // Crear un objeto para almacenar el número total de warnings para cada usuario
    const warnsByUser = {};

    // Iterar a través de cada documento en la colección de warnSchema
    allWarns.forEach((warn) => {
      // Iterar a través de los warnings de cada usuario
      warn.warnings.forEach((warning) => {
        // Incrementar el número total de warnings para este usuario
        const user = warning.autor;
        if (warnsByUser[user]) {
          warnsByUser[user]++;
        } else {
          warnsByUser[user] = 1;
        }
      });
    });

    // Ordenar el objeto de número total de warnings por valor, de mayor a menor
    const sortedWarnsByUser = Object.entries(warnsByUser)
      .sort((a, b) => b[1] - a[1]);

    // Crear un mensaje con la tabla de líderes
    const leaderboard = sortedWarnsByUser.map(([userId, numWarns], i) => {
      return `${i + 1}. <@${userId}> con ${numWarns} warnings`;
    }).join("\n");

    // Enviar el mensaje con la tabla de líderes al canal
    message.channel.send(`🔥 Los staff que dieron mas warns en el servidor: \n${leaderboard}`);
  },
};
