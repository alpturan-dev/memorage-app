import express from 'express';
import 'dotenv/config'
import mongoose from 'mongoose';
import cors from 'cors';
import AuthRoute from './routes/AuthRoute.js'
import CollectionRoute from './routes/CollectionRoute.js'

const app = express();

app.use(express.json());

app.use(cors());

app.use("/", AuthRoute);
app.use('/api/collections', CollectionRoute);

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