import { Word } from "../models/WordModel.js";
import { WordCollection } from "../models/WordCollectionModel.js";

export const createWord = async (req, res) => {
    try {
        const { nativeWord, targetWord, wordCollectionId } = req.body;

        const collection = await WordCollection.findOne({ _id: wordCollectionId, user: req.user.id });
        if (!collection) {
            return res.status(404).json({ message: 'WordCollection not found or unauthorized' });
        }

        const existsWords = await Word.find({ nativeWord });

        if (existsWords.length > 0) {
            return res.status(400).json({ message: 'Word already exists.' });
        }

        const newWord = new Word({
            nativeWord,
            targetWord,
            wordCollection: wordCollectionId,
        });

        const savedWord = await newWord.save();
        res.status(201).json(savedWord);
    } catch (error) {
        res.status(500).json({ message: 'Error creating word', error: error.message });
    }
};

export const getWordsByWordCollection = async (req, res) => {
    try {
        const { wordCollectionId } = req.params;
        const { limit = 20, offset = 0 } = req.query;

        const collection = await WordCollection.findOne({ _id: wordCollectionId, user: req.user.id });
        if (!collection) {
            return res.status(404).json({ message: 'WordCollection not found or unauthorized' });
        }

        const totalCount = await Word.countDocuments({ wordCollection: wordCollectionId });

        const words = await Word.find({ wordCollection: wordCollectionId })
            .sort({ _id: -1 })
            .skip(parseInt(offset))
            .limit(parseInt(limit));

        const hasMore = parseInt(offset) + words.length < totalCount;

        res.json({
            words,
            pagination: {
                totalCount,
                offset: parseInt(offset),
                limit: parseInt(limit),
                hasMore
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching words', error: error.message });
    }
};

export const updateWord = async (req, res) => {
    try {
        const { id } = req.params;
        const { nativeWord, targetWord } = req.body;
        const word = await Word.findById(id);
        if (!word) {
            return res.status(404).json({ message: 'Word not found' });
        }

        const collection = await WordCollection.findOne({ _id: word.wordCollection, user: req.user.id });
        if (!collection) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        word.nativeWord = nativeWord;
        word.targetWord = targetWord;

        const updatedWord = await word.save();
        res.status(200).json(updatedWord);
    } catch (error) {
        res.status(500).json({ message: 'Error updating word', error: error.message });
    }
};

export const deleteWord = async (req, res) => {
    try {
        const { id } = req.params;

        const word = await Word.findById(id);
        if (!word) {
            return res.status(404).json({ message: 'Word not found' });
        }

        const collection = await WordCollection.findOne({ _id: word.wordCollection, user: req.user.id });
        if (!collection) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Word.findByIdAndDelete(id);
        res.json({ message: 'Word deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting word', error: error.message });
    }
};