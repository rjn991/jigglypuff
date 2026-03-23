const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music and clears the queue'),
    async execute(interaction) {
        const queue = musicPlayer.getQueue(interaction.guildId);

        if (!queue) {
            return interaction.reply({ content: 'There is nothing playing!', ephemeral: true });
        }

        if (interaction.member.voice.channel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: 'You must be in the same voice channel as the bot to stop music!', ephemeral: true });
        }

        queue.songs = [];
        queue.player.stop();
        queue.connection.destroy();
        musicPlayer.queue.delete(interaction.guildId);

        await interaction.reply('🛑 Stopped the music and cleared the queue!');
    },
};
