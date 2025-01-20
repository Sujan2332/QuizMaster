const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    token: { type: String, required: false },
    resetToken: { type: String, required: false }, // Add this field
},{collection:"quizusers"});

// UserSchema.pre('save', async function (next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

module.exports = mongoose.model("User", UserSchema);
