
var express = require('express');
var app = express();
var saveUser = require("../services/database")
var { registerUser } = require("../services/registerUser");
var { invokeTransaction } = require("../services/invoke");
var { queryTransaction } = require("../services/query");

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: "User Management"
 * components:
 *   schemas:
 *     registerUser:
 *       type: object
 *       required:
 *         - username
 *         - orgname
 *       properties:
 *         username:
 *           type: string
 *           description: Name of User
 *         orgname:
 *           type: string
 *           description: Organization name
 *       example:  
 *         username: bansaltushar 
 *         orgname: Org1 
 *     createEntry:
 *       type: object
 *       required:
 *         - carKey
 *         - make 
 *         - model
 *         - colour
 *         - owner
 *       properties:
 *         carKey:
 *           type: string
 *           description: unique Car Key
 *         make:
 *           type: string
 *           description: Maker of car
 *         model:
 *           type: string
 *           description: Model of car
 *         colour:
 *           type: string
 *           description: Colour of car
 *         owner:
 *           type: string
 *           description: Owner of car
 *       example:  
 *         carKey: CAR134     
 *         make: Toyota
 *         model: Zapin
 *         colour: Red
 *         owner: Tushar
 */


/**
 * @swagger
 * /register:
 *  post:
 *    summary: Register functionality
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/registerUser'
 *    responses:
 *      200:
 *        description: User registration successfully
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
app.use('/register', async (req, res) => {
    const username = req.body.username;
    const orgname = req.body.orgname;
    if (orgname == 'Org1' || orgname == 'Org2') {
        const result = await registerUser(username, orgname);
        res.send(result);;
    } else {
        res.send("Invalid orgname!");
    }
})


/**
 * @swagger
 * /createEntry:
 *  post:
 *    summary: Create New Entry for Car
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/createEntry'
 *    responses:
 *      200:
 *        description: User registration successfully
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
app.use('/createEntry', async (req, res) => {
    const fcn = "createCar";
    const args = req.body;
    const result = await invokeTransaction("mychannel", "fabcar", fcn, args, "bansaltushar1", "Org1", "data")
    res.send(result.result);
})


/**
 * @swagger
 * /fetchAllCars:
 *  post:
 *    summary: Create New Entry for Car
 *    tags:
 *      - User
 *    responses:
 *      200:
 *        description: Fatch all cars successfully
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
app.use('/fetchAllCars', async (req, res) => {
    const result = await queryTransaction("mychannel", "fabcar", "fcn", "args", "bansaltushar1", "Org1", "data")
    console.log(result.result);
    res.send(result.result);
})

app.use('/save', async (req, res) => {
    const data = {
        name: "tushar2",
        email: "tushar@gmail.com"
    }
    const result = await saveUser.saveTransaction(data);
    res.send(result);
})

module.exports = app;