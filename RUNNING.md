# How to run the POC

## Installing geth

Run the following commands to add the tap and install geth:

```
brew tap ethereum/ethereum
brew install ethereum
```

## Start the private chain
Ensure the geth homebrew package is installed, this wrapper just bootstraps a node using the present installation.

```
cd geth && ./start.sh
```

## Reset the chain, this will delete all transactions and restart at the genesis block.

```
cd geth && ./reset.sh
```