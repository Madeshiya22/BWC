import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // check header + format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        //verify token
        const decoded = jwt.verify(token, config.accessTokenSecret);

        // attach user
        req.user = { id: decoded.id };

        next();

    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};