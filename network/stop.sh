docker-compose down

rm -f fabcar.tar.gz
rm -f log.txt

rm -rf channel-artifacts
rm -rf ./artifacts/genesis.block
rm -rf ./artifacts/mychannel.tx
rm -rf ./artifacts/Org1MSPanchors.tx
rm -rf ./artifacts/Org2MSPanchors.tx
sudo rm -rf ./artifacts/crypto-config
