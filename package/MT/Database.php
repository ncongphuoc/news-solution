<?php

namespace MT;

use  Zend\Db\Adapter as ZendDbAdapter;

class Database
{

    /**
     * Hold Zend_Config_Ini instances
     * @var Array
     */
    protected static $_instances = array();

    /**
     * Avoid creation of class instance
     */
    protected function __construct()
    {
    }

    protected function __clone()
    {
    }

    /**
     * Get database
     * @param <string> $instance
     * @return <Zend_Db>
     */
    public static function getInstance($instance)
    {

        if (!$instance) {
            throw new \Exception('No database instance was defined.');
        }

        if (!isset(self::$_instances[$instance])) {
            $config = Config::get('database');
            //
            $configArray = $config['db']['adapters'][$instance];
            //
            self::$_instances[$instance] = new ZendDbAdapter\Adapter($configArray);
        }

        return self::$_instances[$instance];
    }

    /**
     * @static
     * Close all DB connections
     */
    public static function closeAllConnections()
    {
        foreach (self::$_instances as &$instances) {
            $instances->getDriver()->getConnection()->disconnect();
            unset($instances);
        }
    }

    /**
     * @return array
     */
    public static function getAllInstances()
    {
        $data = array();
        if (!empty(self::$_instances)) {
            foreach (self::$_instances as $key => $obj) {
                $data[$key] = $obj->getDriver()->getConnection()->isConnected();
            }
        }
        return $data;
    }
}