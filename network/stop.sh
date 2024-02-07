docker-compose down

rm -f fabricTask.tar.gz
rm -f log.txt

rm -rf channel-artifacts
rm -rf ./artifacts/config/connection-org1.json
rm -rf ./artifacts/config/connection-org2.json
rm -rf ./artifacts/config/connection-org3.json
rm -rf ./artifacts/genesis.block
rm -rf ./artifacts/mychannel.tx
rm -rf ./artifacts/Org1MSPanchors.tx
rm -rf ./artifacts/Org2MSPanchors.tx
rm -rf ./artifacts/Org3MSPanchors.tx
sudo rm -rf ./artifacts/crypto-config
rm -rf ../backend/client/org1-wallet
rm -rf ../backend/client/org2-wallet
rm -rf ../backend/client/org3-wallet