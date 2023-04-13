# rave-bot
Rave Bot is a Node.js program that uses the Discord.js library to create a Discord bot that plays an audio file when a user joins a voice channel on a Discord server.

The program first imports the necessary modules, including the Discord.js library and the @discordjs/voice library for voice communication. It then defines the audio file to be played and creates a new Discord client object.

The program then listens for the 'voiceStateUpdate' event, which is triggered when a user joins or leaves a voice channel. If the event is triggered by a user joining or switching to a new a voice channel, the program retrieves the voice channel object and creates a new connection to that channel. It then loads and plays the audio file for 5 seconds, using the createAudioPlayer() and createAudioResource() functions from the @discordjs/voice library.

Once the audio has finished playing, the program disconnects from the voice channel using the connection.destroy() method. Finally, the program logs into the Discord server using the Discord bot token provided.
