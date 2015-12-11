#!/bin/bash
curl -X POST --data "{\"jsonrpc\":\"2.0\",\"method\":\"personal_unlockAccount\",\"params\":[\"0x3e0d0e42ce28b5ae471dfc4ade385a4bf39dc8a9\",\"12345\"]}" http://localhost:8545 2>/dev/null | jq .result
