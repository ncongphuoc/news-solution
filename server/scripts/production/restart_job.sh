#!/bin/sh
# KhamDB
export PATH="/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:"
export APPLICATION_ENV=production
php_bin="/usr/bin/php"
php_ini="/etc/php.ini"
job_path="/var/www/mt-pingpong/html/server/job"
env="$1"
job_file="$2"
debug="$3"
restartJob()
{
	if [ "$debug" == "true" ] ; then
        ps -ef | grep -w $job_path/$job_file | grep -v grep | awk '{print "kill",$2}' | sh
		sleep 1
    fi

    if [ "$job_file" == "worker-admin.php" ] ; then
		for i in `seq 0 9`;do
    	    nohup $php_bin -c $php_ini $job_path/$job_file --env $env &
    	done
    else
		for i in `seq 0 4`;do
            nohup $php_bin -c $php_ini $job_path/$job_file --env $env &
        done
    fi
    rm -f nohup

}

if [ $# -ne 3 ]
then
    echo "Usage: $0 <production> <job_name> <true|false>"
    exit 1
else
    restartJob
    sleep 3
    rm -f nohup.out
fi
