const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// Function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    )
}

// Register user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User Already Exists" })
        }
        const user = await User.create({ name, email, password })
        const token = generateToken(user);
        user.token = token
        await user.save()
        res.status(201).json({ user })
    } catch (error) {
        res.status(500).json({ message: "Error Registering User", details:error.message })
    }
}

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        const token = generateToken(user)
        user.token =token
        await user.save()
        res.status(200).json({message:"Login Successfull",user,token})
    } catch (error) {
        res.status(500).json({ message: "Error Logging in",details: error.message })
    }
}

// Update user to be an admin and regenerate token
exports.updateToAdmin = async (req, res) => {
    const { userId } = req.params;  // Assuming userId is provided in the URL

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        // Update isAdmin field
        user.isAdmin = true;
        await user.save(); // Save updated user in the database

        // Generate a new token with the updated isAdmin field
        const updatedToken = generateToken(user);

        // Send the updated token to the client
        res.json({ token: updatedToken });

    } catch (error) {
        res.status(500).json({ message: "Error updating to Admin", error })
    }
}
