import { PresetCollection } from "../models/PresetCollectionModel.js";

export const getPresetCollections = async (req, res) => {
    try {
        const collections = await PresetCollection.find({});
        if (!collections) {
            return res.status(404).json({ message: 'PresetCollections not found or unauthorized' });
        }

        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching words', error: error.message });
    }
};

export const getPresetCollection = async (req, res) => {
    try {
        const { languageCode, level } = req.params;
        const collection = await PresetCollection.findOne({ languageCode, level });
        if (!collection) {
            return res.status(404).json({ message: 'PresetCollection not found or unauthorized' });
        }

        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching words', error: error.message });
    }
};

export const getPresetCollectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const collection = await PresetCollection.findById(id);
        if (!collection) {
            return res.status(404).json({ message: 'PresetCollection not found or unauthorized' });
        }

        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching words', error: error.message });
    }
};