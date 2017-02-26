#!/bin/bash
export PATH="/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:"
php_bin="/build/phpADSV3/bin/php"
script_path="/sandbox/data/www/public_html/v3.adx.vn/server/job"
type="$1"
case $type in
worker-subscribe-buyer)
    ps -ef |grep -w $script_path/"worker-subscribe-buyer.php" |grep $php_bin
    ;;
worker-buyer)
    (echo status ; sleep 0.1) | nc 10.198.0.204 4631
    ;;
worker-adx)
    (echo status ; sleep 0.1) | nc 10.198.0.204 4630
    ;;
phpADSV3-logs)
    grep -n "PHP" /build/phpADSV3/logs/phpADSV3_errors.log | tail -n 5
    ;;
elasticV3)
    curl -s "http://10.198.0.204:8199/"
    ;;
check-status-index-es)
    curl "http://10.198.0.204:8199/_cat/indices?v"
    ;;
*)
    echo "not found"
    exit 2
esac
