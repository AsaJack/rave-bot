// Import necessary modules and libraries
const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource} = require('@discordjs/voice');
const { join } = require('node:path');
const { token } = require("./config.json");

// Define the audio file resource used by Rave Bot
let resource = createAudioResource(join(__dirname, 'rave.mp3'));

// Create Discord bot client with required intents
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

// Log a message when the bot is ready
client.once("ready", () => {
  console.log("Ready!");
});

// Define the event for when a user joins or leaves a voice channel
client.on('voiceStateUpdate', async (oldState, newState) => {
  // If a user joins a voice channel
  if (newState.channel) {
    // Get the voice channel the user has joined
    const voiceChannel = newState.channel;

    // Connect to the voice channel
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    // Create an audio player and subscribe to the voice connection
    const player = createAudioPlayer();
    connection.subscribe(player);

    // Play the audio file resource for 5 seconds
    player.play(resource);
    await new Promise(resolve => player.on('idle', resolve));
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Disconnect from the voice channel
    connection.destroy();
  }
});

// Log the bot in with the provided token
client.login(token);
