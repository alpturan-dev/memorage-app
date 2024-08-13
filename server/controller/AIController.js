import * as fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const importWordsFromImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        const { sourceLanguage, targetLanguage } = req.body;
        if (!sourceLanguage || !targetLanguage) {
            return res.status(400).json({ error: 'Source and target languages are required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imageParts = await Promise.all(req.files.map(async (file) => {
            const imageData = await fs.promises.readFile(file.path);
            return {
                inlineData: {
                    data: imageData.toString('base64'),
                    mimeType: file.mimetype
                }
            };
        }));

        const prompt = "Analyze the given images to identify word pairs consisting of a word in [SOURCE_LANGUAGE] and its translation in [TARGET_LANGUAGE]. Return the results as a valid JSON array. Each object in the array should contain the following properties: nativeWord, targetWord. If no word pairs are found, return an empty array.";

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        console.log('Raw AI response:', text);  // Log the raw response

        // Try to extract JSON from the response
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
            try {
                const objects = JSON.parse(jsonMatch[0]);
                res.json(objects);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                res.status(500).json({ error: 'Error parsing AI response' });
            }
        } else {
            console.error('No valid JSON found in the response');
            res.status(500).json({ error: 'Invalid AI response format' });
        }

        // Clean up uploaded files
        req.files.forEach(file => fs.unlinkSync(file.path));

    } catch (error) {
        console.error('Error processing images:', error);
        res.status(500).json({ error: 'Error processing images' });
    }
};