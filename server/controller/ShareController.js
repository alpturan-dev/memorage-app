import crypto from 'crypto';
import { WordCollection } from "../models/WordCollectionModel.js";
import { Word } from "../models/WordModel.js";

export const generateShareLink = async (req, res) => {
  try {
    const collection = await WordCollection.findOne({ _id: req.params.id, user: req.user.id });
    if (!collection) {
      return res.status(404).json({ message: 'WordCollection not found' });
    }

    if (!collection.shareToken) {
      collection.shareToken = crypto.randomUUID();
      await collection.save();
    }

    res.json({ shareToken: collection.shareToken });
  } catch (error) {
    res.status(500).json({ message: 'Error generating share link', error: error.message });
  }
};

export const removeShareLink = async (req, res) => {
  try {
    const collection = await WordCollection.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { shareToken: null },
      { new: true }
    );
    if (!collection) {
      return res.status(404).json({ message: 'WordCollection not found' });
    }
    res.json({ message: 'Share link removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing share link', error: error.message });
  }
};

export const getSharedCollection = async (req, res) => {
  try {
    const collection = await WordCollection.findOne({ shareToken: req.params.token });
    if (!collection) {
      return res.status(404).json({ message: 'Shared collection not found' });
    }

    const words = await Word.find({ wordCollection: collection._id });

    res.json({
      collection: {
        name: collection.name,
        nativeLanguage: collection.nativeLanguage,
        targetLanguage: collection.targetLanguage,
      },
      words,
      totalWords: words.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shared collection', error: error.message });
  }
};

export const copySharedCollection = async (req, res) => {
  try {
    const sourceCollection = await WordCollection.findOne({ shareToken: req.params.token });
    if (!sourceCollection) {
      return res.status(404).json({ message: 'Shared collection not found' });
    }

    const newCollection = new WordCollection({
      name: sourceCollection.name,
      nativeLanguage: sourceCollection.nativeLanguage,
      targetLanguage: sourceCollection.targetLanguage,
      user: req.user.id,
    });
    const savedCollection = await newCollection.save();

    const sourceWords = await Word.find({ wordCollection: sourceCollection._id });
    if (sourceWords.length > 0) {
      const wordCopies = sourceWords.map(word => ({
        nativeWord: word.nativeWord,
        targetWord: word.targetWord,
        wordCollection: savedCollection._id,
      }));
      await Word.insertMany(wordCopies);
    }

    res.status(201).json({ collection: savedCollection, wordsCopied: sourceWords.length });
  } catch (error) {
    res.status(500).json({ message: 'Error copying collection', error: error.message });
  }
};
