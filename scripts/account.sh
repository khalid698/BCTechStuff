#!/bin/bash
#
# Returns the first account address registered in geth
#
curl -X POST --data "{\"jsonrpc\":\"2.0\",\"method\":\"personal_listAccounts\",\"params\":[]}" http://localhost:8545 2>/dev/null | jq -r .result[0]
