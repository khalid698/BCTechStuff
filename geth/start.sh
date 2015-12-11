#!/bin/bash
echo "Starting private network"
geth --rpc --rpcaddr "0.0.0.0" \
	--datadir . \
	--genesis genesis.json \
	--networkid 10742 \
	--rpccorsdomain "*" \
	--mine --minerthreads "4" \
	--etherbase "0" \
	--rpcapi "db,eth,net,web3,personal" \
	--ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" \
	--nodiscover --maxpeers 0 \
	console