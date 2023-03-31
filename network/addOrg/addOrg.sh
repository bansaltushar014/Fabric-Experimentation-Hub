export PATH=${PWD}/../../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../../config

setGlobalsForPeer0Org1() {
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/../artifacts/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/../artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer0Org2() {
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/../artifacts/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/../artifacts/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
}

setGlobalsForPeer0Org3() {
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org3MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/crypto-config-ca/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config-ca/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
    export CORE_PEER_ADDRESS=localhost:11051
}

## prepare the config material for peer3 
# docker-compose up -d
# sleep 6
# ./create-certificate-with-ca.sh 
# sleep 2 
# export FABRIC_CFG_PATH=${PWD}/configtx
# mkdir org3Block
# configtxgen -printOrg Org3MSP > ./org3Block/org3.json

## Fetch the Block 

export ORDERER_CA=${PWD}/../artifacts/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export CHANNEL_NAME=mychannel

export FABRIC_CFG_PATH=${PWD}/../../config
setGlobalsForPeer0Org1
# peer channel fetch config ./org3Block/config_block.pb -o localhost:7050 -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
# configtxlator proto_decode --input ./org3Block/config_block.pb --type common.Block | jq .data.data[0].payload.data.config > ./org3Block/config.json
# jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"Org3MSP":.[1]}}}}}' ./org3Block/config.json ./org3Block/org3.json > ./org3Block/modified_config.json
# configtxlator proto_encode --input ./org3Block/config.json --type common.Config --output ./org3Block/config.pb
# configtxlator proto_encode --input ./org3Block/modified_config.json --type common.Config --output ./org3Block/modified_config.pb
# configtxlator compute_update --channel_id $CHANNEL_NAME --original ./org3Block/config.pb --updated ./org3Block/modified_config.pb --output ./org3Block/org3_update.pb
# configtxlator proto_decode --input ./org3Block/org3_update.pb --type common.ConfigUpdate | jq . > ./org3Block/org3_update.json
# echo '{"payload":{"header":{"channel_header":{"channel_id":"mychannel", "type":2}},"data":{"config_update":'$(cat ./org3Block/org3_update.json)'}}}' | jq . > ./org3Block/org3_update_in_envelope.json
# configtxlator proto_encode --input ./org3Block/org3_update_in_envelope.json --type common.Envelope --output ./org3Block/org3_update_in_envelope.pb

# setGlobalsForPeer0Org1
# peer channel signconfigtx -f ./org3Block/org3_update_in_envelope.pb

# setGlobalsForPeer0Org2
# peer channel update -f ./org3Block/org3_update_in_envelope.pb -c $CHANNEL_NAME -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls true --cafile $ORDERER_CA

peer channel getinfo -c mychannel

## start the docker-compose-org3.yaml file 
# docker-compose -f docker-compose-org3.yaml up -d

## Fetch the mychannel.block
# peer channel fetch 0 ./org3Block/mychannel.block -o localhost:7050 -c $CHANNEL_NAME --tls --cafile $ORDERER_CA

# setGlobalsForPeer0Org3

## join the peer to channel 
# peer channel join -b ./org3Block/mychannel.block

## Install the chaincode 
# peer lifecycle chaincode install ../fabricTask.tar.gz

## Query the chaincode 
# peer lifecycle chaincode queryinstalled

## Approve the chaincode 
# peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name fabricTask --version 1 --init-required --package-id fabricTask_1:c588644e4d0912418d83b68590968c674c50eed14fcb8fdc2d8e41d7b2b4a9f3 --sequence 1

# Commit the chaincode 