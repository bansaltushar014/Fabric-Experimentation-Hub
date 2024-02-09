/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const { getWalletPath, CCP } = require('../config/util');
const register = require('./registerUser');

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name, transientData) => {
    try {
        const ccp = await CCP(org_name);
        const walletPath = await getWalletPath(org_name);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(username);
        if (!identity) {
            console.log('An identity for the user "appUser1" does not exist in the wallet');
            await register.registerUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        const connectOptions = {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true },
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        if (fcn == "createCar") {
            var result = await contract.submitTransaction('createCar', args.carKey, args.make, args.model, args.colour, args.owner);
        }
        if (fcn == "CreateCarTransiant") {
            let carData = JSON.parse(JSON.stringify({
                [args.key] :
                {
                    id: args.id,
                    make: args.make,
                    model: args.model,
                    colour: args.colour,
                    owner: args.owner,
                    price: args.price
                }
            }
            ))
            console.log(carData)
            key = Object.keys(carData)[0]
            const transientBuffer = {}
            transientBuffer[key] = Buffer.from(JSON.stringify(carData.asset_properties))
            var result = await contract.createTransaction('CreateCarTransiant').setTransient(transientBuffer).submit();
        }
        if (fcn == "ChangeCarOwner") {
            console.log("inside change car owner")
            var result = await contract.submitTransaction('ChangeCarOwner', args.carKey, args.newOwner);
        }
        if (fcn == "Mint") {
            var result = await contract.submitTransaction('Mint', args.amount);
        }
        if (fcn == "Transfer") {
            var result = await contract.submitTransaction('Transfer', args.receiverId, args.amount);
        }
        // Disconnect from the gateway.
        await gateway.disconnect();

        return "Transaction has been submitted";

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

module.exports = { invokeTransaction }
