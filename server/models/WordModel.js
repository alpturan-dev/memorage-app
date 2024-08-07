import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const WordSchema = new Schema({
    nativeWord: {
        type: String,
        required: true,
        trim: true
    },
    targetWord: {
        type: String,
        required: true,
        trim: true
    },
    wordCollection: {
        type: Schema.Types.ObjectId,
        ref: 'WordCollection',
        required: true
    },
});

export const Word = mongoose.model('Word', WordSchema);