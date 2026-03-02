import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import studentModel from "../models/studentModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "kalvia_secret_key";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const signup = async (req, res) => {
    try {
        const { full_name, email, password, phone, date_of_birth, city } = req.body;

        // Validate required fields
        if (!full_name || !email || !password) {
            return res.status(400).json({ error: "full_name, email, and password are required" });
        }

        // Check if user already exists
        const existingUser = await studentModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email already in use" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user object
        const newStudent = {
            full_name,
            email,
            password: hashedPassword,
            phone,
            date_of_birth,
            city
        };

        // Save to database
        const result = await studentModel.create(newStudent);

        // Generate JWT
        const token = jwt.sign(
            { id: result.lastID, email: newStudent.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Store in httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: COOKIE_MAX_AGE,
            path: '/'
        });

        res.status(201).json({
            message: "Student registered successfully",
            user: {
                id: result.lastID,
                full_name: newStudent.full_name,
                email: newStudent.email,
                phone: newStudent.phone,
                city: newStudent.city
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = await studentModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Store in httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: COOKIE_MAX_AGE,
            path: '/'
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
        expires: new Date(0)
    });
    res.json({ message: "Logged out successfully" });
};
