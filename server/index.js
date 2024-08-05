import express from 'express';
import 'dotenv/config'
import mongoose from 'mongoose';
import AuthRoute from './routes/AuthRoute.js'
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

app.use("/", AuthRoute);
app.use('/books', booksRoute);

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