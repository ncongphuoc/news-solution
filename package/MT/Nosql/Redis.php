<?php
namespace MT\Nosql;

use MT\Config;

class Redis
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
     * Get redis instance
     * @param <string> $instance
     * @return <Zend_Db>
     */
    public static function getInstance($instance = 'caching')
    {
        try {
            if (!isset(self::$_instances[$instance])) {
                self::$_instances[$instance] = new \Redis();
                $config = Config::get('redis')['redis']['adapters'][$instance];
                self::$_instances[$instance]->pconnect($config['host'], $config['port'], 0);
            }
            return self::$_instances[$instance];
        } catch (\Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function closeConnection($instance = 'caching')
    {
        if (isset(self::$_instances[$instance])) {
            $redis = self::$_instances[$instance];
            if (is_resource($redis)) {
                $redis->close();
            }
            unset(self::$_instances[$instance]);
        }
    }

    public static function closeAllConnections()
    {
        if (empty(self::$_instances)) {
            return;
        }

        foreach (self::$_instances as &$instances) {
            if (is_resource($instances)) {
                $instances->close();
            }
            unset($instances);
        }
    }
}