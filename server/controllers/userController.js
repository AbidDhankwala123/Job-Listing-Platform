const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkHealth = (req,res) => {
    res.status(200).json({
        server: req.headers.host,
        service:"Job Listing Platform",
        status:"ACTIVE",
        time:new Date(),
    })
}

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json({
            status: "SUCCESS",
            users
        })
    } catch (error) {
        next(new Error(error.message));
    }
}

const registeredUser = async (req, res, next) => {
    try {
        const { name, email, password, mobile } = req.body;
        if (!name || !email || !password || !mobile) {
            res.status(400);
            next(new Error("All fields are required"));
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400);
            next(new Error("User already exists"));
        }

        const encryptedPassword = await bcrypt.hash(password, 10)
        await User.create({ name, email, password: encryptedPassword, mobile })
        

        const user = await User.findOne({ email });
        const jwtToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 * 60 }) // 1 hour

        res.status(200).json({
            status: "SUCCESS",
            message: "You are Registered Successfully",
            jwtToken,
            recruiterName: user.name
        })
    } catch (error) {
        next(new Error(error.message));
    }

}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            next(new Error("All fields are required"));
        }
        const user = await User.findOne({ email });//user is mongoose object or mongodb object,so we need to convert it into json
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const jwtToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 * 30 }) // 30 minutes
                res.status(200).json({
                    status: "SUCCESS",
                    recruiterName: user.name,
                    message: "You are Logged In Successfully",
                    jwtToken
                })
            }
            else {
                res.status(400);
                next(new Error("Invalid credentials"));
            }
        }
        else {
            res.status(400);
            next(new Error("Invalid credentials"));

        }
    } catch (error) {
        next(new Error(error.message));
    }

}

module.exports = {checkHealth, getUsers, registeredUser, loginUser }