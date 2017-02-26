<?php
/**
 * Created by PhpStorm.
 * User: tuandv
 * Date: 4/27/16
 * Time: 23:30
 */

namespace MT;

use Elasticsearch;

class Elastic
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
    public static function getInstances($instance)
    {
        if (!isset(self::$_instances[$instance])) {

            $config = Config::get('elastic');
            $hosts = $config['elastic']['adapters'][$instance];
            self::$_instances[$instance] = Elasticsearch\ClientBuilder::create()->setHosts(array(
                $hosts['host']. ':'. $hosts['transport.port']
            ))->build();
        }

        return self::$_instances[$instance];
    }

    public static function closeAllConnections()
    {
        if (empty(self::$_instances)) {
            return;
        }

        foreach (self::$_instances as &$instances) {
            if (is_resource($instances)) {
                curl_close($instances);
            }
            unset($instances);
        }
    }
}