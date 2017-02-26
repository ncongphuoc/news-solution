<?php

namespace MT\Business;

class Account
{
    public static function test()
    {
        $instance = new \MT\Search\Content();
        $return = $instance->searchData();
        return $return;
    }
}