import { Collection } from "../models/CollectionModel.js";

export const createCollection = async (req, res) => {
  try {
    const { name, targetLanguage } = req.body;
    const newCollection = new Collection({
      name,
      targetLanguage,
      user: req.user.id
    });
    const savedCollection = await newCollection.save();
    res.status(201).json(savedCollection);
  } catch (error) {
    res.status(500).json({ message: 'Error creating collection', error: error.message });
  }
};

export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections', error: error.message });
  }
};

export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findOne({ _id: req.params.id, user: req.user.id });
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collection', error: error.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { name, targetLanguage } = req.body;
    const updatedCollection = await Collection.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, targetLanguage },
      { new: true }
    );
    if (!updatedCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: 'Error updating collection', error: error.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const deletedCollection = await Collection.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting collection', error: error.message });
  }
};