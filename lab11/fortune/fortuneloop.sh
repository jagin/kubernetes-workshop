#!/bin/bash
trap "exit" SIGINT

INTERVAL=${INTERVAL:-10}

echo Configured to generate new fortune every $INTERVAL seconds

mkdir /var/fortune

while :
do
  echo $(date) Writing fortune to /var/fortune/fortune.txt
  /usr/games/fortune "$@" > /var/fortune/fortune.txt
  cat /var/fortune/fortune.txt
  sleep $INTERVAL
done

