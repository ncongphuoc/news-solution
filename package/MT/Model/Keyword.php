<?php
/**
 * Created by PhpStorm.
 * User: Chien Nguyen
 * Date: 11/04/2016
 * Time: 11:24 AM
 */

namespace MT\Model;

class Keyword
{
    public function add($params)
    {
        $daoKeyword = new \MT\DAO\Keyword();
        return $daoKeyword->add($params);
    }

    public function update($params, $condition)
    {
        $dao = new \MT\DAO\Keyword();
        return $dao->update($params, $condition);
    }

    public function getData($params)
    {
        $daoKeyword = new \MT\DAO\Keyword();
        return $daoKeyword->getData($params);
    }
}