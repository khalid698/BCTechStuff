#!/bin/bash
curl -X POST --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getTransactionByHash\",\"params\":[\"$1\"]}" http://localhost:8545 2>/dev/null | jq -r .result