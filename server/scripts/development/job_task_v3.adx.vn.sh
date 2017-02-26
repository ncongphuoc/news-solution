#!/bin/sh
export PATH=/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin
. /home/khamdb/v3.adx.vn/server/scripts/init_v3.adx.vn.sh
prefix_log="/home/khamdb/v3.adx.vn/server/server/job/log"
env="development"
case "$1" in
1min)

	;;
5min)

	;;
30min)

	;;
hour)

	;;
2hour)

	;;
day_0h)

    ##$php /home/khamdb/v3.adx.vn/server/job/crontab/elastic.php --env $env --type "repair-data-elastic"
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
*)
	echo $"Usage: $0 {30min|hour|day_0h|day_0h30|day_1h|day_23h50|1min}"
	exit 2
esac
