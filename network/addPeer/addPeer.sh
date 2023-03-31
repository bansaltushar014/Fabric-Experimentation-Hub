export PATH=${PWD}/../../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../../config

./create-new-peer.sh 

docker-compose -f docker-compose-peer.yaml up -d

containerId=$(docker ps -q --filter="NAME=peer2.org1.example.com")
echo $containerId
$(docker network connect artifacts_test $containerId)

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/crypto-config-ca/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/../artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:11051

CORE_PEER_ADDRESS=localhost:11051 peer channel list
CORE_PEER_ADDRESS=localhost:11051 peer channel join -b ../channel-artifacts/mychannel.block
CORE_PEER_ADDRESS=localhost:11051 peer lifecycle chaincode install ../fabricTask.tar.gz
CORE_PEER_ADDRESS=localhost:11051 peer chaincode query -C mychannel -n fabricTask -c '{"function": "queryCar","Args":["CAR0"]}'
