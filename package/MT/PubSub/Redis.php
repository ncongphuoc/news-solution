<?php
namespace ADX\PubSub;


class Redis implements InterfacePubSub
{
    protected static $_instances = array();
    protected static $_redis = array();
    protected static $_params;


    public function __construct($config, $instance = 'info_buyer')
    {
        self::$_redis[$instance] = new \Redis();
        self::$_redis[$instance]->pconnect($config['host'], $config['port']);
    }

    public static function getInstance($config, $instance = 'info_buyer')
    {
        if (!isset(self::$_instances[$instance])) {
            self::$_instances[$instance] = new self($config, $instance);
        }

        return self::$_instances[$instance];
    }

    protected static function _getRedis($instance = 'info_buyer')
    {
        return self::$_redis[$instance];
    }

    public function publish($channel, $data, $instance = 'info_buyer')
    {
        $redis = self::_getRedis($instance);

        //Jsonify data
        $jsonify = json_encode($data);

        $result = $redis->publish($channel, $jsonify);

        //Log published data with score = timestamp
        $redis->zAdd($channel . ':published', $data['timestamp'], $jsonify);

        return $result;
    }

    public function subscribe($channel, $callback, $instance = 'info_buyer')
    {
        $redis = self::_getRedis($instance);

        //set last time process to redis
//        $time = round(microtime(true) * 1000);
//        $redis->set('lasttime_process', $time);

        $f = function ($redis, $channel, $message) use ($callback) {
            $callback($redis, $channel, $message);
        };

        return $redis->subscribe($channel, $f);
    }
}