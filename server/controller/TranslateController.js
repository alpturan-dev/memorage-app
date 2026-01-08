import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST endpoint to translate text
export const translateWord = async (req, res) => {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
        return res.status(400).json({ error: 'Text and target language are required' });
    }

    try {
        const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
        const url = `https://translation.googleapis.com/language/translate/v2`;

        const response = await axios.post(url, null, {
            params: {
                q: text,
                target: targetLang,
                key: apiKey,
            },
        });
        const translatedText = response.data.data.translations[0].translatedText;
        res.json({ translatedText });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Translation failed' });
    }
};

// POST endpoint to get multiple translation suggestions using Gemini AI
export const getTranslationSuggestions = async (req, res) => {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !targetLang) {
        return res.status(400).json({ error: 'Text and target language are required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `Translate the word "${text}" from ${sourceLang || 'English'} to ${targetLang}.
Provide multiple translation options including:
- Primary/most common translation
- Synonyms or alternative translations
- Related words with similar meaning

Return ONLY a JSON array of strings with 3-6 translation suggestions, ordered by relevance.
Example: ["ev", "konut", "mesken", "yuva"]
Do not include explanations, just the JSON array.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Parse JSON array from response
        const jsonMatch = responseText.match(/\[.*\]/s);
        if (jsonMatch) {
            const suggestions = JSON.parse(jsonMatch[0]);
            res.json({ suggestions });
        } else {
            res.status(500).json({ error: 'Invalid AI response format' });
        }
    } catch (error) {
        console.error('Error getting translation suggestions:', error);
        res.status(500).json({ error: 'Translation suggestions failed' });
    }
};
