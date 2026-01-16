const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json({
            status: "SUCCESS",
            users
        })
    } catch (error) {
        next(error);
    }
}

const registeredUser = async (req, res, next) => {
    try {
        const { name, email, password, mobile } = req.body;
        if (!name || !email || !password || !mobile) {
            return next(new AppError("All fields are required", 400));

        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError("User already exists", 400));
        }

        const encryptedPassword = await bcrypt.hash(password, 10)
        await User.create({ name, email, password: encryptedPassword, mobile })

        const user = await User.findOne({ email });
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 }) // 1 hour

        res.status(200).json({
            status: "SUCCESS",
            message: "You are Registered Successfully",
            jwtToken,
            recruiterName: user.name
        })
    } catch (error) {
        next(error);

    }

}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError("User already exists", 400));
        }
        const user = await User.findOne({ email });//user is mongoose object or mongodb object,so we need to convert it into json
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 60 * 30 }) // 30 minutes
                res.status(200).json({
                    status: "SUCCESS",
                    recruiterName: user.name,
                    message: "You are Logged In Successfully",
                    jwtToken
                })
            }
            else {
                return next(new AppError("Invalid credentials", 400));
            }
        }
        else {
            return next(new AppError("You are not register user", 400));
        }
    } catch (error) {
        next(error);

    }
}

module.exports = { getUsers, registeredUser, loginUser }