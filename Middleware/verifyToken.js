import jwt from "jsonwebtoken";
import User from "../Models/User.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // const token = req.headers["x-auth-token"];

    if (!authHeader) {
        res.status(401).json({ message: 'missing token' });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, async (err, decode) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token, token expired" })
        }
        const user = await User.findOne({ _id: decode.id })
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        req.user = user;
        next()
    })
}