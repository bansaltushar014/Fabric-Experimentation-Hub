# Fabric Task

It is a fabric task which contains 2 organization and 3 orderer node. Handles the car creation and selling of item with fabric ERC20 token.

## Description

It handles the car creation, where one organization creates the car and other buys it. There is also token creation api which handles mints token, provides total supply, balance of user and transfers the token. Integrate swagger for API execution in backend and used JWT token for authorization. 

## Branch Description - 3OrgSetupCryptogen

This branch contains the setup with 3 Organization. All the files has the respective changes to make the setup of 3 Organizations 

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

## Getting Started

* git clone https://github.com/bansaltushar014/Fabric-Task
* cd fabric-task ```-----Move inside fabric-task----```
* cd network/ ```-----Move inside network folder----```
* ./start.sh ```-----Creates artifacts and run docker-compose, so on----```
* ./generate-cpp.sh ```-----Generates org1 and org2 json file----```
* cd ../../../ ```-----Comes out to root----```
* cd backend/client ```-----Go inside client directory----```
* npm install  ```-----Install npm packages----```
* npm start ```-----It starts the application----```

## To Clean

* cd fabric-task/network ```-----Move inside fabric-task, network folder----```
* ./stop.sh ```-----Kill all docker, remove all artificats, removes the wallet etc----```

### Dependencies

-   Golang, Docker, Nodejs, Npm.

### Executing program

-   After successful execution visit `http://localhost:3001/api-docs/` in browser. 


### Demo Video

-   Please watch this demo for more understanding ``
