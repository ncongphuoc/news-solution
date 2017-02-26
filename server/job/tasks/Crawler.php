<?php

namespace TASK;

use MT\Model,
    My\General;

class Crawler
{
    public function hotTrend($params)
    {
        date_default_timezone_set('Asia/Saigon');
        $fileNameSuccess = __CLASS__ . '_' . __FUNCTION__ . '_Success';
        $fileNameError = __CLASS__ . '_' . __FUNCTION__ . '_Error';

        try {
            $current_date = date('Y-m-d');
            $instanceSearchKeyWord = new \MT\Search\Keyword();
            for ($i = 0; $i <= 10; $i++) {
                $date = strtotime('-' . $i . ' days', strtotime($current_date));
                $date = date('Ymd', $date);
                echo \My\General::getColoredString("Date = {$date}", 'cyan');
                $href = 'https://www.google.com/trends/hottrends/hotItems?ajax=1&pn=p1&htd=' . $date . '&htv=l';
                $responseCurl = \My\General::crawler($href);
                $arrData = json_decode($responseCurl, true);

                foreach ($arrData['trendsByDateList'] as $data) {
                    foreach ($data['trendsList'] as $data1) {
                        $arr_key[] = $data1['title'];
                        if (!empty($data1['relatedSearchesList'])) {
                            foreach ($data1['relatedSearchesList'] as $arr_temp) {
                                if (!empty($arr_temp['query'])) {
                                    array_push($arr_key, $arr_temp['query']);
                                }
                            }
                        }

                        foreach ($arr_key as $val) {
                            $is_exits = $instanceSearchKeyWord->searchData([
                                'key_slug' => trim(General::getSlug($val)),
                                'limit' => 1,
                                'page' => 1,
                                'source' => ['key_id']
                            ]);

                            if ($is_exits['total']) {
                                continue;
                            }

                            $url_gg = 'https://www.google.com.vn/search?sclient=psy-ab&biw=1366&bih=212&espv=2&q=' . rawurlencode($val) . '&oq=' . rawurlencode($val);

                            $gg_rp = \My\General::crawler($url_gg);

                            $gg_rp_dom = new \Zend\Dom\Query($gg_rp);
                            $results = $gg_rp_dom->execute('.st');

                            if (!count($results)) {
                                continue;
                            }

                            $key_description = '';

                            foreach ($results as $item) {
                                empty($key_description) ?
                                    $key_description .= '<p><strong>' . strip_tags($item->textContent) . '</strong></p>' :
                                    $key_description .= '<p>' . strip_tags($item->textContent) . '</p>';
                            }

                            $serviceKeyword = new \MT\Model\Keyword();

                            $id = $serviceKeyword->add([
                                'key_name' => $val,
                                'key_slug' => General::getSlug($val),
                                'is_crawler' => 0,
                                'created_date' => time(),
                                'key_description' => $key_description
                            ]);

                            if ($id) {
                                echo \My\General::getColoredString("Insert to tbl_keyword success key_name =  {$val} \n", 'green');
                            } else {
                                echo \My\General::getColoredString("Insert to tbl_keyword ERROR key_name =  {$val} \n", 'red');
                            }
                            unset($serviceKeyword, $gg_rp, $gg_rp_dom, $key_description, $id);
                            self::flush();
                            //random sleep
                            sleep(rand(4, 10));
                        }
                        self::flush();
                    }
                    self::flush();
                }
                self::flush();
            }
            echo \My\General::getColoredString("Crawler Hot Trend Done", 'yellow');

            if ($params['init_key']) {
                \MT\Utils::runJob(
                    'info',
                    'TASK\Crawler',
                    'crawlerKeyword',
                    'doHighBackgroundTask',
                    'admin_crawler',
                    array(
                        'actor' => __FUNCTION__,
                        'id' => 1
                    )
                );
            }
            \MT\Utils::writeLog($fileNameSuccess, $params);
            return true;
        } catch (\Exception $ex) {
            if (APPLICATION_ENV !== 'production') {
                die($ex->getMessage());
            }
            \MT\Utils::writeLog($fileNameError, $params);
            return false;
        }
    }

    public static function flush()
    {
        ob_end_flush();
        ob_flush();
        flush();
    }

    public function initKeyword($params)
    {
        date_default_timezone_set('Asia/Saigon');
        $fileNameSuccess = __CLASS__ . '_' . __FUNCTION__ . '_Success';
        $fileNameError = __CLASS__ . '_' . __FUNCTION__ . '_Error';

        $arrParam = [
            'params_input' => $params
        ];
        date_default_timezone_set('Asia/Saigon');

        try {

            $arr_key = [

            ];

            $instanceSearchKeyWord = new \My\Search\Keyword();
            foreach ($arr_key as $name) {
                $isexist = $instanceSearchKeyWord->getDetail(['key_slug' => General::getSlug($name)]);

                if ($isexist) {
                    continue;
                }
                $arr_data = [
                    'key_name' => $name,
                    'key_slug' => trim(General::getSlug($name)),
                    'created_date' => time(),
                    'is_crawler' => 0
                ];
                $serviceKeyword = $this->serviceLocator->get('My\Models\Keyword');
                $int_result = $serviceKeyword->add($arr_data);
                unset($serviceKeyword);
                if ($int_result) {
                    echo General::getColoredString("add keyword : {$name} success id : {$int_result} ", 'green');
                } else {
                    echo General::getColoredString("add keyword : {$name} error", 'red');
                }
                $this->flush();
            }
            echo General::getColoredString("add keyword complete", 'yellow', 'cyan');
            return true;

        } catch (\Exception $ex) {
            $arrParam['exc'] = [
                'code' => $ex->getCode(),
                'messages' => $ex->getMessage()
            ];
            \MT\Utils::writeLog($fileNameError, $arrParam);
        }
    }

    public function crawlerKeyword($params)
    {
        date_default_timezone_set('Asia/Saigon');
        $fileNameSuccess = __CLASS__ . '_' . __FUNCTION__ . '_Success';
        $fileNameError = __CLASS__ . '_' . __FUNCTION__ . '_Error';

        try {
            $id = $params['id'];

            $match = [
                '', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
            ];
            $instanceSearchKeyWord = new \MT\Search\Keyword();
            $arr_keyword = $instanceSearchKeyWord->searchData(
                [
                    'is_crawler' => 0,
                    'key_id' => $id,
                    'limit' => 1,
                    'page' => 1,
                    'sort' => ['key_id' => ['order' => 'asc']],
                    'source' => [
                        'key_id', 'key_name'
                    ]
                ]
            );

            unset($instanceSearchKeyWord);

            if (!$arr_keyword['total']) {
                return;
            }
            $arr_keyword = current($arr_keyword['rows']);

            $serviceKeyword = new \MT\Model\Keyword();
            $status = $serviceKeyword->update(
                [
                    'is_crawler' => 1,
                    'updated_date' => time()
                ],
                [
                    'key_id' => $id
                ]
            );
            unset($status);

            $keyword = $arr_keyword['key_name'];

            foreach ($match as $key => $value) {
                if ($key == 0) {
                    $key_match = $keyword . $value;
                    $url = 'http://www.google.com/complete/search?output=search&client=chrome&q=' . rawurlencode($key_match) . '&hl=en&gl=us';
                    $return = \My\General::crawler($url);
                    self::add_keyword(json_decode($return)[1]);
                    continue;
                } else {
                    for ($i = 0; $i < 2; $i++) {
                        if ($i == 0) {
                            $key_match = $keyword . ' ' . $value;
                        } else {
                            $key_match = $value . ' ' . $keyword;
                        }
                        $url = 'http://www.google.com/complete/search?output=search&client=chrome&q=' . rawurlencode($key_match) . '&hl=en&gl=us';
                        $return = \My\General::crawler($url);
                        self::add_keyword(json_decode($return)[1]);
                        continue;
                    }
                }
                self::flush();
            };
            self::flush();

            \MT\Utils::runJob(
                'info',
                'TASK\Crawler',
                'crawlerKeyword',
                'doHighBackgroundTask',
                'admin_crawler',
                array(
                    'actor' => __FUNCTION__,
                    'id' => $id + 1
                )
            );

            \MT\Utils::writeLog($fileNameSuccess, $params);

        } catch (\Exception $e) {
            $params['exc'] = [
                'code' => $e->getCode(),
                'messages' => $e->getMessage()
            ];
            \MT\Utils::writeLog($fileNameError, $params);
        }
    }

    public static function add_keyword($arr_key)
    {
        if (empty($arr_key)) {
            return false;
        }

        $instanceSearchKeyWord = new \MT\Search\Keyword();
        foreach ($arr_key as $key_word) {

            $is_exits = $instanceSearchKeyWord->searchData([
                'key_slug' => trim(\My\General::getSlug($key_word)),
                'limit' => 1,
                'page' => 1,
                'source' => ['key_id']
            ]);

            if ($is_exits['total']) {
                continue;
            }

            $arr_data = [
                'key_name' => $key_word,
                'key_slug' => trim(\My\General::getSlug($key_word)),
                'created_date' => time(),
                'is_crawler' => 0,
                'key_description' => ''
            ];

            $serviceKeyword = new \MT\Model\Keyword();
            $int_result = $serviceKeyword->add($arr_data);
            unset($serviceKeyword);
            if ($int_result) {
                echo \My\General::getColoredString("Insert success 1 row with id = {$int_result}", 'yellow');
            }
            self::flush();
        }
        unset($instanceSearchKeyWord);
        return true;
    }
}