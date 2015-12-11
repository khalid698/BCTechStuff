#!/bin/bash
#
# Deploys identity solidity code, returns new address
#
BYTECODE=$(solc --combined-json bin ../contracts/id_v2.sol | jq -r .contracts.Identity.bin)
# echo "Compiled into bytecode $BYTECODE"
FROM=$(./account.sh)
echo "Using 'from' address $FROM"
TX=$(curl -X POST --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_sendTransaction\",\"params\":[{\"from\":\"$FROM\", \"data\":\"$BYTECODE\", \"gas\": 3000000 }]}" http://localhost:8545 2>/dev/null | jq -r .result)
echo "Created tx $TX"