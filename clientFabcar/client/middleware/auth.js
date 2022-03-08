const JWTCONFIG = require("../config/jwt.js");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(400).json(errorResponse("ERROR_MESSAGE.REQUIRE_TOKEN"));
    } else {
        var decoded = {}
        try {
            decoded = jwt.verify(token, JWTCONFIG.SECRET);
        } catch (error) {
            logger.error(error)
            return res.status(401).json(errorResponse("ERROR_MESSAGE.INVALID_TOKEN"))
        }
        if (!decoded.hasOwnProperty("username") || !decoded.hasOwnProperty("orgname")) {
            return res.status(401).json(errorResponse("ERROR_MESSAGE.INVALID_TOKEN"))
        }
        req.username = decoded.username;
        req.orgname = decoded.orgname;
        req.password = decoded.password;
        next();
    }
}

module.exports = { auth }