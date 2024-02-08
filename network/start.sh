# !/bin/bash

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=false

# rm -rf ./artifacts/crypto-config
# rm genesis.block mychannel.tx Org1MSPanchors.tx Org2MSPanchors.tx Org3MSPanchors.tx 

cd ./artifacts/create-certificate-with-ca/ 
docker-compose up -d 
sleep 5 
./create-certificate-with-ca.sh && 
sleep 5 
cp -r crypto-config-ca ../
cd ..
mv crypto-config-ca crypto-config
mkdir ./crypto-config/ordererOrganizations/example.com/ca
mv ./crypto-config/ordererOrganizations/example.com/msp/keystore/* ./crypto-config/ordererOrganizations/example.com/ca/
mv ./crypto-config/peerOrganizations/org1.example.com/msp/keystore/* ./crypto-config/peerOrganizations/org1.example.com/ca/
mv ./crypto-config/peerOrganizations/org2.example.com/msp/keystore/* ./crypto-config/peerOrganizations/org2.example.com/ca/
cd .. 

sleep 1 

configtxgen -profile TwoOrgsOrdererGenesis -configPath ./artifacts/configtx -channelID system-channel -outputBlock ./artifacts/genesis.block

configtxgen -profile TwoOrgsChannel -configPath ./artifacts/configtx -outputCreateChannelTx ./artifacts/mychannel.tx -channelID mychannel

configtxgen -profile TwoOrgsChannel -configPath ./artifacts/configtx -outputAnchorPeersUpdate ./artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP

configtxgen -profile TwoOrgsChannel -configPath ./artifacts/configtx -outputAnchorPeersUpdate ./artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP

docker-compose up -d

$(docker network create artifacts_test)
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

sleep 5 

cd ./artifacts/config
exec ./generate-cpp.sh