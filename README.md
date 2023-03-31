# Fabric Task

It is a fabric task which contains 2 organization and 3 orderer node. Handles the car creation and selling of item with fabric ERC20 token.

## Description

It handles the car creation, where one organization creates the car and other buys it. There is also token creation api which handles mints token, provides total supply, balance of user and transfers the token. Integrate swagger for API execution in backend and used JWT token for authorization. 

### Add Channel 

It also shows to create a new channel and add it in the network. In this branch, it adds a new channel with name ```org1channel``` which refers to the profile ```OneOrgsChannel``` defined inside the configtx.yaml file. Inside the ```start.sh``` show the flow to create a new channel

### Functionalities:

-   Register - Register of user via Hyperledger Fabric CA
-   Login - Login of user via Hyperledger Fabric CA
-   CreateEntry - Enter new car entry
-   FetchCarById - Fetch Car entry by Id
-   FetchAllCars - It fetches all cars
-   ChangeOwner - It changes the Owner of car
-   TotalSupply - It returns the total supply
-   GetBalance - It returns the balance of user
-   GetClientId - It returns the clientId which helps to transfer fund
-   Mint - It mints token, only org1 is allowed to mint token
-   Transfer - It transfer the token which takes the receiver clientId

### Getting Started

* git clone https://github.com/bansaltushar014/Fabric-Task
* cd fabric-task ```-----Move inside fabric-task----```
* cd network/ ```-----Move inside network folder----```
* ./start.sh ```-----Creates artifacts and run docker-compose, so on----```
* cd /artifacts/config ```-----Manual run generate-cpp.sh file----```
* ./generate-cpp.sh ```-----Generates org1 and org2 json file----```
* cd ../../../ ```-----Comes out to root----```
* cd backend/client ```-----Go inside client directory----```
* npm install  ```-----Install npm packages----```
* npm start ```-----It starts the application----```

### Environmet variable for peer0.org1 from /network path 

- export CORE_PEER_TLS_ENABLED=true
- export CORE_PEER_LOCALMSPID="Org1MSP"
- export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
- export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
- export CORE_PEER_ADDRESS=localhost:7051

### Environmet variable for peer0.org2 from /network path 

- export CORE_PEER_TLS_ENABLED=true
- export CORE_PEER_LOCALMSPID="Org2MSP"
- export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
- export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
- export CORE_PEER_ADDRESS=localhost:9051


### Dependencies

-   Golang, Docker, Nodejs, Npm.

### Executing program

-   After successful execution visit `http://localhost:3001/api-docs/` in browser. 


### Demo Video

-   Please watch this demo for more understanding ``
