<?php
/**
 * Created by PhpStorm.
 * User: Chien Nguyen
 * Date: 11/24/16
 * Time: 9:33 AM
 */
namespace TASK;

use My\General;

class SynDataEs
{
    public function rsynData($params)
    {
        date_default_timezone_set('Asia/Saigon');
        $fileNameSuccess = __CLASS__ . '_' . __FUNCTION__ . '_Success';
        $fileNameError = __CLASS__ . '_' . __FUNCTION__ . '_Error';
        try {
            $index = $params['index'];
            $params_es = $params['params_es'];
            $type = $params['type'];
            $instanceSearch = self::getInstance($index);
            $instanceSearch->$type($params_es);
            \MT\Utils::writeLog($fileNameSuccess, $params);
        } catch (\Exception $ex) {
            if (APPLICATION_ENV !== 'production') {
                die($ex->getMessage());
            }
            \MT\Utils::writeLog($fileNameError, $params);
            return false;
        }
    }

    public static function getInstance($index)
    {
        try {
            $instanceSearch = '';
            switch ($index) {
                case 'keyword' :
                    $instanceSearch = new \MT\Search\Keyword();
                    break;
                case 'content' :
                    $instanceSearch = new \MT\Search\Content();
                    break;
                default :
                    break;
            }

            return $instanceSearch;
        } catch (\Exception $ex) {
            if (APPLICATION_ENV !== 'production') {
                die($ex->getMessage());
            }
            return false;
        }
    }
}