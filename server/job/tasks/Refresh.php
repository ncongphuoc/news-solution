<?php
/**
 * Created by PhpStorm.
 * User: GiangBeo
 * Date: 11/24/16
 * Time: 9:33 AM
 */
namespace TASK;

use MT\Model,
    My\General;

class Refresh
{
    public function tokenYoutube($params)
    {
        date_default_timezone_set('Asia/Saigon');
        $fileNameSuccess = __CLASS__ . '_' . __FUNCTION__ . '_Success';
        $fileNameError = __CLASS__ . '_' . __FUNCTION__ . '_Success';

        $arrParam = [
            'params_input' => $params
        ];

        try {
            $google_config = \My\General::$google_config;
            $client = new \Google_Client();
            $client->setClientId($google_config['client_id']);
            $client->setClientSecret($google_config['client_secret']);
            $client->setAccessType("offline");
            $client->setApprovalPrompt("force");
            $client->refreshToken($google_config['refresh_token']);
            $new_token = $client->getAccessToken();

            //set lại xuống redis
            $redis = \MT\Nosql\Redis::getInstance('caching');
            $redis->HSET('token:youtube', 'access_token', $new_token['access_token']);

            \MT\Utils::writeLog($fileNameSuccess, $arrParam);

        } catch (\Exception $e) {
            $arrParam['exc'] = [
                'code' => $e->getCode(),
                'messages' => $e->getMessage()
            ];
            \MT\Utils::writeLog($fileNameError, $arrParam);
        }
    }
}