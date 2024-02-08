docker-compose down
docker-compose -f ./artifacts/create-certificate-with-ca/docker-compose.yaml down
docker-compose -f ./addPeer/docker-compose-peer.yaml down
docker rm $(docker ps -a -q)

rm -f fabricTask.tar.gz
rm -f log.txt

rm -rf channel-artifacts
rm -rf ./artifacts/config/connection-org1.json
rm -rf ./artifacts/config/connection-org2.json
rm -rf ./artifacts/genesis.block
rm -rf ./artifacts/mychannel.tx
rm -rf ./artifacts/Org1MSPanchors.tx
rm -rf ./artifacts/Org2MSPanchors.tx
rm -rf ./addPeer/crypto-config-ca
rm -rf ../backend/client/org1-wallet
rm -rf ../backend/client/org2-wallet
sudo rm -rf ./artifacts/crypto-config
sudo rm -rf ./artifacts/create-certificate-with-ca/crypto-config-ca
sudo rm -rf ./artifacts/create-certificate-with-ca/fabric-ca
sudo rm -rf /var/tushar 

# Remove add Org 
docker-compose -f ./addOrg/docker-compose.yaml down 
docker-compose -f ./addOrg/docker-compose-org3.yaml down 
rm -rf ./addOrg/crypto-config-ca 
sudo rm -rf ./addOrg/fabric-ca
rm -rf ./addOrg/org3Block 
