# !/bin/bash

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=false

rm -rf ./artifacts/crypto-config
rm genesis.block mychannel.tx Org1MSPanchors.tx Org2MSPanchors.tx Org3MSPanchors.tx 

cryptogen generate --config=./artifacts/configtx/crypto-config.yaml --output=./artifacts/crypto-config/

configtxgen -profile TwoOrgsOrdererGenesis -configPath ./artifacts/configtx -channelID system-channel -outputBlock ./artifacts/genesis.block

configtxgen -profile TwoOrgsChannel -configPath ./artifacts/configtx -outputCreateChannelTx ./artifacts/mychannel.tx -channelID mychannel

configtxgen -profile TwoOrgsChannel -configPath ./artifacts/configtx -outputAnchorPeersUpdate ./artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP

configtxgen -profile TwoOrgsChannel -configPath ./artifacts/configtx -outputAnchorPeersUpdate ./artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP

docker-compose up -d

containers=$(sudo docker ps | awk '{if(NR>1) print $NF}')
for container in $containers
do
    echo "Containers: $container"
    containerId=$(docker ps -q --filter="NAME=$container")
    echo $containerId
    $(docker network connect artifacts_test $containerId)
done

sleep 7
./createChannel.sh
sleep 7
./deployChaincode.sh

# #Perform the steps for new channel 

export CHANNEL_NAME=org1channel
export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export FABRIC_CFG_PATH=${PWD}/../config/
export PEER0_ORG1_CA=${PWD}/artifacts/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

configtxgen -profile OneOrgsChannel -configPath ./artifacts/configtx -outputCreateChannelTx ./artifacts/org1channel.tx -channelID $CHANNEL_NAME

peer channel create -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.example.com \
    -f ./artifacts/${CHANNEL_NAME}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME}.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block

peer channel list

export CC_NAME="fabricTask"
export PRIVATE_DATA_CONFIG=${PWD}/private-data/collections_config.json
export VERSION="1"
export SEQ="1"
export PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)

# Install the chaincode 
peer lifecycle chaincode install ${CC_NAME}.tar.gz

# Approve the chaincode 
peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com --tls \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --init-required --package-id ${PACKAGE_ID} \
        --sequence ${VERSION}

# Check commit Readiness 
peer lifecycle chaincode checkcommitreadiness \
        --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --sequence ${SEQ} --output json --init-required

# commitChaincodeDefination 
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        --version ${VERSION} --sequence ${VERSION} --init-required

# Query the committed chaincode 
peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}

# Instantiate the chaincode 
peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C $CHANNEL_NAME -n ${CC_NAME} \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        --isInit -c '{"Args":[]}'

# Invoke the chaincode 
peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA \
        -C $CHANNEL_NAME -n ${CC_NAME} \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        -c '{"function": "initLedger","Args":[]}'

# Query the chanicode
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "queryCar","Args":["CAR0"]}'