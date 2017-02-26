<?php
namespace MT;

class PubSub
{
    protected static $_instances = array();
    protected static $_params = array();

    protected static function getInstance($instance = 'info_buyer')
    {
        if (!isset(self::$_instances[$instance])) {
            $config = Config::get('pubsub');
            //
            $configArray = $config['redis']['adapters'][$instance];
            //
            self::$_params[$instance] = $configArray;
            //
            self::$_instances[$instance] = PubSub\Redis::getInstance($configArray, $instance);
        }

        return self::$_instances[$instance];
    }

    public static function publish($instance = 'info_buyer', $object, $event, $data, $location = '')
    {
        //
        $resource = self::getInstance($instance);
        //
        $channel_string = self::$_params[$instance]['prefix'] . ':' . $object . ':' . $event;
        //
        if ($location != '') {
            $channel_string = $location . '_' . self::$_params[$instance]['prefix'] . ':' . $object . ':' . $event;
        }
        $channel = strtolower($channel_string);
        //
        $data = array_merge($data, array(
            'timestamp' => round(microtime(true) * 1000),
            'fromComponent' => self::$_params[$instance]['component'],
            'channel' => $channel
        ));
        //
        return $resource->publish($channel, $data, $instance);
    }

    public static function subscribe($instance = 'info_buyer', $channel, $callback)
    {
        $resource = self::getInstance($instance);
        //
        //$channel = strtolower(self::$_params[$instance]['prefix'] . ':' . $object . ':' . $event);

        //
        return $resource->subscribe($channel, $callback, $instance);
    }

}