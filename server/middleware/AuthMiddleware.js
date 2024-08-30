import { User } from "../models/UserModel.js"
import 'dotenv/config'
import jwt from "jsonwebtoken"

export const userVerification = async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.TOKEN_KEY)
            req.user = await User.findById(decoded.id).select("-password")
            next()
        } catch (error) {
            console.log(error)
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired', expired: true });
            }
            res.status(401).json({ message: 'Token is not valid' });
        }
    }
    if (!token) {
        res.status(401)
        res.json({ message: "Not authorized, no token" })
    }
}