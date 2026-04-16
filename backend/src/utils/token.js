import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const generateAccessToken = (user)=>{
    return jwt.sign(
        {id:user._id},
        config.accessTokenSecret,
        {expiresIn:"15m"}
    )
}

export const generateRefreshToken = (user)=>{
    return jwt.sign(
        {id:user._id},
        config.refreshTokenSecret,
        {expiresIn:"7d"}
    )
}