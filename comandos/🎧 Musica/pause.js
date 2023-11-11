

module.exports = {
    name: "pause",
    aliases: ["pausa", "pausa-flaco", "pará", "resume", "basta"],
    desc: "Sirve para desconectar al bot de la sala de voz",
    run: async (client, message, args, prefix) => {
        //comprobaciones previas
        const queue = client.distube.getQueue(message);
        if(!queue) return message.reply(`❌ **No hay ninguna canción reproduciéndose!**`);
        if(!message.member.voice?.channel) return message.reply(`❌ **Tienes que estar en un canal de voz para ejecutar este comando!**`);
        if(message.guild.members.me.voice?.channel && message.member.voice?.channel.id != message.guild.members.me.voice?.channel.id) return message.reply(`❌ **Tienes que estar en el mismo canal de voz __QUE YO__ para ejecutar este comando!**`);
        if (queue.paused) {
            client.distube.resume(message)
            message.reply(`**Canción sonando!** ⏩ [\`${queue.songs[0].name}\`](${queue.songs[0].url})`)
        } else {
            client.distube.pause(message);
            message.reply(`**Canción pausada!** ⏸ [\`${queue.songs[0].name}\`](${queue.songs[0].url})`)
        }
        
    }
}
