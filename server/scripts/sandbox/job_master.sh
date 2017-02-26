#!/bin/sh
# KhamDB
export PATH="/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:"
export APPLICATION_ENV=sandbox
job_path="/sandbox/data/www/public_html/v3.adx.vn/server/job"
socket_path="/sandbox/data/www/public_html/v3.adx.vn/server/socket"
script_path="/sandbox/data/www/public_html/v3.adx.vn/server/scripts/sandbox"
env="$1"
action="$2"
processJob()
{
	case "$action" in
stop)
	echo '=========== Stop worker buyer =============='
    ps -ef | grep -w $job_path | grep -v grep | awk '{print "kill",$2}' | sh
    sleep 1
    echo '=========== Stop socket buyer =============='
    ps -ef | grep -w $socket_path | grep -v grep | awk '{print "kill",$2}' | sh
    echo '=========== Done Stop =============='
	;;
start)
    echo '=========== Start worker subscribe-buyer =============='
    sh $script_path/restart_job_subscribe.sh $env worker-subscribe-buyer.php false
    echo '=========== Start worker monitor-buyer =============='
    sh $script_path/restart_job_socket.sh $env worker-monitor.php false
    echo '=========== Start worker worker-monitor =============='
    sh $script_path/restart_job_background.sh $env worker-monitor.php false
	echo '=========== Start worker worker-admin =============='
	sh $script_path/restart_job_adx.sh $env worker-admin.php false
	echo '=========== Start worker worker-elastic =============='
	sh $script_path/restart_job_adx.sh $env worker-elastic.php false
	echo '=========== Start worker worker-redis =============='
    sh $script_path/restart_job_adx.sh $env worker-redis.php false
    echo '=========== Start worker worker-campaign =============='
    sh $script_path/restart_job_adx.sh $env worker-campaign.php false
    echo '=========== Start worker worker-creative =============='
    sh $script_path/restart_job_adx.sh $env worker-creative.php false
    echo '=========== Start worker worker-lineitem =============='
    sh $script_path/restart_job_adx.sh $env worker-lineitem.php false
    echo '=========== Start worker worker-elastic-helper =============='
    sh $script_path/restart_job_adx.sh $env worker-elastic-helper.php false
    echo '=========== Start worker worker-elastic-helper =============='
    sh $script_path/restart_job_adx.sh $env worker-admin-helper.php false
	;;
*)
	echo "Usage: $0 $env <start|stop>"
	exit 2
esac
}

if [ $# -ne 2 ]
then
    echo "Usage: $0 <sandbox> <start|stop>"
    exit 1
else
    processJob
    sleep 3
fi
