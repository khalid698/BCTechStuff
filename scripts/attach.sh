#!/bin/bash
#
# Attach to dockerized geth daemon
#
docker exec -i -t docker_geth_1 /bin/bash -c "/opt/geth/geth --ipcpath /opt/geth/geth.ipc attach"
