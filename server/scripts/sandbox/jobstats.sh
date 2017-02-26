#!/bin/sh

echo "-----------------------------------------"
echo -e '\E[32m'
echo "PORT 10.198.0.204:4631 - sandbox buyer"
echo -e '\E[30;37m'
(echo status ; sleep 0.1) | nc 10.198.0.204 4631