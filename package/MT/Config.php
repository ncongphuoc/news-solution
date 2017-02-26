<?php

namespace MT;

use Zend\Config as ZendConfig;

class Config
{
    /**
     * Hold Zend_Config_Ini instances
     * @var Array
     */
    protected static $_instances = array();

    /**
     * Get configuration
     * @param <string> $module
     * @param <string> $filename
     * @return <Zend_Config_Ini>
     */
    public static function get($filename)
    {

        if (!isset(self::$_instances[$filename])) {
            $filePath = CONFIG_PATH . '/autoload/' . APPLICATION_ENV . '/' . $filename . '.global.php';
            //load file config
            $config = new ZendConfig\Config(include $filePath, true);
            //conver to array
            $config = $config->toArray();
            //set config to instance
            self::$_instances[$filename] = $config;
        }

        //retrun config
        return self::$_instances[$filename];
    }

    /**
     * Get job client
     * @return <ADXFW_JobClient>
     */
    public static function getJobClient()
    {
        $_config = self::get(APP_CONFIG);
        //Return jobclient
        return ADXFW_JobClient::getInstance($_config->job->toArray());
    }

    /**
     * Get job function
     * @param <string> $name
     * @return <string>
     */
    public static function getJobFunction($name)
    {

        $_config = self::get(APP_CONFIG);

        //To array
        $jobConfiguration = $_config->job->toArray();

        //Return job name
        return $jobConfiguration[$jobConfiguration['adapter']]['function'][$name];
    }

    /**
     * Get job client
     * @return <ADXFW_JobClient>
     */
    public static function getSearch($name)
    {
        //Get Ini Configuration
        $_config = self::get(APP_CONFIG);
        //Return jobclient
        return ADXFW_Search::getInstance($_config->job->toArray());
    }
}