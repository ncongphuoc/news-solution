#!/bin/sh
export PATH=/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin
. /sandbox/data/www/public_html/v3.adx.vn/server/scripts/sandbox/init_v3.adx.vn.sh
prefix_log="/sandbox/data/www/public_html/v3.adx.vn/server/job/log"
env="sandbox"
case "$1" in
1min)
    ##monitor elastic-buyer
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "elastic-buyer"

    ##monitor worker-subscribe
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "worker-subscribe-buyer"

    ##monitor worker-buyer
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "worker-buyer"

    ##monitor worker-adx
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "worker-adx"

    ##monitor logs-php-v3
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "logs-php-v3"

    ##monitor logs-php-v2
    #$php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "logs-php-v2"

    ##monitor campaign-no-lineitem
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "campaign-no-lineitem"

    ##monitor creative-no-lineitem
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "creative-no-lineitem"
    ;;
5min)
    ## ELASTIC
    ## Repair data elastic
    #$php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/elastic.php --env $env --type "backup-elastic"

    ##monitor status index
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "check-status-index-es"
    ##monitor campaign target
    #$php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "monitor-target-campaign"
	;;
30min)

	;;
hour)
    ## LINEITEM
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "check-key-lineitem"

    ##Audience
    ##Giang NT - update visitor audience
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/process.php --env $env --type "update-visitor-audience"

    ##update remarketing
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/process.php --env $env --type "update-remarketing"

    ##update audience
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/process.php --env $env --type "update-audience"

    ##update audience private
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/process.php --env $env --type "update-audience-private"

    ##monitor campaign target
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/monitor.php --env $env --type "monitor-target-campaign"
	;;
2hour)

	;;
day_0h)
    ##AUDIENCE - GIANGNT
    ##refresh remarketing
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/process.php --env $env --type "refresh-remarketing"
    ##refresh audience
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/process.php --env $env --type "refresh-audience"
    ##refresh audience private
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/process.php --env $env --type "refresh-audience-private"

	## REDIS - KhamDB

	## CREATIVE - KhamDB

	## AUDIENCE - KhamDB

	## REMARKETING - KhamDB

	## BOOKING - KhamDB

	## LINEITEM - KhanhHV
	$php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/lineitem.php --env $env --type "lineitem-pending-to-running"

    ## LINEITEM FINISH
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/lineitem.php --env $env --type "lineitem-finish"

    ## ELASTIC
    ## Repair data elastic
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/elastic.php --env $env --type "repair-data-elastic"
    ## Remove api logs elastic
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/elastic.php --env $env --type "remove-api-logs"

    ## Remove monitor_query
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/elastic.php --env $env --type "remove-monitor-query"
	;;
day_0h30)
	##### RUN at 00h30 everyday #####

	## AUDIENCE - KhamDB

	## REMARKETING - KhamDB

	## Send Mail Warning Campaign don't finish target daily

	;;
day_1h)
    ##Estimated remarketing not link creative running - GIANGNT
    $php /sandbox/data/www/public_html/v3.adx.vn/server/job/crontab/process.php --env $env --type "estimated-audience"
	## Recalculate data booking - TienTM

	## Synchronous Oracle = ES

	;;
day_2h)
	## REDIS - KhamDB

	;;
day_3h)
	## REDIS - KhamDB

	;;
day_6h)
	## Update Similar Product - KhamDB

	;;
day_9h)
	## REDIS - KhamDB

	;;
day_23h50)
	##### RUN at 23h50 everyday #####
	## Build data booking - TienTM

	;;
update_dynamic_product)
	##### RUN every minute #####

	;;
stop_creative_pause)
	##### RUN at 05h everyday #####

	;;
cpd_job)
	##### RUN at 06:00  every day  #####

	;;
debug)

	;;
*)
	echo $"Usage: $0 {30min|hour|day_0h|day_0h30|day_1h|day_23h50|1min}"
	exit 2
esac
