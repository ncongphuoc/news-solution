<?php

namespace MT\Job;

use MT\Config;
use My\Job;

class Client
{
    protected static $_config = array();

    protected static $_instances = array();

    public static function getConfig($instance = 'info')
    {
        if (!isset(self::$_config[$instance])) {
            $config = Config::get('queue');
            //
            self::$_config[$instance] = $config['queue']['adapters'][$instance];
        }

        return self::$_config[$instance];
    }

    public static function getInstance($instance = 'info_buyer')
    {
        //Get Config
        if (!isset(self::$_config[$instance])) {
            self::getConfig($instance);
        }
        //Get instance
        if (!isset(self::$_instances[$instance])) {
            $adapter = self::$_config[$instance]['adapter'];
            self::$_instances[$instance] = Job\Client::factory($adapter, self::$_config[$instance]);
        }
        //
        return self::$_instances[$instance];
    }


    public static function getFunction($name, $instance = 'info_buyer')
    {
        //Return job name
        return self::$_config[$instance]['function'][$name];
    }
}