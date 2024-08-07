import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
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

export const Collection = mongoose.model('Collection', CollectionSchema);