
const mongoose = require("mongoose");
const userModel = require("../model/user");

/**
 * Establish a connection to database
 */
const connectDatabase = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/sociobee", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error.toString());
    }
};

/**
 * Connection status
 * 
 */
const connectionDBStatus = async () => {
    try {
        var db = mongoose.connection;
        db.on("error", (error) => {
            throw new Error("ERROR_MESSAGE.PG_DB_CONNECTION_ERROR");
        });
        db.once("open", function (callback) {
            console.log("SUCCESS_MESSAGE.MONGO_CONNECTION_SUCCESS");
        });
    } catch (error) {
        console.log(error.toString());
        throw new Error("ERROR_MESSAGE.PG_DB_CONNECTION_ERROR");
    }
};


const saveTransaction = async (data) => {
    try {
        const userObj = {
            name: data.name,
            email: data.email
        }
        const res = userModel.create(userObj);
        return res;
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    connectDatabase,
    connectionDBStatus,
    saveTransaction
}