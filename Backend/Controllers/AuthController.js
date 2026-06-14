const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        console.log('Checking if user exists for email:', email);
        const user = await UserModel.findOne({ email });
        if (user) {
            console.log('User already exists:', user);
            return res.status(409)
                .json({ message: 'User already exists, you can log in', success: false });
        }

        // Hash password before saving
        console.log('Hashing password for user:', email);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword); // Log hashed password for debugging

        const userModel = new UserModel({ name, email, password: hashedPassword });
        console.log('Saving new user to the database:', userModel);
        await userModel.save(); // Save user to the database

        res.status(201).json({
            message: "Signup successfully",
            success: true
        });
    } catch (err) {
        console.error('Signup error:', err);  // Log the error details
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
}

module.exports = {
    signup,
    login
}    