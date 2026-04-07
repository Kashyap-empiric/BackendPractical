const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokens");

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

exports.loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if(!user) {
        throw new Error("Invalid email!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error("Invalid password!");
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    return { user, accessToken, refreshToken };
}