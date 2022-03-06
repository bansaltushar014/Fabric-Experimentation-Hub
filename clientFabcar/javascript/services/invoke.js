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
        // load the network configuration
        // const ccpPath = path.resolve(__dirname, '..', '..', 'network', 'artifacts', 'config', 'connection-org1.json');
        // let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const ccp = await CCP(org_name);
        // Create a new file system based wallet for managing identities.
        const walletPath = await getWalletPath(org_name); 
        // const walletPath = path.join(process.cwd(), 'wallet');
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

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        if(fcn = "createCar"){
            var result = await contract.submitTransaction('createCar', args.carKey, args.make, args.model, args.colour, args.owner);
        }        
        // await contract.submitTransaction('WriteData', 'key2', "value2")
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        result = JSON.parse(result.toString());

        let response = {
            message: "Success",
            result
        }

        return response;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

module.exports = { invokeTransaction }
