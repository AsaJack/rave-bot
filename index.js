const { Client, Intents } = require('discord.js');

const { joinVoiceChannel } = require('@discordjs/voice');
const { createAudioPlayer } = require('@discordjs/voice');
const { createAudioResource } = require('@discordjs/voice');

const { token } = require("./config.json");
const { join } = require('node:path');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once("ready", () => {
  console.log("Ready!");
});

client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.channelId === null) {

    console.log('Rave');

    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: newState.channel.id,
      guildId: newState.guild.id,
      adapterCreator: newState.guild.voiceAdapterCreator
    });

    let resource = createAudioResource(join(__dirname, 'rave.mp3'));

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

client.login(token);