import userModel from "../models/users.model.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

// ================= REGISTER =================
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const exist = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (exist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        const { password: _, refreshToken: __, ...safeUser } = user._doc;

        res.status(201).json({
            message: "User created successfully",
            user: safeUser,
            accessToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================= LOGIN =================
export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await userModel.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        const { password: _, refreshToken: __, ...safeUser } = user._doc;

        res.status(200).json({
            message: "User logged in successfully",
            user: safeUser,
            accessToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================= GET ME =================
export const getMe = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.user.id)
            .select("-password -refreshToken");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ================= REFRESH =================
export const refreshTokenHandler = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) return res.sendStatus(401);

        const user = await userModel.findOne({ refreshToken: token });
        if (!user) return res.sendStatus(403);

        // verify token
        jwt.verify(token, config.refreshTokenSecret);

        // generate new tokens
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // update DB
        user.refreshToken = newRefreshToken;
        await user.save();

        // set new cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        res.json({ accessToken: newAccessToken });

    } catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (token) {
            const user = await userModel.findOne({ refreshToken: token });
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        res.clearCookie("refreshToken");

        res.json({ message: "Logged out successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};