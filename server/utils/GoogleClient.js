import 'dotenv/config'
import { OAuth2Client } from "google-auth-library"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleIdToken = async (credential) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        throw new Error('GOOGLE_CLIENT_ID is not configured');
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (error) {
        const invalid = new Error('Invalid Google credential');
        invalid.code = 'INVALID_GOOGLE_TOKEN';
        invalid.cause = error;
        throw invalid;
    }
};
