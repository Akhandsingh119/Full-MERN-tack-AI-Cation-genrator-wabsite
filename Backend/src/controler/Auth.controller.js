const userSchema = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { client } = require('../Database/Redis');
const Authmiddleware = require('../middleware1/middleware.auth');
const sendResetEmail = require("../utils/Send.RESET.Password.link");

// Simple but solid email format check
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmail = (v) => typeof v === 'string' && EMAIL_REGEX.test(v.trim());

// Hash a reset token (sha256) so the raw value is never stored in the DB
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

async function getinfo(req, res) {
    try {
        const user = req.user;
        res.status(201).json({
            message: "data fatch sucessfully",
            userId: user
        });
    } catch {
        res.status(401).json({
            message: "error on fetching data",
        });
    }
}

async function Register(req, res) {
    try {
        const { username, email, password } = req.body;

        const trimmedUsername = typeof username === 'string' ? username.trim() : '';
        const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

        if (!trimmedUsername) {
            return res.status(400).json({ message: "Username is required" });
        }
        if (trimmedUsername.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters" });
        }
        if (!trimmedEmail) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!isEmail(trimmedEmail)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existUser = await userSchema.findOne({
            $or: [{ username: trimmedUsername }, { email: trimmedEmail }]
        });

        if (existUser) {
            const field = existUser.email === trimmedEmail ? 'Email' : 'Username';
            return res.status(409).json({ message: `${field} is already taken` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userSchema.create({
            username: trimmedUsername,
            email: trimmedEmail,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_token
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User created successfully",
            userId: user._id
        });
    } catch (error) {
        console.error("Register error:", error);
        // Handle duplicate key errors from the unique index as a clean message
        if (error && error.code === 11000) {
            const field = Object.keys(error.keyValue || {})[0] || 'field';
            return res.status(409).json({ message: `That ${field} is already registered` });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function Login(req, res) {
    try {
        // Accept either "identifier" or "username" so the client can send either.
        const raw = req.body.identifier || req.body.username;
        const { password } = req.body;

        const identifier = typeof raw === 'string' ? raw.trim() : '';

        if (!identifier) {
            return res.status(400).json({ message: "Username or email is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Decide whether the provided value is an email or a username
        const query = isEmail(identifier)
            ? { email: identifier.toLowerCase() }
            : { username: identifier };

        const user = await userSchema.findOne(query);

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Accounts created before password existed (edge case) cannot log in via password
        if (!user.password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_token
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "User logged in successfully",
            id: user._id
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function Logout(req, res) {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    await client.set(`token:${token}`, "blocked")
    await client.expire(`token:${token}`, 1800);
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}

async function forgotpassword(req, res) {
    try {
        const { email } = req.body;
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

        if (!normalizedEmail) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!isEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Try email first, then fall back to username for legacy accounts
        // that were created before the email field was added.
        let user = await userSchema.findOne({ email: normalizedEmail });
        if (!user) {
            user = await userSchema.findOne({ username: normalizedEmail });
        }

        if (!user) {
            return res.status(200).json({
                message: "If an account with that email exists, a password reset link has been sent."
            });
        }

        // Legacy account created before email was required — found by username fallback
        // but has no email address to deliver to.
        if (!user.email) {
            return res.status(400).json({
                message: "Your account does not have an email address on file. Please register a new account with an email."
            });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = hashToken(rawToken);
        user.resetTokenExpiry = new Date(Date.now() + 3600000);

        try {
            await sendResetEmail(user.email, rawToken);
            await user.save();
        } catch (mailErr) {
            console.error("Reset email send error:", mailErr);
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();
            return res.status(500).json({
                message: "Failed to send the reset email. Please try again later."
            });
        }

        return res.status(200).json({
            message: "If an account with that email exists, a password reset link has been sent."
        });
    } catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ message: "An error occurred while processing your request" });
    }
}

async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Reset token is required" });
        }
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Hash the incoming token and look for a matching, non-expired record.
        const user = await userSchema.findOne({
            resetToken: hashToken(token),
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;

        await user.save();

        return res.status(200).json({ message: "Password has been successfully reset. You can now log in." });
    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({ message: "An error occurred while resetting the password" });
    }
}

module.exports = {
    Register,
    Login,
    Logout,
    getinfo,
    forgotpassword,
    resetPassword
};
