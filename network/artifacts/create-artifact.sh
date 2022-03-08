#!/bin/bash

export PATH=${PWD}/../../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=false

rm -rf ./crypto-config
rm genesis.block mychannel.tx Org1MSPanchors.tx Org2MSPanchors.tx Org3MSPanchors.tx 

cryptogen generate --config=./crypto-config.yaml --output=./

configtxgen -profile TwoOrgsOrdererGenesis -configPath ./configtx -channelID system-channel -outputBlock ./genesis.block

configtxgen -profile TwoOrgsChannel -configPath ./configtx -outputCreateChannelTx ./mychannel.tx -channelID mychannel

configtxgen -profile TwoOrgsChannel -configPath ./configtx -outputAnchorPeersUpdate ./Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP

configtxgen -profile TwoOrgsChannel -configPath ./configtx -outputAnchorPeersUpdate ./Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP
