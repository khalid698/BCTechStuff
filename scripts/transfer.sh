#!/bin/bash
#
# Deploys identity solidity code, returns new address
#
FROM=$(./account.sh)
TX=$(curl -X POST --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_sendTransaction\",\"params\":[{\"from\":\"$FROM\", \"to\":\"$1\",\"value\":\"0x9184e72a000\"}]}" http://localhost:8545 2>/dev/null | jq -r .result)