<?php

namespace Index\Controller;

use Admin\Controller\AbstractAdminRestController;
use MT\Search;
use Zend\View\Model\JsonModel;
use MT\Business;

class IndexController extends AbstractAdminRestController
{
    public function indexAction()
    {
//        $instanceKeyword = new \MT\Model\Keyword();
//        $arr_data = $instanceKeyword->getData([
//            'limit' => 200,
//            'page' => 1,
//            'order_by' => 'key_id asc'
//        ]);
//        echo '<pre>';
//        print_r($arr_data);
//        echo '</pre>';
//        die();
        $instanceSearchKeyword = new \MT\Search\Keyword();
        $is_exits = $instanceSearchKeyword->searchData([
//            'key_slug' => trim(\My\General::getSlug('Falcons score')),
//            'key_id' => 1,
//            'match_key_name' => 'Green Bay',
            'like_key_name' => 'Green Bay',
            'limit' => 100,
            'page' => 1,
            'sort' => ['_score'=>['order'=>'desc']]
//            'source' => ['key_id']
        ]);
        echo '<pre>';
        print_r($is_exits);
        echo '</pre>';
        die();
        die('abc');
        $instanceSearchKeyword = new \MT\Search\Keyword();
        foreach ($arr_data as $value){
            $instanceSearchKeyword->add($value);
        }
        die('done');

        $status = $instanceSearchKeyword->createIndex();
        echo '<pre>';
        print_r($status);
        echo '</pre>';
        die();

//        $params = [
//            'key_id' => 1,
//            'key_name' => 'chiennn1111111',
//            'key_slug' => 'chiennn1111111',
//            'is_crawler' => 1,
//            'key_description' => ''
//        ];
//        $result = $instanceSearchKeyword->add($params);
////        $result = $instanceSearchKeyword->update($params);
//        echo '<pre>';
//        print_r($result);
//        echo '</pre>';
//        die();
        $arr_data = [
            'videos',
            'clip',
            'music',
            'film',
            'trailer'
        ];

        $serviceKeyword = new \MT\Model\Keyword();

        foreach ($arr_data as $key_name) {
            $params = [
                'key_name' => $key_name,
                'key_slug' => \My\General::getSlug($key_name),
                'is_crawler' => 0,
                'key_description' => '',
                'created_date' => time()
            ];
            $result = $serviceKeyword->add($params);
            echo '<pre>';
            print_r($result);
            echo '</pre>';
//            die();
        }
        die();

//        $params = [
//            'condition' => [
//                'key_id' => 4
//            ],
//            'params' => [
//                'key_name' => 'chiennn'
//            ]
//        ];

//        $count = count($arr_data);
        $instanceKeyword = new \MT\Model\Keyword();
        $result = $instanceKeyword->getData([
            'limit' => 2,
            'page' => 1
        ]);
        echo '<pre>';
        print_r($result);
        echo '</pre>';
        die();

        $result = $instanceKeyword->update($params);
        echo '<pre>';
        print_r($result);
        echo '</pre>';
        die();

        $result = $instanceKeyword->delete([
            'key_id' => 1
        ]);
        echo '<pre>';
        print_r($result);
        echo '</pre>';
        die();

        for ($i = 0; $i < $count; $i++) {
            $data = [
                'key_name' => $arr_data[$i],
                'key_slug' => \My\General::getSlug($arr_data[$i]),
                'is_crawler' => 0
            ];
            $result = $instanceKeyword->create($data);
            echo '<pre>';
            print_r($result);
            echo '</pre>';
            die();

        }

        $intanceSearchKeyword = new \MT\Search\Keyword();
        $status = $intanceSearchKeyword->createIndex();
        echo '<pre>';
        print_r($status);
        echo '</pre>';
        die();
        //client_secret=yuNS6kJUsU69NX7rPXRIrU4C&grant_type=refresh_token&refresh_token=1%2FyeOm41z-ONX4kdpghOUqprx_t3dCOGY9bNIiuG_HipLOvis2gCBMiGdKa1FHkWzL&client_id=305277173466-i7u7cmv0a7gqco2rj86a9p99jbokp9lq.apps.googleusercontent.com
        try {
            ECHO '<CENTER>HELLO MT-SOLUTION</CENTER>';
            die();
//            $google_config = \My\General::$google_config;
//            $client = new \Google_Client();
//            $client->setClientId($google_config['client_id']);
//            $client->setClientSecret($google_config['client_secret']);
//            $client->setAccessType("offline");
//            $client->setApprovalPrompt("force");
//            $client->refreshToken($google_config['refresh_token']);
//            $new_token = $client->getAccessToken();

            //set lại xuống redis
            //$redis = \MT\Nosql\Redis::getInstance('caching');
//            $redis->HMSET('token:youtube', 'access_token', $new_token['access_token']);

            echo '<pre>';
            print_r($redis);
            echo '</pre>';
            die();
        } catch (\Exception $ex) {
            echo '<pre>';
            print_r($ex->getMessage());
            echo '</pre>';
            die();
        }
        die('1111');
        try {
            $google_config = \My\General::$google_config;
            $client = new \Google_Client();
//            $client->setClientId($google_config['client_id']);
//            $client->setClientSecret($google_config['client_secret']);
            $client->setClientId('305277173466-i7u7cmv0a7gqco2rj86a9p99jbokp9lq.apps.googleusercontent.com');
            $client->setClientSecret('yuNS6kJUsU69NX7rPXRIrU4C');
            $client->setAccessType("offline");
            $client->setApprovalPrompt("force");

//            $url = 'https://www.googleapis.com/oauth2/v4/token?client_id=305277173466-i7u7cmv0a7gqco2rj86a9p99jbokp9lq.apps.googleusercontent.com&client_secret=yuNS6kJUsU69NX7rPXRIrU4C&refresh_token=1/5_0h3Lq9dvLz-OJzRUQgr1EKl-PqVghpAWmyGC6mi-bcJiCSHVXYxRy87EGyw1Wt&grant_type=refresh_token';
//            $rp = \My\General::crawler($url, '', [], [], 1);
//            echo '<pre>';
//            print_r($rp);
//            echo '</pre>';
//            die();

//            client_id=8819981768.apps.googleusercontent.com&
//            client_secret=your_client_secret&
//            refresh_token=1/6BMfW9j53gdGImsiyUH5kU5RsR4zwI9lUVX-tqf8JXQ&
//            grant_type=refresh_token

            //$config_token
            $config_token = \My\General::$youtube_tooken;
            $client->refreshToken('1/5_0h3Lq9dvLz-OJzRUQgr1EKl-PqVghpAWmyGC6mi-bcJiCSHVXYxRy87EGyw1Wt');
            $new_token = $client->getAccessToken();
            echo '<pre>';
            print_r($new_token);
            echo '</pre>';
            die();

            $configApi = \My\General::$google_config;

//            ya29.Ci-5A5UpmkCcpV6lI03FW518ctUk1bMAwS1NW8EifsUzI-T5Bmx8pma51u0kIJJHXg

            //token youtube
            $redis = \MT\Nosql\Redis::getInstance('caching');
            $redis->HMSET('token:youtube', 'access_token', 'ya29.Ci-5A5UpmkCcpV6lI03FW518ctUk1bMAwS1NW8EifsUzI-T5Bmx8pma51u0kIJJHXg');
//            echo '<pre>';
//            print_r($redis->HGET('token:youtube', 'access_token'));
//            echo '</pre>';
//            die();
            echo '<pre>';
            print_r($redis->HGET('token:youtube', 'access_token'));
            echo '</pre>';
            die();
            $refresh_token = $redis->HGET('token:youtube', 'refresh_token');

            $url = 'https://www.googleapis.com/oauth2/v4/token/';

//            client_id=8819981768.apps.googleusercontent.com&
//            client_secret=your_client_secret&
//            refresh_token=1/6BMfW9j53gdGImsiyUH5kU5RsR4zwI9lUVX-tqf8JXQ&
//            grant_type=refresh_token

//            $arr_data = [
//                'client_id' => $configApi['client_id'],
//                'client_secret' => $configApi['client_secret'],
//                'refresh_token' => $refresh_token,
//                'grant_type' => 'refresh_token'
//            ];

//            client_id=8819981768.apps.googleusercontent.com&
//            client_secret=your_client_secret&
//            refresh_token=1/6BMfW9j53gdGImsiyUH5kU5RsR4zwI9lUVX-tqf8JXQ&
//            grant_type=refresh_token

            $arr_data = [
                'client_id' => $configApi['client_id'],
                'client_secret' => $configApi['client_secret'],
                'refresh_token' => $refresh_token,
                'grant_type' => 'refresh_token'
            ];

            $build_data_url = http_build_query($arr_data);

            $url .= '?' . $build_data_url;

            $headers[] = 'Content-Type: application/x-www-form-urlencoded';

            $response = \My\General::crawler($url, '', $headers, [], 1);
            echo '<pre>';
            print_r($response);
            echo '</pre>';
            die();
            if (empty($response)) {

            }

            $response = json_decode($response, true);

            //set lại xuống redis
            $redis->HMSET('token:youtube', 'access_token', $response['access_token']);

            \MT\Utils::writeLog($fileNameSuccess, $arrParam);


            $redis = \MT\Nosql\Redis::getInstance('caching');
//            $arrData = [
//                'access_token' => 'ya29.Ci-5A5gLX2anrCENLNye_DQhxikPm9gkN1bFreni6PZnXX5dGXhoT0Q-By07ZMWHKg',
//                'refresh_token' => '1/Cud1-EVnGQ4Jaj9LKoLd8Lzlvk42JU1TLP7s_t3AfYEVUXODO6nzUW0YIDtn8zMX'
//            ];
            $key = 'token:youtube';
            //$status = $redis->HMSET($key, $arrData);
            echo '<pre>';
            print_r($redis->HGET($key, 'access_token'));
            echo '</pre>';
            die();
        } catch (\Exception $exc) {
            echo '<pre>';
            print_r([
                'code' => $exc->getCode(),
                'messages' => $exc->getMessage()
            ]);
            echo '</pre>';
            die();
        }

    }

    public function index()
    {
        echo '<pre>';
        print_r('123123213221');
        echo '</pre>';
        die();
    }

    public function getList()
    {
        echo '<pre>';
        print_r('123123');
        echo '</pre>';
        die();
        $arr_return = [];
        try {
            $params = $this->getRequest()->getQuery()->toArray();
            $params = array_merge(array(
                'user_id' => $this->getEvent()->getParam('user_id', false),
                'network_id' => $this->getEvent()->getParam('network_id', false),
            ), $params);
            $instanceSearch = new \ADX\Search\Deal();
            switch ($params['type']) {
                case 'checkName':
                    $arrConidition = [
                        'package_name' => $params['package_name'],
                        'network_id' => $params['network_id'],
                        'source' => ['package_id', 'package_name']
                    ];
                    $response = $instanceSearch->searchData($arrConidition);
                    break;
                default :
                    $response = Search\Package::searchData(
                        [
                            'network_id' => $params['network_id']
                        ]
                    );
                    break;
            }
            return Business\Api::success(200, $response);
        } catch (\Exception $ex) {
            return Business\Api::error(101, $arr_return);
        }
    }

    public function get($id)
    {
        echo '<pre>';
        print_r('123123');
        echo '</pre>';
        die();
        return new JsonModel(array('message' => 'Hello Get'));
    }

    public function update($id, $data)
    {
        return new JsonModel(array('message' => 'Hello Update'));
    }

    public function delete($id)
    {
        return new JsonModel(array('message' => 'Hello Delete'));
    }

    public function create($params)
    {
        $arr_return = [];
        try {
            $params = array_merge(array(
                'user_id' => $this->getEvent()->getParam('user_id', false),
                'network_id' => $this->getEvent()->getParam('network_id', false),
            ), $params);

            //validate params
            $data = Business\Deal::validateParams($params);

            if ($data['status'] == 'error') {
                return Business\Api::error($data['code']);
            }

            //create package
            $result = Business\Deal::createDeal($data);

            if (!empty($result['status']) && $result['status'] == 'error') {
                return Business\Api::error($data['code']);
            }

            return Business\Api::success(200, $result);
        } catch (\Exception $ex) {
            return Business\Api::error(101, $arr_return);
        }
    }
}
