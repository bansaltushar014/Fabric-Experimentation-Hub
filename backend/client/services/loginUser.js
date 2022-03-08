/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const { CCP, getWalletPath, getCaUrl } = require('../config/util');

async function loginUser(username, userOrg) {
    try {
        const ccp = await CCP(userOrg);
        const caURL = await getCaUrl(userOrg, ccp)
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = await getWalletPath(userOrg)
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(username);
        if (userIdentity) {
            console.log(`An identity for the user ${username} exists in the wallet`);
            var response = {
                success: true,
                message: username + ' login Successfully',
            };
            return response;
        } else {
            console.log(`An identity for the user ${username} does not exists in the wallet`);
            var response = {
                success: false,
                message: username + ' login Unsuccessfully',
            };
            return response;
        }

    } catch (error) {
        console.error(`Failed to register user "appUser": ${error}`);
        process.exit(1);
    }
}

module.exports = { loginUser }
