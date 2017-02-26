<?php
// Define root path
define('ROOT_PATH', realpath(dirname(__FILE__) . '/../..'));

// Define path to config directory
defined('CONFIG_PATH')
|| define('CONFIG_PATH', ROOT_PATH . '/config');

defined('LANGUAGE_DEFAULT')
|| define('LANGUAGE_DEFAULT', 'vi_VN');

//
require_once CONFIG_PATH . '/common/defined.php';
//
require_once CONFIG_PATH . '/common/constant.php';

/**
 * This makes our life easier when dealing with paths. Everything is relative
 * to the application root now.
 */
chdir(dirname(__DIR__) . '/..');

// Decline static file requests back to the PHP built-in webserver
if (php_sapi_name() === 'cli-server') {
    $path = realpath(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    if (__FILE__ !== $path && is_file($path)) {
        return false;
    }
    unset($path);
}

// Setup autoloading
require 'init_autoloader.php';
Zend\Loader\AutoloaderFactory::factory(array(
    'Zend\Loader\StandardAutoloader' => array(
        'namespaces' => array(
            'TASK' => __DIR__ . '/tasks',
        ),
    )
));

//Check console params options
$opts = new Zend\Console\Getopt(array(
    'env-s' => 'environment',
    'v-i' => 'verbose option'
));

//Get info console
$env = $opts->getOption('env');
$verbose = $opts->getOption('v');

if (empty($env) || !in_array($env, array('development', 'sandbox', 'production'))) {
    echo 'Error Environment server-name.php --env [development, sandbox, production]';
    exit();
}

// Define application environment
defined('APPLICATION_ENV')
|| define('APPLICATION_ENV', $env);

//Print information environment
if ($verbose) {
    echo "ROOT_PATH : " . ROOT_PATH . "\n";
    echo "ENVIRONMENT : " . APPLICATION_ENV . "\n";
}

try {
//    \MT\Utils::runJob(
//        'info',
//        'TASK\Crawler',
//        'crawlerKeyword',
//        'doHighBackgroundTask',
//        'admin_crawler',
//        array(
//            'actor' => __FUNCTION__,
//            'id' => 1
//        )
//    );
//    die('done');

    \MT\Utils::runJob(
        'info',
        'TASK\Crawler',
        'hotTrend',
        'doHighBackgroundTask',
        'admin_crawler',
        array(
            'actor' => __FUNCTION__,
            'init_key' => true
        )
    );
    die('done');

    \MT\Utils::runJob(
        'info',
        'TASK\Test',
        'cloneYoutube',
        'doHighBackgroundTask',
        'admin_process',
        array(
            'manager_id' => 521234123,
            'user_id' => 918231423,
            'network_id' => 22100,
            'object_id' => 123123123,
            'object_type' => 'UPDATE TEST',
            'actor' => __FUNCTION__
        )
    );

    die('done');

    $client = ADX\Elastic::getInstances('info_slave');

    $a = ADX\Model\ElasticSearch::refreshIndexElastic(array(
        'creatives'
    ));


    echo "DONE";
    exit();

    $arr_creative_id = array(512018166, 512001694);

    foreach ($arr_creative_id as $creative_id) {

        //get detail

        $result = ADX\DAO\Job::getCreativeDetail(
            array(
                'creative_id' => $creative_id,
                'columns' => implode(',', ADX\Model\Job::getColumnsCreative())
            )
        );

        $creative = $result[0];
        $third_party_url = $creative['THIRD_PARTY_URL'];

        if (strpos($third_party_url, 'http://') === 0 || strpos($third_party_url, 'https://') === 0) {
            $url = $third_party_url;
        } else {
            $url = 'http://' . $third_party_url;
        }

        $third_party = array(
            'impression' => array(
                $url
            )
        );

        //
        $properties = json_decode($creative['PROPERTIES'], true);
        $properties['third_party'] = $third_party;


        $result = ADX\DAO\Creative::updateCreative(
            array(
                'properties' => json_encode($properties),
                'creative_id' => $creative_id
            )
        );
        if ($result) {
            ADX\PubSub::publish(
                'info_buyer',
                ADX\Model\Job::renderChannelName()[ADX\Model\Job::CHANNEL_CREATIVE],
                ADX\Model\Job::renderEventChannel()[ADX\Model\Job::CHANNEL_EVENT_DELETE],
                array(
                    'objId' => $creative_id,
                    'userId' => $creative['ADS_ID'],
                    'actorId' => $creative['MANAGER_ID'],
                    'actorType' => 'user',
                    'data' => array(),
                    'es' => array(
                        'object_id' => $creative_id,
                        'object_type' => ADX\Model\Common::TYPE_CREATIVE,
                        'network_id' => $creative['NETWORK_ID'],
                        'manager_id' => $creative['MANAGER_ID'],
                        'user_id' => $creative['ADS_ID']
                    ),
                    'fromComponent' => 'front-end'
                )
            );

            //Update es line item
            ADX\Utils::runJob(
                'info_buyer',
                'TASK\ElasticSearch',
                'indexObject',
                'doHighBackgroundTask',
                'admin_elastic',
                array(
                    'manager_id' => $creative['MANAGER_ID'],
                    'user_id' => $creative['ADS_ID'],
                    'network_id' => $creative['NETWORK_ID'],
                    'object_id' => $creative_id,
                    'object_type' => ADX\Model\Common::TYPE_CREATIVE,
                    'actor' => __FUNCTION__
                )
            );
        }


    }


    echo "DONE";
    exit();


    $arr_creative_id = array(582508753, 582508323);

    foreach ($arr_creative_id as $creative_id) {

        //get detail

        $result = ADX\DAO\Job::getCreativeDetail(
            array(
                'creative_id' => $creative_id,
                'columns' => implode(',', ADX\Model\Job::getColumnsCreative())
            )
        );

        $creative = $result[0];

        $properties = json_decode($creative['PROPERTIES'], true);

        if (isset($properties['overlay_balloon']) && $properties['overlay_balloon'] == 1) {

            //update creative
            unset($properties['overlay_balloon']);
            $result = ADX\DAO\Creative::updateCreative(
                array(
                    'properties' => json_encode($properties),
                    'creative_id' => $creative_id
                )
            );
            if ($result) {
                ADX\PubSub::publish(
                    'info_buyer',
                    ADX\Model\Job::renderChannelName()[ADX\Model\Job::CHANNEL_CREATIVE],
                    ADX\Model\Job::renderEventChannel()[ADX\Model\Job::CHANNEL_EVENT_DELETE],
                    array(
                        'objId' => $creative_id,
                        'userId' => $creative['ADS_ID'],
                        'actorId' => $creative['MANAGER_ID'],
                        'actorType' => 'user',
                        'data' => array(),
                        'es' => array(
                            'object_id' => $creative_id,
                            'object_type' => ADX\Model\Common::TYPE_CREATIVE,
                            'network_id' => $creative['NETWORK_ID'],
                            'manager_id' => $creative['MANAGER_ID'],
                            'user_id' => $creative['ADS_ID']
                        ),
                        'fromComponent' => 'front-end'
                    )
                );

                //Update es line item
                ADX\Utils::runJob(
                    'info_buyer',
                    'TASK\ElasticSearch',
                    'indexObject',
                    'doHighBackgroundTask',
                    'admin_elastic',
                    array(
                        'manager_id' => $creative['MANAGER_ID'],
                        'user_id' => $creative['ADS_ID'],
                        'network_id' => $creative['NETWORK_ID'],
                        'object_id' => $creative_id,
                        'object_type' => ADX\Model\Common::TYPE_CREATIVE,
                        'actor' => __FUNCTION__
                    )
                );
            }

        }


    }


    echo "DONE";
    exit();


    echo "DONE";
    exit();
    //
    function bulkData($params)
    {
        if (!isset($params['object'])) {
            echo 'object name is not exists';
            return;
        }

        $limit = isset($params['limit']) ? $params['limit'] : 500;
        $prefix = isset($params['prefix']) ? $params['prefix'] : '';
        $offset = 0;
        $running = true;

        $client = ADX\Elastic::getInstances('info_slave');

        //get config
        $config = ADX\Config::get('elastic');
        $hosts = $config['elastic']['adapters']['info_slave'];

        $object_info = isset($params['object']) ? ADX\Model\ElasticSearch::getObjectInfo($params['object']) : '';

        //prefix
        if (!$prefix) {
            $prefix = isset($hosts['prefix']) ? $hosts['prefix'] : '';
        }

        if ($object_info) {

            if (isset($params['mapping']) && $params['mapping']) {
                ADX\Model\ElasticSearch::mapping(array(
                    'object' => $params['object']
                ));
            }

            while ($running) {
                $result = call_user_func_array(array('ADX\\DAO\\ElasticSearch', $object_info['function_name']), array(array(
                    'limit' => $limit,
                    'offset' => $offset
                )));

                //nested column
                if (isset($object_info['nested']) && $object_info['nested']) {
                    switch ($params['object']) {
                        case 'campaign_topic':
                            if (isset($result) && !empty($result)) {
                                $arr_campaigns_id = array();
                                $arr_line_item_id = array();
                                $arr_topic_id = array();
                                foreach ($result as $resp) {
                                    if (isset($resp->lineitem_id)) {
                                        $arr_line_item_id[] = $resp->lineitem_id;
                                    }

                                    if (isset($resp->campaign_id)) {
                                        $arr_campaigns_id[] = $resp->campaign_id;
                                    }

                                    if (isset($resp->topic_id)) {
                                        $arr_topic_id[] = $resp->topic_id;
                                    }
                                }

                                //get lineitems
                                if (!empty($arr_line_item_id)) {
                                    $lineitems = ADX\Model\ElasticSearch::getDataInfo('lineitems', $arr_line_item_id);
                                }

                                //get campaigns
                                if (!empty($arr_campaigns_id)) {
                                    $campaigns = ADX\Model\ElasticSearch::getDataInfo('campaigns', $arr_campaigns_id);
                                }

                                //get topics
                                if (!empty($arr_topic_id)) {
                                    $topics = ADX\Model\ElasticSearch::getDataInfo('topics', $arr_topic_id);
                                }

                                foreach ($result as &$resp) {

                                    if (isset($lineitems[$resp->lineitem_id])) {
                                        $resp->lineitem_name = isset($lineitems[$resp->lineitem_id]['lineitem_name']) ? $lineitems[$resp->lineitem_id]['lineitem_name'] : '';
                                        $resp->lineitem_type_id = isset($lineitems[$resp->lineitem_id]['lineitem_type_id']) ? $lineitems[$resp->lineitem_id]['lineitem_type_id'] : '';
                                    }

                                    if (isset($campaigns[$resp->campaign_id])) {
                                        $resp->campaign_name = isset($campaigns[$resp->campaign_id]['campaign_name']) ? $campaigns[$resp->campaign_id]['campaign_name'] : '';
                                    }

                                    if (isset($topics[$resp->topic_id])) {
                                        $resp->topic_name_vn = isset($topics[$resp->topic_id]['topic_name_vn']) ? $topics[$resp->topic_id]['topic_name_vn'] : '';
                                        $resp->topic_name_en = isset($topics[$resp->topic_id]['topic_name_en']) ? $topics[$resp->topic_id]['topic_name_en'] : '';
                                    }
                                }
                            }

                            break;
                    }
                }

                if (isset($result) && !empty($result)) {
                    if (count($result) < $limit) {
                        $running = false;
                    }

                    $request = ['body' => []];
                    foreach ($result as $data) {
                        $id = '';
                        $arr_data_search = isset($object_info['data_search']) ? $object_info['data_search'] : '';

                        //
                        if (is_array($object_info['private_key'])) {
                            foreach ($object_info['private_key'] as $key) {
                                if (isset($data->{$key})) {
                                    $id .= $data->{$key};
                                }
                            }
                        }

                        $body = array();
                        foreach ($data as $key => $process_val) {
                            //
                            $process_key = strtolower($key);

                            if (in_array($process_key, ADX\Model\ElasticSearch::$arr_key_by_pass_db)) {
                                continue;
                            }

                            if (empty($id) && $process_key == $object_info['private_key']) {
                                $id = $process_val;
                            }

                            if (isset($arr_data_search[$process_key])) {
                                $arr_data_search[$process_key] = $process_val;
                            }

                            if (array_key_exists($process_key, $object_info['index'])) {
                                $body[$process_key] = trim($process_val);
                            }
                        }

                        //
                        $request['body'][] = [
                            'index' => [
                                '_index' => isset($prefix) && !empty($prefix) ? $prefix . '.' . $params['object'] : $params['object'],
                                '_type' => 'data',
                                '_id' => $id
                            ]
                        ];

                        //query contain
                        if (isset($object_info['data_raw']) && !empty($object_info['data_raw'])) {
                            foreach ($object_info['data_raw'] as $raw) {
                                $body[$raw . '_raw'] = isset($data->{$raw}) ? trim(ADX\Utils::remove_accent($data->{$raw})) : '';
                            }
                        }

                        //1 cot total_budget nhưung co 2 gia tri
                        if (property_exists($data, 'total_budget') && property_exists($data, 'daily_budget') && property_exists($data, 'revenue_type')) {
                            if ($data->revenue_type == 1) {
                                $body['budget'] = $data->total_budget;
                            } else {
                                $body['budget'] = $data->daily_budget;
                            }
                        }

                        $body['data_search'] = !empty($arr_data_search) ? trim(ADX\Utils::remove_accent(implode(' ', array_values($arr_data_search)))) : '';

                        //nested column
                        if (isset($object_info['nested']) && $object_info['nested']) {
                            switch ($params['object']) {
                                case 'campaign_topic':

                                    //lineitems & lineitem_type_id
                                    $body['lineitems'] = array(
                                        'lineitem_name' => isset($data->lineitem_name) ? $data->lineitem_name : '',
                                        'lineitem_name_raw' => isset($data->lineitem_name) ? trim(ADX\Utils::remove_accent($data->lineitem_name)) : ''
                                    );

                                    $body['lineitem_type'] = array(
                                        'lineitem_type_id' => isset($data->lineitem_type_id) ? $data->lineitem_type_id : 0,
                                    );

                                    //campaigns
                                    $body['campaigns'] = array(
                                        'campaign_name' => isset($data->campaign_name) ? $data->campaign_name : '',
                                        'campaign_name_raw' => isset($data->campaign_name) ? trim(ADX\Utils::remove_accent($data->campaign_name)) : ''
                                    );

                                    //topics

                                    $body['topics'] = array(
                                        'topic_name_vn' => isset($data->topic_name_vn) ? $data->topic_name_vn : '',
                                        'topic_name_vn_raw' => isset($data->topic_name_vn) ? trim(ADX\Utils::remove_accent($data->topic_name_vn)) : '',
                                        'topic_name_en' => isset($data->topic_name_en) ? $data->topic_name_en : '',
                                        'topic_name_en_raw' => isset($data->topic_name_en) ? trim(ADX\Utils::remove_accent($data->topic_name_en)) : ''
                                    );

                                    break;
                            }
                        }

                        $request['body'][] = $body;
                    }

                    $responses = $client->bulk($request);

                    if (isset($responses['errors']) && $responses['errors'] == 1) {
                        $arr_data['responses'] = $responses;

                    }

                    //Update params
                    $offset += $limit;

                } else {
                    $running = false;
                }
            }
        } else {
            echo 'object is error';
        }
    }

    bulkData(array(
        'object' => 'campaign_section',
        'limit' => 500,
        'mapping' => true
    ));


    //call job client
    /*ADX\Utils::runJob(
        'info',
        'TASK\ElasticSearch',
        'bulkData',
        'doHighBackgroundTask',
        'admin_process',
        array(
            'object' => 'browsers',
            'limit' => 500
        )
    );*/

    echo 'Done';
    exit;
} catch (Exception $ex) {
    echo $ex->getMessage() . ' - ' . $ex->getCode();
}