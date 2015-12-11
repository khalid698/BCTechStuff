# How to run the POC meteor app 

## Start the private chain
Ensure the geth homebrew package is installed, this wrapper just bootstraps a node using the present installation.

```
cd geth && ./start.sh
```

## Start the meteor app
Ensure meteor is installed :
```
curl https://install.meteor.com/ | sh
```

Start the meteor application
```
cd app && meteor
```

## Deploy the contract
Ensure ehtereum is insalled, we require the solidity compiler (solc) from this project.
We also need jq, a tiny json tool.
```
brew install cpp-ethereum jq
```
If this is all done we can compile and deploy our contract ( id_v2.sol ).

```
cd scripts
```
This directory contains various scripts to make dealing with geth easier, the first important one is unlock.sh, this allows us to operate on a fixed address without having to sign requests. this will change in the future but will keep us going for now.
```
./unlock.sh
```
This should return the string 'true', if not something has gone wrong, double check that geth is running from the geth directory and not using the global ehtereum network. this can be validated by running ./account, which should return ```0x3e0d0e42ce28b5ae471dfc4ade385a4bf39dc8a9```

If all goes well, we now have a working and deployment-ready ehtereum instance.

To deploy the contract run 
```
./deploy.sh
Using 'from' address 0x3e0d0e42ce28b5ae471dfc4ade385a4bf39dc8a9
Created tx 0x43b201a97421f37366f29850bd44a8b6467aeef80ae032ae459bf6b7f49400d9
```
The transaction reference can then be used to find the contract address, this will be available once the transaction is mined.
```
./address.sh 0x43b201a97421f37366f29850bd44a8b6467aeef80ae032ae459bf6b7f49400d9
0x798f1c78fc6bb1ea111987e90a59ba7a13ac9239
```

The contract address is ```0x798f1c78fc6bb1ea111987e90a59ba7a13ac9239```, this will change after each deployment.

## Interacting with the contract
In order to use the meteor app with the contract, make sure the contract address ( returned by ```./address ....``` is setup correctly in the client/identity.js file.