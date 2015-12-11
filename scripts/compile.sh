#!/bin/bash
# This is overcomplcated, just use solc because that is was geth does anyway ...
# SRC=$(cat ../contracts/$1 | tr '\n' ' ' | tr '\t' ' ')
# curl -X POST --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_compileSolidity\",\"params\":[\"$SRC\"],\"id\":1}" http://localhost:8545 2>/dev/null
