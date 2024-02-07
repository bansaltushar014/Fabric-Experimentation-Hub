const express = require('express');
const app = express();
const { registerUser } = require("../services/registerUser");
const { loginUser } = require("../services/loginUser");
const { invokeTransaction } = require("../services/invoke");
const { queryTransaction } = require("../services/query");
const { getAuthToken } = require("../controllers/auth");
const { auth } = require("../middleware/auth");

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
 *     loginUser:
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
 *     fetchCarById:
 *       type: object
 *       required:
 *         - carKey
 *       properties:
 *         carKey:
 *           type: string
 *           description: unique Car Key
 *       example:  
 *         carKey: CAR134     
 *     changeOwner:
 *       type: object
 *       required:
 *         - carKey
 *         - newOwner 
 *       properties:
 *         carKey:
 *           type: string
 *           description: unique Car Key
 *         newOwner:
 *           type: string
 *           description: newOwner of car
 *       example:  
 *         carKey: CAR134     
 *         newOwner: tushar0123
 *     mintoken:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: string
 *           description: Amount of token to mint
 *       example:  
 *         amount: 1000     
 *     Transfer:
 *       type: object
 *       required:
 *         - amount
 *         - receiverId
 *       properties:
 *         amount:
 *           type: string
 *           description: Amount to transfer
 *         receiverId:
 *           type: string
 *           description: Receiver ID  
 *       example:  
 *         amount: 10
 *         receiverId: eDUwOTo6Q049QWRtaW5Ab3JnMS5leGFtcGxlLmNvbSxPVT1hZG1pbixMPVNhbiBGcmFuY2     
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
    if (orgname == 'Org1' || orgname == 'Org2' || orgname == 'Org3') {
        const result = await registerUser(username, orgname);
        const token = await getAuthToken(username, orgname);
        res.send(result);;
    } else {
        res.send("Invalid orgname!");
    }
})

/**
 * @swagger
 * /login:
 *  post:
 *    summary: Login functionality
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/loginUser'
 *    responses:
 *      200:
 *        description: Login user successfully
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
app.use('/login', async (req, res) => {
    const username = req.body.username;
    const orgname = req.body.orgname;
    if (orgname == 'Org1' || orgname == 'Org2' || orgname == 'Org3') {
        const result = await loginUser(username, orgname);
        if (result.success) {
            const token = await getAuthToken(username, orgname);
            res.send(token);
        } else {
            res.send("Invalid Credentials");
        }
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
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Authentication token
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
app.use('/createEntry', auth, async (req, res) => {
    const fcn = "createCar";
    const args = req.body;
    const result = await invokeTransaction("mychannel", "fabricTask", fcn, args, req.username, req.orgname, "data")
    res.send("Entry has been created!");
})

/**
 * @swagger
 * /fetchCarById:
 *  post:
 *    summary: Fetch Car details by key
 *    tags:
 *      - User
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Authentication token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/fetchCarById'
 *    responses:
 *      200:
 *        description: ChangeOwner of car success
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
 app.use('/fetchCarById', auth, async (req, res) => {
    const fcn = "QueryCar";   
    const args = req.body;
    const result = await queryTransaction("mychannel", "fabricTask", fcn, args, req.username, req.orgname, "data")
    res.send(result.result);
})


/**
 * @swagger
 * /fetchAllCars:
 *  post:
 *    summary: Create New Entry for Car
 *    tags:
 *      - User
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Authentication token
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
app.use('/fetchAllCars', auth, async (req, res) => {
    const result = await queryTransaction("mychannel", "fabricTask", "queryAllCars", "args", req.username, req.orgname, "data")
    res.send(result.result);
})


/**
 * @swagger
 * /changeOwner:
 *  post:
 *    summary: ChangeOwner of Car
 *    tags:
 *      - User
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Authentication token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/changeOwner'
 *    responses:
 *      200:
 *        description: ChangeOwner of car success
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
 app.use('/changeOwner', auth, async (req, res) => {
    const fcn = "ChangeCarOwner";   
    const args = req.body;
    await invokeTransaction("mychannel", "fabricTask", fcn, args, req.username, req.orgname, "data")
    res.send("Car owner changed!");
})


/**
 * @swagger
 * /totalSupply:
 *  post:
 *    summary: Fetch totalsupply
 *    tags:
 *      - User
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Authentication token
 *    responses:
 *      200:
 *        description: totalSupply successfully
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
 app.use('/totalSupply', auth, async (req, res) => {
    const result = await queryTransaction("mychannel", "fabricTask", "TotalSupply", "args", req.username, req.orgname, "data")
    res.send("totalSupply is " + result.result);
})


/**
 * @swagger
 * /getbalance:
 *  post:
 *    summary: Fetch getbalance
 *    tags:
 *      - User
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Authentication token
 *    responses:
 *      200:
 *        description: getbalance successfully
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
 app.use('/getbalance', auth, async (req, res) => {
    const result = await queryTransaction("mychannel", "fabricTask", "getbalance", "args", req.username, req.orgname, "data")
    res.send("balance is " + result.result);
})



/**
 * @swagger
 * /getclientID:
 *  post:
 *    summary: Fetch getclientID
 *    tags:
 *      - User
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Authentication token
 *    responses:
 *      200:
 *        description: getclientID successfully
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
 app.use('/getclientID', auth, async (req, res) => {
    const result = await queryTransaction("mychannel", "fabricTask", "getclientID", "args", req.username, req.orgname, "data")
    res.send("Clientid is " + result.result);
})



/**
 * @swagger
 * /mintoken:
 *  post:
 *    summary: mintoken 
 *    tags:
 *      - User
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Authentication token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/mintoken'
 *    responses:
 *      200:
 *        description: mintoken success
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
 app.use('/mintoken', auth, async (req, res) => {
    const fcn = "Mint";   
    const args = req.body;
    await invokeTransaction("mychannel", "fabricTask", fcn, args, req.username, req.orgname, "data")
    res.send("Token has been minted!");
})


/**
 * @swagger
 * /Transfer:
 *  post:
 *    summary: Transfer 
 *    tags:
 *      - User
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Authentication token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Transfer'
 *    responses:
 *      200:
 *        description: mintoken success
 *      500:
 *        description: Internal Server Error
 *      400:
 *        description: Bad Request
 *      403:
 *        description: Method Not Allowed
 */
 app.use('/Transfer', auth, async (req, res) => {
    const fcn = "Transfer";   
    const args = req.body;
    await invokeTransaction("mychannel", "fabricTask", fcn, args, req.username, req.orgname, "data")
    res.send("Token has been transferred!");
})

module.exports = app;