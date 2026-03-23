const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Shows the current music queue (alias for /queue)'),
    async execute(interaction) {
        const queue = musicPlayer.getQueue(interaction.guildId);

        if (!queue || queue.songs.length === 0) {
            return interaction.reply('The queue is currently empty.');
        }

        const displaySongs = queue.songs.slice(0, 25);
        const queueList = displaySongs
            .map((song, index) => `${index + 1}. **${song.title}**`)
            .join('\n');

        let response = `🎶 **Current Queue:**\n${queueList}`;
        
        if (queue.songs.length > 25) {
            response += `\n\n... and **${queue.songs.length - 25}** more songs!`;
        }

        await interaction.reply(response);
    },
};
