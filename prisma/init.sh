#!/bin/bash
if [ "$EUID" -ne 0 ]
  then /usr/bin/echo "bruh you gotta be root"
  exit
fi
/usr/bin/systemctl start docker
/usr/bin/docker-compose up -d
/usr/bin/echo "pls run prisma deploy"
