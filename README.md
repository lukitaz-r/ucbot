# 🤖 UCBot - Discord Bot Multifuncional

Bot de Discord desarrollado con Discord.js v14 que incluye sistema de moderación, música, tickets, sugerencias, sorteos y más.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Comandos Disponibles](#-comandos-disponibles)
- [Solución de Problemas](#-solución-de-problemas)
- [Licencia](#-licencia)

## ✨ Características

### 🛡️ Moderación
- Sistema de warns (advertencias) con persistencia en base de datos
- Ban y kick de usuarios
- Mute/Unmute temporal
- Automod: Detección y eliminación automática de enlaces no permitidos
- Leaderboard de usuarios con más warns

### 🎵 Música
- Reproducción de música desde YouTube, Spotify y SoundCloud
- Integración con DisTube para gestión de colas
- Soporte para playlists

### 🎫 Sistema de Tickets
- Creación y gestión de tickets de soporte
- Transcripciones HTML de conversaciones
- Sistema de roles y permisos

### 💡 Sistema de Sugerencias
- Canal dedicado para sugerencias
- Sistema de votación con reacciones
- Gestión de sugerencias aprobadas/rechazadas

### 🎁 Sorteos
- Creación y gestión de sorteos (giveaways)
- Selección automática de ganadores
- Integración con discord-giveaways

### ⚙️ Configuración Personalizable
- Prefijo personalizado por servidor
- Sistema de roles de reacción
- Canales whitelistados para automod
- Roles privilegiados exentos de sanciones

## 📦 Requisitos Previos

Antes de instalar el bot, asegúrate de tener:

- **Node.js** v16.9.0 o superior ([Descargar](https://nodejs.org/))
- **MongoDB** instalado y en ejecución ([Descargar](https://www.mongodb.com/try/download/community))
  - Alternativamente, puedes usar [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis)
- **FFmpeg** instalado en tu sistema (requerido para reproducción de música)
  - Windows: Descarga desde [ffmpeg.org](https://ffmpeg.org/download.html) o usa el paquete `ffmpeg-static` (ya incluido)
  - Linux: `sudo apt install ffmpeg`
  - macOS: `brew install ffmpeg`
- **Git** (opcional, para clonar el repositorio)

## 🚀 Instalación

### 1. Clonar o Descargar el Repositorio

```bash
git clone https://github.com/lukitaz-r/ucbot.git
cd ucbot
```

O descarga el ZIP desde GitHub y extráelo.

### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`:
- `discord.js` v14.10.2
- `mongoose` v8.13.0
- `distube` v4.0.4
- `discord-giveaways` v6.0.1
- `discord-html-transcripts` v3.1.4
- Y más...

## ⚙️ Configuración

### 1. Crear una Aplicación de Discord

1. Ve al [Portal de Desarrolladores de Discord](https://discord.com/developers/applications)
2. Haz clic en "New Application" y dale un nombre
3. Ve a la sección "Bot" y haz clic en "Add Bot"
4. **Importante**: Activa los siguientes **Privileged Gateway Intents**:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
5. Copia el **Token** del bot (lo necesitarás en el siguiente paso)

### 2. Configurar el Archivo `config.json`

El archivo `config/config.json` contiene toda la configuración del bot. **Este archivo NO está incluido en el repositorio por seguridad** (está en `.gitignore`).

Crea el archivo `config/config.json` con el siguiente contenido:

```json
{
    "token": "TU_TOKEN_DEL_BOT_AQUI",
    "prefix": "uc!",
    "mongodb": "mongodb://localhost:27017/ucbot",
    "ownerIDS": [
        "TU_DISCORD_USER_ID_AQUI"
    ],
    "color": "#ffc600",
    "mensajes": [
        "Hola men",
        "Hola! Como estamos?",
        "Buenas",
        "Que me mencionas w",
        "Que quieres w",
        "Que onda w",
        "Por que me mencionas w",
        "Que pasa",
        "Holaaa :3",
        "Hello world",
        "Que tranza",
        "Si quieres usar mis comandos pon `uc!` de prefijo bro",
        "`uc!` pa usar mis comandos"
    ],
    "allowedLinks": [
        "youtube",
        "youtu.be",
        "media.discordapp.net",
        "discord.com",
        "twitch.tv",
        "github.com",
        "spotify.com",
        "steamcommunity.com",
        "reddit.com",
        "canva.com",
        "notion.so",
        "drive.google.com",
        "docs.google.com",
        "music.youtube.com",
        "tenor.com",
        "giphy.com",
        "cdn.discordapp.com"
    ],
    "whitelistedChannels": [],
    "privilegedRoleId": [],
}
```

#### Explicación de los Campos:

| Campo | Descripción | Requerido |
|-------|-------------|-----------|
| `token` | Token del bot de Discord | ✅ Sí |
| `prefix` | Prefijo por defecto para comandos | ✅ Sí |
| `mongodb` | URI de conexión a MongoDB | ✅ Sí |
| `ownerIDS` | Array de IDs de Discord de los dueños del bot | ✅ Sí |
| `color` | Color hexadecimal para embeds | ❌ No |
| `mensajes` | Mensajes aleatorios cuando mencionan al bot | ❌ No |
| `allowedLinks` | Dominios permitidos en el automod | ❌ No |
| `whitelistedChannels` | IDs de canales exentos del automod | ❌ No |
| `privilegedRoleId` | IDs de roles exentos de sanciones | ❌ No |
| `apiIa` | API Key de OpenAI (funcionalidad experimental) | ❌ No |

### 3. Configurar MongoDB

#### Opción A: MongoDB Local

1. Instala MongoDB Community Edition
2. Inicia el servicio de MongoDB:
   ```bash
   # Windows (como servicio)
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   
   # macOS
   brew services start mongodb-community
   ```
3. La URI por defecto es: `mongodb://localhost:27017/ucbot`

#### Opción B: MongoDB Atlas (Nube - Recomendado)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Configura un usuario de base de datos
4. Whitelist tu IP (o usa `0.0.0.0/0` para permitir todas)
5. Obtén la URI de conexión (ejemplo: `mongodb+srv://usuario:contraseña@cluster.mongodb.net/ucbot`)
6. Reemplaza el campo `mongodb` en `config.json` con tu URI

### 4. Obtener tu Discord User ID

1. Activa el Modo Desarrollador en Discord:
   - Configuración de Usuario → Avanzado → Modo Desarrollador
2. Haz clic derecho en tu perfil y selecciona "Copiar ID"
3. Pega este ID en el array `ownerIDS` del `config.json`

### 5. Invitar el Bot a tu Servidor

1. Ve al [Portal de Desarrolladores](https://discord.com/developers/applications)
2. Selecciona tu aplicación
3. Ve a "OAuth2" → "URL Generator"
4. Selecciona los siguientes **scopes**:
   - `bot`
   - `applications.commands`
5. Selecciona los siguientes **permisos** (Bot Permissions):
   - Administrator (o permisos específicos según necesites)
6. Copia la URL generada y ábrela en tu navegador
7. Selecciona el servidor donde quieres añadir el bot

## 🎯 Despliegue

### Desarrollo Local

Para ejecutar el bot en modo desarrollo:

```bash
npm test
```

O directamente:

```bash
node index.js
```

Si todo está configurado correctamente, verás:

```
╔═════════════════════════════════════════════════════╗
║                                                     ║
║        Bienvenido al Handler  por  lukitaz_r        ║
║                                                     ║
╚═════════════════════════════════════════════════════╝
18 Comandos Cargados
Cargando los eventos...
2 Eventos Cargados
Iniciando Sesión el Bot...
```

### Producción (Servidor 24/7)

Para mantener el bot en ejecución continua, usa un process manager como **PM2**:

#### Instalar PM2

```bash
npm install -g pm2
```

#### Iniciar el Bot con PM2

```bash
pm2 start index.js --name ucbot
```

#### Comandos Útiles de PM2

```bash
# Ver estado del bot
pm2 status

# Ver logs en tiempo real
pm2 logs ucbot

# Reiniciar el bot
pm2 restart ucbot

# Detener el bot
pm2 stop ucbot

# Eliminar el bot de PM2
pm2 delete ucbot

# Guardar la configuración actual
pm2 save

# Configurar PM2 para iniciar al arrancar el sistema
pm2 startup
```

### Despliegue en la Nube

#### Opción 1: Railway

1. Crea una cuenta en [Railway](https://railway.app/)
2. Conecta tu repositorio de GitHub
3. Añade las variables de entorno desde `config.json`
4. Railway detectará automáticamente Node.js y desplegará

#### Opción 2: Heroku

1. Crea un `Procfile` en la raíz del proyecto:
   ```
   worker: node index.js
   ```
2. Sube tu código a Heroku
3. Configura las variables de entorno
4. Escala el worker: `heroku ps:scale worker=1`

#### Opción 3: VPS (DigitalOcean, Linode, AWS EC2)

1. Conecta por SSH a tu VPS
2. Instala Node.js y MongoDB
3. Clona el repositorio
4. Configura `config.json`
5. Usa PM2 para mantener el bot en ejecución

## 📁 Estructura del Proyecto

```
ucbot/
├── comandos/                    # Comandos del bot organizados por categoría
│   ├── ⚒ Moderación/           # Comandos de moderación
│   │   ├── ban.js
│   │   ├── kick.js
│   │   ├── warn.js
│   │   ├── unwarn.js
│   │   ├── mute.js
│   │   ├── unmute.js
│   │   ├── warnings.js
│   │   ├── leaderboard-warns.js
│   │   ├── leaderboard-warners.js
│   │   └── sorteos.js
│   ├── ⚙ Ajustes/              # Comandos de configuración
│   │   └── prefix.js
│   ├── ⚜ Torneo/               # Comandos relacionados con torneos
│   │   ├── datos.js
│   │   └── login.js
│   ├── ✅ Setup/                # Comandos de configuración inicial
│   │   ├── setup-reactionrole.js
│   │   ├── setup-suggestions.js
│   │   └── setup-ticket.js
│   └── ❓ Info/                 # Comandos informativos
│       ├── help.js
│       └── ping.js
├── config/                      # Archivos de configuración
│   └── config.json             # ⚠️ NO INCLUIDO - Debes crearlo
├── eventos/                     # Event handlers
│   ├── client/                 # Eventos del cliente
│   │   └── ready.js
│   └── guild/                  # Eventos del servidor
│       └── messageCreate.js
├── handlers/                    # Manejadores del bot
│   ├── automod.js              # Sistema de automoderación
│   ├── command.js              # Cargador de comandos
│   ├── events.js               # Cargador de eventos
│   ├── reaccion_roles.js       # Sistema de roles por reacción
│   ├── sorteos.js              # Sistema de sorteos
│   ├── sugerencias.js          # Sistema de sugerencias
│   └── tickets.js              # Sistema de tickets
├── modelos/                     # Esquemas de MongoDB
│   ├── servidor.js             # Configuración por servidor
│   ├── setups.js               # Setups de sistemas
│   ├── sorteos.js              # Datos de sorteos
│   ├── tickets.js              # Datos de tickets
│   ├── votos-sugs.js           # Votos de sugerencias
│   └── warns.js                # Sistema de advertencias
├── utils/                       # Utilidades
│   └── funciones.js            # Funciones auxiliares
├── .gitignore                   # Archivos ignorados por Git
├── index.js                     # Punto de entrada principal
├── LICENSE                      # Licencia GPL-3.0
├── package.json                 # Dependencias y scripts
└── README.md                    # Este archivo

Archivos NO incluidos en el repositorio (.gitignore):
├── node_modules/                # Dependencias (se instalan con npm install)
├── package-lock.json            # Lock file de npm
├── cleanupWarns.js              # Script de limpieza
└── dbm.json                     # Base de datos local (generada automáticamente)
```

## 🎮 Comandos Disponibles

### Moderación (⚒)
- `uc!ban <usuario> [razón]` - Banea a un usuario del servidor
- `uc!kick <usuario> [razón]` - Expulsa a un usuario del servidor
- `uc!warn <usuario> <razón>` - Advierte a un usuario
- `uc!unwarn <usuario> <ID_warn>` - Elimina una advertencia
- `uc!warnings <usuario>` - Muestra las advertencias de un usuario
- `uc!mute <usuario> <tiempo> [razón]` - Mutea a un usuario temporalmente
- `uc!unmute <usuario>` - Desmutea a un usuario
- `uc!leaderboard-warns` - Top usuarios con más warns
- `uc!leaderboard-warners` - Top moderadores que más warns han dado
- `uc!sorteos` - Gestiona sorteos

### Configuración (⚙)
- `uc!prefix <nuevo_prefijo>` - Cambia el prefijo del bot en el servidor

### Setup (✅)
- `uc!setup-reactionrole` - Configura el sistema de roles por reacción
- `uc!setup-suggestions` - Configura el sistema de sugerencias
- `uc!setup-ticket` - Configura el sistema de tickets

### Información (❓)
- `uc!help` - Muestra todos los comandos disponibles
- `uc!ping` - Muestra la latencia del bot

### Torneo (⚜)
- `uc!datos` - Muestra datos del torneo
- `uc!login` - Sistema de login para torneos

## 🔧 Solución de Problemas

### El bot no se conecta

**Error**: `NO HAS ESPECIFICADO UN TOKEN VALIDO O TE FALTAN INTENTOS`

**Solución**:
1. Verifica que el token en `config.json` sea correcto
2. Asegúrate de haber activado los **Privileged Gateway Intents** en el portal de Discord:
   - Ve a https://discord.com/developers/applications
   - Selecciona tu aplicación → Bot
   - Activa: Server Members Intent, Presence Intent, Message Content Intent

### Error de conexión a MongoDB

**Error**: `MongoNetworkError` o `connection refused`

**Solución**:
1. Verifica que MongoDB esté en ejecución:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl status mongod
   ```
2. Verifica que la URI en `config.json` sea correcta
3. Si usas MongoDB Atlas, verifica que tu IP esté whitelistada

### Los comandos no funcionan

**Problema**: El bot está online pero no responde a comandos

**Solución**:
1. Verifica que el **Message Content Intent** esté activado
2. Comprueba que el prefijo sea correcto (por defecto `uc!`)
3. Asegúrate de que el bot tenga permisos de lectura/escritura en el canal

### Error con FFmpeg (música)

**Error**: `FFmpeg not found` o errores al reproducir música

**Solución**:
1. El paquete `ffmpeg-static` ya está incluido en las dependencias
2. Si persiste el error, instala FFmpeg manualmente en tu sistema
3. Verifica que FFmpeg esté en el PATH del sistema

### El automod no funciona

**Problema**: Los enlaces no se eliminan automáticamente

**Solución**:
1. Verifica que el bot tenga permisos de `MANAGE_MESSAGES`
2. Revisa la configuración de `allowedLinks` en `config.json`
3. Comprueba que el canal no esté en `whitelistedChannels`

### Errores al instalar dependencias

**Error**: `npm install` falla

**Solución**:
1. Asegúrate de tener Node.js v16.9.0 o superior:
   ```bash
   node --version
   ```
2. Limpia la caché de npm:
   ```bash
   npm cache clean --force
   ```
3. Elimina `node_modules` y vuelve a instalar:
   ```bash
   rm -rf node_modules
   npm install
   ```

### El bot se desconecta constantemente

**Solución**:
1. Usa PM2 para mantener el bot en ejecución:
   ```bash
   pm2 start index.js --name ucbot
   ```
2. Verifica los logs para identificar errores:
   ```bash
   pm2 logs ucbot
   ```

## 📝 Notas Importantes

- **Seguridad**: Nunca compartas tu `config.json` o token del bot públicamente
- **Backups**: Haz backups regulares de tu base de datos MongoDB
- **Actualizaciones**: Mantén las dependencias actualizadas con `npm update`
- **Permisos**: Asegúrate de que el bot tenga los permisos necesarios en tu servidor
- **Rate Limits**: Discord tiene límites de tasa. No abuses de las APIs

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia GNU General Public License v3.0. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**lukitaz_r (Luca Ramirez)**

- GitHub: [@lukitaz-r](https://github.com/lukitaz-r)
- Repositorio: [ucbot](https://github.com/lukitaz-r/ucbot)

## 🙏 Agradecimientos

- [Discord.js](https://discord.js.org/) - Librería principal
- [Mongoose](https://mongoosejs.com/) - ODM para MongoDB
- Comunidad de Discord.js por el soporte

---

**¿Necesitas ayuda?** Abre un [issue](https://github.com/lukitaz-r/ucbot/issues) en GitHub.
