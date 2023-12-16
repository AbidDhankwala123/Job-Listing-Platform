const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    try {
        const { jwttoken } = req.headers;
        if(!jwttoken){
            res.status(404);
            next(new Error('Login First'));
        }
        const user = jwt.verify(jwttoken,process.env.JWT_SECRET);
        req.user=user;
        console.log("req.user: "+req.user+"user: "+user);
        next();
    } catch (error) {
        next(new Error(error.message));
    }

}

module.exports = isAuthenticated