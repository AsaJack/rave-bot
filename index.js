// Import necessary modules and functions from discord.js and @discordjs/voice packages
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { join } = require('node:path');
const { token } = require("./config.json");

// Define the path to the audio resource file
const RESOURCE_PATH = join(__dirname, 'rave.mp3');

// Create a new Discord client with specified intents
const client = new Client({
  intents: [
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Function to create a voice connection to a Discord channel
const createVoiceConnection = (channelId, guildId, adapterCreator) => {
  return joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator
  });
};

// Function to set up the audio player and play the specified audio resource in the given connection
const setupPlayer = (connection) => {
  // Create an audio resource from the specified file path
  const AUDIO_RESOURCE = createAudioResource(RESOURCE_PATH)
  // Create an audio player
  const player = createAudioPlayer();
  // Play the audio resource in the player
  player.play(AUDIO_RESOURCE);
  // Subscribe the player to the connection
  connection.subscribe(player);
  // Return the player for further control if needed
  return player;
};

// Function to clean up the voice connection after a specified timeout
const cleanupConnection = (connection) => {
  // Set a timeout of 5 seconds for cleanup
  const timeout = setTimeout(() => {
    try {
      // Destroy the voice connection
      connection.destroy();
      // Clear the timeout to prevent it from triggering after cleanup
      clearTimeout(timeout);
      // Log a message indicating successful cleanup
      console.log("Voice connection cleaned up successfully");
    } catch (error) {
      // Handle any errors that occur during cleanup and log the error
      console.error('Error occurred during cleanup:', error);
    }
  }, 5000); // 5000 milliseconds (5 seconds)
};

// Event handler when the bot is ready
client.once("ready", () => {
  // Log a message when the bot is ready
  console.log("Bot is ready!");
});

// Event handler for voice state updates
client.on('voiceStateUpdate', (oldState, newState) => {
  // Check if the updated voice state is related to the bot user
  if (newState.member.user.id === client.user.id) {
    // If it's the bot's own voice state update, do nothing
    return;
  }

  // Store the previous and current voice states for convenience
  const previousVoiceState = oldState;
  const currentVoiceState = newState;

  // Check if the bot has just joined a voice channel (previous channel ID is null)
  if (previousVoiceState.channelId === null) {
    // Log a message indicating that the bot has joined a voice channel
    console.log('Bot has joined a voice channel');
    try {
      // Create a voice connection to the current channel
      const connection = createVoiceConnection(
        currentVoiceState.channel.id,
        currentVoiceState.guild.id,
        currentVoiceState.guild.voiceAdapterCreator
      );

      // Set up the player and play the audio resource in the connection
      const player = setupPlayer(connection);
      
      // Clean up the voice connection after playback (5 seconds in this case)
      cleanupConnection(connection);
    } catch (error) {
      // Handle any errors that occur during voice connection setup and log the error
      console.error('Error occurred during voice connection setup:', error);
    }
  }
});

// Log in to Discord using the provided bot token from the configuration file
client.login(token);
