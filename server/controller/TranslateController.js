import axios from 'axios';

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
