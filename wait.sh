#!/bin/sh

trap "echo Received stop signal; exit 0" TERM INT

echo "Container is running. PID: $$"

# Idle loop
while true; do
    sleep 1
done
