const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password: hashedPassword
    });
    await user.save();
    return user;
};