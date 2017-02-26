#!/bin/sh
# KhamDB
export PATH="/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:"
export APPLICATION_ENV=production
job_path="/var/www/mt-pingpong/html/server/job"
script_path="/var/www/mt-pingpong/html/server/scripts/production"
env="$1"
action="$2"
processJob()
{
	case "$action" in
stop)
    echo '=========== Stop worker =============='
	ps -ef | grep -w $job_path | grep -v grep | awk '{print "kill",$2}' | sh
	;;
start)
	echo '=========== Start worker worker-admin =============='
    sh $script_path/restart_job.sh $env worker-admin.php false
    echo '=========== Start worker worker-helper =============='
    sh $script_path/restart_job.sh $env worker-helper.php false
	echo '=========== Start worker worker-upload =============='
    sh $script_path/restart_job.sh $env worker-upload.php false
    echo '=========== Start worker worker-crawler =============='
    sh $script_path/restart_job.sh $env worker-crawler.php false
	;;
*)
	echo "Usage: $0 $env <start|stop>"
	exit 2
esac
}

if [ $# -ne 2 ]
then
    echo "Usage: $0 <production> <start|stop>"
    exit 1
else
    processJob
    sleep 3
fi
