const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears all upcoming songs from the queue'),
    async execute(interaction) {
        const queue = musicPlayer.getQueue(interaction.guildId);

        if (!queue || queue.songs.length <= 1) {
            return interaction.reply({ content: 'There are no upcoming songs to clear!', ephemeral: true });
        }

        if (interaction.member.voice.channel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: 'You must be in the same voice channel as the bot to clear the queue!', ephemeral: true });
        }

        // Keep only the current song (index 0)
        const currentSong = queue.songs[0];
        queue.songs = [currentSong];

        await interaction.reply('🧹 Cleared all upcoming songs from the queue!');
    },
};
