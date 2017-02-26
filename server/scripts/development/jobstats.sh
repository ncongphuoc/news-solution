#!/bin/sh
echo "-----------------------------------------"
echo -e '\E[32m'
echo "PORT 127.0.0.1:4730 - development buyer"
echo -e '\E[30;37m'
(echo status ; sleep 0.1) | nc 127.0.0.1 4730