const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),
    async execute(interaction) {
        const queue = musicPlayer.getQueue(interaction.guildId);

        if (!queue) {
            return interaction.reply({ content: 'There is nothing playing!', ephemeral: true });
        }

        if (interaction.member.voice.channel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: 'You must be in the same voice channel as the bot to skip music!', ephemeral: true });
        }

        queue.player.stop();
        await interaction.reply('⏭️ Skipped the current song!');
    },
};
