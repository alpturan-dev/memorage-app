// ttsUtils.js
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure to set this environment variable
const API_KEY = process.env.GOOGLE_TTS_API_KEY;

// Cache settings
const CACHE_DIR = path.join(__dirname, '..', 'public', 'audio');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function ensureCacheDirectoryExists() {
    try {
        await fs.access(CACHE_DIR);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.mkdir(CACHE_DIR, { recursive: true });
        } else {
            throw error;
        }
    }
}

export async function getAudioContent(text, languageCode) {
    const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
        {
            input: { text },
            voice: { languageCode, ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        }
    );
    return response.data.audioContent;
}

export function generateFilename(text, languageCode) {
    const hash = crypto.createHash('md5').update(`${text}_${languageCode}`).digest('hex');
    return `${hash}.mp3`;
}

export async function cacheAudio(filename, audioContent) {
    await ensureCacheDirectoryExists();
    const filePath = path.join(CACHE_DIR, filename);
    await fs.writeFile(filePath, Buffer.from(audioContent, 'base64'));
}

export async function getCachedAudio(filename) {
    await ensureCacheDirectoryExists();
    const filePath = path.join(CACHE_DIR, filename);
    try {
        const stats = await fs.stat(filePath);
        if (Date.now() - stats.mtimeMs < CACHE_DURATION) {
            return await fs.readFile(filePath);
        }
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
    return null;
}

export async function cleanupCache() {
    await ensureCacheDirectoryExists();
    const files = await fs.readdir(CACHE_DIR);
    const now = Date.now();
    for (const file of files) {
        const filePath = path.join(CACHE_DIR, file);
        const stats = await fs.stat(filePath);
        if (now - stats.mtimeMs > CACHE_DURATION) {
            await fs.unlink(filePath);
        }
    }
}