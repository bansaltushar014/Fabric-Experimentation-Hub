const dotenv = require("dotenv");
const port = process.env.PORT || 3001;
dotenv.config();

module.exports = {
    "open_api_version": "3.0.3",
    "title": "E3DA API",
    "version": "1.0.0",
    "description": "Controller for E3DA API Calls are defined here",
    "url": "http://localhost:" + port,
    "apis": ["./routes/*.js"]
}