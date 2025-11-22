const config = require(`${process.cwd()}/config/config.json`);
const Discord = require('discord.js');
const serverSchema = require(`${process.cwd()}/modelos/servidor.js`)
const { asegurar_todo } = require(`${process.cwd()}/utils/funciones.js`) 
const privilegedRoleId = config.privilegedRoleId || []

const apiKey = config.apiIa; // Reemplaza con tu API key real
const url = "https://api.openai.com/v1/chat/completions";

// 2. Headers con autenticación
const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
};
// 4. Función asíncrona para enviar la solicitud
async function callOpenAI(d) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(d)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const jsonResponse = await response.json();

        // 5. Procesamiento de la respuesta
        const assistantResponse = jsonResponse.choices[0].message.content;
        

        // 7. Cálculo estimado de costo
        const inputTokens = jsonResponse.usage.prompt_tokens;
        const outputTokens = jsonResponse.usage.completion_tokens;
        
        const costInput = (inputTokens / 1_000_000) * 0.15; // Ejemplo: $0.02 por 1M tokens input
        const costOutput = (outputTokens / 1_000_000) * 0.60; // Ejemplo: $0.08 por 1M tokens output
        
        console.log(`\nCosto estimado: $${(costInput + costOutput).toFixed(6)}`);
        return assistantResponse
    } catch (error) {
        console.error("Error en la solicitud:", error.message);
    }
}


module.exports = async (client, message) => {
    const tag = `<@${client.user.id}>`
    const resArg = message.content.split(" ").filter(i => i !== tag).join(" ")
    
    if (!message.guild || !message.channel || message.author.bot) return;



    await asegurar_todo(message.guild.id, message.author.id);
    let data = await serverSchema.findOne({guildID: message.guild.id});
    const member = await message.guild.members.fetch(message.author.id);

    let hasPrivilegedRole
    for (i = 0; i < privilegedRoleId.length; i++) {
        if (member.roles.cache.has(privilegedRoleId[i])) {
            hasPrivilegedRole = true
        break
        } else {
            hasPrivilegedRole = false
        }
    }
    //si el bot es mencionado, devolvemos un mensaje de respuesta indicando el prefijo establecido en el servidor
    if(message.content.includes(client.user.id)) return message.reply(config.mensajes[Math.floor(Math.random() * config.mensajes.length)]) 

    if (!message.content.startsWith(data.prefijo)) return;

    const args = message.content.slice(data.prefijo.length).trim().split(" ");
    const cmd = args.shift()?.toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));

    if (command) {
        if (command.owner) {
            if (!config.ownerIDS.includes(message.author.id)) return message.reply(`❌ **Solo los dueños de este bot pueden ejecutar este comando!**\n**Dueños del bot:** ${config.ownerIDS.map(ownerid => `<@${ownerid}>`)}`)
        }
        if(command.premium){
            if(data.premium){
                if(data.premium <= Date.now()) return message.reply("❌ **Tu suscripción premium ha expirado!**")
            } else {
                return message.reply("❌ **Este es un comando premium!**")
            }
        }

        if(command.permisos_bot){
            if(!message.guild.members.me.permissions.has(command.permisos_bot)) return message.reply(`❌ **No tengo suficientes permisos para ejecutar este comando!**\nNecesito los siguientes permisos ${command.permisos_bot.map(permiso => `\`${permiso}\``).join(", ")}`)
        }

        if(command.permisos){
            if(!message.member.permissions.has(command.permisos)) return message.reply(`❌ **No tienes suficientes permisos para ejecutar este comando!**\nNecesitas los siguientes permisos ${command.permisos.map(permiso => `\`${permiso}\``).join(", ")}`)
        }

        command.run(client, message, args, data.prefijo, data.idioma);

    } else {
        return message.reply("❌ No he encontrado el comando que me has especificado!");
    }

}
