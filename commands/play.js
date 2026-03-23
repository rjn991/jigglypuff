const { SlashCommandBuilder } = require('discord.js');
const youtubedl = require('youtube-dl-exec');
const musicPlayer = require('../player');
const getYouTubeOptions = require('../yt-options');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song title or URL')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            let entries = [];
            
            // Extract from URL (can be single video or playlist)
            if (query.startsWith('http')) {
                const output = await youtubedl(query, getYouTubeOptions({
                    flatPlaylist: true,
                    playlistItems: '1:100'
                }));
                
                if (output.entries) {
                    // It's a playlist
                    entries = output.entries.map(entry => ({
                        title: entry.title,
                        url: entry.url || `https://www.youtube.com/watch?v=${entry.id}`
                    }));
                } else {
                    // It's a single video
                    entries = [{
                        title: output.title,
                        url: query
                    }];
                }
            } else {
                // Search for it
                const output = await youtubedl(`ytsearch1:${query}`, getYouTubeOptions({
                    flatPlaylist: true
                }));
                
                if (!output.entries || output.entries.length === 0) {
                    return interaction.editReply('❌ No results found.');
                }
                
                const bestMatch = output.entries[0];
                entries = [{
                    title: bestMatch.title,
                    url: bestMatch.url || `https://www.youtube.com/watch?v=${bestMatch.id}`
                }];
            }

            console.log(`Identified ${entries.length} songs`);

            if (entries.length === 0) {
                return interaction.editReply('❌ No playable tracks found.');
            }

            // Remove any entries without valid URLs
            const validEntries = entries.filter(e => e.url && e.title);
            
            if (validEntries.length === 0) {
                return interaction.editReply('❌ Could not find valid URLs for those songs.');
            }

            await musicPlayer.addSongs(interaction, validEntries);
            
            if (validEntries.length === 1) {
                await interaction.editReply(`🎶 Now attempting to play: **${validEntries[0].title}**`);
            } else {
                await interaction.editReply(`🎶 Added a playlist with **${validEntries.length}** songs!`);
            }
        } catch (error) {
            console.error('Search/Extraction Error:', error);
            await interaction.editReply('❌ There was an error while searching for that song/playlist.');
        }
    },
};
