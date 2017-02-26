#!/bin/sh

echo "-----------------------------------------"
echo -e '\E[32m'
echo "PORT 10.199.0.1:4731 - production buyer"
echo -e '\E[30;37m'
(echo status ; sleep 0.1) | nc 10.199.0.1 4731