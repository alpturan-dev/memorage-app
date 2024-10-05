import 'dotenv/config'
import jwt from "jsonwebtoken"

export const createSecretToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: '14 days',
    });
};