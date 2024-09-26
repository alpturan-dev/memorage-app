import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const PresetCollectionSchema = new Schema({
    languageCode: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true
    },
    words: {
        type: Array,
        required: true
    }
},
);

export const PresetCollection = mongoose.model('PresetCollection', PresetCollectionSchema);