const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource} = require('@discordjs/voice');

const { token } = require("./config.json");
const { join } = require('node:path');

// Audio file resource used by Rave Bot
let resource = createAudioResource(join(__dirname, 'rave.mp3'));

// Create bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

// Log in console when the bot goes online
client.once("ready", () => {
  console.log("Ready!");
});

/ Define the event for when a user joins a voice channel
client.on('voiceStateUpdate', async (oldState, newState) => {
  if (newState.channel) {
    // User joined or switched to a new a voice channel
    const voiceChannel = newState.channel;
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    // Load and play the audio file for 5 seconds
    const player = createAudioPlayer();
    connection.subscribe(player);
    player.play(resource);
    await new Promise(resolve => player.on('idle', resolve));
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Disconnect from the voice channel
    connection.destroy();
  }
});

// Log bot into discord with private token
client.login(token);
