<?php
/**
 * Created by PhpStorm.
 * User: tuandv
 * Date: 4/28/16
 * Time: 10:03
 */

namespace ADX\Model;

use ADX;
use ADX\Elastic;
use ADX\Entity;
use ADX\Business;
use ADX\Exception;
use ADX\Utils;
use ADX\Nosql;
use ADX\DAO;
use ADX\Model;

class ElasticSearch extends Entity\ElasticSearch
{
    //key by pass
    public static $arr_key_by_pass_db = [
        'num_row',
        'found_rows'
    ];

    public static $data_search_package = [
        'package_id' => '',
        'package_name' => ''
    ];

    //index
    public static $packages = [
        'package_id' => [
            'type' => 'long',
            'index' => 'not_analyzed'
        ],
        'network_id' => [
            'type' => 'long',
            'index' => 'not_analyzed',
        ],
        'user_id' => [
            'type' => 'long',
            'index' => 'not_analyzed'
        ],
        'package_name' => [
            'type' => 'string',
            'index' => 'analyzed',
            'fields' => [
                'raw' => [
                    'type' => 'string',
                    'index' => 'not_analyzed',
                ]
            ]
        ],
        'package_name_raw' => [
            'type' => 'string',
            'index' => 'not_analyzed',
        ],
        'payment_model' => [
            'type' => 'long',
            'index' => 'not_analyzed',
        ],
        'from_date' => [
            'type' => 'date',
            'format' => 'yyyy-MM-dd HH:mm:ss',
            'index' => 'not_analyzed'
        ],
        'to_date' => [
            'type' => 'date',
            'format' => 'yyyy-MM-dd HH:mm:ss',
            'index' => 'not_analyzed'
        ],
        'price' => [
            'type' => 'float',
            'index' => 'not_analyzed',
        ],
        'properties' => [
            'type' => 'string',
            'index' => 'not_analyzed',
        ],
        'ctime' => [
            'type' => 'date',
            'format' => 'yyyy-MM-dd HH:mm:ss',
            'index' => 'not_analyzed'
        ],
        'utime' => [
            'type' => 'date',
            'format' => 'yyyy-MM-dd HH:mm:ss',
            'index' => 'not_analyzed'
        ],
        'package_type' => [
            'type' => 'long',
            'index' => 'not_analyzed',
        ],
        'is_bidding' => [
            'type' => 'long',
            'index' => 'not_analyzed',
        ],
        'discount' => [
            'type' => 'float',
            'index' => 'not_analyzed',
        ],
        'price_buy' => [
            'type' => 'float',
            'index' => 'not_analyzed',
        ],
        'data_search' => [
            'type' => 'string',
            'index' => 'analyzed'
        ]
    ];


    //Return array object run cronjob
    public static function getArrObject()
    {
        return array('lineitems', 'campaigns', 'creatives', 'creative_object', 'interests', 'topics', 'inmarkets',
            'browsers', 'locations', 'os', 'devices', 'os_versions', 'users', 'websites', 'sections', 'zones',
            'carriers', 'remarketing', 'lineitem_type', 'ages', 'label', 'lineitem_label', 'creative_label',
            'campaign_label', 'merchant_cates', 'merchant_files', 'merchant_website', 'merchant_prices', 'cates',
            'channels', 'contracts', 'network_users');
    }

    public static function getObjectInfo($object_name)
    {
        $data = array(
            'index' => '',
            'function_name' => '',
            'private_key' => '',
            'data_search' => array()
        );

        switch ($object_name) {
            case 'deal':
                $data = array(
                    'index' => self::$packages,  //Kieu du lieu index data
                    'function_name' => 'getPackages', //Model get all data
                    'private_key' => 'package_id', //Private key cua object, thuong la ID
                    'data_raw' => array('package_name'), //Nhung cot muon search theo kieu contain
                    'data_search' => self::$data_search_package, //Cot data_search ket hop nhung column nao
                    'data_search_raw' => 'package_name_raw', //Cot search raw theo name
                    'model' => 'Package', //Model
                    'default_column' => 'PACKAGE_ID, PACKAGE_NAME', //Column default
                    'refresh_interval' => '1s'
                );
                break;
        }

        return $data;
    }

    public static function getDataInfo($object, $arr_object_id = array())
    {
        try {
            $rows = array();
            $object_info = self::getObjectInfo($object);

            if (isset($object_info['index']) && !empty($object_info['index']) && !empty($arr_object_id)) {
                $object_info = ElasticSearch::getObjectInfo($object);

                $client = Elastic::getInstances('info_slave');

                //get config
                $config = ADX\Config::get('elastic');
                $hosts = $config['elastic']['adapters']['info_slave'];

                $should = array();
                if (!empty($arr_object_id) && count($arr_object_id) > 1024) {
                    $index = 0;
                    $arr_id = array();
                    foreach ($arr_object_id as $object_id) {
                        if ($index >= 1000) {
                            $index = 0;
                            $should[] = array(
                                'query_string' => array(
                                    'default_field' => $object_info['private_key'],
                                    'query' => implode(' ', $arr_id)
                                )
                            );

                            $arr_id = array();

                        } else {
                            $index++;
                            $arr_id[] = $object_id;
                        }
                    }
                } else {
                    $should = array(
                        'terms' => array(
                            $object_info['private_key'] => $arr_object_id
                        )
                    );
                }


                $body = [
                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object : $object,
                    'type' => 'data',
                    'body' => [
                        'from' => 0,
                        'size' => 1000,
                        'query' => [
                            'bool' => [
                                'should' => $should
                            ]
                        ]
                    ]
                ];

                $results = $client->search($body);

                if (isset($results['hits']['hits']) && !empty($results['hits']['hits'])) {
                    foreach ($results['hits']['hits'] as $hits) {
                        $rows[$hits['_source'][$object_info['private_key']]] = !empty($hits['_source']) ? $hits['_source'] : array();
                    }
                }
            }

            return $rows;

        } catch (\Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function getDataInfoRM($object, $arr_object_id = array())
    {
        try {
            $rows = array();
            $object_info = self::getObjectInfo($object);

            if (isset($object_info['index']) && !empty($object_info['index']) && !empty($arr_object_id)) {
                $object_info = ElasticSearch::getObjectInfo($object);

                $client = Elastic::getInstances('info_slave');

                //get config
                $config = ADX\Config::get('elastic');
                $hosts = $config['elastic']['adapters']['info_slave'];

                $should = array();
                if (!empty($arr_object_id) && count($arr_object_id) > 1024) {
                    $index = 0;
                    $arr_id = array();
                    foreach ($arr_object_id as $object_id) {
                        if ($index >= 1000) {
                            $index = 0;
                            $should[] = array(
                                'query_string' => array(
                                    'default_field' => 'remarketing_id',
                                    'query' => implode(' ', $arr_id)
                                )
                            );

                            $arr_id = array();

                        } else {
                            $index++;
                            $arr_id[] = $object_id;
                        }
                    }
                } else {
                    $should = array(
                        'terms' => array(
                            'remarketing_id' => $arr_object_id
                        )
                    );
                }


                $body = [
                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object : $object,
                    'type' => 'data',
                    'body' => [
                        'from' => 0,
                        'size' => 1000,
                        'query' => [
                            'bool' => [
                                'should' => $should
                            ]
                        ]
                    ]
                ];

                $results = $client->search($body);

                if (isset($results['hits']['hits']) && !empty($results['hits']['hits'])) {
                    foreach ($results['hits']['hits'] as $hits) {
                        $rows[$hits['_source']['remarketing_id']] = !empty($hits['_source']) ? $hits['_source'] : array();
                    }
                }
            }

            return $rows;

        } catch (\Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function getPerformanceInfo($object_name, $rows = array())
    {
        //
        $redis = Nosql\Redis::getInstance('real_time');
        //
        $results = array();
        $object_info = self::getObjectInfo($object_name);

        if (empty($object_info['index'])) {
            return false;
        }

        $list_object_id = array();
        if (!empty($rows)) {
            foreach ($rows as $object) {

                if (!is_array($object_info['private_key'])) {
                    if (isset($object[$object_info['private_key']])) {
                        $list_object_id[] = $object[$object_info['private_key']];
                    }

                    //
                    switch ($object_name) {
                        case 'ages':
                            if (isset($object['age_range_id'])) {
                                $list_object_id[] = $object['age_range_id'];
                            }
                            break;
                    }
                } else {
                    $object_id = '';
                    foreach ($object_info['private_key'] as $key) {
                        if (isset($object[$key])) {
                            $object_id .= $object[$key];
                        }

                        //
                        switch ($object_name) {
                            case 'campaign_demographic':
                                if ($key == 'demographic_id') {
                                    if (isset($object['age_range_id'])) {
                                        $object_id .= $object['age_range_id'];
                                    }

                                    if (isset($object['gender_id'])) {
                                        $object_id .= $object['gender_id'];
                                    }
                                }
                                break;
                        }
                    }
                    $list_object_id[] = $object_id;
                }
            }
        }

        if (!empty($list_object_id)) {
            $list_object_id = array_values(array_unique($list_object_id));
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $should = array();

            $arr_object_id = array_chunk($list_object_id, 1000, true);

            if (!empty($arr_object_id)) {

                //
                $default_field = $object_info['private_key'];
                switch ($object_name) {
                    case 'campaign_topic':
                    case 'campaign_section':
                    case 'campaign_audience':
                    case 'campaign_demographic':
                        $default_field = '_id';
                        break;
                }

                foreach ($arr_object_id as $object_id) {
                    $should[] = array(
                        "terms" => array(
                            $default_field => $object_id
                        )
                    );
                }
            }

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object_name : $object_name,
                'type' => 'data',
                'body' => [
                    'from' => 0,
                    'size' => 1000,
                    'query' => [
                        'bool' => [
                            'should' => $should
                        ]
                    ]
                ]
            ];

            //
            $query = Utils::buildQueryESMonitor($body);
            $id = md5($query . uniqid(microtime(true)));

            //
            $time_begin = microtime(true);
//            $redis->publish('adx_v3:query:monitor', json_encode(array(
//                'instance' => 'elastic',
//                'id' => $id,
//                'query' => $query,
//                'begin' => $time_begin
//            )));
            //
            $results = $client->search($body);
            //
            $redis->publish('adx_v3:query:monitor', json_encode(array(
                'instance' => 'elastic',
                'lid' => isset($params['log_api_id']) ? $params['log_api_id'] : '',
                'pid' => getmypid(),
                'id' => $id,
                'query' => $query,
                'begin' => $time_begin,
                'end' => microtime(true)
            )));
            //
            Nosql\Redis::closeConnection('real_time');
        }

        $data = array();
        if (isset($results['hits']['hits']) && !empty($results['hits']['hits'])) {
            foreach ($results['hits']['hits'] as $hits) {
                if (!is_array($object_info['private_key'])) {
                    $data[$hits['_source'][$object_info['private_key']]] = !empty($hits['_source']) ? $hits['_source'] : array();
                } else {
                    $object_id = '';
                    foreach ($object_info['private_key'] as $key) {
                        if (isset($hits['_source'][$key])) {
                            $object_id .= $hits['_source'][$key];
                        }
                    }

                    $data[$object_id] = !empty($hits['_source']) ? $hits['_source'] : array();
                }
            }
        }

        return $data;
    }

    public static function performaceMappingRemarketingInfo($rows = array())
    {
        if (!empty($rows)) {
            //get config
            foreach ($rows as $key => $row) {
                foreach ($row as $key_sub => $row_sub) {
                    $system_cate_id = '';
                    switch ($key_sub) {
                        case "rm_type_id":
                            $rows[$key]['rm_type'] = '';
                            $rows[$key]['rm_type_parent'] = '';
                            if (isset($row['rm_type_id'])) {

                                if (!is_null($row['rm_type_id'])) {

                                    $rm_type_detail = Model\ElasticSearch::getDataInfo('remarketing_types', array($row['rm_type_id']));

                                    $rows[$key]['rm_type'] = isset($rm_type_detail[$row['rm_type_id']]['group_type']) ? $rm_type_detail[$row['rm_type_id']]['group_type'] : '';

                                    $type_parent = isset($rm_type_detail[$row['rm_type_id']]['parent_id']) ? $rm_type_detail[$row['rm_type_id']]['parent_id'] : '';
                                    if (!empty($type_parent)) {
                                        $rm_type_parent = Model\ElasticSearch::getDataInfo('remarketing_types', array($type_parent));
                                    }
                                    $rows[$key]['rm_type_parent'] = '';
                                    if ($row['dynamic_type'] != 'Audience') {
                                        $rows[$key]['rm_type_parent'] = isset($rm_type_parent[$rm_type_detail[$row['rm_type_id']]['parent_id']]['rm_type_name']) ? $rm_type_parent[$rm_type_detail[$row['rm_type_id']]['parent_id']]['rm_type_name'] : '';
                                    }
                                }

                            }
                            break;
                        case "dynamic_type":
                            $is_default = 0;
                            if (isset($row['rm_type_id'])) {
                                if (!is_null($row['rm_type_id'])) {
                                    $rm_type_detail = Model\ElasticSearch::getDataInfo('remarketing_types', array($row['rm_type_id']));

                                    $str = '';

                                    if ($row['dynamic_type'] != 'Audience') {
                                        $str = isset($rm_type_detail[$row['rm_type_id']]['description']) ? $rm_type_detail[$row['rm_type_id']]['description'] : '';
                                    }
                                    $rows[$key]['object_list'] = $str;
                                }
                            }
                            switch ($row['dynamic_type']) {
                                case 'all':
                                    $is_default = 1;
                                    break;
                                case 'product':
                                    $is_default = 1;
                                    break;
                                case 'cart':
                                    $is_default = 1;
                                    break;
                                case 'purchase':
                                    $is_default = 1;
                                    break;
                                case 'general':
                                    $is_default = 1;
                                    break;
                                case 'Audience':
                                    $is_default = 1;
                                    break;
                                case 'private':
                                    $is_default = 1;
                                    break;
                            }
                            $rows[$key]['is_default'] = $is_default;
                            break;
                    }
                }
            }
        }
        return $rows;
    }

    public static function getPerformanceLabelInfo($object_name, $rows = array())
    {
        if (!empty($rows)) {
            $arr_object_id = array();
            foreach ($rows as $row) {
                switch ($object_name) {
                    case 'lineitems':
                        if (isset($row['lineitem_id'])) {
                            $arr_object_id[] = $row['lineitem_id'];
                        }
                        break;
                    case 'campaigns':
                        if (isset($row['campaign_id'])) {
                            $arr_object_id[] = $row['campaign_id'];
                        }
                        break;
                    case 'creatives':
                        if (isset($row['creative_id'])) {
                            $arr_object_id[] = $row['creative_id'];
                        }
                        break;
                    case 'remarketing':
                        if (isset($row['remarketing_id'])) {
                            $arr_object_id[] = $row['remarketing_id'];
                        }
                        break;
                }
            }

            //
            if (!empty($arr_object_id)) {
                $object_label = 'lineitem_label';
                $object_id = 'lineitem_id';

                switch ($object_name) {
                    case 'lineitems':
                        $object_label = 'lineitem_label';
                        $object_id = 'lineitem_id';
                        break;
                    case 'campaigns':
                        $object_label = 'campaign_label';
                        $object_id = 'campaign_id';
                        break;
                    case 'remarketings':
                        $object_label = 'remarketing_label';
                        $object_id = 'remarketing_id';
                        break;
                    case 'creatives':
                        $object_label = 'creative_label';
                        $object_id = 'creative_id';
                        break;
                    case 'remarketing':
                        $object_label = 'remarketing_label';
                        $object_id = 'remarketing_id';
                }

                $client = Elastic::getInstances('info_slave');

                //get config
                $config = ADX\Config::get('elastic');
                $hosts = $config['elastic']['adapters']['info_slave'];

                $body = [
                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object_label : $object_label,
                    'type' => 'data',
                    'body' => [
                        'from' => 0,
                        'size' => 1000,
                        'query' => [
                            'bool' => [
                                'must' => array(
                                    "terms" => array(
                                        $object_id => $arr_object_id
                                    )
                                )
                            ]
                        ]
                    ]
                ];

                $results = self::transform($client->search($body));

                if (isset($results['data']) && !empty($results['data'])) {
                    $arr_label_id = array();
                    $arr_object_label = array();
                    foreach ($results['data'] as $label) {
                        if (isset($label['label_id'])) {
                            $arr_label_id[] = $label['label_id'];
                        }

                        if (isset($label[$object_id])) {
                            $arr_object_label[$label[$object_id]][] = $label['label_id'];
                        }
                    }

                    //
                    if (!empty($arr_label_id)) {
                        $labels = self::getDataInfo('label', $arr_label_id);


                        //Mapping label with object
                        foreach ($rows as &$row) {

                            if (isset($row[$object_id]) && isset($arr_object_label[$row[$object_id]])) {
                                $object_label_id = $arr_object_label[$row[$object_id]];

                                foreach ($object_label_id as $label_id) {

                                    if (isset($labels[$label_id])) {

                                        $row['label'][] = array(
                                            'label_id' => isset($labels[$label_id]['label_id']) ? $labels[$label_id]['label_id'] : '',
                                            'label_name' => isset($labels[$label_id]['label_name']) ? $labels[$label_id]['label_name'] : '',
                                            'label_color' => isset($labels[$label_id]['color']) ? $labels[$label_id]['color'] : '',
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return $rows;
    }

    public static function getSystemCateInfo($object_name, $rows = array(), $custom_object = '', $custom_search_string = '')
    {
        $results = array();
        $object_info = self::getObjectInfo($object_name);
        if (!isset($object_info['index'])) {
            return 0;
        }
        $list_id = '';

        foreach ($rows as $key => $object) {
            if (in_array($key, $object_info['private_key'])) {
                $list_id .= $object;
            }
        }
        if (!empty($list_id)) {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $should = array();
            if (empty($custom_object)) {
                $should[] = array(
                    'query_string' => array(
                        'default_field' => '_id',
                        'query' => $list_id
                    )
                );
            } else {
                $should[] = array(
                    'query_string' => array(
                        'default_field' => $custom_object,
                        'query' => $custom_search_string
                    )
                );
            }

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object_name : $object_name,
                'type' => 'data',
                'body' => [
                    'from' => 0,
                    'size' => 1000,
                    'query' => [
                        'bool' => [
                            'should' => $should
                        ]
                    ]
                ]
            ];
            $results = $client->search($body);
        }
        $data = array();
        if (isset($results['hits']['hits']) && !empty($results['hits']['hits'])) {
            foreach ($results['hits']['hits'] as $hits) {
                $data[$hits['_id']][] = !empty($hits['_source']) ? $hits['_source'] : array();
            }
        }
        return $data;
    }

    public static function getObjectById($object_name, $rows = array())
    {
        $results = array();
        $object_info = self::getObjectInfo($object_name);
        if (!isset($object_info['index'])) {
            return 0;
        }

        $list_object_id = array();
        $list_id = '';
        if (!empty($rows)) {

            foreach ($rows as $object) {
                if (is_array($object_info['private_key'])) {
                    foreach ($object_info['private_key'] as $k => $v) {
                        if (isset($object[$v])) {
                            $list_id .= $object[$v];
                        }
                    }
                    $list_object_id[] = $list_id;
                } else {
                    if (isset($object[$object_info['private_key']])) {
                        $list_object_id[] = $object[$object_info['private_key']];

                    }
                }
            }
        }

        if (!empty($list_object_id)) {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $should = array();
            if (!empty($list_object_id) && count($list_object_id) > 1024) {
                $index = 0;
                $arr_id = array();
                foreach ($list_object_id as $object_id) {
                    if ($index >= 1000) {
                        $index = 0;
                        $should[] = array(
                            'query_string' => array(
                                'default_field' => '_id',
                                'query' => implode(' ', $arr_id)
                            )
                        );

                        $arr_id = array();

                    } else {
                        $index++;
                        $arr_id[] = $object_id;
                    }
                }
            } else {
                $should = array(
                    'query_string' => array(
                        'default_field' => '_id',
                        'query' => implode(' ', $list_object_id)
                    )
                );
            }

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object_name : $object_name,
                'type' => 'data',
                'body' => [
                    'from' => 0,
                    'size' => 1000,
                    'query' => [
                        'bool' => [
                            'should' => $should
                        ]
                    ]
                ]
            ];
            $results = $client->search($body);

        }
        $data = array();
        if (isset($results['hits']['hits']) && !empty($results['hits']['hits'])) {
            foreach ($results['hits']['hits'] as $hits) {
                $data[$hits['_id']][] = !empty($hits['_source']) ? $hits['_source'] : array();
            }
        }
        return $data;
    }

    public static function getInfo($object, $arr_object_id = array())
    {
        $rows = array();
        $object_info = self::getObjectInfo($object);
        if (isset($object_info['index']) && !empty($object_info['index']) && !empty($arr_object_id)) {
            $object_info = ElasticSearch::getObjectInfo($object);

            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $should = array();
            if (!empty($arr_object_id) && count($arr_object_id) > 1024) {
                $index = 0;
                $arrID = array();
                foreach ($arr_object_id as $object_id) {
                    if ($index >= 1000) {
                        $index = 0;
                        $should[] = array(
                            'query_string' => array(
                                'default_field' => $object_info['private_key'],
                                'query' => implode(' ', $arrID)
                            )
                        );

                        $arrID = array();

                    } else {
                        $index++;
                        $arrID[] = $object_id;
                    }
                }
            } else {
                $should = array(
                    'query_string' => array(
                        'default_field' => $object_info['private_key'],
                        'query' => implode(' ', $arr_object_id)
                    )
                );
            }

            $params = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object : $object,
                'type' => 'data',
                'body' => [
                    'from' => 0,
                    'size' => 1000,
                    'query' => [
                        'bool' => [
                            'should' => $should
                        ]
                    ]
                ]
            ];

            $results = $client->search($params);

            if (isset($results['hits']['hits']) && !empty($results['hits']['hits'])) {
                foreach ($results['hits']['hits'] as $hits) {
                    $rows[] = !empty($hits['_source']) ? $hits['_source'] : array();
                }
            }
        }

        return $rows;
    }

    public static function getApiLogInfo($object_name, $rows = array(), $main_key = '')
    {
        $obj_es = 'api_logs';
        $object_info = self::getObjectInfo($obj_es);
        $key = 'api_id';
        if (!isset($object_info['index'])) {
            return 0;
        }

        $list_object_id = array();

        if (!empty($rows)) {
            foreach ($rows as $object) {
                if (isset($object[$key])) {
                    $list_object_id[] = $object[$key];
                }
            }
        }

        if (!empty($list_object_id)) {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $should = array();
            if (!empty($list_object_id) && count($list_object_id) > 1024) {
                $index = 0;
                $arr_id = array();
                foreach ($list_object_id as $object_id) {
                    if ($index >= 1000) {
                        $index = 0;
                        $should[] = array(
                            'query_string' => array(
                                'default_field' => $key,
                                'query' => implode(' ', $arr_id)
                            )
                        );

                        $arr_id = array();

                    } else {
                        $index++;
                        $arr_id[] = $object_id;
                    }
                }
            } else {
                $should = array(
                    'query_string' => array(
                        'default_field' => $key,
                        'query' => implode(' ', $list_object_id)
                    )
                );
            }

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object_name : $object_name,
                'type' => 'data',
                'body' => [
                    'from' => 0,
                    'size' => 1000,
                    'query' => [
                        'bool' => [
                            'should' => $should
                        ]
                    ]
                ]
            ];

            $results = $client->search($body);
        }
        $data = array();
        if (isset($results['hits']['hits']) && !empty($results['hits']['hits'])) {
            foreach ($results['hits']['hits'] as $hits) {
                $data[$hits['_source'][$key]][] = !empty($hits['_source']) ? $hits['_source'] : array();
            }
        }
        return $data;
    }

    public static function getSearchData($params)
    {
        try {
            $object_info = isset($params['object']) ? self::getObjectInfo($params['object']) : '';
            $limit = isset($params['limit']) ? $params['limit'] : 1000;
            $offset = isset($params['offset']) ? $params['offset'] : 0;

            if (isset($object_info['index']) && !empty($object_info['index'])) {
                $client = Elastic::getInstances('info_slave');

                //get config
                $config = ADX\Config::get('elastic');
                $hosts = $config['elastic']['adapters']['info_slave'];

                if (isset($params['search']) && !empty($params['search'])) {

                    //search value
                    $must = array();
                    $must_not = array();
                    if (isset($object_info['data_search_raw'])) {
                        array_push($must, array(
                            "wildcard" => array(
                                $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                            )
                        ));
                    }
                    //filter theo tung object
                    switch ($params['object']) {
                        case 'lineitems':
                        case 'campaigns':
                        case 'creatives':
                            $should = array();
                            $must = array();

                            //should filter
                            if (isset($params['should']) && !empty($params['should'])) {
                                foreach (json_decode($params['should'], true) as $field => $row) {
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($should, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                //
                                                array_push($should, array(
                                                    'query_string' => array(
                                                        'default_field' => $field,
                                                        'query' => implode(' ', $value)
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            //must filter
                            if (isset($params['must']) && !empty($params['must'])) {
                                foreach (json_decode($params['must'], true) as $field => $row) {
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($must, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                array_push($must, array(
                                                    'query_string' => array(
                                                        'default_field' => $field,
                                                        'query' => implode(' ', $value)
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            //
                            if (isset($params['list_user_id']) && !empty($params['list_user_id'])) {
                                array_push($must, array(
                                    'query_string' => array(
                                        'default_field' => 'ads_id',
                                        'query' => implode(' ', $params['list_user_id'])
                                    )
                                ));
                            }

                            array_push($must,
                                array(
                                    'range' => array(
                                        'lineitem_id' => array(
                                            'gte' => 0,
                                        )
                                    )
                                ),
                                array(
                                    "term" => array(
                                        'network_id' => $params['network_id']
                                    )
                                ),
                                array(
                                    "range" => array(
                                        'operational_status' => array(
                                            'gt' => 0
                                        )
                                    )
                                )
                            );

                            //operational status lineitem, campaign, creative
                            if (in_array($params['object'], ['lineitems', 'campaigns'])) {
                                array_push($must_not, array(
                                    "terms" => array(
                                        'operational_status' => [0, 80]
                                    )
                                ));

                            } else {
                                array_push($must, array(
                                    'range' => array(
                                        'operational_status' => array(
                                            'gte' => 0,
                                            'lt' => 80
                                        )
                                    )
                                ));
                            }

                            if (is_numeric(Utils::remove_accent($params['search']))) {
                                $should = array(
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, $must, array(
                                                    array(
                                                        'wildcard' => array(
                                                            $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    ),
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, $must, array(
                                                    array(
                                                        'wildcard' => array(
                                                            'data_search' => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    )
                                );

                            } else {
                                $should = array(
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, $must, array(
                                                    array(
                                                        'wildcard' => array(
                                                            $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    )
                                );
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'query' => [
                                        'bool' => [
                                            'should' => $should,
                                            'must_not' => $must_not
                                        ]
                                    ]
                                ]
                            ];

                            break;
                        case 'sections':
                            if (isset($params['sort'])) {
                                //sort by lineitem name
                                $request_sort = array(
                                    array(
                                        strtolower($params['sort']) => array(
                                            'order' => strtolower($params['az'])
                                        )
                                    )
                                );
                            } else {
                                $request_sort = array(
                                    array(
                                        $object_info['private_key'] => array(
                                            'order' => 'desc'
                                        )
                                    )
                                );
                            }

                            $should = array();
                            $must = array();

                            //should filter
                            if (isset($params['should']) && !empty($params['should'])) {
                                foreach (json_decode($params['should'], true) as $field => $row) {
                                    if ($params['object'] == 'sections') {
                                        $field = 'section_parent';
                                    }
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                if ($params['object'] == 'inmarkets' && $field == 'parent_id' && $value == 0) {
                                                    $value = '';
                                                }

                                                array_push($should, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                //
                                                array_push($should, array(
                                                    "terms" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            //must filter
                            if (isset($params['must']) && !empty($params['must'])) {
                                foreach (json_decode($params['must'], true) as $field => $row) {
                                    if ($params['object'] == 'sections') {
                                        $field = 'section_parent';
                                    }
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {

                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($must, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));

                                                break;
                                        }
                                    }
                                }
                            }

                            if (!isset($params['website'])) {
                                //get website section
                                $request = [
                                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'websites' : 'websites',
                                    'type' => 'data',
                                    'body' => [
                                        'from' => 0,
                                        'size' => 10000,
                                        'query' => [
                                            'bool' => [
                                                'must' => array(
                                                    array(
                                                        "query_string" => array(
                                                            'default_field' => 'network_id',
                                                            'query' => $params['network_id']
                                                        )
                                                    ),
                                                    array(
                                                        "query_string" => array(
                                                            'default_field' => 'status',
                                                            'query' => 3
                                                        )
                                                    ),
                                                    array(
                                                        "query_string" => array(
                                                            'default_field' => 'app_type',
                                                            'query' => 1
                                                        )
                                                    )
                                                )
                                            ]
                                        ]
                                    ]
                                ];

                                $result = $client->search($request);

                                $rows = self::transform($result);

                                $website_id = array();
                                if (isset($rows['data']) && !empty($rows['data'])) {
                                    foreach ($rows['data'] as $website) {
                                        $website_id[] = $website['website_id'];
                                    }
                                }

                                if (!empty($website_id)) {
                                    array_push($must, array(
                                        "terms" => array(
                                            'website_id' => (array)$website_id
                                        )
                                    ));
                                }
                            }

                            array_push($must,
                                array(
                                    "query_string" => array(
                                        'default_field' => 'network_id',
                                        'query' => $params['network_id']
                                    )
                                ),
                                array(
                                    "query_string" => array(
                                        'default_field' => 'status',
                                        'query' => 1
                                    )
                                ),
                                array(
                                    "query_string" => array(
                                        'default_field' => 'section_type',
                                        'query' => 1
                                    )
                                )
                            );

                            if (isset($params['section_price'])) {
                                array_push($must,
                                    array(
                                        "terms" => array(
                                            'section_id' => (array)$params['section_price']
                                        )
                                    )
                                );
                            }

                            if (is_numeric(Utils::remove_accent($params['search']))) {
                                $should = array(
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, $must, array(
                                                    array(
                                                        'wildcard' => array(
                                                            $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    ),
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, $must, array(
                                                    array(
                                                        'wildcard' => array(
                                                            'data_search' => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    )
                                );
                            } else {
                                $should = array(
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, $must, array(
                                                    array(
                                                        'wildcard' => array(
                                                            $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    )
                                );
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => $request_sort,
                                    'query' => [
                                        'bool' => [
                                            'should' => $should
                                        ]
                                    ]
                                ]
                            ];

                            break;
                        case 'topics':
                            $should = array();

                            if (is_numeric(Utils::remove_accent($params['search']))) {
                                $should = array(
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, array(
                                                    array(
                                                        'wildcard' => array(
                                                            $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    ),
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, array(
                                                    array(
                                                        'wildcard' => array(
                                                            'data_search' => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    )
                                );
                            } else {
                                $should = array(
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, array(
                                                    array(
                                                        'wildcard' => array(
                                                            $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    )
                                );
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'query' => [
                                        'bool' => [
                                            'should' => $should
                                        ]
                                    ]
                                ]
                            ];

                            break;
                        case 'conversion':
                            array_push($must, array(
                                array(
                                    "term" => array(
                                        'user_id' => $params['user_id']
                                    )
                                ),
                                array(
                                    "term" => array(
                                        'network_id' => $params['network_id']
                                    )
                                )
                            ));
                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'query' => [
                                        'bool' => [
                                            'must' => $must
                                        ]
                                    ]
                                ]
                            ];

                            break;
                        case 'remarketing':
                            $should = array();
                            $rm_status = isset($params['rm_status']) && is_array($params['rm_status']) && !empty($params['rm_status'])
                                ? $params['rm_status'] : [1, 2, 80];

                            if (is_numeric(Utils::remove_accent($params['search']))) {
                                $should = array(
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, array(
                                                    array(
                                                        "term" => array(
                                                            'network_id' => $params['network_id']
                                                        )
                                                    ),
                                                    array(
                                                        'wildcard' => array(
                                                            $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ),
                                                    array(
                                                        "terms" => array(
                                                            'rm_status' => $rm_status
                                                        )
                                                    ),
                                                    array(
                                                        "bool" => array(
                                                            "should" => array(
                                                                array(
                                                                    "term" => array(
                                                                        'user_id' => $params['user_id']
                                                                    )
                                                                ),
                                                                array(
                                                                    "term" => array(
                                                                        'owner_id' => $params['user_id']
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    ))
                                            )
                                        )
                                    ),
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, array(
                                                    array(
                                                        'wildcard' => array(
                                                            'data_search' => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ),
                                                    array(
                                                        "terms" => array(
                                                            'rm_status' => $rm_status
                                                        )
                                                    ),
                                                    array(
                                                        "bool" => array(
                                                            "should" => array(
                                                                array(
                                                                    "term" => array(
                                                                        'user_id' => $params['user_id']
                                                                    )
                                                                ),
                                                                array(
                                                                    "term" => array(
                                                                        'owner_id' => $params['user_id']
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    ))
                                            )
                                        )
                                    )
                                );
                            } else {
                                $should = array(
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, array(
                                                    array(
                                                        "term" => array(
                                                            'network_id' => $params['network_id']
                                                        )
                                                    ),
                                                    array(
                                                        'wildcard' => array(
                                                            $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ),
                                                    array(
                                                        "terms" => array(
                                                            'rm_status' => $rm_status
                                                        )
                                                    ),
                                                    array(
                                                        "bool" => array(
                                                            "should" => array(
                                                                array(
                                                                    "term" => array(
                                                                        'user_id' => $params['user_id']
                                                                    )
                                                                ),
                                                                array(
                                                                    "term" => array(
                                                                        'owner_id' => $params['user_id']
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    ))
                                            )
                                        )
                                    )
                                );
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'query' => [
                                        'bool' => [
                                            'should' => $should
                                        ]
                                    ]
                                ]
                            ];

                            break;
                        default:
                            $must = array();
                            $should = array();

                            //must filter
                            if (isset($params['must']) && !empty($params['must'])) {
                                foreach (json_decode($params['must'], true) as $field => $row) {
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($must, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));

                                                break;
                                            case 'in':
                                                //
                                                array_push($must, array(
                                                    'query_string' => array(
                                                        'default_field' => $field,
                                                        'query' => implode(' ', $value)
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            //should filter
                            if (isset($params['should']) && !empty($params['should'])) {
                                foreach (json_decode($params['should'], true) as $field => $row) {
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($should, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                //
                                                array_push($should, array(
                                                    'query_string' => array(
                                                        'default_field' => $field,
                                                        'query' => implode(' ', $value)
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            if (is_numeric(Utils::remove_accent($params['search']))) {
                                $should = array(
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, $must, array(
                                                    array(
                                                        'wildcard' => array(
                                                            $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    ),
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, $must, array(
                                                    array(
                                                        'wildcard' => array(
                                                            'data_search' => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    )
                                );
                            } else {
                                $should = array(
                                    array(
                                        'bool' => array(
                                            'must' => array_merge($should, array(
                                                    array(
                                                        'wildcard' => array(
                                                            $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                                        )
                                                    ))
                                            )
                                        )
                                    )
                                );
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'query' => [
                                        'bool' => [
                                            'should' => $should
                                        ]
                                    ]
                                ]
                            ];
                            break;
                    }

                } else {
                    $must = array();
                    //filter theo tung object
                    switch ($params['object']) {
                        case 'lineitems':
                        case 'campaigns':
                            $must = array();
                            $must_not = array();

                            array_push($must_not, array(
                                "terms" => array(
                                    'operational_status' => [0, 80]
                                )
                            ));

                            array_push($must,
                                array(
                                    'range' => array(
                                        'lineitem_id' => array(
                                            'gte' => 0,
                                        )
                                    )
                                ),
                                array(
                                    "term" => array(
                                        'network_id' => $params['network_id']
                                    )
                                ),
                                array(
                                    "range" => array(
                                        'operational_status' => array(
                                            'gt' => 0
                                        )
                                    )
                                )
                            );

                            if (isset($params['list_user_id'])) {
                                array_push($must, array(
                                    'query_string' => array(
                                        'default_field' => 'ads_id',
                                        'query' => implode(' ', $params['list_user_id'])
                                    )
                                ));
                            }

                            //Must
                            if (isset($params['must']) && !empty($params['must'])) {
                                foreach (json_decode($params['must'], true) as $field => $row) {
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($must, array(
                                                    "term" => array(
                                                        strtolower($field) => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                array_push($must, array(
                                                    'query_string' => array(
                                                        'default_field' => strtolower($field),
                                                        'query' => implode(' ', $value)
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => array(
                                        array(
                                            $object_info['private_key'] => array(
                                                'order' => 'desc'
                                            )
                                        )
                                    ),
                                    'query' => [
                                        'bool' => [
                                            'must' => $must,
                                            'must_not' => $must_not
                                        ]
                                    ]
                                ]
                            ];

                            break;
                        case 'interests':
                        case 'inmarkets':
                        case 'topics':
                            //
                            if (isset($params['sort'])) {
                                //sort by name
                                switch ($params['object']) {
                                    case 'topics':
                                        $request_sort = array(
                                            array(
                                                'topic_name_en_raw' => array(
                                                    'order' => strtolower($params['az'])
                                                )
                                            )
                                        );
                                        break;
                                    case 'inmarkets':
                                        $request_sort = array(
                                            array(
                                                'inmarket_name_en_raw' => array(
                                                    'order' => strtolower($params['az'])
                                                )
                                            )
                                        );
                                        break;
                                    case 'interests':
                                        $request_sort = array(
                                            array(
                                                'interest_name_en_raw' => array(
                                                    'order' => strtolower($params['az'])
                                                )
                                            )
                                        );
                                        break;
                                    default:
                                        $request_sort = array(
                                            array(
                                                strtolower($params['sort']) => array(
                                                    'order' => strtolower($params['az'])
                                                )
                                            )
                                        );
                                        break;
                                }
                            } else {
                                $request_sort = array(
                                    array(
                                        $object_info['private_key'] => array(
                                            'order' => 'desc'
                                        )
                                    )
                                );

                            }

                            //should filter
                            $should = array();
                            if (isset($params['should']) && !empty($params['should'])) {
                                foreach (json_decode($params['should'], true) as $field => $row) {
                                    if ($params['object'] == 'sections') {
                                        $field = 'section_parent';
                                    }
                                    $row = (array)$row;

                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                if ($params['object'] == 'inmarkets' && $field == 'parent_id' && $value == 0) {
                                                    $value = '';
                                                }

                                                array_push($should, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                //
                                                array_push($should, array(
                                                    'query_string' => array(
                                                        'default_field' => $field,
                                                        'query' => implode(' ', $value)
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            //must filter
                            $must = array();

                            if (isset($params['must']) && !empty($params['must'])) {
                                foreach (json_decode($params['must'], true) as $field => $row) {
                                    if ($params['object'] == 'sections') {
                                        $field = 'section_parent';
                                    }
                                    $row = (array)$row;

                                    foreach ($row as $op => $value) {

                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($must, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));

                                                break;
                                        }
                                    }
                                }
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => $request_sort,
                                    'query' => [
                                        'bool' => [
                                            'must' => $must,
                                            'should' => $should
                                        ]
                                    ]
                                ]
                            ];
                            break;
                        case 'websites':
                            if (isset($params['section_id'])) {
                                //get website from section id
                                $request = [
                                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'sections' : 'sections',
                                    'type' => 'data',
                                    'body' => [
                                        'from' => 0,
                                        'size' => 10000,
                                        'query' => [
                                            'bool' => [
                                                'must' => array(
                                                    array(
                                                        "terms" => array(
                                                            'section_id' => $params['section_id']
                                                        )
                                                    )
                                                )
                                            ]
                                        ]
                                    ]
                                ];

                                $rows = self::transform($client->search($request));

                                if (isset($rows['data']) && !empty($rows['data'])) {
                                    $website_id = array();
                                    foreach ($rows['data'] as $section) {
                                        if (isset($section['website_id'])) {
                                            $website_id[] = $section['website_id'];
                                        }
                                    }

                                    $website_id = array_values(array_unique($website_id));

                                    if (!empty($website_id)) {
                                        array_push($must, array(
                                            "terms" => array(
                                                'website_id' => $website_id
                                            )
                                        ));
                                    }
                                }
                            }

                            array_push($must,
                                array(
                                    "term" => array(
                                        'network_id' => $params['network_id']
                                    )
                                ),
                                array(
                                    "term" => array(
                                        'status' => 3
                                    )
                                ),
                                array(
                                    "term" => array(
                                        'app_type' => 1
                                    )
                                )
                            );

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'websites' : 'websites',
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 10000,
                                    'query' => [
                                        'bool' => [
                                            'must' => $must
                                        ]
                                    ]
                                ]
                            ];
                            break;
                        case 'sections':
                            if (isset($params['sort'])) {
                                //sort by lineitem name
                                $request_sort = array(
                                    array(
                                        strtolower($params['sort']) => array(
                                            'order' => strtolower($params['az'])
                                        )
                                    )
                                );
                            } else {
                                $request_sort = array(
                                    array(
                                        $object_info['private_key'] => array(
                                            'order' => 'desc'
                                        )
                                    )
                                );
                            }

                            //should filter
                            $should = array();
                            if (isset($params['should']) && !empty($params['should'])) {
                                foreach (json_decode($params['should'], true) as $field => $row) {
                                    if ($params['object'] == 'sections') {
                                        $field = 'section_parent';
                                    }

                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                if ($params['object'] == 'inmarkets' && $field == 'parent_id' && $value == 0) {
                                                    $value = '';
                                                }

                                                array_push($should, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                //
                                                array_push($should, array(
                                                    "terms" => array(
                                                        $field => $value
                                                    )
                                                ));

                                                break;
                                        }
                                    }
                                }
                            }

                            //must filter
                            $must = array();

                            //website id
                            if (isset($params['website_id'])) {
                                array_push($must,
                                    array(
                                        "terms" => array(
                                            'website_id' => (array)$params['website_id']
                                        )
                                    )
                                );
                            } else if (!isset($params['website'])) {
                                //get website section
                                $request = [
                                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'websites' : 'websites',
                                    'type' => 'data',
                                    'body' => [
                                        'from' => 0,
                                        'size' => 10000,
                                        'query' => [
                                            'bool' => [
                                                'must' => array(
                                                    array(
                                                        "term" => array(
                                                            'network_id' => $params['network_id']
                                                        )
                                                    ),
                                                    array(
                                                        "term" => array(
                                                            'status' => 3
                                                        )
                                                    ),
                                                    array(
                                                        "term" => array(
                                                            'app_type' => 1
                                                        )
                                                    )
                                                )
                                            ]
                                        ]
                                    ]
                                ];

                                $result = $client->search($request);

                                $rows = self::transform($result);

                                $website_id = array();
                                if (isset($rows['data']) && !empty($rows['data'])) {
                                    foreach ($rows['data'] as $website) {
                                        $website_id[] = $website['website_id'];
                                    }
                                }

                                if (!empty($website_id)) {
                                    array_push($must,
                                        array(
                                            "terms" => array(
                                                'website_id' => (array)$website_id
                                            )
                                        )
                                    );
                                }
                            }

                            //Section id
                            if (isset($params['section_id'])) {
                                array_push($must,
                                    array(
                                        "terms" => array(
                                            'section_id' => (array)$params['section_id']
                                        )
                                    )
                                );
                            }

                            array_push($must,
                                array(
                                    "query_string" => array(
                                        'default_field' => 'network_id',
                                        'query' => $params['network_id']
                                    )
                                ),
                                array(
                                    "query_string" => array(
                                        'default_field' => 'status',
                                        'query' => 1
                                    )
                                ),
                                array(
                                    "query_string" => array(
                                        'default_field' => 'section_type',
                                        'query' => 1
                                    )
                                )
                            );

                            if (isset($params['must']) && !empty($params['must'])) {
                                foreach (json_decode($params['must'], true) as $field => $row) {
                                    if ($params['object'] == 'sections') {
                                        $field = 'section_parent';
                                    }
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {

                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($must, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));

                                                break;
                                            case 'in':
                                                //
                                                array_push($must, array(
                                                    "terms" => array(
                                                        $field => $value
                                                    )
                                                ));

                                                break;
                                        }
                                    }
                                }
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => $request_sort,
                                    'query' => [
                                        'bool' => [
                                            'must' => $must,
                                            'should' => $should
                                        ]
                                    ]
                                ]
                            ];

                            break;
                        case 'creatives':
                            //should filter
                            $should = array();
                            if (isset($params['should']) && !empty($params['should'])) {
                                foreach (json_decode($params['should'], true) as $field => $row) {
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($should, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                //
                                                array_push($should, array(
                                                    'query_string' => array(
                                                        'default_field' => $field,
                                                        'query' => implode(' ', $value)
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            //must filter
                            $must = array();
                            if (isset($params['must']) && !empty($params['must'])) {
                                foreach (json_decode($params['must'], true) as $field => $row) {
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($must, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                array_push($must, array(
                                                    'query_string' => array(
                                                        'default_field' => $field,
                                                        'query' => implode(' ', $value)
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            //
                            if (isset($params['list_user_id']) && !empty($params['list_user_id'])) {
                                array_push($must, array(
                                    'query_string' => array(
                                        'default_field' => 'ads_id',
                                        'query' => implode(' ', $params['list_user_id'])
                                    )
                                ));
                            }

                            array_push($must, array(
                                'range' => array(
                                    'lineitem_id' => array(
                                        'gte' => 0,
                                    )
                                )
                            ));

                            array_push($must,
                                array(
                                    'range' => array(
                                        'operational_status' => array(
                                            'gt' => 0,
                                            'lt' => 80
                                        )
                                    )
                                ),
                                array(
                                    "term" => array(
                                        'network_id' => $params['network_id']
                                    )
                                )
                            );

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'query' => [
                                        'bool' => [
                                            'must' => $must,
                                            'should' => $should
                                        ]
                                    ]
                                ]
                            ];

                            break;
                        case 'merchant_products':
                            $must = array();
                            array_push($must, array(
                                "term" => array(
                                    'user_id' => $params['user_id']
                                )
                            ));
                            array_push($must, array(
                                "term" => array(
                                    'status' => 50
                                )
                            ));
                            if (isset($params['file_id'])) {
                                array_push($must, array(
                                    "term" => array(
                                        'file_id' => $params['file_id']
                                    )
                                ));
                            }

                            if (isset($params['website_id'])) {
                                array_push($must, array(
                                    "term" => array(
                                        'website_id' => $params['website_id']
                                    )
                                ));
                            }
                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => 1000,
                                    'query' => [
                                        'bool' => [
                                            'must' => $must,
                                        ]
                                    ]
                                ]
                            ];
                            break;
                        case 'locations':
                            $must = array();
                            $should = array();

                            //default
                            if (isset($params['default']) && $params['default'] = 1) {
                                //search default
                                array_push($should, array(
                                    "term" => array(
                                        'parent_id' => 1001
                                    )
                                ));
                                array_push($should, array(
                                    "term" => array(
                                        'parent_id' => 0
                                    )
                                ));
                            }

                            //search theo location id
                            if (isset($params['location_id_search']) && $params['location_id_search'] == 1000) {
                                array_push($should, array(
                                    "term" => array(
                                        'parent_id' => 1005,
                                    )
                                ));
                                array_push($should, array(
                                    "term" => array(
                                        'parent_id' => 1006,
                                    )
                                ));
                                array_push($should, array(
                                    "term" => array(
                                        'parent_id' => 1007,
                                    )
                                ));
                            }
                            if (isset($params['location_id_search']) && $params['location_id_search'] != 1000) {
                                array_push($should, array(
                                    "term" => array(
                                        'parent_id' => $params['location_id_search'],
                                    )
                                ));
                            }

                            //get detail
                            if (isset($params['detail']) && $params['detail'] == 1) {
                                array_push($must, array(
                                    "term" => array(
                                        'location_id' => $params['location_id'],
                                    )
                                ));
                            }

                            //Get list detail
                            if (isset($params['arr_location_id']) && $params['arr_location_id']) {
                                foreach ($params['arr_location_id'] as $location_id) {
                                    array_push($should, array(
                                        "term" => array(
                                            'location_id' => $location_id
                                        )
                                    ));
                                }
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 10,
                                    'sort' => array('location_name_raw' => isset($params['sort']) ? $params['sort'] : 'asc'),
                                    'query' => [
                                        'bool' => [
                                            'must' => $must,
                                            'should' => $should
                                        ]
                                    ]
                                ]
                            ];
                            break;
                        case 'os':
                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => array(
                                        array(
                                            'os_name' => array(
                                                'order' => 'ASC'
                                            )
                                        )
                                    )
                                ]
                            ];
                            break;
                        case 'os_versions':
                            $must = array();
                            $must_not = array();
                            //
                            if (isset($params['os_id'])) {
                                array_push($must, array(
                                    "term" => array(
                                        'os_id' => $params['os_id']
                                    )
                                ));
                            }

                            if (isset($params['version_type'])) {
                                array_push($must, array(
                                    "term" => array(
                                        'version_type' => $params['version_type']
                                    )
                                ));
                            }

                            if (isset($params['not_version_type'])) {
                                array_push($must_not, array(
                                    "term" => array(
                                        'version_type' => $params['not_version_type']
                                    )
                                ));
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => array(
                                        array(
                                            'os_version_id' => array(
                                                'order' => 'ASC'
                                            )
                                        )
                                    ),
                                    'query' => [
                                        'bool' => [
                                            'must' => $must,
                                            'must_not' => $must_not,
                                        ]
                                    ]
                                ]
                            ];
                            break;
                        case 'devices':
                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => array(
                                        array(
                                            'device_name_raw' => array(
                                                'order' => 'ASC'
                                            )
                                        )
                                    )
                                ]
                            ];
                            break;
                        case 'browsers':
                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => array(
                                        array(
                                            'browser_name' => array(
                                                'order' => 'ASC'
                                            )
                                        )
                                    )
                                ]
                            ];
                            break;
                        case 'remarketing':
                            //
                            if (isset($params['sort'])) {
                                //sort by lineitem name
                                $request_sort = array(
                                    array(
                                        strtolower($params['sort']) => array(
                                            'order' => strtolower($params['az'])
                                        )
                                    )
                                );
                            } else {
                                $request_sort = array(
                                    array(
                                        'remarketing_name_raw' => array(
                                            'order' => 'asc'
                                        )
                                    )
                                );

                            }

                            $must = array();
                            $rm_status = isset($params['rm_status']) && is_array($params['rm_status']) && !empty($params['rm_status'])
                                ? $params['rm_status'] : [1, 2, 80];

                            array_push($must, array(
                                array(
                                    "term" => array(
                                        'network_id' => $params['network_id']
                                    )
                                ),
                                array(
                                    "bool" => array(
                                        "should" => array(
                                            array(
                                                "term" => array(
                                                    'user_id' => $params['user_id']
                                                )
                                            ),
                                            array(
                                                "term" => array(
                                                    'owner_id' => $params['user_id']
                                                )
                                            )
                                        )
                                    )
                                ),
                                array(
                                    "terms" => array(
                                        'rm_status' => $rm_status
                                    )
                                )
                            ));

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => $request_sort,
                                    'query' => [
                                        'bool' => [
                                            'must' => $must
                                        ]
                                    ]
                                ]
                            ];

                            break;
                        case 'conversion':
                            //
                            if (isset($params['sort'])) {
                                //sort by lineitem name
                                $request_sort = array(
                                    array(
                                        strtolower($params['sort']) => array(
                                            'order' => strtolower($params['az'])
                                        )
                                    )
                                );
                            } else {
                                $request_sort = array(
                                    array(
                                        $object_info['private_key'] => array(
                                            'order' => 'desc'
                                        )
                                    )
                                );

                            }

                            $must = array();
                            array_push($must, array(
                                array(
                                    "term" => array(
                                        'user_id' => $params['user_id']
                                    )
                                ),
                                array(
                                    "term" => array(
                                        'network_id' => $params['network_id']
                                    )
                                )
                            ));

                            $should = array();
                            if (isset($params['owner_id'])) {
                                array_push($should, array(
                                    array(
                                        "term" => array(
                                            'owner_id' => $params['owner_id']
                                        )
                                    )
                                ));
                            }

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => $request_sort,
                                    'query' => [
                                        'bool' => [
                                            'must' => $must,
                                            'should' => $should
                                        ]
                                    ]
                                ]
                            ];


                            break;
                        case 'creative_object':
                            $must_not = array();

                            array_push($must_not, array(
                                "term" => array(
                                    'parent_id' => 0
                                )
                            ));

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => array(
                                        array(
                                            'ct_object_id' => array(
                                                'order' => 'ASC'
                                            )
                                        )
                                    ),
                                    'query' => [
                                        'bool' => [
                                            'must_not' => $must_not,
                                        ]
                                    ]
                                ]
                            ];

                            break;
                        case 'modify_reports':
                            //should filter
                            $should = array();
                            if (isset($params['should']) && !empty($params['should'])) {
                                foreach (json_decode($params['should'], true) as $field => $row) {
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($should, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                //
                                                array_push($should, array(
                                                    'query_string' => array(
                                                        'default_field' => $field,
                                                        'query' => implode(' ', $value)
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            //must filter
                            $must = array();
                            if (isset($params['must']) && !empty($params['must'])) {
                                foreach (json_decode($params['must'], true) as $field => $row) {
                                    $row = (array)$row;
                                    foreach ($row as $op => $value) {
                                        switch ($op) {
                                            case 'equals':
                                                //
                                                array_push($must, array(
                                                    "term" => array(
                                                        $field => $value
                                                    )
                                                ));
                                                break;
                                            case 'in':
                                                array_push($must, array(
                                                    'query_string' => array(
                                                        'default_field' => $field,
                                                        'query' => implode(' ', $value)
                                                    )
                                                ));
                                                break;
                                        }
                                    }
                                }
                            }

                            //
                            if (isset($params['list_user_id']) && !empty($params['list_user_id'])) {
                                array_push($must, array(
                                    'query_string' => array(
                                        'default_field' => 'ads_id',
                                        'query' => implode(' ', $params['list_user_id'])
                                    )
                                ));
                            }

                            array_push($must, array(
                                'range' => array(
                                    'lineitem_id' => array(
                                        'gte' => 0,
                                    )
                                )
                            ));

                            array_push($must,
                                array(
                                    'range' => array(
                                        'status' => array(
                                            'gte' => 0,
                                            'lte' => 80
                                        )
                                    )
                                ),
                                array(
                                    "term" => array(
                                        'network_id' => $params['network_id']
                                    )
                                )
                            );

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 10,
                                    'query' => [
                                        'bool' => [
                                            'must' => $must,
                                            'should' => $should
                                        ]
                                    ]
                                ]
                            ];
                            break;
                        case 'campaign_section':

                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => 5000,
                                    'query' => [
                                        'bool' => [
                                            'must' => $params['must'],
                                        ]
                                    ]
                                ]
                            ];
                            break;
                        default:
                            $body = [
                                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                                'type' => 'data',
                                'body' => [
                                    'from' => $offset ? $offset : 0,
                                    'size' => $limit ? $limit : 1000,
                                    'sort' => array(
                                        array(
                                            $object_info['private_key'] => array(
                                                'order' => 'desc'
                                            )
                                        )
                                    )
                                ]
                            ];
                            break;
                    }

                }

                $rows = $client->search($body);

                return $rows;
            }
        } catch (\Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function getAccountEs($params)
    {

        $object_info = self::getObjectInfo('users');
        $limit = isset($params['limit']) ? $params['limit'] : 20;
        $offset = isset($params['offset']) ? $params['offset'] : 0;

        if (isset($object_info['index']) && !empty($object_info['index'])) {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $must = array();
            $should = array();

            if (isset($params['should']) && !empty($params['should'])) {
                foreach (json_decode($params['should'], true) as $field => $row) {
                    $row = (array)$row;

                    foreach ($row as $op => $value) {
                        switch ($op) {
                            case 'in':
                                //
                                if (!empty($value) && count($value) > 1024) {
                                    $index = 0;
                                    $arr_id = array();
                                    foreach ($value as $object_id) {
                                        if ($index >= 1000) {
                                            $index = 0;
                                            $should[] = array(
                                                'query_string' => array(
                                                    'default_field' => $field,
                                                    'query' => implode(' ', $arr_id)
                                                )
                                            );

                                            $arr_id = array();

                                        } else {
                                            $index++;
                                            $arr_id[] = $object_id;
                                        }
                                    }
                                } else {
                                    $should = array(
                                        'query_string' => array(
                                            'default_field' => $field,
                                            'query' => implode(' ', $value)
                                        )
                                    );
                                }

                                break;
                        }
                    }
                }
            }

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'network_users' : 'network_users',
                'type' => 'data',
                'body' => [
                    'from' => $offset,
                    'size' => $limit,
                    'query' => [
                        'bool' => [
                            'should' => $should
                        ]
                    ]
                ]
            ];
            $rows = $client->search($body);

            return isset($rows['hits']['hits'][0]['_source']) ? $rows['hits']['hits'][0]['_source'] : array();
        }
    }

    public static function getSearchAccount($params)
    {

        $object_info = self::getObjectInfo('users');
        $limit = isset($params['limit']) ? $params['limit'] : 20;
        $offset = isset($params['offset']) ? $params['offset'] : 0;

        if (isset($object_info['index']) && !empty($object_info['index'])) {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $must = array();
            $should = array();

            if (isset($params['search']) && !empty($params['search'])) {
                //search value
                if (isset($params['should']) && !empty($params['should'])) {
                    foreach (json_decode($params['should'], true) as $field => $row) {
                        $row = (array)$row;

                        foreach ($row as $op => $value) {
                            switch ($op) {
                                case 'in':
                                    //
                                    if (!empty($value) && count($value) > 1024) {
                                        $index = 0;
                                        $arr_id = array();
                                        foreach ($value as $object_id) {
                                            if ($index >= 1000) {
                                                $index = 0;
                                                $should[] = array(
                                                    'query_string' => array(
                                                        'default_field' => $field,
                                                        'query' => implode(' ', $arr_id)
                                                    )
                                                );

                                                $arr_id = array();

                                            } else {
                                                $index++;
                                                $arr_id[] = $object_id;
                                            }
                                        }
                                    } else {
                                        $should = array(
                                            'query_string' => array(
                                                'default_field' => $field,
                                                'query' => implode(' ', $value)
                                            )
                                        );
                                    }

                                    break;
                            }
                        }
                    }
                }
            }

            if (isset($params['role'])) {
                //get user from network user
                $body = [
                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'network_users' : 'network_users',
                    'type' => 'data',
                    'body' => [
                        'from' => $offset,
                        'size' => 10000,
                        'query' => [
                            'bool' => [
                                'must' => [
                                    array(
                                        'term' => array(
                                            'network_id' => $params['network_id']
                                        )
                                    ),
                                    array(
                                        'term' => array(
                                            'buyer_role' => $params['role']
                                        )
                                    )
                                ]
                            ]
                        ]
                    ]
                ];

                $result = self::transform($client->search($body));

                $list_user_role = [];
                if (isset($result['data']) && !empty($result['data'])) {
                    foreach ($result['data'] as $user) {
                        if (isset($user['user_id'])) {
                            $list_user_role[] = $user['user_id'];
                        }
                    }
                }

                if (!empty($list_user_role)) {
                    array_push($should, array(
                        "terms" => array(
                            'user_id' => $list_user_role
                        )
                    ));
                }
            }

            if (is_numeric(Utils::remove_accent(str_replace('-', '', $params['search'])))) {
                $should = array(
                    array(
                        'bool' => array(
                            'must' => array_merge(array($should), array(
                                    array(
                                        'wildcard' => array(
                                            'full_name_raw' => '*' . Utils::remove_accent(str_replace('-', '', $params['search'])) . '*'
                                        )
                                    ))
                            )
                        )
                    ),
                    array(
                        'bool' => array(
                            'must' => array_merge(array($should), array(
                                    array(
                                        'wildcard' => array(
                                            'data_search' => '*' . Utils::remove_accent(str_replace('-', '', $params['search'])) . '*'
                                        )
                                    ))
                            )
                        )
                    )
                );

            } else {
                $should = array(
                    array(
                        'bool' => array(
                            'must' => array_merge(array($should), array(
                                    array(
                                        'wildcard' => array(
                                            'full_name_raw' => '*' . Utils::remove_accent(str_replace('-', '', $params['search'])) . '*'
                                        )
                                    ))
                            )
                        )
                    )
                );
            }

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'users' : 'users',
                'type' => 'data',
                'body' => [
                    'from' => $offset,
                    'size' => $limit,
                    'query' => [
                        'bool' => [
                            'should' => $should
                        ]
                    ]
                ]
            ];
            $rows = $client->search($body);

            return $rows;
        }
    }

    public static function getSearchMerchantInfo($params = array())
    {
        $object_info = self::getObjectInfo('merchant_files');
        $limit = isset($params['limit']) ? $params['limit'] : 20;
        $offset = isset($params['offset']) ? $params['offset'] : 0;

        if (isset($object_info['index']) && !empty($object_info['index'])) {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $must = array();
            if (isset($params['website_id'])) {
                array_push($must, array(
                    "term" => array(
                        'website_id' => $params['website_id']
                    )
                ));
            }
            if (isset($params['user_id'])) {
                array_push($must, array(
                    "term" => array(
                        'user_id' => $params['user_id']
                    )
                ));
            }

            if (isset($params['search']) && !empty($params['search'])) {
                //search value

                array_push($must, array(
                    "wildcard" => array(
                        $params['search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                    )
                ));

                if (isset($params['must']) && !empty($params['must'])) {
                    foreach (json_decode($params['must'], true) as $field => $row) {
                        $row = (array)$row;
                        foreach ($row as $op => $value) {
                            switch ($op) {
                                case 'in':
                                    //
                                    array_push($must, array(
                                        'query_string' => array(
                                            'default_field' => $field,
                                            'query' => implode(' ', $value)
                                        )
                                    ));

                                    break;
                            }
                        }
                    }
                }

            }


            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['index'] : $params['index'],
                'type' => 'data',
                'body' => [
                    'from' => $offset,
                    'size' => $limit,
                    'query' => [
                        'bool' => [
                            'must' => $must
                        ]
                    ]
                ]
            ];
            $rows = $client->search($body);
            return $rows;
        }
    }

    public static function searchTargetByParent($object, $params = array())
    {
        $object_info = self::getObjectInfo($object);
        $limit = isset($params['limit']) ? $params['limit'] : 500;
        $offset = isset($params['offset']) ? $params['offset'] : 0;

        if (isset($object_info['index']) && !empty($object_info['index'])) {
            $client = Elastic::getInstances('info_slave');
            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $must = array();
            if (isset($params['parent_id'])) {
                array_push($must, array(
                    "term" => array(
                        $object_info['parent'] => $params['parent_id']
                    )
                ));
            }
            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object : $object,
                'type' => 'data',
                'body' => [
                    'from' => $offset,
                    'size' => $limit,
                    'query' => [
                        'bool' => [
                            'must' => $must
                        ]
                    ]
                ]
            ];
            $rows = $client->search($body);
            return self::transform($rows);
        }
    }

    public static function getSearchLocation($params)
    {
        try {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $must = array();

            if (isset($params['location_id'])) {
                array_push($must, array(
                    "term" => array(
                        'location_id' => $params['location_id']
                    )
                ));
            }

            if (isset($params['parent_id'])) {
                array_push($must, array(
                    "term" => array(
                        'parent_id' => $params['parent_id']
                    )
                ));
            }

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'locations' : 'locations',
                'type' => 'data',
                'body' => [
                    'from' => 0,
                    'size' => 100,
                    'query' => [
                        'bool' => [
                            'must' => $must
                        ]
                    ]
                ]
            ];


            $rows = $client->search($body);

            return $rows;

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function getSearchAge($params)
    {
        try {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $sort = [
                $params['sort'] => [
                    "order" => strtolower($params['az'])
                ]
            ];

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'ages' : 'ages',
                'type' => 'data',
                'body' => [
                    'from' => 0,
                    'size' => 100,
                    'sort' => $sort
                ]
            ];

            $rows = $client->search($body);

            return self::transform($rows);

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function getSearchReport($params)
    {
        $object_info = self::getObjectInfo('modify_reports');

        $limit = isset($params['limit']) ? $params['limit'] : 20;
        $offset = isset($params['offset']) ? $params['offset'] : 0;

        if (isset($object_info['index']) && !empty($object_info['index'])) {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $must = array();

            array_push($must, array(
                "term" => array(
                    'user_id' => $params['user_id']
                )
            ));
            array_push($must, array(
                "term" => array(
                    'manager_id' => $params['manager_id']
                )
            ));
            array_push($must, array(
                "term" => array(
                    'network_id' => $params['network_id']
                )
            ));


            if (isset($params['search']) && !empty($params['search'])) {
                array_push($must, array(
                    'wildcard' => array(
                        'report_name_raw' => '*' . Utils::remove_accent($params['search']) . '*'
                    )
                ));
            }

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'modify_reports' : 'modify_reports',
                'type' => 'data',
                'body' => [
                    'from' => $offset,
                    'size' => $limit,
                    'query' => [
                        'bool' => [
                            'must' => $must
                        ]
                    ]
                ]
            ];

            $rows = $client->search($body);

            return self::transform($rows);
        }

    }

    public static function getCountLineItemNotPrivateDeal($params)
    {
        $object_info = isset($params['object']) ? self::getObjectInfo($params['object']) : '';

        if (isset($object_info['index']) && !empty($object_info['index'])) {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $must = array();
            $must_not = array();

            if (isset($params['search']) && !empty($params['search'])) {
                $should = array();
                $must = array();

                //should filter
                if (isset($params['should']) && !empty($params['should'])) {
                    foreach (json_decode($params['should'], true) as $field => $row) {
                        $row = (array)$row;
                        foreach ($row as $op => $value) {
                            switch ($op) {
                                case 'equals':
                                    //
                                    array_push($should, array(
                                        "term" => array(
                                            $field => $value
                                        )
                                    ));
                                    break;
                                case 'in':
                                    //
                                    array_push($should, array(
                                        'query_string' => array(
                                            'default_field' => $field,
                                            'query' => implode(' ', $value)
                                        )
                                    ));
                                    break;
                            }
                        }
                    }
                }

                //must filter
                if (isset($params['must']) && !empty($params['must'])) {
                    foreach (json_decode($params['must'], true) as $field => $row) {
                        $row = (array)$row;
                        foreach ($row as $op => $value) {
                            switch ($op) {
                                case 'equals':
                                    //
                                    array_push($must, array(
                                        "term" => array(
                                            $field => $value
                                        )
                                    ));
                                    break;
                                case 'in':
                                    array_push($must, array(
                                        'query_string' => array(
                                            'default_field' => $field,
                                            'query' => implode(' ', $value)
                                        )
                                    ));
                                    break;
                            }
                        }
                    }
                }

                //
                if (isset($params['list_user_id']) && !empty($params['list_user_id'])) {
                    array_push($must, array(
                        'query_string' => array(
                            'default_field' => 'ads_id',
                            'query' => implode(' ', $params['list_user_id'])
                        )
                    ));
                }

                array_push($must,
                    array(
                        'range' => array(
                            'lineitem_id' => array(
                                'gte' => 0,
                            )
                        )
                    ),
                    array(
                        "term" => array(
                            'network_id' => $params['network_id']
                        )
                    ),
                    array(
                        "range" => array(
                            'operational_status' => array(
                                'gt' => 0
                            )
                        )
                    )
                );

                //operational status lineitem
                array_push($must_not,
                    array(
                        "terms" => array(
                            'operational_status' => [0, 80]
                        )
                    ),
                    array(
                        'range' => array(
                            'package_id' => array(
                                'gt' => 0,
                            )
                        )
                    )
                );


                if (is_numeric(Utils::remove_accent($params['search']))) {
                    $should = array(
                        array(
                            'bool' => array(
                                'must' => array_merge($should, $must, array(
                                        array(
                                            'wildcard' => array(
                                                $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                            )
                                        ))
                                )
                            )
                        ),
                        array(
                            'bool' => array(
                                'must' => array_merge($should, $must, array(
                                        array(
                                            'wildcard' => array(
                                                'data_search' => '*' . Utils::remove_accent($params['search']) . '*'
                                            )
                                        ))
                                )
                            )
                        )
                    );

                } else {
                    $should = array(
                        array(
                            'bool' => array(
                                'must' => array_merge($should, $must, array(
                                        array(
                                            'wildcard' => array(
                                                $object_info['data_search_raw'] => '*' . Utils::remove_accent($params['search']) . '*'
                                            )
                                        ))
                                )
                            )
                        )
                    );
                }

                $body = [
                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                    'type' => 'data',
                    'body' => [
                        'from' => 0,
                        'size' => 1,
                        'query' => [
                            'bool' => [
                                'should' => $should,
                                'must_not' => $must_not
                            ]
                        ]
                    ]
                ];
            } else {
                $must = array();
                $must_not = array();

                array_push($must_not, array(
                    "terms" => array(
                        'operational_status' => [0, 80]
                    )
                ), array(
                    'range' => array(
                        'package_id' => array(
                            'gt' => 0,
                        )
                    )
                ));

                array_push($must,
                    array(
                        'range' => array(
                            'lineitem_id' => array(
                                'gte' => 0,
                            )
                        )
                    ),
                    array(
                        "term" => array(
                            'network_id' => $params['network_id']
                        )
                    ),
                    array(
                        "range" => array(
                            'operational_status' => array(
                                'gt' => 0
                            )
                        )
                    )
                );

                if (isset($params['list_user_id'])) {
                    array_push($must, array(
                        'query_string' => array(
                            'default_field' => 'ads_id',
                            'query' => implode(' ', $params['list_user_id'])
                        )
                    ));
                }

                //Must
                if (isset($params['must']) && !empty($params['must'])) {
                    foreach (json_decode($params['must'], true) as $field => $row) {
                        $row = (array)$row;
                        foreach ($row as $op => $value) {
                            switch ($op) {
                                case 'equals':
                                    //
                                    array_push($must, array(
                                        "term" => array(
                                            strtolower($field) => $value
                                        )
                                    ));
                                    break;
                                case 'in':
                                    array_push($must, array(
                                        'query_string' => array(
                                            'default_field' => strtolower($field),
                                            'query' => implode(' ', $value)
                                        )
                                    ));
                                    break;
                            }
                        }
                    }
                }

                $body = [
                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                    'type' => 'data',
                    'body' => [
                        'from' => 0,
                        'size' => 1,
                        'sort' => array(
                            array(
                                $object_info['private_key'] => array(
                                    'order' => 'desc'
                                )
                            )
                        ),
                        'query' => [
                            'bool' => [
                                'must' => $must,
                                'must_not' => $must_not
                            ]
                        ]
                    ]
                ];
            }

            $rows = $client->search($body);

            return self::transform($rows);
        } else {
            return false;
        }
    }

    public static function mapping($params)
    {
        try {
            $object_name = isset($params['object']) ? $params['object'] : '';
            $prefix = isset($params['prefix']) ? $params['prefix'] : '';

            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            //prefix
            if (!$prefix) {
                $prefix = isset($hosts['prefix']) ? $hosts['prefix'] : '';
            }

            $object_info = self::getObjectInfo($object_name);

            if (!empty($object_info['index'])) {
                if ($params['object'] == 'monitor_query') {
                    $date = date('d_m_Y');
                    $params = [
                        'index' => isset($prefix) && !empty($prefix) ? $prefix . '.' . $object_name . '_' . $date : $object_name . '_' . $date,
                        'body' => [
                            'settings' => [
                                'number_of_shards' => 2,
                                'number_of_replicas' => 1
                            ],
                            'mappings' => [
                                'data' => [
                                    '_source' => [
                                        'enabled' => true
                                    ],
                                    'properties' => $object_info['index']
                                ]
                            ]
                        ]
                    ];
                } else {
                    $params = [
                        'index' => isset($prefix) && !empty($prefix) ? $prefix . '.' . $object_name : $object_name,
                        'body' => [
                            'settings' => [
                                'number_of_shards' => 2,
                                'number_of_replicas' => 1
                            ],
                            'mappings' => [
                                'data' => [
                                    '_source' => [
                                        'enabled' => true
                                    ],
                                    'properties' => $object_info['index']
                                ]
                            ]
                        ]
                    ];
                }

                if (isset($object_info['refresh_interval'])) {
                    $params['body']['settings'] = array('refresh_interval' => $object_info['refresh_interval']);
                }

                // Create the index with mappings and settings now
                $response = $client->indices()->create($params);

                return $response;
            }

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function updateMapping($object_name, $mapping)
    {
        try {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            // Set the index and type
            $params = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object_name : $object_name,
                'type' => 'data',
                'body' => [
                    'data' => [
                        '_source' => [
                            'enabled' => true
                        ],
                        'properties' => $mapping
                    ]
                ]
            ];

            // Update the index mapping
            $response = $client->indices()->putMapping($params);

            return $response;

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function indexData($object_name, $data)
    {
        $arr_data = array();
        try {
            $object_info = self::getObjectInfo($object_name);
            if (!$object_info) {
                //return error
                return false;
            }

            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            //log
            $arr_data['params'] = array(
                'object' => $object_name,
                'data' => $data
            );

            if (!empty($data)) {
                $id = '';
                $arr_data_search = $object_info['data_search'];
                $body = array();

                //Target object
                if (is_array($object_info['private_key'])) {
                    foreach ($object_info['private_key'] as $key) {
                        if (isset($data[$key])) {
                            $id .= $data[$key];
                        }
                    }
                }

                //nested column
                if (isset($object_info['nested']) && $object_info['nested']) {
                    switch ($object_name) {
                        case 'remarketing':
                            if (isset($data['owner_id']) && $data['owner_id'] != '') {
                                $owner_id = $data['owner_id'];
                                $arr_data['params_nested_column'] = array(
                                    'owner_id' => $owner_id
                                );
                                $owners = Model\ElasticSearch::getDataInfo('users', array($owner_id));
                                if (isset($owners[$owner_id])) {
                                    $data['full_name'] = isset($owners[$owner_id]['full_name']) ? $owners[$owner_id]['full_name'] : '';
                                }
                            }
                            if (isset($data['rm_type_id'])) {
                                $rm_type_id = $data['rm_type_id'];
                                $arr_data['params_nested_column'] = array(
                                    'rm_type_id' => $owner_id
                                );
                                $remaketing_types = Model\ElasticSearch::getDataInfo('remarketing_types', array($rm_type_id));
                                if (isset($remaketing_types[$rm_type_id])) {
                                    $data['rm_type_name'] = isset($remaketing_types[$rm_type_id]['rm_type_name']) ? $remaketing_types[$rm_type_id]['rm_type_name'] : '';
                                    $data['rm_group_type'] = isset($remaketing_types[$rm_type_id]['group_type']) ? $remaketing_types[$rm_type_id]['group_type'] : '';
                                }
                            }
                            if (isset($data['status'])) {
                                $status_rm = $data['status'];
                                $arr_data['params_nested_column'] = array(
                                    'status' => $status_rm
                                );
                                $data['status_name'] = ADX\Model\Common::renderStatusRemarketing($status_rm);
                            }
                            break;
                        case 'campaign_topic':
                            if (isset($data['lineitem_id']) && isset($data['campaign_id']) && isset($data['topic_id'])) {
                                $lineitem_id = $data['lineitem_id'];
                                $campaign_id = $data['campaign_id'];
                                $topic_id = $data['topic_id'];

                                //log
                                $arr_data['params_nested_column'] = array(
                                    'lineitem_id' => $lineitem_id,
                                    'campaign_id' => $campaign_id,
                                    'topic_id' => $topic_id
                                );

                                //get lineitems
                                $lineitems = ADX\Model\ElasticSearch::getDataInfo('lineitems', array($lineitem_id));

                                //get campaigns
                                $campaigns = ADX\Model\ElasticSearch::getDataInfo('campaigns', array($campaign_id));

                                //get topics
                                $topics = ADX\Model\ElasticSearch::getDataInfo('topics', array($topic_id));

                                if (isset($lineitems[$lineitem_id])) {
                                    $data['lineitem_name'] = isset($lineitems[$lineitem_id]['lineitem_name']) ? $lineitems[$lineitem_id]['lineitem_name'] : '';
                                    $data['lineitem_type_id'] = isset($lineitems[$lineitem_id]['lineitem_type_id']) ? $lineitems[$lineitem_id]['lineitem_type_id'] : '';
                                }

                                if (isset($campaigns[$campaign_id])) {
                                    $data['campaign_name'] = isset($campaigns[$campaign_id]['campaign_name']) ? $campaigns[$campaign_id]['campaign_name'] : '';
                                }

                                if (isset($topics[$topic_id])) {
                                    $data['topic_name_vn'] = isset($topics[$topic_id]['topic_name_vn']) ? $topics[$topic_id]['topic_name_vn'] : '';
                                    $data['topic_name_en'] = isset($topics[$topic_id]['topic_name_en']) ? $topics[$topic_id]['topic_name_en'] : '';
                                }
                            }
                            break;
                        case 'campaign_section':
                            if (isset($data['lineitem_id']) && isset($data['campaign_id']) && isset($data['section_id'])) {
                                $lineitem_id = $data['lineitem_id'];
                                $campaign_id = $data['campaign_id'];
                                $section_id = $data['section_id'];

                                //log
                                $arr_data['params_nested_column'] = array(
                                    'lineitem_id' => $lineitem_id,
                                    'campaign_id' => $campaign_id,
                                    'section_id' => $section_id
                                );

                                //get lineitems
                                $lineitems = ADX\Model\ElasticSearch::getDataInfo('lineitems', array($lineitem_id));

                                //get campaigns
                                $campaigns = ADX\Model\ElasticSearch::getDataInfo('campaigns', array($campaign_id));

                                //get section
                                $sections = ADX\Model\ElasticSearch::getDataInfo('sections', array($section_id));

                                if (isset($lineitems[$lineitem_id])) {
                                    $data['lineitem_name'] = isset($lineitems[$lineitem_id]['lineitem_name']) ? $lineitems[$lineitem_id]['lineitem_name'] : '';
                                    $data['lineitem_type_id'] = isset($lineitems[$lineitem_id]['lineitem_type_id']) ? $lineitems[$lineitem_id]['lineitem_type_id'] : '';
                                }

                                if (isset($campaigns[$campaign_id])) {
                                    $data['campaign_name'] = isset($campaigns[$campaign_id]['campaign_name']) ? $campaigns[$campaign_id]['campaign_name'] : '';
                                }

                                if (isset($sections[$section_id])) {
                                    $data['section_name'] = isset($sections[$section_id]['section_name']) ? $sections[$section_id]['section_name'] : '';
                                }
                            }
                            break;
                        case 'campaign_demographic':
                        case 'campaign_audience':
                            if (isset($data['lineitem_id']) && isset($data['campaign_id'])) {
                                $lineitem_id = $data['lineitem_id'];
                                $campaign_id = $data['campaign_id'];
                                $audience_id = isset($data['audience_id']) ? $data['audience_id'] : '';
                                $type = isset($data['type']) ? $data['type'] : '';

                                //log
                                $arr_data['params_nested_column'] = array(
                                    'lineitem_id' => $lineitem_id,
                                    'campaign_id' => $campaign_id,
                                    'audience_id' => $audience_id,
                                    'type' => $type
                                );

                                //get lineitems
                                $lineitems = ADX\Model\ElasticSearch::getDataInfo('lineitems', array($lineitem_id));

                                //get campaigns
                                $campaigns = ADX\Model\ElasticSearch::getDataInfo('campaigns', array($campaign_id));

                                if ($audience_id && $type) {
                                    switch ($type) {
                                        case ADX\Model\Common::OBJ_LINK_TARGET_INTEREST:
                                            $interests = ADX\Model\ElasticSearch::getDataInfo('interests', array($audience_id));

                                            if (isset($interests[$audience_id])) {
                                                $data['audience_name'] = isset($interests[$audience_id]['interest_name_en']) ? $interests[$audience_id]['interest_name_en'] : '';
                                            }

                                            break;
                                        case ADX\Model\Common::OBJ_LINK_TARGET_INMARKET:
                                            $inmarkets = ADX\Model\ElasticSearch::getDataInfo('inmarkets', array($audience_id));

                                            if (isset($inmarkets[$audience_id])) {
                                                $data['audience_name'] = isset($inmarkets[$audience_id]['inmarket_name']) ? $inmarkets[$audience_id]['inmarket_name'] : '';
                                            }
                                            break;
                                        case ADX\Model\Common::OBJ_LINK_TARGET_REMARKETING:
                                            $remarketing = ADX\Model\ElasticSearch::getDataInfoRM('remarketing', array($audience_id));

                                            if (isset($remarketing[$audience_id])) {
                                                $data['audience_name'] = isset($remarketing[$audience_id]['remarketing_name']) ? $remarketing[$audience_id]['remarketing_name'] : '';
                                            }
                                            break;
                                    }
                                }

                                if (isset($lineitems[$lineitem_id])) {
                                    $data['lineitem_name'] = isset($lineitems[$lineitem_id]['lineitem_name']) ? $lineitems[$lineitem_id]['lineitem_name'] : '';
                                    $data['lineitem_type_id'] = isset($lineitems[$lineitem_id]['lineitem_type_id']) ? $lineitems[$lineitem_id]['lineitem_type_id'] : '';
                                }

                                if (isset($campaigns[$campaign_id])) {
                                    $data['campaign_name'] = isset($campaigns[$campaign_id]['campaign_name']) ? $campaigns[$campaign_id]['campaign_name'] : '';
                                }

                            }
                            break;
                    }
                }

                foreach ($data as $key => $process_val) {
                    //
                    $process_key = strtolower($key);

                    if (in_array($process_key, self::$arr_key_by_pass_db)) {
                        continue;
                    }

                    if (empty($id) && $process_key == $object_info['private_key']) {
                        $id = $process_val;
                    }

                    if (isset($arr_data_search[$process_key])) {
                        $arr_data_search[$process_key] = $process_val;
                    }

                    if (array_key_exists($process_key, $object_info['index'])) {
                        $body[$process_key] = $process_val;
                    }
                }

                //1 cot total_budget nhưng co 2 gia tri
                if (isset($data['total_budget']) && isset($data['daily_budget']) && isset($data['revenue_type'])) {
                    if ($data['daily_budget'] > 0) {
                        $body['budget'] = $data['daily_budget'];
                    } else {
                        $body['budget'] = $data['total_budget'];
                    }
                }

                $body['data_search'] = Utils::remove_accent(implode(' ', array_values($arr_data_search)));

                if (isset($body['from_date'])) {
                    $body['from_date'] = date('Y-m-d H:i:s', strtotime($body['from_date']));
                }

                if (isset($body['to_date'])) {
                    $body['to_date'] = date('Y-m-d H:i:s', strtotime($body['to_date']));
                }

                if (isset($body['ctime'])) {
                    $body['ctime'] = date('Y-m-d H:i:s', strtotime($body['ctime']));
                }

                if (isset($body['utime'])) {
                    $body['utime'] = date('Y-m-d H:i:s', strtotime($body['utime']));
                }

                //query contain
                if (isset($object_info['data_raw']) && !empty($object_info['data_raw'])) {
                    foreach ($object_info['data_raw'] as $raw) {
                        $body[$raw . '_raw'] = isset($data[$raw]) ? Utils::remove_accent($data[$raw]) : '';
                    }
                }

                //Nested column
                if (isset($object_info['nested']) && $object_info['nested']) {
                    switch ($object_name) {
                        case 'remarketing':

                            $body['full_name'] = isset($data['full_name']) ? $data['full_name'] : '';
                            $body['full_name_raw'] = isset($data['full_name']) ? trim(ADX\Utils::remove_accent($data['full_name'])) : '';

                            $body['status_name'] = isset($data['status_name']) ? $data['status_name'] : '';
                            $body['status_name_raw'] = isset($data['status_name']) ? trim(ADX\Utils::remove_accent($data['status_name'])) : '';

                            $body['rm_type_name'] = isset($data['rm_type_name']) ? $data['rm_type_name'] : '';
                            $body['rm_type_name_raw'] = isset($data['rm_type_name']) ? trim(ADX\Utils::remove_accent($data['rm_type_name'])) : '';

                            $body['rm_group_type'] = isset($data['rm_group_type']) ? $data['rm_group_type'] : '';
                            $body['rm_group_type_raw'] = isset($data['rm_group_type']) ? trim(ADX\Utils::remove_accent($data['rm_group_type'])) : '';

                            break;
                        case 'campaign_topic':
                            //lineitems & lineitem_type_id
                            $body['lineitems'] = array(
                                'lineitem_name' => isset($data['lineitem_name']) ? $data['lineitem_name'] : '',
                                'lineitem_name_raw' => isset($data['lineitem_name']) ? trim(ADX\Utils::remove_accent($data['lineitem_name'])) : ''
                            );

                            $body['lineitem_type'] = array(
                                'lineitem_type_id' => isset($data['lineitem_type_id']) ? $data['lineitem_type_id'] : 0,
                            );

                            //campaigns
                            $body['campaigns'] = array(
                                'campaign_name' => isset($data['campaign_name']) ? $data['campaign_name'] : '',
                                'campaign_name_raw' => isset($data['campaign_name']) ? trim(ADX\Utils::remove_accent($data['campaign_name'])) : ''
                            );

                            //topics
                            $body['topics'] = array(
                                'topic_name_vn' => isset($data['topic_name_vn']) ? $data['topic_name_vn'] : '',
                                'topic_name_vn_raw' => isset($data['topic_name_vn']) ? trim(ADX\Utils::remove_accent($data['topic_name_vn'])) : '',
                                'topic_name_en' => isset($data['topic_name_en']) ? $data['topic_name_en'] : '',
                                'topic_name_en_raw' => isset($data['topic_name_en']) ? trim(ADX\Utils::remove_accent($data['topic_name_en'])) : ''
                            );
                            break;
                        case 'campaign_section':
                            //lineitems & lineitem_type_id
                            $body['lineitems'] = array(
                                'lineitem_name' => isset($data['lineitem_name']) ? $data['lineitem_name'] : '',
                                'lineitem_name_raw' => isset($data['lineitem_name']) ? trim(ADX\Utils::remove_accent($data['lineitem_name'])) : ''
                            );

                            $body['lineitem_type'] = array(
                                'lineitem_type_id' => isset($data['lineitem_type_id']) ? $data['lineitem_type_id'] : 0,
                            );
                            //campaigns
                            $body['campaigns'] = array(
                                'campaign_name' => isset($data['campaign_name']) ? $data['campaign_name'] : '',
                                'campaign_name_raw' => isset($data['campaign_name']) ? trim(ADX\Utils::remove_accent($data['campaign_name'])) : ''
                            );

                            //sections
                            $body['sections'] = array(
                                'section_name' => isset($data['section_name']) ? $data['section_name'] : '',
                                'section_name_raw' => isset($data['section_name']) ? trim(ADX\Utils::remove_accent($data['section_name'])) : '',
                            );
                            break;
                        case 'campaign_demographic':
                        case 'campaign_audience':
                            //lineitems & lineitem_type_id
                            $body['lineitems'] = array(
                                'lineitem_name' => isset($data['lineitem_name']) ? $data['lineitem_name'] : '',
                                'lineitem_name_raw' => isset($data['lineitem_name']) ? trim(ADX\Utils::remove_accent($data['lineitem_name'])) : ''
                            );

                            $body['lineitem_type'] = array(
                                'lineitem_type_id' => isset($data['lineitem_type_id']) ? $data['lineitem_type_id'] : 0,
                            );

                            //campaigns
                            $body['campaigns'] = array(
                                'campaign_name' => isset($data['campaign_name']) ? $data['campaign_name'] : '',
                                'campaign_name_raw' => isset($data['campaign_name']) ? trim(ADX\Utils::remove_accent($data['campaign_name'])) : ''
                            );

                            if ($object_name == 'campaign_audience') {
                                //audience
                                $body['audience_name'] = isset($data['audience_name']) ? $data['audience_name'] : '';
                                $body['audience_name_raw'] = isset($data['audience_name']) ? trim(ADX\Utils::remove_accent($data['audience_name'])) : '';
                            }

                            break;
                    }
                }

                //Status cho campaign, creative
                switch ($object_name) {
                    case 'campaigns':
                        //Status name for sorting
                        if (isset($data['lineitem_id']) && $data['lineitem_id'] && isset($data['operational_status']) &&
                            $data['operational_status']
                        ) {
                            $status = ADX\Model\Campaign::renderStatusV3(array(
                                'lineitem_id' => $data['lineitem_id'],
                                'status' => $data['operational_status']
                            ));

                            if ($status) {
                                $body['status_name'] = $status;
                                $body['status_name_raw'] = trim(ADX\Utils::remove_accent($status));
                            }
                        }

                        break;
                    case 'creatives':
                        //Status name for sorting
                        if (isset($data['campaign_id']) && $data['campaign_id'] && isset($data['lineitem_id']) &&
                            $data['lineitem_id'] && $data['operational_status']
                        ) {
                            $status = ADX\Model\Creative::renderStatus(array(
                                'lineitem_id' => $data['lineitem_id'],
                                'campaign_id' => $data['campaign_id'],
                                'status' => $data['operational_status']
                            ), 'creatives');

                            if ($status) {
                                $body['status_name'] = $status;
                                $body['status_name_raw'] = trim(ADX\Utils::remove_accent($status));
                            }
                        }

                        break;
                }

                //log
                $arr_data['body'] = array(
                    'data' => $body
                );

                $request = [
                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object_name : $object_name,
                    'type' => 'data',
                    'id' => $id,
                    'body' => $body
                ];

                $response = $client->index($request);

                //log
                $arr_data['response'] = array(
                    'data' => $response
                );

                //write log
                Utils::writeLog('Elastic_Index', $arr_data);

                if (isset($response['created']) && $response['created'] == 1) {
                    return 1;
                } else {
                    return 0;
                }
            }
        } catch (\Exception $e) {
            //write log
            Utils::writeLog('Elastic_Index_Error', $arr_data);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function deleteIndex($object_name, $data)
    {
        try {
            $object_info = self::getObjectInfo($object_name);

            if (!$object_info) {
                //return error
                return false;
            }

            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            if (!empty($data)) {
                $id = '';

                if (is_array($object_info['private_key'])) {
                    foreach ($object_info['private_key'] as $key) {
                        if (isset($data[$key])) {
                            $id .= $data[$key];
                        }
                    }
                }

                foreach ($data as $key => $process_val) {

                    //
                    $process_key = strtolower($key);

                    if (in_array($process_key, self::$arr_key_by_pass_db)) {
                        continue;
                    }
                    if (empty($id) && $process_key == $object_info['private_key']) {
                        $id = $process_val;
                    }
                }

                $request = [
                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object_name : $object_name,
                    'type' => 'data',
                    'id' => $id
                ];

                $search = self::getObjectById($object_name, array($data));

                if (!empty($search)) {
                    $response = $client->delete($request);

                    if (isset($response['created']) && $response['created'] == 1) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            }
        } catch (\Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function deleteByFilter($params)
    {
        $arr_data = array();
        try {
            $arr_data['params'] = $params;
            if (!isset($params['object']) || empty($params['object']) || !isset($params['filter']) || empty($params['filter'])) {
                return false;
            }

            $object_info = self::getObjectInfo($params['object']);

            if (!$object_info) {
                return false;
            }

            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $filters = $params['filter'];

            $must = array();
            foreach ($filters as $field => $value) {
                if (!empty($value)) {
                    array_push($must, array(
                        "terms" => array(
                            $field => $value
                        )
                    ));
                }
            }

            //get data filter
            $request = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                'type' => 'data',
                'body' => [
                    'from' => 0,
                    'size' => 1000,
                    'query' => [
                        'bool' => [
                            'must' => $must
                        ]
                    ]
                ]
            ];

            $arr_data['Request_data_filter'] = $request;

            $rows = self::transform($client->search($request));

            $arr_data['Rows'] = $rows;

            if (isset($rows['data']) && !empty($rows['data'])) {
                foreach ($rows['data'] as $row) {
                    $id = '';
                    if (is_array($object_info['private_key'])) {
                        foreach ($object_info['private_key'] as $key) {
                            if (isset($row[$key])) {
                                $id .= $row[$key];
                            }
                        }
                    } else {
                        $id = $row[$object_info['private_key']];
                    }

                    $delete = [
                        'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $params['object'] : $params['object'],
                        'type' => 'data',
                        'id' => $id
                    ];

                    $arr_data['Request_delete'][] = $delete;

                    $exists = $client->exists($delete);

                    if ($exists) {
                        $client->delete($delete);
                    }
                }
            } else {
                return false;
            }
            //write log
            Utils::writeLog('Elastic_Delete_By_Filter', $arr_data);

        } catch (\Exception $e) {
            //write log
            Utils::writeLog('Elastic_Delete_By_Filter_Error', $arr_data);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function getDataNestedColumn($params, $result)
    {
        if (!isset($params['object'])) {
            return false;
        }

        $object_info = self::getObjectInfo($params['object']);

        if (isset($object_info['nested']) && $object_info['nested']) {
            switch ($params['object']) {
                case 'remarketing_label':
                    foreach ($result as &$resp) {
                        $resp->id = $resp->remarketing_id . $resp->label_id;
                    }
                    break;
                case 'campaign_label':
                    foreach ($result as &$resp) {
                        $resp->id = $resp->campaign_id . $resp->label_id;
                    }
                    break;
                case 'creative_label':
                    foreach ($result as &$resp) {
                        $resp->id = $resp->creative_id . $resp->label_id;
                    }
                    break;
                case 'remarketing':
                    if (isset($result) && !empty($result)) {
                        $arr_owner_id = [];
                        $arr_rm_type_id = [];
                        foreach ($result as $resp) {

                            if (isset($resp->owner_id)) {
                                $arr_owner_id[] = $resp->owner_id;
                            }

                            if (isset($resp->rm_type_id)) {
                                $arr_rm_type_id[] = $resp->rm_type_id;
                            }
                            //get users owner
                            if (!empty($arr_owner_id)) {
                                $owners = ADX\Model\ElasticSearch::getDataInfo('users', $arr_owner_id);
                            }

                            //get rm types name
                            if (!empty($arr_rm_type_id)) {
                                $remarketing_types = ADX\Model\ElasticSearch::getDataInfo('remarketing_types', $arr_rm_type_id);
                            }

                            foreach ($result as &$resp) {

                                if (isset($owners[$resp->owner_id])) {
                                    $resp->full_name = isset($owners[$resp->owner_id]['full_name']) ? $owners[$resp->owner_id]['full_name'] : '';
                                }
                                if (isset($remarketing_types[$resp->rm_type_id])) {
                                    $resp->rm_type_name = isset($remarketing_types[$resp->rm_type_id]['rm_type_name']) ? $remarketing_types[$resp->rm_type_id]['rm_type_name'] : '';
                                    $resp->rm_group_type = isset($remarketing_types[$resp->rm_type_id]['group_type']) ? $remarketing_types[$resp->rm_type_id]['group_type'] : '';
                                }

                            }
                        }
                    }
                    break;
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
                case 'campaign_section':
                    if (isset($result) && !empty($result)) {
                        $arr_campaigns_id = array();
                        $arr_line_item_id = array();
                        $arr_section_id = array();
                        foreach ($result as $resp) {
                            if (isset($resp->lineitem_id)) {
                                $arr_line_item_id[] = $resp->lineitem_id;
                            }

                            if (isset($resp->campaign_id)) {
                                $arr_campaigns_id[] = $resp->campaign_id;
                            }

                            if (isset($resp->section_id)) {
                                $arr_section_id[] = $resp->section_id;
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

                        //get section
                        if (!empty($arr_section_id)) {
                            $sections = ADX\Model\ElasticSearch::getDataInfo('sections', $arr_section_id);
                        }

                        foreach ($result as &$resp) {

                            if (isset($lineitems[$resp->lineitem_id])) {
                                $resp->lineitem_name = isset($lineitems[$resp->lineitem_id]['lineitem_name']) ? $lineitems[$resp->lineitem_id]['lineitem_name'] : '';
                                $resp->lineitem_type_id = isset($lineitems[$resp->lineitem_id]['lineitem_type_id']) ? $lineitems[$resp->lineitem_id]['lineitem_type_id'] : '';
                            }

                            if (isset($campaigns[$resp->campaign_id])) {
                                $resp->campaign_name = isset($campaigns[$resp->campaign_id]['campaign_name']) ? $campaigns[$resp->campaign_id]['campaign_name'] : '';
                            }

                            if (isset($sections[$resp->section_id])) {
                                $resp->section_name = isset($sections[$resp->section_id]['section_name']) ? $sections[$resp->section_id]['section_name'] : '';
                            }
                        }
                    }
                    break;
                case 'campaign_demographic':
                case 'campaign_audience':
                    if (isset($result) && !empty($result)) {
                        $arr_campaigns_id = array();
                        $arr_line_item_id = array();
                        $arr_interest_id = array();
                        $arr_inmarket_id = array();
                        $arr_remarketing_id = array();
                        foreach ($result as $resp) {
                            if (isset($resp->lineitem_id)) {
                                $arr_line_item_id[] = $resp->lineitem_id;
                            }
                            if (isset($resp->campaign_id)) {
                                $arr_campaigns_id[] = $resp->campaign_id;
                            }

                            if (isset($resp->audience_id) && isset($resp->type)) {
                                switch ($resp->type) {
                                    case ADX\Model\Common::OBJ_LINK_TARGET_INTEREST:
                                        $arr_interest_id[] = $resp->audience_id;
                                        break;
                                    case ADX\Model\Common::OBJ_LINK_TARGET_INMARKET:
                                        $arr_inmarket_id[] = $resp->audience_id;
                                        break;
                                    case ADX\Model\Common::OBJ_LINK_TARGET_REMARKETING:
                                        $arr_remarketing_id[] = $resp->audience_id;
                                        break;
                                }
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

                        //get audience name
                        if (!empty($arr_interest_id)) {
                            $interests = ADX\Model\ElasticSearch::getDataInfo('interests', $arr_interest_id);
                        }

                        if (!empty($arr_inmarket_id)) {
                            $inmarkets = ADX\Model\ElasticSearch::getDataInfo('inmarkets', $arr_inmarket_id);
                        }

                        if (!empty($arr_remarketing_id)) {
                            $remarketing = ADX\Model\ElasticSearch::getDataInfoRM('remarketing', $arr_remarketing_id);
                        }

                        foreach ($result as &$resp) {

                            if (isset($lineitems[$resp->lineitem_id])) {
                                $resp->lineitem_name = isset($lineitems[$resp->lineitem_id]['lineitem_name']) ? $lineitems[$resp->lineitem_id]['lineitem_name'] : '';
                                $resp->lineitem_type_id = isset($lineitems[$resp->lineitem_id]['lineitem_type_id']) ? $lineitems[$resp->lineitem_id]['lineitem_type_id'] : '';
                            }

                            if (isset($campaigns[$resp->campaign_id])) {
                                $resp->campaign_name = isset($campaigns[$resp->campaign_id]['campaign_name']) ? $campaigns[$resp->campaign_id]['campaign_name'] : '';
                            }

                            if (isset($resp->audience_id) && isset($resp->type)) {
                                switch ($resp->type) {
                                    case ADX\Model\Common::OBJ_LINK_TARGET_INTEREST:
                                        if (isset($interests[$resp->audience_id])) {
                                            $resp->audience_name = isset($interests[$resp->audience_id]['interest_name_en']) ? $interests[$resp->audience_id]['interest_name_en'] : '';
                                        }
                                        break;
                                    case ADX\Model\Common::OBJ_LINK_TARGET_INMARKET:
                                        $resp->audience_name = isset($inmarkets[$resp->audience_id]['inmarket_name']) ? $inmarkets[$resp->audience_id]['inmarket_name'] : '';
                                        break;
                                    case ADX\Model\Common::OBJ_LINK_TARGET_REMARKETING:
                                        $resp->audience_name = isset($remarketing[$resp->audience_id]['remarketing_name']) ? $remarketing[$resp->audience_id]['remarketing_name'] : '';
                                        break;
                                }
                            }


                        }
                    }
                    break;
            }
        }

        return $result;
    }

    public static function setDataNestedColumn($params, $data, $body)
    {
        if (!isset($params['object'])) {
            return false;
        }

        $object_info = self::getObjectInfo($params['object']);

        if (isset($object_info['nested']) && $object_info['nested']) {
            switch ($params['object']) {
                case 'remarketing':
                    $body['full_name'] = isset($data->full_name) ? $data->full_name : '';
                    $body['full_name_raw'] = isset($data->full_name) ? trim(ADX\Utils::remove_accent($data->full_name)) : '';

                    $body['rm_type_name'] = isset($data->rm_type_name) ? $data->rm_type_name : '';
                    $body['rm_type_name_raw'] = isset($data->rm_type_name) ? trim(ADX\Utils::remove_accent($data->rm_type_name)) : '';

                    $body['status_name'] = ADX\Model\Common::renderStatusRemarketing($data->status);
                    $body['status_name_raw'] = trim(ADX\Utils::remove_accent(ADX\Model\Common::renderStatusRemarketing($data->status)));

                    $body['rm_group_type'] = isset($data->rm_group_type) ? $data->rm_group_type : '';
                    $body['rm_group_type_raw'] = isset($data->rm_group_type) ? trim(ADX\Utils::remove_accent($data->rm_group_type)) : '';

                    break;
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
                case 'campaign_section':
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

                    //sections
                    $body['sections'] = array(
                        'section_name' => isset($data->section_name) ? $data->section_name : '',
                        'section_name_raw' => isset($data->section_name) ? trim(ADX\Utils::remove_accent($data->section_name)) : '',
                    );
                    break;
                case 'campaign_demographic':
                case 'campaign_audience':
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

                    //audience
                    $body['audience_name'] = isset($data->audience_name) ? $data->audience_name : '';
                    $body['audience_name_raw'] = isset($data->audience_name) ? trim(ADX\Utils::remove_accent($data->audience_name)) : '';

                    break;
                case 'remarketing_label':
                    //lineitems & lineitem_type_id

                    $body['id'] = $data->remarketing_id . $data->label_id;
                    break;
                case 'campaign_label':
                    //lineitems & lineitem_type_id
                    $body['id'] = $data->campaign_id . $data->label_id;
                    break;
                case 'creative_label':
                    //lineitems & lineitem_type_id
                    $body['id'] = $data->creative_id . $data->label_id;
                    break;
            }
        }

        return $body;
    }

    public static function getReportInfo($object_name)
    {
        try {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object_name : $object_name,
                'type' => 'data',
                'body' => [
                    'from' => 0,
                    'size' => 100,
                    'query' => [
                        'bool' => [
                            'must' => []
                        ]
                    ]
                ]
            ];


            $rows = $client->search($body);

            return self::transform($rows);

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage(), $e->getCode());
        }
    }

    //
    public static function bulkData($params)
    {
        $arr_data = array();
        try {
            $offset = 0;
            $running = true;

            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $object_info = isset($params['object']) ? self::getObjectInfo($params['object']) : '';
            $limit = isset($params['limit']) ? $params['limit'] : 500;
            $prefix = isset($params['prefix']) ? $params['prefix'] : '';
            $arr_object_id = isset($params['arr_object_id']) ? (array)$params['arr_object_id'] : array();
            $arr_campaign_id = isset($params['arr_campaign_id']) ? (array)$params['arr_campaign_id'] : array();
            $target_type = isset($params['target_type']) ? $params['target_type'] : '';

            //Prefix
            if (!$prefix) {
                $prefix = isset($hosts['prefix']) ? $hosts['prefix'] : '';
            }

            $arr_data['params'] = array(
                'object' => $params['object'],
                'limit' => $limit,
                'arr_object_id' => $arr_object_id,
                'arr_campaign_id' => $arr_campaign_id,
                'target_type' => $target_type
            );

            //Mapping index
            if (isset($params['mapping']) && $params['mapping']) {
                self::mapping(array(
                    'object' => $params['object'],
                    'prefix' => $prefix
                ));
            }

            while ($running) {
                $private_key = $object_info['private_key'];
                $object_target = false;
                switch ($params['object']) {
                    case 'campaign_topic':
                        $private_key = 'topic_id';
                        $object_target = true;
                        break;
                    case 'campaign_section':
                        $private_key = 'section_id';
                        $object_target = true;
                        break;
                    case 'campaign_demographic':
                        $private_key = 'demographic_id';
                        $object_target = true;
                        break;
                    case 'campaign_audience':
                        $private_key = 'audience_id';
                        $object_target = true;
                        break;
                }

                if ($object_target) {
                    $result = call_user_func_array(array('ADX\\DAO\\ElasticSearch', $object_info['function_name']), array(array(
                        $private_key => $arr_object_id,
                        'campaign_id' => $arr_campaign_id,
                        'type' => $target_type,
                        'limit' => $limit,
                        'offset' => $offset
                    )));
                } else {
                    $result = call_user_func_array(array('ADX\\DAO\\ElasticSearch', $object_info['function_name']), array(array(
                        $private_key => $arr_object_id,
                        'limit' => $limit,
                        'offset' => $offset
                    )));
                }

                if (isset($result) && count($result)) {

                    //nested column
                    $result = ADX\Model\ElasticSearch::getDataNestedColumn(array(
                        'object' => $params['object']
                    ), $result);

                    if (count($result) < $limit) {
                        $running = false;
                    }

                    $request = array();
                    foreach ($result as $data) {
                        $id = '';
                        $arr_data_search = $object_info['data_search'];

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

                            if (in_array($process_key, self::$arr_key_by_pass_db)) {
                                continue;
                            }

                            if (empty($id) && $process_key == $object_info['private_key']) {
                                $id = $process_val;
                            }

                            if (isset($arr_data_search[$process_key])) {
                                $arr_data_search[$process_key] = $process_val;
                            }

                            if (array_key_exists($process_key, $object_info['index'])) {
                                $body[$process_key] = $process_val;
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

                        if (isset($body['from_date'])) {
                            $body['from_date'] = date('Y-m-d H:i:s', strtotime($body['from_date']));
                        }

                        if (isset($body['to_date'])) {
                            $body['to_date'] = date('Y-m-d H:i:s', strtotime($body['to_date']));
                        }

                        if (isset($body['ctime'])) {
                            $body['ctime'] = date('Y-m-d H:i:s', strtotime($body['ctime']));
                        }

                        if (isset($body['utime'])) {
                            $body['utime'] = date('Y-m-d H:i:s', strtotime($body['utime']));
                        }

                        //Query contain
                        if (isset($object_info['data_raw']) && !empty($object_info['data_raw'])) {
                            foreach ($object_info['data_raw'] as $raw) {
                                $body[$raw . '_raw'] = isset($data->{$raw}) ? ADX\Utils::remove_accent($data->{$raw}) : '';
                            }
                        }

                        //1 cot total_budget nhưng co 2 gia tri
                        if (property_exists($data, 'total_budget') && property_exists($data, 'daily_budget')) {
                            if ($data->daily_budget > 0) {
                                $body['budget'] = $data->daily_budget;
                            } else {
                                $body['budget'] = $data->total_budget;
                            }
                        }

                        //Them cot cho report(date_range_type)
                        if (property_exists($data, 'date_range') && $params['object'] == 'modify_reports') {
                            if ($data->date_range != '') {
                                $body['date_range_type'] = Model\Report::getIdDateRange(json_decode($data->date_range, true)['date_range']);
                            }
                        }

                        //Status cho campaign, creative
                        switch ($params['object']) {
                            case 'campaigns':
                                //Status name for sorting
                                if (isset($data->lineitem_id) && $data->lineitem_id && isset($data->operational_status) &&
                                    $data->operational_status
                                ) {
                                    $status = ADX\Model\Campaign::renderStatusV3(array(
                                        'lineitem_id' => $data->lineitem_id,
                                        'status' => $data->operational_status
                                    ));

                                    if ($status) {
                                        $body['status_name'] = $status;
                                        $body['status_name_raw'] = trim(ADX\Utils::remove_accent($status));
                                    }
                                }

                                break;
                            case 'creatives':
                                //Status name for sorting
                                if (isset($data->campaign_id) && $data->campaign_id && isset($data->lineitem_id) &&
                                    $data->lineitem_id && $data->operational_status
                                ) {
                                    $status = ADX\Model\Creative::renderStatus(array(
                                        'lineitem_id' => $data->lineitem_id,
                                        'campaign_id' => $data->campaign_id,
                                        'status' => $data->operational_status
                                    ), 'creatives');

                                    if ($status) {
                                        $body['status_name'] = $status;
                                        $body['status_name_raw'] = trim(ADX\Utils::remove_accent($status));
                                    }
                                }

                                break;
                        }

                        $body['data_search'] = Utils::remove_accent(implode(' ', array_values($arr_data_search)));

                        //nested column
                        $body = ADX\Model\ElasticSearch::setDataNestedColumn(array(
                            'object' => $params['object']
                        ), $data, $body);

                        $request['body'][] = $body;

                    }

                    $responses = $client->bulk($request);

                    $arr_data['body'] = $request;

                    if (isset($responses['errors']) && $responses['errors'] == 1) {
                        $arr_data['responses'] = $responses;
                        Utils::writeLog('Elastic_Bulk_Data', $arr_data);
                    }

                    //Update params
                    $offset += $limit;
                } else {
                    $running = false;
                }
            }

            //write log
            Utils::writeLog('Elastic_Bulk_Data', $arr_data);
        } catch (\Exception $e) {
            //write log
            Utils::writeLog('Elastic_Bulk_Data_Error', $arr_data);
            throw new \Exception($e->getMessage(), $e->getCode());
        }
    }

    //Sync data v2 and v3
    public static function rsyncData($params)
    {
        $object_name = isset($params['object_name']) ? $params['object_name'] : '';
        $arr_object_id = isset($params['arr_object_id']) ? $params['arr_object_id'] : '';
        $prefix = isset($params['prefix']) ? $params['prefix'] : '';

        if ($object_name) {
            $object_info = self::getObjectInfo($object_name);

            if ($object_info && $arr_object_id) {

                //bulk all data
                if ($arr_object_id == 'all') {
                    self::bulkData(array(
                        'object' => $object_name,
                        'limit' => 500,
                        'prefix' => $prefix
                    ));
                } else {
                    self::bulkData(array(
                        'object' => $object_name,
                        'arr_object_id' => $arr_object_id,
                        'limit' => 500,
                        'prefix' => $prefix
                    ));
                }
            }
        }
    }

    public static function addApiDataProccess($index_name, $params)
    {
        try {
            $client = Elastic::getInstances('info_slave');
            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];
            if (isset($params['user_id']) && isset($params['network_id'])) {
                $ip = Utils::getClientIp();
                $user_agent = $_SERVER['HTTP_USER_AGENT'];
                $timestamp = round(microtime(true) * 1000);
                $time_stamp = time();
                $method = $_SERVER['REQUEST_METHOD'];
                $request_uri = $_SERVER['REQUEST_URI'];
                $request_exp = explode('/', $request_uri);
                $module = '';
                $action = '';
                if (isset($request_exp[3])) {
                    $module = $request_exp[3];
                }
                if (isset($request_exp[4])) {
                    $action = explode('?', $request_exp[4]);
                    $action = $action[0];
                }

                $string = $params['network_id'] . '|' . $params['user_id'] . '|' . $time_stamp;
                $key = crc32($request_uri . '+' . microtime());
                $param_agent = [];
                if (!isset($params['platform'])) {
                    $param_agent = Utils::parse_user_agent($_SERVER['HTTP_USER_AGENT']);
                }
                $data_index = [
                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $index_name : $index_name,
                    'type' => 'data',
                    'id' => isset($params['api_id']) ? $params['api_id'] : $key,
                    'body' => [
                        'user_id' => $params['user_id'],
                        'network_id' => $params['network_id'],
                        'manager_id' => $params['manager_id'],
                        'api_id' => isset($params['api_id']) ? $params['api_id'] : $key,
                        'ip' => isset($params['ip']) ? $params['ip'] : $ip,
                        'platform' => isset($params['platform']) ? $params['platform'] : $param_agent['platform'],
                        'browser' => isset($params['browser']) ? $params['browser'] : $param_agent['browser'],
                        'browser_version' => isset($params['version']) ? $params['version'] : $param_agent['version'],
                        'timestamp' => $timestamp,
                        'method' => isset($params['method']) ? $params['method'] : $method,
                        'request_uri' => isset($params['request_uri']) ? $params['request_uri'] : $request_uri,
                        'params' => isset($params['params']) && !is_null($params['params']) ? json_encode($params['params']) : '',
                        'module' => isset($params['module']) ? $params['module'] : $module,
                        'action' => isset($params['action']) ? $params['action'] : $action,
                        'data_update' => isset($params['data_update']) && !is_null($params['data_update']) ? json_encode($params['data_update']) : '',
                        'data_proccess' => isset($params['data_proccess']) && !is_null($params['data_proccess']) ? json_encode($params['data_proccess']) : '',
                        'data_origin' => isset($params['data_origin']) && !is_null($params['data_origin']) ? json_encode($params['data_origin']) : '',
                        'data_respone' => isset($params['data_respone']) && !is_null($params['data_respone']) ? json_encode($params['data_respone']) : '',
                        'body_params' => isset($params['body_params']) && !is_null($params['body_params']) ? json_encode($params['body_params']) : '',
                        'related_id' => isset($params['related_id']) && !is_null($params['related_id']) ? $params['related_id'] : $key
                    ]
                ];

                if (!isset($params['update'])) {
                    $response = $client->index($data_index);
                    if ((isset($response['created']) && $response['created'] == 1)) {
                        return $key;
                    } else {
                        return 0;
                    }
                } else {
                    $updateParams['index'] = isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $index_name : $index_name;
                    $updateParams['type'] = 'data';
                    $updateParams['id'] = isset($params['api_id']) ? $params['api_id'] : $key;
                    $updateParams['body']['doc'] = $data_index['body'];
                    $response = $client->update($updateParams);
                    if ((isset($response['_version']) && $response['_version'] > 1)) {
                        return $key;
                    } else {
                        return 0;
                    }
                }
            }
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function mappingIndexApi()
    {
        try {
            $client = Elastic::getInstances('info_slave');
            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];
            $object_info = self::getObjectInfo('api_logs');
            $current_date = date('d_m_Y');
            if (!empty($object_info['index'])) {
                $params = [
                    'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'api_logs' . "_" . $current_date : 'api_logs' . '_' . $current_date,
                    'body' => [
                        'settings' => [
                            'number_of_shards' => 2,
                            'number_of_replicas' => 1
                        ],
                        'mappings' => [
                            'data' => [
                                '_source' => [
                                    'enabled' => true
                                ],
                                'properties' => $object_info['index']
                            ]
                        ]
                    ]
                ];

                if (isset($object_info['refresh_interval'])) {
                    $params['body']['settings'] = array('refresh_interval' => $object_info['refresh_interval']);
                }

                //Check index exist or not
                $indexParams['index'] = $params['index'];
                $result_check = $client->indices()->exists($indexParams);
                // Create the index with mappings and settings now
                $arr_respone = ['index' => $indexParams['index']];
                if (!$result_check) {
                    $response = $client->indices()->create($params);
                    $arr_respone = array('index' => $indexParams['index'], 'respone' => $response);
                }
                return $arr_respone;
            }

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function deleteIndexApiLog($object_name)
    {
        try {
            $object_info = self::getObjectInfo('api_logs');

            if (!$object_info) {
                //return error
            }

            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];
            $id = $object_info['private_key'];
            $deleteParams = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $object_name : $object_name
            ];
            $result_check = $client->indices()->exists($deleteParams);
            if ($result_check) {
                $response = $client->indices()->delete($deleteParams);
                return $response;
            } else {
                return 0;
            }

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function writeLog($params)
    {
        $client = Elastic::getInstances('info_slave');

        //get config
        $config = ADX\Config::get('elastic');
        $hosts = $config['elastic']['adapters']['info_slave'];

        if (isset($params['user_id']) && isset($params['network_id'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
            $user_agent = $_SERVER['HTTP_USER_AGENT'];
            $timestamp = date('Y-m-d H:i:s');
            $method = $_SERVER['REQUEST_METHOD'];
            $request_uri = $_SERVER['REQUEST_URI'];
            $string = $params['network_id'] . '|' . $params['user_id'] . '|' . $timestamp;
            $key = Utils::encode($string, API_KEY);
            $params = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'logs' : 'logs',
                'type' => 'data',
                'id' => $key,
                'body' => [
                    'user_id' => $params['user_id'],
                    'network_id' => $params['network_id'],
                    'manager_id' => $params['manager_id'],
                    'ip' => $ip,
                    'user_agent' => $user_agent,
                    'timestamp' => $timestamp,
                    'method' => $method,
                    'request_uri' => $request_uri,
                    'params' => isset($params['params']) ? json_encode($params['params']) : ''
                ]
            ];
            $response = $client->index($params);
            if (isset($response['created']) && $response['created'] == 1) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    public static function getHistoryLogData($params)
    {
        try {
            $client = Elastic::getInstances('info_slave');

            //get config
            $config = ADX\Config::get('elastic');
            $hosts = $config['elastic']['adapters']['info_slave'];

            $must = self::addWhereQuery($params);

            $body = [
                'index' => isset($hosts['prefix']) ? $hosts['prefix'] . '.' . 'history_logs' : 'history_logs',
                'type' => 'data',
                'body' => [
                    'from' => 0,
                    'size' => 100,
                    'query' => [
                        'bool' => [
                            'must' => $must
                        ]
                    ],
                    "sort" => [
                        "c_time" => [
                            "order" => "desc"
                        ]
                    ],
                ]
            ];

            $result = $client->search($body);

            $data = array();
            if (isset($result['hits']['hits']) && !empty($result['hits']['hits'])) {
                foreach ($result['hits']['hits'] as $rows) {
                    if (isset($rows['_source']) && !empty($rows['_source'])) {
                        $data[] = $rows['_source'];
                    }
                }
            }
            return $data;

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function getInfoObjectId($object_id)
    {
        $data = array(
            'object_name' => ''
        );

        switch ($object_id) {
            case 'device_id':
                $data = array(
                    'object_name' => 'devices'
                );
                break;
        }

        return $data;
    }

    private function addWhereQuery($params = array())
    {
        $must = array();

        if (isset($params['from_date'])) {
            array_push($must, array(
                "constant_score" => [
                    "filter" => [
                        "numeric_range" => array(
                            'c_time' => [
                                'gte' => (int)strtotime($params['from_date'])
                            ]
                        )
                    ]
                ]

            ));
        }

        if (isset($params['to_date'])) {
            array_push($must, array(
                "constant_score" => [
                    "filter" => [
                        "numeric_range" => array(
                            'c_time' => [
                                'lte' => (int)strtotime($params['to_date'])
                            ]
                        )
                    ]
                ]

            ));
        }

        if (isset($params['client_id'])) {
            array_push($must, array(
                "term" => array(
                    'client_id' => $params['client_id']
                )
            ));
        }

        if (isset($params['is_read'])) {
            array_push($must, array(
                "term" => array(
                    'is_read' => $params['is_read']
                )
            ));
        }

        if (isset($params['object_id'])) {
            array_push($must, array(
                "term" => array(
                    'object_id' => $params['object_id']
                )
            ));
        }

        if (isset($params['object_type'])) {
            array_push($must, array(
                "term" => array(
                    'object_type' => $params['object_type']
                )
            ));
        }

        if (isset($params['manager_id'])) {
            array_push($must, array(
                "term" => array(
                    'manager_id' => $params['manager_id']
                )
            ));
        }

        if (isset($params['object_name'])) {
            array_push($must, array(
                "term" => array(
                    'object_name' => $params['object_name']
                )
            ));
        }

        return $must;
    }

    public static function transform($rows)
    {
        $data = array();
        $result = array();

        if (isset($rows['hits']['hits']) && !empty($rows['hits']['hits'])) {
            foreach ($rows['hits']['hits'] as $row) {
                if (isset($row['_source']) && !empty($row['_source'])) {
                    $result[] = $row['_source'];
                }
            }

            $data['data'] = $result;
        }

        if (isset($rows['hits']['total'])) {
            $data['total'] = $rows['hits']['total'];
        }

        return $data;
    }

    public static function getallLabelObject($params)
    {
        return DAO\Label::getallLabelObject($params);
    }

    public static function getTargetById($object = '', $params = array())
    {
        $object_info = self::getObjectInfo($object);
        $client = Elastic::getInstances('info_slave');

        $should = array();
        if (isset($params['should']) && !empty($params['should'])) {
            foreach (json_decode($params['should'], true) as $field => $row) {
                $row = (array)$row;
                foreach ($row as $op => $value) {
                    switch ($op) {
                        case 'equals':
                            //

                            array_push($should, array(
                                "term" => array(
                                    $field => $value
                                )
                            ));
                            break;
                        case 'in':
                            //
                            array_push($should, array(
                                "terms" => array(
                                    $field => $value
                                )
                            ));

                            break;
                    }
                }
            }
        }
        $sort = array();
        if ($object == 'ages') {
            $sort = array(
                array(
                    'level_position' => array(
                        'order' => 'DESC'
                    )
                )
            );
        }

        $request = [
            'index' => $object,
            'type' => 'data',
            'body' => [
                'from' => 0,
                'size' => 5000,
                'sort' => $sort,
                'query' => [
                    'bool' => [
                        'must' => $should
                    ]
                ]
            ]
        ];

        $rows = $client->search($request);
        $result = array();

        if ($object == 'remarketing') {
            $object_info['private_key'] = 'remarketing_id';
        }
        
        if (isset($rows['hits']['hits']) && !empty($rows['hits']['hits'])) {
            foreach ($rows['hits']['hits'] as $row) {
                if (isset($row['_source']) && !empty($row['_source'])) {
                    $result[$row['_source'][$object_info['private_key']]] = $row['_source'];
                }
            }
        }

        return $result;
    }
}