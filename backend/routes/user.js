import express from 'express'
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session.js';
const router = express.Router();

const saltRounds = 10;
const registerFeilds = ["name", "email", "password", "age"]
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, age, anonymousName } = req.body;
        let requiredFeilds = [];
        for (let i = 0; i < registerFeilds.length; i++) {
            if (!req.body[registerFeilds[i]]) {
                requiredFeilds.push(registerFeilds[i]);
            }
        }
        if (requiredFeilds.length > 0) {
            return res.status(400).json({ message: `${requiredFeilds.join(", ")} are required`, success: false });
        }
        const hash = await bcrypt.hash(password, saltRounds);
        const user = new User({ name, email, password: hash, age, anonymousName });
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists", success: false });
        }
        await user.save();
        res.status(200).json({ message: "User registered successfully", success: true });
    } catch (error) {
        console.log("Error registering user", error);
        res.status(500).json({ message: "Error registering user", success: false });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found", success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password", success: false });
    }
    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) {
        await Session.deleteOne({ _id: existingSession._id });
    }
    const unqId = uuidv4();
    const session = new Session({ userId: user._id, token: unqId, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
    await session.save();
    const token = jwt.sign({ token: unqId }, process.env.JWT_SECRET);
    res.clearCookie('token');
    res.cookie('token', token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })
    res.status(200).json({ message: "User logged in successfully", success: true });
});

router.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "User logged out successfully", success: true });
});
export default router;