const jwt = require("jsonwebtoken");
const JWTCONFIG = require("../config/jwt.js");

const getAuthToken = async (username, orgname) => {
    try {
        
        console.log(Math.floor(Date.now() / 1000) + 60 * 60)

        const token = {
            token: jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                    username: username,
                    orgname: orgname,
                    password: "fabric_task",
                },
                JWTCONFIG.SECRET
            ),
        };

        return token;
    } catch (error) {
        console.log("Error" + error.toString());
    }
};

module.exports = { getAuthToken }