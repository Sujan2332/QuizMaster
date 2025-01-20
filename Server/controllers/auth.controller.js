const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer");

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


const transporter = nodemailer.createTransport({
    service: "gmail", // You can replace this with your email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

const sendResetEmail = async (email, resetToken) => {
    const resetURL = `${process.env.CLIENT_URL}/#/reset-password?token=${resetToken}`; // URL for the frontend reset password page
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: `
            <h3>Password Reset</h3>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetURL}" target="_blank">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        user.resetToken = resetToken; // Save reset token in the database
        await user.save();
        console.log(resetToken)

        // Send reset token email
        await sendResetEmail(email, resetToken);

        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending reset email", details: error.message });
    }
};

// Update Login Password
exports.updatePassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;
    console.log("RESET TOKEN",resetToken)
    console.log("NEW PASSWORD:",newPassword)

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.resetToken !== resetToken) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Update password and clear the reset token
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating password", details: error.message });
    }
};