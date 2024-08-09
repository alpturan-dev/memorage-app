import { WordCollection } from "../models/WordCollectionModel.js";

export const createWordCollection = async (req, res) => {
  try {
    const { name, nativeLanguage, targetLanguage } = req.body;
    const newWordCollection = new WordCollection({
      name,
      nativeLanguage,
      targetLanguage,
      user: req.user.id
    });
    const savedWordCollection = await newWordCollection.save();
    res.status(201).json(savedWordCollection);
  } catch (error) {
    res.status(500).json({ message: 'Error creating collection', error: error.message });
  }
};

export const getAllWordCollections = async (req, res) => {
  try {
    const collections = await WordCollection.find({ user: req.user.id });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections', error: error.message });
  }
};

export const getWordCollectionById = async (req, res) => {
  try {
    const collection = await WordCollection.findOne({ _id: req.params.id, user: req.user.id });
    if (!collection) {
      return res.status(404).json({ message: 'WordCollection not found' });
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collection', error: error.message });
  }
};

export const updateWordCollection = async (req, res) => {
  try {
    const { name, nativeLanguage, targetLanguage } = req.body;
    const updatedWordCollection = await WordCollection.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, nativeLanguage, targetLanguage },
      { new: true }
    );
    if (!updatedWordCollection) {
      return res.status(404).json({ message: 'WordCollection not found' });
    }
    res.json(updatedWordCollection);
  } catch (error) {
    res.status(500).json({ message: 'Error updating collection', error: error.message });
  }
};

export const deleteWordCollection = async (req, res) => {
  try {
    const deletedWordCollection = await WordCollection.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedWordCollection) {
      return res.status(404).json({ message: 'WordCollection not found' });
    }
    res.json({ message: 'WordCollection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting collection', error: error.message });
  }
};