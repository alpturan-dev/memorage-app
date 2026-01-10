import express from 'express';
import 'dotenv/config'
import mongoose from 'mongoose';
import cors from 'cors';
import AuthRoute from './routes/AuthRoute.js'
import WordCollectionRoute from './routes/WordCollectionRoute.js'
import WordRoute from './routes/WordRoute.js'
import AIRoute from './routes/AIRoute.js'
import PresetCollectionRoute from './routes/PresetCollectionRoute.js'
import TranslateRoute from './routes/TranslateRoute.js'
import TTSRoute from './routes/TTSRoute.js'
import DashboardRoute from './routes/DashboardRoute.js'

const app = express();

app.use(express.json());

app.use(cors());

app.use('', AuthRoute);
app.use('/api/wordCollections', WordCollectionRoute);
app.use('/api/words', WordRoute);
app.use('/api/ai', AIRoute);
app.use('/api/preset-collections', PresetCollectionRoute);
app.use('/api/translate', TranslateRoute);
app.use('/api/tts', TTSRoute);
app.use('/api/dashboard', DashboardRoute);

mongoose
    .connect(process.env.ATLAS_URI)
    .then(() => {
        console.log('App connected to database');
        app.listen(process.env.PORT, () => {
            console.log(`App is listening to port: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });