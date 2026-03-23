const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState,
} = require('@discordjs/voice');
const youtubedl = require('youtube-dl-exec');
const https = require('https');

class MusicPlayer {
    constructor() {
        this.queue = new Map(); // Guild ID -> Queue object
    }

    getQueue(guildId) {
        return this.queue.get(guildId);
    }

    createQueue(guildId, textChannel, voiceChannel) {
        console.log(`Creating queue for guild: ${guildId}`);
        const queueConstruct = {
            textChannel,
            voiceChannel,
            connection: null,
            player: createAudioPlayer(),
            songs: [],
            volume: 5,
            playing: true,
        };

        this.queue.set(guildId, queueConstruct);

        queueConstruct.player.on(AudioPlayerStatus.Idle, () => {
            this.playNext(guildId);
        });

        queueConstruct.player.on('error', error => {
            console.error(`Error in audio player: ${error.message}`);
            this.playNext(guildId);
        });

        return queueConstruct;
    }

    async join(guildId, voiceChannel) {
        const queue = this.getQueue(guildId);
        if (!queue) return;

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        queue.connection = connection;
        connection.subscribe(queue.player);

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            } catch (error) {
                connection.destroy();
                this.queue.delete(guildId);
            }
        });
    }

    async playNext(guildId) {
        const queue = this.getQueue(guildId);
        if (!queue) return;

        queue.songs.shift();

        if (queue.songs.length === 0) {
            queue.connection.destroy();
            this.queue.delete(guildId);
            return;
        }

        this.play(guildId, queue.songs[0]);
    }

    async play(guildId, song) {
        console.log(`Player attempting to play song in guild ${guildId}:`, song);
        const queue = this.getQueue(guildId);
        if (!queue) return;

        if (!song || !song.url) {
            console.error('Attempted to play a song with an undefined URL:', song);
            queue.textChannel.send('❌ Invalid song data. Skipping...');
            this.playNext(guildId);
            return;
        }

        try {
            let resource;
            let streamUrl = song.url;

            // Handle YouTube URLs differently with youtube-dl-exec
            if (song.url.includes('youtube.com') || song.url.includes('youtu.be')) {
                console.log(`Using youtube-dl-exec to extract stream: ${song.url}`);
                const output = await youtubedl(song.url, {
                    dumpSingleJson: true,
                    noWarnings: true,
                    noCheckCertificate: true,
                    preferFreeFormats: true,
                    format: 'bestaudio',
                    jsRuntime: 'node'
                });
                streamUrl = output.url;
                console.log('Stream URL extracted successfully');
            }

            if (!streamUrl) {
                throw new Error('Failed to extract a stream URL for this song.');
            }

            // Create resource from URL directly (Discord.js handles the networking)
            if (streamUrl.startsWith('https://')) {
                const https = require('https');
                https.get(streamUrl, (stream) => {
                    if (stream.statusCode < 200 || stream.statusCode >= 300) {
                        console.error('Media stream returned status code:', stream.statusCode);
                        queue.textChannel.send('❌ The media stream was blocked by YouTube. Skipping...');
                        this.playNext(guildId);
                        return;
                    }
                    resource = createAudioResource(stream);
                    queue.player.play(resource);
                }).on('error', (err) => {
                    console.error('HTTPS stream error:', err);
                    this.playNext(guildId);
                });
            } else {
                throw new Error('Unsupported stream URL protocol');
            }

            queue.textChannel.send(`🎶 Now playing: **${song.title}**`);
        } catch (error) {
            console.error('Playback Error:', error);
            queue.textChannel.send(`❌ Could not play the song: ${error.message}`);
            this.playNext(guildId);
        }
    }

    async addSongs(interaction, songs) {
        if (!songs || songs.length === 0) return;
        
        const guildId = interaction.guild.id;
        let queue = this.getQueue(guildId);

        console.log(`Adding ${songs.length} songs to guild ${guildId} queue.`);

        if (!queue) {
            queue = this.createQueue(guildId, interaction.channel, interaction.member.voice.channel);
            queue.songs.push(...songs);
            await this.join(guildId, interaction.member.voice.channel);
            this.play(guildId, queue.songs[0]);
        } else {
            queue.songs.push(...songs);
            await interaction.followUp(`✅ Added **${songs.length}** songs to the queue!`);
        }
    }

    async addSong(interaction, song) {
        await this.addSongs(interaction, [song]);
    }
}

module.exports = new MusicPlayer();
