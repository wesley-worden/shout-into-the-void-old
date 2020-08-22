#!/bin/bash
if [ "$EUID" -ne 0 ]
  then /usr/bin/echo "bruh you gotta be root"
  exit
fi
./nuke.sh && ./init.sh
