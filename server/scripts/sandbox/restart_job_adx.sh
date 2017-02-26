#!/bin/sh
# KhamDB
export PATH="/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:"
export APPLICATION_ENV=sandbox
php_bin="/build/phpADSV3/bin/php"
php_ini="/build/phpADSV3/etc/php.ini"
job_path="/sandbox/data/www/public_html/v3.adx.vn/server/job"
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
    echo "Usage: $0 <sandbox> <job_name> <true|false>"
    exit 1
else
    restartJob
    sleep 3
    rm -f nohup.out
fi
