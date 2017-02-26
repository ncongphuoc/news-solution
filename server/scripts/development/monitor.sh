#!/bin/bash
export PATH="/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:"
php_bin="/build/phpADSV3/bin/php"
script_path="/home/tuandv/v3.adxdev.vn/server/job"
type="$1"
case $type in
worker-subscribe-buyer)
    ps -ef |grep -w $script_path/"worker-subscribe-buyer.php" |grep $php_bin
    ;;
worker-buyer)
    (echo status ; sleep 0.1) | nc 10.197.0.1 4730
    ;;
check-status-index-es)
    curl http://10.197.0.1:9401/_cat/indices?v
    ;;
*)
    echo "not found"
    exit 2
esac
