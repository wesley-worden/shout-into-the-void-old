#!/bin/bash
if [ "$EUID" -ne 0 ]
  then /usr/bin/echo "bruh you gotta be root"
  exit
fi
/usr/bin/echo "removing containers..."
/usr/bin/docker stop $(/usr/bin/docker ps -aq)
/usr/bin/docker rm $(/usr/bin/docker ps -aq)
/usr/bin/echo "armaggedon"
/usr/bin/docker network prune -f
/usr/bin/docker rmi -f $(/usr/bin/docker images --filter dangling=true -qa)
/usr/bin/docker volume rm $(/usr/bin/docker volume ls --filter dangling=true -q)
/usr/bin/docker rmi -f $(/usr/bin/docker images -qa)
/usr/bin/systemctl stop docker
