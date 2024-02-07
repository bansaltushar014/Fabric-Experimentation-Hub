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

sleep 5 

$(docker network create artifacts_test)
containers=$(sudo docker ps | awk '{if(NR>1) print $NF}')
for container in $containers
do
    echo "Containers: $container"
    containerId=$(docker ps -q --filter="NAME=$container")
    echo $containerId
    $(docker network connect artifacts_test $containerId)
done

sleep 5 

./createChannel.sh

sleep 5 

./deployChaincode.sh

sleep 5 

cd ./artifacts/config
exec ./generate-cpp.sh