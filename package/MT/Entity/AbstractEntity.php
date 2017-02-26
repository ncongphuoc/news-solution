<?php
namespace ADX\Entity;

abstract class AbstractEntity
{
    protected static $instances = array();

    protected function __construct()
    {
    }

    public static function getInstance($id, $params)
    {
        $class = get_called_class();
        $object = new $class();
        foreach ($params as $field => $value) {
            $field = strtolower($field);

            if ($field == 'found_rows') {
                continue;
            }

            $object->$field = $value;
        }

        return $object;
    }

    public static function clearInstance($id)
    {
        $class = get_called_class();

        unset($class::$instances[$id]);
    }
} 