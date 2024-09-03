import { User } from "../models/UserModel.js";
import { createSecretToken } from "../utils/SecretToken.js";
import bcrypt from "bcrypt"

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Incorrect password or email' })
        }
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.status(400).json({ message: 'Incorrect password or email' })
        }
        const token = createSecretToken(user._id);
        return res.status(201).json({ message: "User logged in successfully", success: true, user, token });
    } catch (error) {
        console.error(error);
    }
}

export const Signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "This email already used." });
        }
        const user = await User.create({ email, password, username });
        const token = createSecretToken(user._id);
        res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user, token });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Bad Request" + error })
    }
};

export const UpdateUserCredentials = async (req, res) => {
    try {
        const { username, email } = req.body;
        if (!username && !email) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const user = await User.findOneAndUpdate({ _id: req.params.id }, { username, email }, { new: true })
        if (!user) {
            return res.status(400).json({ message: 'Something happened updating user credentials' })
        }
        return res.status(200).json({ message: "User updated successfully", success: true, user });
    } catch (error) {
        console.error(error);
    }
}