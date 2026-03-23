const fs = require('fs');
const path = require('path');

function getYouTubeOptions(additionalOptions = {}) {
    const cookiesPath = path.join(__dirname, 'cookies.txt');
    const options = {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        format: 'bestaudio',
        jsRuntime: 'node'
    };

    // Use cookies if the file exists (best way to bypass cloud blocks)
    if (fs.existsSync(cookiesPath)) {
        console.log('[INFO] Using cookies.txt for YouTube extraction');
        options.cookies = cookiesPath;
    } else {
        // Fallback for cloud machines without cookies (using android client often bypasses bot checks)
        console.log('[INFO] No cookies.txt found. Using Android client fallback.');
        options.extractorArgs = 'youtube:player_client=android,web_creator';
    }

    return { ...options, ...additionalOptions };
}

module.exports = getYouTubeOptions;
