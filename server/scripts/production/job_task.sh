#!/bin/sh
export PATH=/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin
php_bin="/usr/bin/php"
php_ini="/etc/php.ini"
prefix_log="/var/www/mt-pingpong/html/server/server/job/log"
env="production"
echo "$1"
case "$1" in
1min)
    ;;
5min)
	;;
30min)
    $php_bin -c $php_ini /var/www/mt-pingpong/html/server/job/crontab/refresh.php --env $env --type "refresh_token"
	;;
50min)

    ##monitor creative-no-lineitem
    ##$php_bin -c $php_ini /var/www/mt-pingpong/html/server/job/crontab/refresh.php --env $env --type "refresh_token"
;;
hour)

	;;
2hour)


	;;
day_0h)

	;;
day_0h30)

	;;
day_1h)

	;;
day_2h)

	;;
day_3h)

	;;
day_6h)

	;;
day_9h)

	;;
day_23h50)

	;;
update_dynamic_product)
	;;
stop_creative_pause)

	;;
cpd_job)

	;;
debug)

	;;
*)
	echo $"Usage: $0 {30min|hour|day_0h|day_0h30|day_1h|day_23h50|1min}"
	exit 2
esac
