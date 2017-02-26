<?php
namespace MT\Business;

class Api
{
    const TYPE_UNKNOWN = 0;

    public static function errorCodeApp($code)
    {
        $arrayError = array(
            100 => 'Error Username Or Password Empty',
            101 => 'Error Function',
            102 => 'Error User Id Empty',
            103 => 'Error User Un Active',
            104 => 'Error Network Id',
            105 => '',
            200 => 'Success'
        );

        return isset($arrayError[$code]) ? $arrayError[$code] : 'UnKnown';
    }

    public static function errorCode($code)
    {
        $arrayError = array(
            100 => 'Error Username Or Password Empty',
            101 => 'Error Function',
            102 => 'Error User Id Empty',
            103 => 'Error User Un Active',
            104 => 'Error Network Id',
            105 => 'Username or password is not wrong',
            106 => 'Error Delete. Try again, Please!',
            107 => 'Error Code Authen Google.',
            200 => 'Success',
            204 => 'No data result.',
            420 => 'User do not exists.',
            421 => 'No found website.',
            422 => 'No found creative.',
            423 => 'Error update. Try again, Please!',
            424 => 'From_date value not null.',
            425 => 'To_date value not null.',
            426 => 'Error creative_id value.',
            427 => 'Error website_id value.',
            428 => 'Error status value.',
            429 => 'Error status value, Only accept 0 or 1.',
            430 => 'Error format param.',
            431 => 'Error status value, Only accept 1 or 2.',
            432 => 'Error zone_id value',
            433 => 'Error campaign_id value',
            434 => 'Error type value',
            435 => 'Error from_date value',
            436 => 'Error to_date value',
            437 => 'Error to_date < from_date',
            438 => 'Maximum is 180 days',
            510 => 'Error token.',
            511 => 'Error token.',
            512 => 'Error token.',
            513 => 'Error token.',
            514 => 'Error token.',
            515 => 'Token expired.',
            516 => 'Error API.',
            517 => 'Error API.',
            518 => 'Token old',
            519 => 'Error params',
            520 => 'Error function',
            521 => 'Error data',
            522 => 'Create campaign failed, please try again',
            523 => 'Invalid Line Item ID',
            524 => 'Invalid campaign name',
            525 => 'Invalid Campaign Target',
            526 => 'Invalid Campaign Type',
            527 => 'Invalid Campaign Bid Price',
            528 => 'Bid is too low',
            529 => 'Line Item detail not found',
            530 => 'Bid price can not greater than total budget',
            531 => 'Current date is greater than start date',
            532 => 'Current date is greater than end date',
            533 => 'Campaign name is too long',
            534 => 'The demographics targeting method has no effect on reach as all options are being targeted. Please remove at least one criterion or choose another targeting method.',
            535 => 'A Campaign with this name already exists in the Line item',
            536 => 'Please select at least one criterion',
            537 => 'Bid price of campaign must be a number',
            538 => 'Not match key',
            539 => 'Bid price can not greater than daily budget',
            540 => 'Campaign detail not found',
            541 => 'Invalid bid value',
            542 => 'Invalid action for bidding price',
            543 => 'Invalid case for bidding case for bidding must be is dong or %',
            544 => 'Invalid bidding',
            545 => 'Invalid value limit for increase and decrease',
            546 => 'Invalid target id',
            547 => 'Invalid target type',
            548 => 'Invalid status of target',
            600 => 'Invalid payment model',
            601 => 'Campaign can not be delete because it alreay have static',
            602 => 'Campaign have static',
            603 => 'Invalid campaign',
            604 => 'Invalid Package',
            605 => 'From date can not greater than from date package or from date package can not smaller than to date package',
            606 => 'To date can not smaller than to date package or to date can not greater than from date package',
            607 => 'Invalid list campaign id',
            608 => 'Invalid list remarketing id',
            609 => 'Invalid Package ID',
            610 => 'Your remarketing has been link to campaign you is owner',
            611 => 'Remove remarketing failed',
            612 => 'Invalid remarketing id',
            613 => 'Invalid status remarketing',
            614 => 'Lineitem is removed or deleted',
            615 => 'Can not add target remarketing to campaign because have at least one target is closed',
            616 => 'Can not change membership status',
            617 => 'This campaign had been removed',
            618 => 'Description must have max lenght is 2000',
            619 => 'Invalid duration',
            620 => 'Invalid remarketing name',
            621 => 'Invalid remarketing rules',
            622 => 'Invalid remarketing type',
            623 => 'Can not add remarketing to campaign because can not find info of campaign',
            624 => "You don't have permission for update remarketing init default by system",
            625 => "Update failed",
            626 => 'Bid price of campaign smaller than price of package',
            627 => 'This remarketing has been removed',
            628 => 'Invalid Package Name',
            629 => 'Payment Model is Not Empty',
            630 => 'Invalid Payment Model',
            631 => 'Invalid Sale Price',
            632 => 'Package name already exists in the system',
            633 => 'Location is not Empty',
            633 => 'Time Frame is not Empty',
            634 => 'Placement is not Empty',
            635 => 'Find not found Placement in DB',
            636 => 'Find not found Browser in DB',
            637 => 'Find not found Os Version in DB',
            638 => 'Find not found Section in DB',
            639 => 'Find not found Topic in DB',
            640 => 'Frequency is not smaller 1',
            641 => 'Find not found Remarketing in DB',
            642 => 'Find not found Inmarketing in DB',
            643 => 'Find not found Interest in DB',
            644 => 'Invalid Age',
            645 => 'Invalid Frequency',
            646 => 'Invalid Frequency Life time',
            647 => 'Invalid Frequency Type',
            648 => 'Create Package Error'
        );

        return isset($arrayError[$code]) ? $arrayError[$code] : 'Error UnDefine';
    }

    /**
     * @param $name
     * @return int
     */
    public static function checkToken($params)
    {
        //$key = API_KEY;
        //$signature = API_SIGNATURE;

        if (isset($params['token'])) {
            $token = $params['token'];
        } else {
            return array(
                'status' => 'error',
                'error_code' => 510
            );
        }

        //
        $decode_token = Utils::decode($token, API_KEY);
        $exp_token = explode('|', $decode_token);

        if (!is_array($exp_token) || count($exp_token) != 4) {
            return array(
                'status' => 'error',
                'error_code' => 511
            );
        }

        $network_id_token = $exp_token[0];
        $user_id_token = $exp_token[1];
        $time = date('d-m-Y H:i:s', $exp_token[2]);
        $signature_token = $exp_token[3];

        /*$today = date('d-m-Y H:i:s', strtotime(date("Y-m-d H:i:s")));

        $fromDateObj = date_create($time);
        $currentDateObj = date_create($today);

        $interval = date_diff($fromDateObj, $currentDateObj);
        $day = $interval->days;

        if ($day > API_DATE_LIMIT) {
            return array(
                'status' => 'error',
                'error_code' => 515
            );
        }*/

        //
        if (empty($network_id_token)) {
            return array(
                'status' => 'error',
                'error_code' => 512
            );
        }

        if (empty($user_id_token)) {
            return array(
                'status' => 'error',
                'error_code' => 513
            );
        }
        //Check signature
        if (empty($signature_token) || $signature_token != API_SIGNATURE) {
            return array(
                'status' => 'error',
                'error_code' => 514
            );
        }
        /*
        //Validate Token current old?
        $redis = Adx_Nosql_Redis::getInstance('token');
        //key
        $key = 'token:' . $network_id_token . ':' . $user_id_token;
        //Limit request token in day: time, count
        $token_redis = $redis->HGET($key, 'token');
        //
        if (empty($token_redis)) {
            return array(
                'status' => 'error',
                'error_code' => 515
            );
        }
        //
        if (trim($token_redis) != trim($token)) {
            return array(
                'status' => 'error',
                'error_code' => 518
            );
        }
        */
        //
        return array(
            'status' => 'success',
            'token' => $token,
            'user_id' => $user_id_token,
            'network_id' => $network_id_token,
            'signature' => $signature_token
        );

    }

    public function webCreativeLockStatus($check = true, $status = -1)
    {
        $arrStatus = array(
            Adx_Model_CreativeSection::BLOCK_BY_CREATIVE => '?� ch?n',
            Adx_Model_CreativeSection::DELIVERY => 'Ch?a ch?n'
        );

        //
        if ($check) {
            return isset($arrStatus[$status]) ? true : false;
        } else {
            return isset($arrStatus[$status]) ? $arrStatus[$status] : '';
        }
    }

    public function renderStatus($object, $status)
    {
        $result = '';
        switch ($object) {
            case "campaigns":
                $result = Adx_Model_Campaign::displayStatus($status)['name'] ? Adx_Model_Campaign::displayStatus($status)['name'] : null;
                break;
            case "creatives":
                if ($status == 1) {
                    $status = Adx_Model_CreativeSection::BLOCK_BY_CREATIVE;
                } else if ($status == 2) {
                    $status = Adx_Model_CreativeSection::DELIVERY;
                }
                $result = Adx_Business_Api::webCreativeLockStatus(false, $status);
                break;
            case "activity":

                break;
        }
        return $result;
    }

    public static function formatData($rows, $object = '')
    {
        //
        if (is_array($rows)) {
            foreach ($rows as $keys => $row) {
                $rows[$keys] = array_change_key_case($row);
                //
                if (is_array($rows[$keys])) {
                    $data = $rows[$keys];
                    foreach ($data as $key => $value) {
                        switch ($key) {
                            case "files":
                                $data['creative_image'] = '';
                                $decode_value = json_decode($value, true);
                                $name = 'file';
                                if (isset($decode_value['image']) && !empty($decode_value['image'])) {
                                    $name = 'image';
                                }
                                //
                                $data['creative_image'] = (isset($decode_value[$name][0]['url']) && !empty($decode_value[$name][0]['url']) ? (UPLOAD_URL . '/' . $decode_value[$name][0]['url']) : '');
                                //
                                unset($data[$key]);
                                break;
                            case "campaign_id":
                            case "zone_id":
                            case "click_amount":
                            case "creative_id":
                            case "website_id":
                            case "total_budget":
                            case "true_impression":
                            case "impression_amount":
                            case "user_id":
                            case "manager_id":
                            case "network_id":
                            case "placement_id":
                            case "ads_id":
                            case "daily_budget":
                            case "total_click":
                            case "daily_click":
                            case "total_imp":
                            case "daily_imp":
                            case "total_install":
                            case "daily_install":
                            case "debit_budget":
                            case "spent_budget":
                            case "spent_click":
                            case "spent_imp":
                            case "spent_install":
                            case "history_id":
                            case "object_id":
                            case "parent_id":
                            case "resource_id":
                            case "balance_change_id":
                            case "balance":
                            case "conversion_windown":
                            case "value":
                                $data[$key] = (int)$value;
                                break;
                            case "ctr":
                            case "true_ctr":
                                $data[$key] = (float)$value;
                                break;
                            case "status":
                                $data[$key] = Adx_Business_Api::renderStatus($object, $value);
                                break;
                            case "note":
                                $data[$key] = json_decode($value);
                                break;
                            case "conversion_type":
                            case "tracking_status":
                            case "spent_amount":
                            case "recno":
                            case "bid_price":
                            case "camp_payment_model":
                            case "camp_resource_type":
                            case "is_refund":
                            case "found_rows":
                            case "row_num":
                                unset($data[$key]);
                                break;
                        }

                        $rows[$keys] = $data;
                    }
                }
            }
        }
        return $rows;
    }

    public static function renderMetricsObject($rows)
    {
        if (is_array($rows)) {
            switch ($rows['id']) {
                case "campaign_name":
                    $rows['name'] = 'Campaign name';
                    $rows['val_type'] = self::TYPE_STRING;
                    break;
                case "status":
                    $rows['name'] = 'Status';
                    $rows['val_type'] = self::TYPE_STRING;
                    break;
                case "total_budget":
                    $rows['name'] = 'Total budget';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "daily_budget":
                    $rows['name'] = 'Daily budget';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "total_click":
                    $rows['name'] = 'Total click';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "daily_click":
                    $rows['name'] = 'Daily click';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "total_imp":
                    $rows['name'] = 'Total impression';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "daily_imp":
                    $rows['name'] = 'Daily impression';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "total_install":
                    $rows['name'] = 'Total install';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "daily_install":
                    $rows['name'] = 'Daily install';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "from_date":
                    $rows['name'] = 'From date';
                    $rows['val_type'] = self::TYPE_DATE;
                    break;
                case "to_date":
                    $rows['name'] = 'To date';
                    $rows['val_type'] = self::TYPE_DATE;
                    break;
                case "debit_budget":
                    $rows['name'] = 'Debit budget';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "spent_budget":
                    $rows['name'] = 'Spent budget';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "spent_click":
                    $rows['name'] = 'Spent click';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "spent_imp":
                    $rows['name'] = 'Spent impression';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "spent_install":
                    $rows['name'] = 'Spent install';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "remain_budget":
                    $rows['name'] = 'Remain budget';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "conversion_label":
                    $rows['name'] = 'Conversion label';
                    $rows['val_type'] = self::TYPE_STRING;
                    break;
                case "conversion_windown":
                    $rows['name'] = 'Conversion windown';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "count":
                    $rows['name'] = 'Count';
                    $rows['val_type'] = self::TYPE_STRING;
                    break;
                case "conversions":
                    $rows['name'] = 'Conversions';
                    $rows['val_type'] = self::TYPE_INTEGER;
                    break;
                case "cate_name":
                    $rows['name'] = 'Cate name';
                    $rows['val_type'] = self::TYPE_STRING;
                    break;
                case "source_name":
                    $rows['name'] = 'Source name';
                    $rows['val_type'] = self::TYPE_STRING;
                    break;

            }
        }
        return $rows;
    }

    public static function convertDataApps($result, $main_objects, $metrics_objects, $object)
    {
        if (isset($result['rows']) && !empty($result['rows'])) {
            $result['rows'] = self::formatData($result['rows'], $object);
            foreach ($result['rows'] as &$row) {
                if (isset($row['found_rows'])) {
                    unset($row['found_rows']);
                }
                $items = array();

                switch ($object) {
                    case 'campaigns';
                        if (array_key_exists('total_budget', $row) && array_key_exists('spent_budget', $row)) {
                            $row['remain_budget'] = $row['total_budget'] - $row['spent_budget'];
                        }
                        break;
                }

                foreach ($row as $key => $value) {

                    if (!in_array($key, $main_objects)) {
                        if (!in_array($key, $metrics_objects) && array_key_exists($key, $row)) {
                            unset($row[$key]);
                            continue;
                        }

                        $object = array(
                            'id' => $key,
                            'value' => $value,
                            'name' => '',
                            'val_type' => ''
                        );

                        $object = self::renderMetricsObject($object);

                        array_push($items, $object);

                        if (array_key_exists($key, $row)) {
                            unset($row[$key]);
                        }
                    }
                }
                $row['metrics'] = $items;
            }
        }
        return $result['rows'];
    }

    public static function resultData($rows, $token, $website_id, $limit, $page, $object)
    {

        $total = isset($rows[0]['FOUND_ROWS']) ? intval($rows[0]['FOUND_ROWS']) : 0;

        $next = ($total - ($total % $limit)) / $limit;
        $str_page_next = 'http://' . $_SERVER['SERVER_NAME'] . '/api/creative/get-waiting-approve?token=' . $token['token'];

        if (!empty($limit)) {
            $str_page_next .= '&limit=' . $limit;
        }

        if (!empty($website_id)) {
            $str_page_next .= '&website_id=' . $website_id;
        }

        $str_page_pre = $str_page_next;

        if ($page + 1 > $next) {
            $str_page_next = '';
        } else {
            $str_page_next .= '&page=' . ($page + 1);
        }

        if ($page <= 1) {
            $str_page_pre = '';
        } else {
            $str_page_pre .= '&page=' . ($page - 1);
        }

        //
        foreach ($rows as $key => $value) {
            if (isset($value['STATUS'])) {
                if ($value['STATUS'] == Adx_Model_CreativeSection::BLOCK_BY_CREATIVE) {
                    $rows[$key]['change_status'] = array(
                        self::CHANGE_STATUS_KHONG_CHAN => "Kh�ng ch?n"
                    );
                } else {
                    $rows[$key]['change_status'] = array(
                        self::CHANGE_STATUS_CHAN => "Ch?n"
                    );
                }
            }
        }

        $result = array(
            $object => array(
                'total' => $total,
                'rows' => Adx_Business_Api::formatData($rows, $object),
                'page' => array(
                    'next' => $str_page_next,
                    'pre' => $str_page_pre
                )
            )
        );

        return $result;
    }

    public static function checkCreativeApprove($params)
    {
        //
        $token = Adx_Business_Api::checkToken($params);
        //
        if ($token['status'] == 'error') {
            return array(
                'status' => 'error',
                'error_code' => $token['error_code']
            );
        }

        if (isset($params['creative_id']) &&
            !empty($params['creative_id'])
        ) {
            $creative_id = $params['creative_id'];
        } else {
            return array(
                'status' => 'error',
                'error_code' => '426'
            );
        }

        //
        if (isset($params['website_id']) &&
            !empty($params['website_id']) &&
            is_numeric($params['website_id'])
        ) {
            $website_id = $params['website_id'];
        } else {
            return array(
                'status' => 'error',
                'error_code' => '427'
            );
        }

        //
        if (isset($params['change_status']) &&
            !empty($params['change_status']) &&
            is_numeric($params['change_status'])
        ) {
            $change_status = $params['change_status'];
            if (!in_array($change_status, array(
                self::CHANGE_STATUS_CHAN,
                self::CHANGE_STATUS_KHONG_CHAN,
            ))
            ) {
                return array(
                    'status' => 'error',
                    'error_code' => '429'
                );
            }
        } else {
            return array(
                'status' => 'error',
                'error_code' => '428'
            );
        }

        return array(
            'status' => 'success',
            'user_id' => $token['user_id'],
            'network_id' => $token['network_id'],
            'signature' => $token['signature'],
            'creative_id' => $creative_id,
            'website_id' => $website_id,
            'change_status' => $change_status
        );
    }

    public static function checkReport($params)
    {
        $token = Adx_Business_Api::checkToken($params);

        if ($token['status'] == 'error') {
            return array(
                'status' => 'error',
                'error_code' => $token['error_code']
            );
        }

        if (isset($params['from_date']) && !empty($params['from_date'])) {
            if (!Adx_Utils::validateDate($params['from_date'], 'Y-m-d')) {
                return array(
                    'status' => 'error',
                    'error_code' => '435'
                );
            }
            //
            $params['from_date'] = Adx_Utils::getDate(Adx_Utils::formatDate($params['from_date']), 1, 0, 1);
        } else {
            return array(
                'status' => 'error',
                'error_code' => '424'
            );
        }

        if (isset($params['to_date']) && !empty($params['to_date'])) {
            if (!Adx_Utils::validateDate($params['to_date'], 'Y-m-d')) {
                return array(
                    'status' => 'error',
                    'error_code' => '436'
                );
            }
            if (strtotime($params['from_date']) > strtotime($params['to_date'])) {
                return array(
                    'status' => 'error',
                    'error_code' => '437'
                );
            }
            //
            $params['to_date'] = Adx_Utils::getDate(Adx_Utils::formatDate($params['to_date']), 0, 0, 1);
        } else {
            return array(
                'status' => 'error',
                'error_code' => '425'
            );
        }

        $fromDateObj = date_create($params['from_date']);
        $toDateObj = date_create($params['to_date']);

        $interval = date_diff($fromDateObj, $toDateObj);
        $day = $interval->days;
        if ($day > 180) {
            return array(
                'status' => 'error',
                'error_code' => '438'
            );
        }

        if (!isset($params['type']) || !in_array($params['type'], array('total', 'daily'))) {
            return array(
                'status' => 'error',
                'error_code' => '434'
            );
        }

        return array(
            'status' => 'success',
            'user_id' => $token['user_id'],
            'network_id' => $token['network_id'],
            'signature' => $token['signature'],
            'from_date' => $params['from_date'],
            'to_date' => $params['to_date']
        );
    }

    public static function checkContact($params)
    {
        $token = Adx_Business_Api::checkToken($params);

        if ($token['status'] == 'error') {
            return array(
                'status' => 'error',
                'error_code' => $token['error_code']
            );
        }

        if (!isset($params['client_id']) || empty($params['client_id'])) {

        }

        if (!isset($params['contract_id']) || empty($params['contract_id'])) {

        }

        return array(
            'status' => 'success',
            'user_id' => $token['user_id'],
            'network_id' => $token['network_id'],
            'signature' => $token['signature'],
            'client_id' => $params['client_id'],
            'contract_id' => $params['contract_id']
        );
    }

    public static function validateParams($params, $request_params = array())
    {
        $data = array(
            'status' => '',
            'user_id' => '',
            'network_id' => '',
            'signature' => ''
        );

        $token = Adx_Business_Api::checkToken($params);

        if ($token['status'] == 'error') {
            return array(
                'status' => 'error',
                'error_code' => $token['error_code']
            );
        }

        if (isset($params['from_date']) && !empty($params['from_date'])) {
            if (!Adx_Utils::validateDate($params['from_date'], 'Y-m-d')) {
                return array(
                    'status' => 'error',
                    'error_code' => '435'
                );
            }
            //
            $params['from_date'] = Adx_Utils::getDate(Adx_Utils::formatDate($params['from_date']), 1, 0, 1);
            $data['from_date'] = $params['from_date'];
        } else if (isset($request_params['from_date'])) {
            return array(
                'status' => 'error',
                'error_code' => '424'
            );
        }

        if (isset($params['to_date']) && !empty($params['to_date'])) {
            if (!Adx_Utils::validateDate($params['to_date'], 'Y-m-d')) {
                return array(
                    'status' => 'error',
                    'error_code' => '436'
                );
            }
            if (strtotime($params['from_date']) > strtotime($params['to_date'])) {
                return array(
                    'status' => 'error',
                    'error_code' => '437'
                );
            }
            //
            $params['to_date'] = Adx_Utils::getDate(Adx_Utils::formatDate($params['to_date']), 0, 0, 1);
            $data['to_date'] = $params['to_date'];
        } else if (isset($request_params['from_date'])) {
            return array(
                'status' => 'error',
                'error_code' => '425'
            );
        }

        if (isset($params['type']) && !in_array($params['type'], array('hour', 'day', 'month', 'week'))) {
            return array(
                'status' => 'error',
                'error_code' => '434'
            );
        }

        if (isset($params['from_date']) && !empty($params['from_date']) &&
            isset($params['to_date']) && !empty($params['to_date'])
        ) {
            $fromDateObj = date_create($params['from_date']);
            $toDateObj = date_create($params['to_date']);

            $interval = date_diff($fromDateObj, $toDateObj);
            $day = $interval->days;
            if ($day > 180) {
                return array(
                    'status' => 'error',
                    'error_code' => '438'
                );
            }
        }

        if (isset($params['from_date_comp']) && !empty($params['from_date_comp'])) {
            if (!Adx_Utils::validateDate($params['from_date_comp'], 'Y-m-d')) {
                return array(
                    'status' => 'error',
                    'error_code' => '435'
                );
            }
            //
            $params['from_date_comp'] = Adx_Utils::getDate(Adx_Utils::formatDate($params['from_date_comp']), 1, 0, 1);
            $data['from_date_comp'] = $params['from_date_comp'];
        } else if (isset($request_params['from_date'])) {
            $params['from_date_comp'] = null;
        }

        if (isset($params['to_date_comp']) && !empty($params['to_date_comp'])) {
            if (!Adx_Utils::validateDate($params['to_date_comp'], 'Y-m-d')) {
                return array(
                    'status' => 'error',
                    'error_code' => '436'
                );
            }
            if (strtotime($params['to_date_comp']) > strtotime($params['to_date_comp'])) {
                return array(
                    'status' => 'error',
                    'error_code' => '437'
                );
            }
            //
            $params['to_date_comp'] = Adx_Utils::getDate(Adx_Utils::formatDate($params['to_date_comp']), 0, 0, 1);
            $data['to_date_comp'] = $params['to_date_comp'];
        } else if (isset($request_params['from_date'])) {
            $params['to_date_comp'] = null;
        }

        //
        if (!empty($params['to_date_comp']) && !empty($params['from_date_comp']) && !empty($params['to_date']) && !empty($params['from_date'])) {
            $to_date = explode(' ', $params['to_date']);
            $from_date = explode(' ', $params['from_date']);
            $to_date_comp = explode(' ', $params['to_date_comp']);
            $from_date_comp = explode(' ', $params['from_date_comp']);
            //
            if (strtotime($to_date_comp[0]) == strtotime($from_date_comp[0]) && strtotime($to_date[0]) == strtotime($from_date[0])) {
                $params['type'] = 'hour';
            } else {
                $params['type'] = 'day';
            }
        } else if (!empty($params['to_date']) && !empty($params['from_date'])) {
            $to_date = explode(' ', $params['to_date']);
            $from_date = explode(' ', $params['from_date']);
            //
            if (strtotime($to_date[0]) == strtotime($from_date[0])) {
                $params['type'] = 'hour';
            } else {
                $params['type'] = 'day';
            }
        } else {
            $params['type'] = 'day';
        }

        $data['status'] = 'success';
        $data['user_id'] = $token['user_id'];
        $data['network_id'] = $token['network_id'];
        $data['signature'] = $token['signature'];
        $data['type'] = isset($params['type']) ? self::getValueType($params['type']) : '';

        //
        return $data;
    }

    public static function generatorTokenAction($network_id, $user_id)
    {
        $time = strtotime(date("Y-m-d H:i:s"));
        $string = $network_id . '|' . $user_id . '|' . $time . '|' . API_SIGNATURE;
        $token = Utils::encode($string, API_KEY);
        return $token;
    }

    public static function generatorSecretAction($network_id)
    {
        $time = strtotime(date("Y-m-d H:i:s"));
        $string = $network_id . '|' . $time . '|' . API_SIGNATURE;
        $secret_key = Utils::encode($string, API_KEY);
        return $secret_key;
    }

    public static function defineAttribute()
    {
        $data = array(
            'impression_amount',
            'click_amount',
            'revenue_amount',
            'ctr'
        );

        return $data;
    }

    public static function getValueType($type)
    {
        $data = array(
            'hour' => 1,
            'day' => 2,
            'week' => 3,
            'month' => 4
        );

        return isset($data[$type]) ? $data[$type] : 2;
    }

    public static function transformData($key, $value, $compare = false, $value1 = 0)
    {
        $data = array();
        //
        switch ($key) {
            case 'impression_amount':
                $data['id'] = 'impression_amount';
                $data['name'] = 'Impression';
                $data['type'] = self::TYPE_INTEGER;
                break;
            case 'true_impression':
                $data['id'] = 'true_impression';
                $data['name'] = 'Viewable';
                $data['type'] = self::TYPE_INTEGER;
                break;
            case 'click_amount':
                $data['id'] = 'click_amount';
                $data['name'] = 'Click';
                $data['type'] = self::TYPE_INTEGER;
                break;
            case 'revenue_amount':
                $data['id'] = 'revenue_amount';
                $data['name'] = '?� chi';
                $data['type'] = self::TYPE_CURRENCY;
                break;
            case 'ctr':
                $data['id'] = 'ctr';
                $data['name'] = 'CTR';
                $data['type'] = self::TYPE_PERCENTAGE;
                break;
            case 'true_ctr':
                $data['id'] = 'true_ctr';
                $data['name'] = 'True CTR';
                $data['type'] = self::TYPE_PERCENTAGE;
                break;
        }
        //
        $data['value'] = $value;
        //
        if ($compare) {
            $data['value1'] = $value1;
        }
        //
        return $data;
    }

    public static function sendRequest($api_url, $data = array())
    {
        $arrData = array();
        $arrData['api_url'] = $api_url;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch, CURLOPT_URL, $api_url);
        if (defined('CONFIG_CONTRACT_ACTIVE') && CONFIG_CONTRACT_ACTIVE == 1) {
            //auth
            if (defined('CONFIG_AUTH_USERNAME') && CONFIG_AUTH_USERNAME != DEFAULT_STATUS_INACTIVE
                && defined('CONFIG_AUTH_PASSWORD') && CONFIG_AUTH_PASSWORD != DEFAULT_STATUS_INACTIVE
            ) {
                curl_setopt($ch, CURLOPT_USERPWD, CONFIG_AUTH_USERNAME . ':' . CONFIG_AUTH_PASSWORD);
                curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            }
            //API key
            if (defined('CONFIG_API_KEY') && CONFIG_API_KEY != DEFAULT_STATUS_INACTIVE) {
                $data['params']['key'] = CONFIG_API_KEY;
            }
            //API output format
            if (defined('CONFIG_OUTPUT_FORMAT') && CONFIG_OUTPUT_FORMAT != '') {
                $data['params']['format'] = CONFIG_OUTPUT_FORMAT;
            }

        }
        if (isset($data['post']) && $data['post'] == true) {
            curl_setopt($ch, CURLOPT_POST, 1);
        }
        if (isset($data['params']) && !empty($data['params'])) {
            $param_query = $data['params'];
            $arrData['Params'] = $param_query;
            $postFields = http_build_query($param_query);
            //
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        }

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        if (curl_exec($ch) === false) {
            $arrData['Error'] = curl_error($ch);
            Adx_Utils::writeLog($data['fileNameError'], $arrData);
            curl_close($ch);
            return false;

        }
        if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == '404') {
            $arrData['Error'] = '404 Not Found';
            Adx_Utils::writeLog($data['fileNameError'], $arrData);
            curl_close($ch);
            return false;
        }

        $response = curl_exec($ch);
        curl_close($ch);
        $arrData['Data'] = array(
            'status' => 'SUCCESS',
        );
        Adx_Utils::writeLog($data['fileNameSuccess'], $arrData);
        if (!$response) {
            return false;
        }
        return $response;
    }

    public static function aliasArray($data = array())
    {
        $param_alias = Adx_Model_Api::paramAlias();
        if (!empty($data)) {
            foreach ($data as $key => $array_alias) {
                foreach ($param_alias as $key_new => $key_old) {
                    $array_alias = Adx_Utils::changeKeyArray($array_alias, $key_old, $key_new);
                }
                $data[$key] = $array_alias;
            }
        }
        return $data;
    }

    public static function getListClient($params = array())
    {
        //
        if (!isset($params['number_day']) || empty($params['number_day'])) {
            $params['number_day'] = 100;
        }
        //
        $params = array(
            'fileNameSuccess' => 'Get_List_Client_Action',
            'fileNameError' => 'Get_List_Client_Error',
            'params' => array_merge($params, self::getConfigApi24h())
        );
        $data = array();
        if (defined('CONFIG_GET_LIST_CLIENT')) {
            if (CONFIG_GET_LIST_CLIENT == '') {
                $arrData['Error'] = 'Link API empty';
                Adx_Utils::writeLog($params['fileNameError'], $arrData);
                return false;
            }
            $data = self::sendRequest(CONFIG_GET_LIST_CLIENT, $params);
            //decode json to array
            if (defined('CONFIG_OUTPUT_FORMAT') && CONFIG_OUTPUT_FORMAT == 0) {
                $data = json_decode($data, 1);
            }
            $data = self::aliasArray($data['data']['list_client']);
        }
        //return array
        return $data;
    }

    //
    public static function getListContract($params = array())
    {
        //
        if (!isset($params['number_day']) || empty($params['number_day'])) {
            $params['number_day'] = 100;
        }
        //
        $params = array(
            'fileNameSuccess' => 'Get_List_Contract_Action',
            'fileNameError' => 'Get_List_Contract_Error',
            'params' => array_merge($params, self::getConfigApi24h())
        );
        $data = array();
        if (defined('CONFIG_GET_LIST_CONTRACT')) {
            if (CONFIG_GET_LIST_CONTRACT == '') {
                $arrData['Error'] = 'Link API empty';
                Adx_Utils::writeLog($params['fileNameError'], $arrData);
                return false;
            }
            $data = self::sendRequest(CONFIG_GET_LIST_CONTRACT, $params);
            //decode json to array
            if (defined('CONFIG_OUTPUT_FORMAT') && CONFIG_OUTPUT_FORMAT == 0) {
                $data = json_decode($data, 1);
            }
            $data = self::aliasArray($data['data']['list_contract']);
        }
        //return array
        return $data;
    }

    //
    public static function getContract($params = array())
    {
        //
        $params = array(
            'fileNameSuccess' => 'Get_Contract_Action',
            'fileNameError' => 'Get_Contract_Error',
            'post' => true,
            'params' => array_merge($params, self::getConfigApi24h())
        );
        $data = array();
        if (defined('CONFIG_GET_CONTRACT')) {
            if (CONFIG_GET_CONTRACT == '') {
                $arrData['Error'] = 'Link API empty';
                Adx_Utils::writeLog($params['fileNameError'], $arrData);
                return false;
            }
            $data = self::sendRequest(CONFIG_GET_CONTRACT, $params);
            if (defined('CONFIG_OUTPUT_FORMAT') && CONFIG_OUTPUT_FORMAT == 0) {
                $data = json_decode($data, 1);
            }
            $data = self::aliasArray($data['data']['detail_client']);
        }
        //return array
        return $data;
    }

    public static function getContractByClientId($params = array())
    {

        $params = array(
            'fileNameSuccess' => 'Get_Contract_By_Client_Id_Action',
            'fileNameError' => 'Get_Contract_By_Client_Id_Error',
            'post' => true,
            'params' => array_merge($params, self::getConfigApi24h())
        );
        if (!isset($params['params']['api_link']) || empty($params['params']['api_link'])) {
            $arrData['Error'] = 'Link API empty';
            Adx_Utils::writeLog($params['fileNameError'], $arrData);
            return false;
        }

        $data = self::sendRequest($params['params']['api_link'], $params);

        $data = json_decode($data, 1);

        $data = self::aliasArray($data['data']['list_contract']);
        //return array
        return $data;
    }

    public static function getConfigApi24h()
    {
        $v_ma_doi_tac = 'ANTS';
        $v_user_name = 'ANTS';
        $v_password = 'ANTS$%()*@#$)*^$$%';
        $v_key = 'ANTS&^@(^N�K*)';
        $v_loai_thao_tac = 'GET';
        $v_khoa_tu_sinh = time() + 60;
        $v_token = md5($v_key . $v_khoa_tu_sinh . md5($v_password));

        return array(
            'p_ma_doi_tac' => $v_ma_doi_tac,
            'p_user' => $v_user_name,
            'e' => $v_khoa_tu_sinh,
            'token' => $v_token,
            'p_loai_thao_tac' => $v_loai_thao_tac,
        );
    }

    public static function error($code, $data = array())
    {
        return new JsonModel(array(
            'code' => $code,
            'message' => self::errorCode($code),
            'data' => $data
        ));
    }

    public static function success($code, $data = array())
    {
        return new JsonModel(array(
            'code' => 200,
            'message' => self::errorCode($code),
            'data' => $data
        ));
    }

    public static function sendRequestV2($api_url, $data = array())
    {
        $arrData = array();
        $arrData['api_url'] = $api_url;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch, CURLOPT_URL, $api_url);


        if (isset($data['params']['is_post']) && $data['params']['is_post'] == true) {
            curl_setopt($ch, CURLOPT_POST, 1);
        }
        if (isset($data['params']) && !empty($data['params'])) {
            $param_query = $data['params'];
            $arrData['Params'] = $param_query;
            $post_fields = http_build_query($param_query);
            //
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
        }

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        if (curl_exec($ch) === false) {
            $arrData['Error'] = curl_error($ch);
            Adx_Utils::writeLog($data['fileNameError'], $arrData);
            curl_close($ch);
            return false;

        }
        if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == '404') {
            $arrData['Error'] = '404 Not Found';
            Adx_Utils::writeLog($data['fileNameError'], $arrData);
            curl_close($ch);
            return false;
        }

        $response = curl_exec($ch);
        curl_close($ch);
        $arrData['Data'] = array(
            'status' => 'SUCCESS',
        );
        Adx_Utils::writeLog($data['fileNameSuccess'], $arrData);
        if (!$response) {
            return false;
        }
        return $response;
    }

    public static function groupBy($rows, $key, $sort = "", $key_is_date = false)
    {
        $result = array();
        if ($key_is_date) {
            foreach ($rows as $row) {
                $temp = date("Y-m-d", strtotime($row[$key]));
                $result[$temp][] = $row;
            }
        } else {
            foreach ($rows as $row) {
                $result[$row[$key]][] = $row;
            }
        }
        $sort = strtolower($sort);
        if ($sort == "asc") ksort($result);
        else if ($sort == "desc") krsort($result);

        return $result;
    }

    public static function displayHistoryLog($log)
    {
        $resource_name = Adx_Model_HistoryLog::displayResource($log['resource_id']);
        $action = ' ' . Adx_Model_HistoryLog::displayAction($log['action']);
        $note = json_decode($log['note']);
        $creator = isset($note->creator) ? $note->creator : '';
        $executor = isset($note->executor) ? $note->executor : '';
        $executor = $executor == -1 ? Adx_Utils::T('General_Text_System') : $executor;
        $html = '';
        $html .= Adx_Model_HistoryLog::displayResourceName($resource_name, $note);
        $html .= Adx_Model_HistoryLog::displayLink($log['resource_id'], $log['object_id'], $log['parent_id'], $note);
        if (!empty($log['user_request'])) {
            $html .= Adx_Utils::T('General_Text_Of') . ' ' . $creator . ' ' . $action . ' ' . Adx_Utils::T('General_Text_By') . ' <strong>' . $executor . '</strong>' . ' ' . $note->suffix = isset($note->suffix) ? $note->suffix : '';
        } elseif (!empty($log['executor'])) {
            if ($note->title == 'update_debit_amount') {
                $html .= ' ' . $action . " " . Adx_Utils::T('General_Text_From') . ' <strong> ' . number_format($note->debit_amount_old) . '</strong> VN? ' . Adx_Utils::T('General_Text_Into') . ' <strong>' . number_format($note->debit_amount_new) . '</strong> VN? ' . Adx_Utils::T('General_Text_By') . ' <strong>' . $executor . '</strong>' . ' ' . $note->suffix = isset($note->suffix) ? $note->suffix : '';
            } else {
                $html .= ' ' . $action . ' ' . Adx_Utils::T('General_Text_By') . ' <strong> ' . $executor . ' </strong> ' . ' ' . $note->suffix = isset($note->suffix) ? $note->suffix : '';
            }
        } else {
            if ($note->title == 'update_debit_amount') {
                $html .= ' ' . $action . " " . strtolower(Adx_Utils::T('General_Text_From')) . " " . ' <strong>' . number_format($note->debit_amount_old) . '</strong> VN? ' . Adx_Utils::T('General_Text_Into') . ' <strong>' . number_format($note->debit_amount_new) . '</strong> VN?';
            } else {
                $html .= '  ' . $action;
            }
        }
        return $html;
    }


}