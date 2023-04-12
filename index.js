const { Client, Intents } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { createAudioPlayer } = require('@discordjs/voice');
const { createAudioResource } = require('@discordjs/voice');

const { token } = require("./config.json");
const { join } = require('node:path');

// Audio file resource used by Rave Bot
let resource = createAudioResource(join(__dirname, 'rave.mp3'));

// Create bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

// Log in console when the bot goes online
client.once("ready", () => {
  console.log("Ready!");
});

// Code triggers when a discord member joins a new voice channel
client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.channelId === null) {

    // Log in console that a rave has started
    console.log('Rave');

    // Create an audio player with a connection to the voice channel that was joined by the discord member and then plays
    // the crab rave audio on that channel for 5 seconds.
    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: newState.channel.id,
      guildId: newState.guild.id,
      adapterCreator: newState.guild.voiceAdapterCreator
    });

    player.play(resource);

    const subscription = connection.subscribe(player);

    setTimeout(() => {
      //subscription.unsubscribe();
      try {
        connection.destroy();
      } catch (error) {

      }
    }, 5_000);
  };
});

// Log bot into discord with private token
client.login(token);
