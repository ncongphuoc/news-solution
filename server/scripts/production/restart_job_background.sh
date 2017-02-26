#!/bin/sh
# KhamDB
export PATH="/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:"
export APPLICATION_ENV=production
php_bin="/build/phpADSV3/bin/php"
php_ini="/build/phpADSV3/etc/php_bg.ini"
job_path="/data/www/public_html/v3.adx.vn/server/job"
env="$1"
job_file="$2"
debug="$3"
restartJob()
{
	nohup $php_bin -c $php_ini $job_path/$job_file --env $env &
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
