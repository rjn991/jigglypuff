# 🍮 Jigglypuff - The Ultimate Music Bot

A high-performance, lightweight, and reliable Discord Music Bot built with `discord.js` and `yt-dlp`. 

> [!TIP]
> **Sike!** This isn't just a basic bot. It's built for speed and stability, bypassing YouTube's latest security restrictions with ease using `yt-dlp`.

---

## 🔥 Features

- ⚡ **Lightning Fast Extraction**: Uses `yt-dlp` via `youtube-dl-exec` for reliable streaming.
- 🎶 **Playlist & Mix Support**: Paste a single song link or a massive YouTube Mix/Playlist.
- 🔍 **Universal Search**: Find any song just by its name.
- 🧹 **Queue Management**: Efficiently clear, skip, or view your upcoming tracks.
- 🔒 **Secure**: No private tokens ever committed, thanks to `.env` integration.

### 📋 Prerequisites

Before installing the bot, make sure you have **FFmpeg** installed on your system. This is required for audio transcoding and streaming.

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install ffmpeg

# Fedora / RedHat
sudo dnf install ffmpeg

# MacOS
brew install ffmpeg
```

---

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rjn991/jigglypuff.git
   cd jigglypuff
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup your environment variables:
   Create a `.env` file based on the `.env.example` template:
   ```bash
   cp .env.example .env
   # Open .env and add your Discord Token, Client ID, and Guild ID
   ```

4. Deploy slash commands:
   ```bash
   node deploy-commands.js
   ```

5. Run the bot:
   ```bash
   node index.js
   ```

---

## 🎮 Commands

| Command | Description |
| --- | --- |
| `/play` | Play a song by name or URL (Supports Playlists!) |
| `/skip` | Skips to the next track in the queue |
| `/stop` | Stops the music and makes the bot leave the channel |
| `/clear` | Empties all upcoming songs in the queue |
| `/list` | Shows the current Top 25 songs in the queue |
| `/queue` | Alias for `/list` |

---

## 🛠️ Built With

- [**Discord.js v14**](https://discord.js.org/)
- [**yt-dlp**](https://github.com/yt-dlp/yt-dlp)
- [**@discordjs/voice**](https://github.com/discordjs/voice)
- [**FFmpeg**](https://ffmpeg.org/) (High-performance audio transcoding)

---

### 🎵 Enjoy the high-fidelity music experience!  Pudding! 🍮
---
