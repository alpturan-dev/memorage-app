// ttsController.js
import {
    getAudioContent,
    generateFilename,
    cacheAudio,
    getCachedAudio,
    cleanupCache
} from '../utils/TTSUtils.js';

export const synthesizeSpeech = async (req, res) => {
    try {
        const { text, languageCode = 'en-US' } = req.body;
        const filename = generateFilename(text, languageCode);

        let audioContent = await getCachedAudio(filename);

        if (!audioContent) {
            audioContent = await getAudioContent(text, languageCode);
            await cacheAudio(filename, audioContent);
        }

        res.contentType('audio/mpeg');
        res.send(Buffer.from(audioContent, 'base64'));
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred during speech synthesis' });
    }
};

// Run cache cleanup every hour
setInterval(cleanupCache, 60 * 60 * 1000);