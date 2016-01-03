#!/bin/bash
curl -X POST --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getCode\",\"params\":[\"$1\", \"latest\"]}" http://localhost:8545 2>/dev/null | jq -r .result