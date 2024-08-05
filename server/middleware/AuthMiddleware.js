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
            res.status(401)
        }
    }
    if (!token) {
        res.status(401)
        res.json({ message: "Not authorized, no token" })
    }
}