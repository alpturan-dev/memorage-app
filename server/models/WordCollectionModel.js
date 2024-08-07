import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const WordCollectionSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetLanguage: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

export const WordCollection = mongoose.model('WordCollection', WordCollectionSchema);