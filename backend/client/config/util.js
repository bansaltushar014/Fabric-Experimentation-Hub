const path = require('path');
const fs = require('fs');

const getWalletPath = async (org) => {
    if (org == "Org1") {
        return path.join(process.cwd(), 'org1-wallet');
    } else if (org == "Org2") {
        return path.join(process.cwd(), 'org2-wallet');
    } else if (org == "Org3") {
        return path.join(process.cwd(), 'org3-wallet');
    } else
        return null
}

const CCP = async (org) => {
    let ccpPath;
    // const ccpPath = path.resolve(__dirname, '..', '..', '..', 'network', 'artifacts', 'config', 'connection-'+role+'.json');
    if (org == "Org1") {
        ccpPath = path.resolve(__dirname, '..', '..', '..', 'network', 'artifacts', 'config', 'connection-org1.json');

    } else if (org == "Org2") {
        ccpPath = path.resolve(__dirname, '..', '..', '..', 'network', 'artifacts', 'config', 'connection-org2.json');

    } else if (org == "Org3") {
        ccpPath = path.resolve(__dirname, '..', '..', '..', 'network', 'artifacts', 'config', 'connection-org3.json');
    } else
        return null
    const fileExists = fs.existsSync(ccpPath);
    if (!fileExists) {
        throw new Error(`no such file or directory: ${ccpPath}`);
    }
    const contents = fs.readFileSync(ccpPath, 'utf8');

    // build a JSON object from the file contents
    const ccp = JSON.parse(contents);

    console.log(`Loaded the network configuration located at ${ccp}`);
    return ccp;
}


const getCaUrl = async (org, ccp) => {
    if (org == "Org1") {
        return ccp.certificateAuthorities['ca.org1.example.com'].url;
    } else if (org == "Org2") {
        return ccp.certificateAuthorities['ca.org2.example.com'].url;
    } else if (org == "Org3") {
        return ccp.certificateAuthorities['ca.org3.example.com'].url;
    } else
        return null
}


module.exports = { getWalletPath, CCP, getCaUrl }