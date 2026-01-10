import * as fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const wordPairSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            nativeWord: {
                type: "string",
                description: "The word in the source/native language"
            },
            targetWord: {
                type: "string",
                description: "The word in the target language"
            }
        },
        required: ["nativeWord", "targetWord"]
    }
};

const cleanupFiles = (files) => {
    if (!files) return;
    files.forEach(file => {
        try {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        } catch (err) {
            console.error('Error cleaning up file:', file.path, err);
        }
    });
};

export const importWordsFromImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        const { sourceLanguage, targetLanguage } = req.body;
        if (!sourceLanguage || !targetLanguage) {
            cleanupFiles(req.files);
            return res.status(400).json({ error: 'Source and target languages are required' });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: wordPairSchema,
                temperature: 0.1,
            }
        });

        const imageParts = await Promise.all(req.files.map(async (file) => {
            const imageData = await fs.promises.readFile(file.path);
            return {
                inlineData: {
                    data: imageData.toString('base64'),
                    mimeType: file.mimetype
                }
            };
        }));

        const prompt = `You are analyzing images to extract vocabulary word pairs for language learning.

Task: Extract all word pairs from the images where words appear in ${sourceLanguage} and ${targetLanguage}.

Rules:
1. If BOTH the ${sourceLanguage} word AND its ${targetLanguage} translation are visible in the image, use exactly what you see - do not modify or translate.
2. If only the ${sourceLanguage} word is visible, translate it to ${targetLanguage} for the targetWord.
3. Preserve the exact spelling and characters as shown in the image, especially for Arabic, Hebrew, and other non-Latin scripts.
4. Do not add diacritics or modify words that don't have them in the original image.
5. Extract ALL word pairs visible in the images.

Return the word pairs as a JSON array.`;

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = result.response;
        const text = response.text();

        console.log('Raw AI response:', text);

        try {
            const wordPairs = JSON.parse(text);
            cleanupFiles(req.files);
            res.json(wordPairs);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            cleanupFiles(req.files);
            res.status(500).json({ error: 'Error parsing AI response' });
        }

    } catch (error) {
        console.error('Error processing images:', error);
        cleanupFiles(req.files);
        res.status(500).json({ error: 'Error processing images' });
    }
};