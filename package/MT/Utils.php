<?php
namespace MT;

use MT\Job;

class Utils
{
    public static function api_get_parse_str($data = array())
    {
        $params = array();
        if (empty($data)) {
            return $params;
        }

        $i = 0;
        foreach ($data as $key => $value) {
            if ($i == 0) {
                $key_first = explode('?', $key);
                $params[$key_first[1]] = $value;
            } else {
                $params[$key] = $value;
            }
            $i++;
        }

        return $params;
    }

    public static function random_hex($arr_color)
    {
        $characters = 'ABCDEF0123456789';
        $hexadecimal = '#';
        for ($i = 1; $i <= 6; $i++) {
            $position = rand(0, strlen($characters) - 1);
            $hexadecimal .= $characters[$position];
        }
        if (!in_array($hexadecimal, $arr_color)) {
            return $hexadecimal;
        } else {
            self::random_hex($arr_color);
        }
    }

    public static function str_len($string)
    {
        return strlen(utf8_decode($string));
    }

    public static function decode($string, $key)
    {
        $j = 0;
        $hash = '';
        $key = sha1($key);
        $strLen = self::str_len($string);
        $keyLen = self::str_len($key);
        for ($i = 0; $i < $strLen; $i += 2) {
            $ordStr = hexdec(base_convert(strrev(substr($string, $i, 2)), 36, 16));
            if ($j == $keyLen) {
                $j = 0;
            }
            $ordKey = ord(substr($key, $j, 1));
            $j++;
            $hash .= chr($ordStr - $ordKey);
        }
        return $hash;
    }

    public static function encode($string, $key)
    {
        $j = 0;
        $hash = '';
        $key = sha1($key);
        $strLen = self::str_len($string);
        $keyLen = self::str_len($key);
        for ($i = 0; $i < $strLen; $i++) {
            $ordStr = ord(substr($string, $i, 1));
            if ($j == $keyLen) {
                $j = 0;
            }
            $ordKey = ord(substr($key, $j, 1));
            $j++;
            $hash .= strrev(base_convert(dechex($ordStr + $ordKey), 16, 36));
        }
        return $hash;
    }

    public static function getDate($isDate = 0, $isFromDate = 1, $numDays = 0, $showTime = 1, $unit = 'days', $format = 'Y-m-d')
    {
        if (is_null($isDate)) {
            return null;
        }

        $now = date($format);
        if ($numDays == 0) {
            return (!empty($isDate) ? $isDate : $now) . ($showTime == 1 ? $isFromDate == 1 ? ' 00:00:00' : ' 23:59:59' : null);
        }
        $date = new \DateTime(!empty($isDate) ? $isDate : $now);
        $date->add(\DateInterval::createFromDateString($numDays . ' ' . $unit));
        return $date->format($format) . ($showTime == 1 ? $isFromDate == 1 ? ' 00:00:00' : ' 23:59:59' : null);
    }

    public static function formatDate($dateTime, $characterExp = "/", $characterImp = "-", $index = 0)
    {
        $date = explode($characterExp, $dateTime);
        if ($index > 0) {
            return $date[$index - 1];
        }
        return implode($characterImp, array_reverse($date));
    }

    public static function getWeekDay($date)
    {
        $weekday = date("l", $date);
        $weekday = strtolower($weekday);

        return ucfirst($weekday);
    }

    public static function clearKeyword($keyword, $html_special_chars = true, $strip_tags = true)
    {
        return htmlspecialchars($keyword, ENT_QUOTES, 'UTF-8');
    }

    public static function remove_accent($fragment)
    {
        //
        if (php_sapi_name() == 'cli') {
            $fragment = iconv('UTF-8', 'US-ASCII//TRANSLIT', $fragment);
        }

        //
        $translate_symbols = array(
            '#(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)#',
            '#(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)#',
            '#(ç)#',
            '#(ì|í|ị|ỉ|ĩ)#',
            '#(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)#',
            '#(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)#',
            '#(ỳ|ý|ỵ|ỷ|ỹ)#',
            '#(đ)#',
            '#(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)#',
            '#(Ç)#',
            '#(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)#',
            '#(Ì|Í|Ị|Ỉ|Ĩ)#',
            '#(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)#',
            '#(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)#',
            '#(Ỳ|Ý|Ỵ|Ỷ|Ỹ)#',
            '#(Đ)#',
            '#(_|-|/|\*|\?|\`|\~|\!|\@|\#|\$|\%|\^|\&|\(|\)|\+|\{|\=|\;|\:|\'|\"|\,|\<|\>|\}|\[|\]|\||\\\)#'
            //'/[^a-zA-Z0-9\-\_]/',
        );

        //
        $replace = array(
            'a',
            'e',
            'c',
            'i',
            'o',
            'u',
            'y',
            'd',
            'A',
            'C',
            'E',
            'I',
            'O',
            'U',
            'Y',
            'D',
            ' '
        );

        //
        $fragment = preg_replace($translate_symbols, $replace, $fragment);

        $fragment = preg_replace('/(-)+/', ' ', $fragment);

        //
        return preg_replace('!\s+!', ' ', strtolower($fragment));
    }

    public static function writeLog($fileName = '', $arrParam = array())
    {
        try {
            date_default_timezone_set('Asia/Saigon');

            $log = new Log();

            if (!file_exists(LOG_FOLDER . '/' . date('Y') . '/' . date('m') . '/' . date('d'))) {
                mkdir(LOG_FOLDER . '/' . date('Y') . '/' . date('m') . '/' . date('d'), 0775, true);
                chmod(LOG_FOLDER . '/' . date('Y') . '/' . date('m') . '/' . date('d'), 0775);

                $process_user = posix_getpwuid(posix_geteuid());

                if (isset($process_user['name']) && $process_user['name'] == 'root') {
                    chown(LOG_FOLDER . '/' . date('Y') . '/' . date('m') . '/' . date('d'), 'ad-user');
                }
            }

            $log->lfile(LOG_FOLDER . '/' . date('Y') . '/' . date('m') . '/' . date('d') . '/ADX_' . $fileName);

            $arrParam['Time'] = date('H:i:s');

            $log->lwrite(json_encode($arrParam), 'Data', true);

            $log->lclose();
        } catch (\Exception $e) {
            throw new Exception($e->getMessage(), $e->getCode());
        }

    }

    public static function autoReconnectionRedis($model, $function, $param, $fileName = '')
    {
        $result = array();
        $message = array();
        $i = 1;
        $parameter = is_array($param) ? json_encode($param[0]) : $param;
        $instance = $param[0];

        do {
            $error = 1;
            $redis = 0;
            try {
                $result = call_user_func_array(array($model, $function), $param);
                $redis = $result->ping();
            } catch (Exception $e) {
                $error = 0;
                if ($i == 4) {
                    $message = array('function' => $function, 'parameter' => $parameter, 'error' => $e->getMessage());
                    break;
                }
            }
            if ($redis && $error == 1) {
                $message = array('function' => $function, 'parameter' => $parameter, 'error' => '');
                $i = 5;
            } else {
                //Close instance Redis connections
                Redis::closeConnection($instance);

                sleep(3);

                echo 'Auto reconnection redis: ' . $i . "\n";
                $i++;
            }

        } while ($i < 5);

        if ($error == 0 && !empty($fileName)) {
            Utils::writeLog($fileName, $message);
        }

        return array('message' => $message, 'error' => $error, 'obj' => $result);
    }

    public static function autoReconnectionFunctionRedis($instance = 'delivery', $function = '', $params = array(), $fileName = '', $dbNumber = null)
    {

        $message = array();
        $result = array();
        $i = 1;

        $result = Utils::autoReconnectionRedis('Redis', 'getInstance', array($instance));

        if (($result['error'] == 0 || empty($result['obj'])) && !empty($fileName)) {
            Utils::writeLog($fileName, $message);

            return $result;
        }

        $redis = $result['obj'];

        do {
            $error = 1;

            try {
                if (empty($dbNumber)) {
                    call_user_func_array(array($redis, 'SELECT'), array(0));
                } else {
                    call_user_func_array(array($redis, 'SELECT'), array($dbNumber));
                }

                $result = call_user_func_array(array($redis, $function), $params);

            } catch (Exception $e) {
                $error = 0;

                if ($i == 4) {
                    $message = array('function' => $function, 'parameter' => $params, 'rows' => $result, 'error' => 0);
                    break;
                }
            }

            if ($error == 1) {
                $message = array('function' => $function, 'parameter' => $params, 'rows' => $result, 'error' => 1);
                $i = 5;
            } else {
                //Close instance Redis connections
                Redis::closeConnection($instance);

                sleep(3);

                echo 'Auto function reconnection: ' . $i . "\n";
                $i++;
            }

        } while ($i < 5);

        return $message;
    }

    public static function runJob($instance = 'info', $class = '', $function = '', $priority = 'doTask', $workload = '', $param = array())
    {
        //add param job
        $param['job'] = array(
            'class' => $class,
            'function' => $function,
            'workload' => $workload
        );
        //job Param
        $jobParams = array();
        $jobParams['class'] = $class;
        $jobParams['function'] = $function;
        $jobParams['args'] = array_merge(array(
            'site_url_global' => (defined('SITE_URL') ? SITE_URL : ''),
            'static_url_global' => (defined('STATIC_URL') ? STATIC_URL : ''),
            'upload_url_global' => (defined('UPLOAD_URL') ? UPLOAD_URL : '')
        ), $param);


        //Create job client
        $jobClient = Job\Client::getInstance($instance);


        //Register job
        try {
            $result = call_user_func_array(array($jobClient, $priority), array(Job\Client::getFunction($workload, $instance), $jobParams));
        } catch (\Exception $e) {
            return array('parameter' => json_encode($jobParams), 'message' => $e->getMessage(), 'error' => 0);
        }


        return array('parameter' => json_encode($jobParams), 'message' => 'success', 'error' => 1, 'result' => $result);
    }

    /**
     * get_meta_tags UTF-8 content
     * @static
     * @param $url
     * @return string
     */
    public static function autoReconnectionProcess($model, $function, $param, $fileName = '', $debug = true)
    {
        try {
            $result = array();
            $message = array();
            $i = 1;
            $parameter = is_array($param) ? json_encode($param) : $param;
            $allInstances = Database::getAllInstances();
            do {
                $error = 1;
                try {
                    $result = call_user_func_array(array($model, $function), array($param));
                } catch (\Exception $e) {
                    $error = 0;
                    if ($i == 4) {
                        $message = array(
                            'model' => $model,
                            'function' => $function,
                            'parameter' => $parameter,
                            'error' => $e->getMessage(),
                            'instancesFirst' => $allInstances,
                            'instancesLast' => Database::getAllInstances()
                        );
                        break;
                    }
                }
                if ($error == 1) {

                    $message = array(
                        'model' => $model,
                        'function' => $function,
                        'parameter' => $parameter,
                        'data' => isset($result['rows']) ? !empty($result['rows']) ? 'YES' : 'NO' : !empty($result) ? 'YES' : 'NO',
                        'error' => '',
                        'instancesFirst' => $allInstances,
                        'instancesLast' => Database::getAllInstances()
                    );
                    break;
                } else {
                    //Close all DB connections
                    Database::closeAllConnections();
//
                    sleep(2);

                    if ($debug) {
                        echo "Auto Mysql Reconnection " . $i . " Model:" . $model . " Function:" . $function . " Params:" . $parameter . "\n";
                    }

                    $i++;
                }

            } while ($i < 5);

            if ($error == 0 && !empty($fileName)) {
                Utils::writeLog($fileName, $message);
            }
            if (isset($result['rows'])) {
                return array('message' => $message, 'error' => $error, 'rows' => $result['rows'], 'type' => 1);
            }

            return array('message' => $message, 'error' => $error, 'rows' => $result, 'type' => 2);
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
    }

    /**
     * @param string $class
     * @param string $function
     * @param int $line
     * @param null $result
     * @param string $fileName
     */
    public static function errorMessenger($class = '', $function = '', $line = 0, $result = null, $fileName = 'Messenger')
    {
        //Write Log
        self::writeLog(
            $fileName,
            array(
                'class' => $class,
                'function' => $function,
                'line' => $line,
                'result' => $result
            )
        );
        //Echo
        if (!empty($result['rows'])) {
            $str = " --> Messenger: ";
        } else {
            $str = " --> Warning: ";
        }
        echo "\n";
        echo "$str";
        if (is_array($result)) {
            echo json_encode(array(
                'Class' => $class,
                'Function' => $function,
                'Line' => $line,
                'Param' => array(
                    'function' => isset($result['message']['function']) ? $result['message']['function'] : 'Function Empty',
                    'parameter' => isset($result['message']['parameter']) ? $result['message']['parameter'] : 'Param Empty',
                    'error' => isset($result['error']) ? $result['error'] : 'Error Unknown',
                    'rows' => isset($result['rows']) ? $result['rows'] : 'Data Empty',
                )
            ));
        } else {
            echo json_encode($result);
        }
        echo "\n";
        echo " |";
    }

    //File get content
    public static function fileGetContents($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 GTB5');
        curl_setopt($ch, CURLOPT_ENCODING, "");
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $result = curl_exec($ch);
        return $result;
    }

    public static function cutStr($p_str, $p_start, $p_end)
    {
        if ($p_start != "") {
            $v_start_post = strpos($p_str, $p_start);
            if ($v_start_post === false) return "";
            $p_str = substr($p_str, $v_start_post + strlen($p_start));
            if ($p_end == "") return $p_str;
            $v_end_post = strpos($p_str, $p_end);
            if ($v_end_post === false) return "";
            $p_str = substr($p_str, 0, $v_end_post);
            return $p_str;
        } else {
            if ($p_end != "") {
                $v_end_post = strpos($p_str, $p_end);
                if ($v_end_post === false) return "";
                $p_str = substr($p_str, 0, $v_end_post);
                return $p_str;
            } else {
                return "";
            }
        }
    }

    public static function checkEmail($mail_address)
    {
        $pattern = "/^[\w-]+(\.[\w-]+)*@";

        $pattern .= "([0-9a-z][0-9a-z-]*[0-9a-z]\.)+([a-z]{2,4})$/i";

        if (preg_match($pattern, $mail_address)) {
            $parts = explode("@", $mail_address);

            if (checkdnsrr($parts[1], "MX")) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public static function cleanKeyword($keyword = '')
    {
        $keyword = trim($keyword);

        if (!self::checkEmail($keyword)) {
            //',*,(,),<,>,-,~,;,!,$,&,=,|,[,],{,}
            $removeKeyword = array(
                "/\'/",
//                "/\./",
                "/\'/",
                "/\,/",
                "/\(/",
                "/\)/",
                "/\*/",
                "/\>/",
                "/\</",
                "/\-/",
                "/\~/",
                "/\;/",
                "/\!/",
                "/\&/",
                "/\=/",
                "/\|/",
                "/\}/",
                "/\{/",
                "/\[/",
                "/\]/"
            );
            $keyword = str_replace("$", " ", $keyword);
            $keyword = preg_replace($removeKeyword, " ", $keyword);

            return preg_replace('/\n+|\t+|\s+/', ' ', $keyword);
        }

        return $keyword;
    }

    /**
     * @param $fromDate
     * @param $toDate
     * @param string $step
     * @param string $format
     * @return array
     */
    public static function getRangeDate($fromDate, $toDate, $step = '+1 day', $format = 'Y-m-d')
    {
        $dates = array();

        $current = strtotime($fromDate);
        $to = strtotime($toDate);

        while ($current <= $to) {
            $dates[] = date($format, $current);
            $current = strtotime($step, $current);
        }

        return $dates;
    }

    public static function parse_user_agent($u_agent = null)
    {
        if (is_null($u_agent)) {
            if (isset($_SERVER['HTTP_USER_AGENT'])) {
                $u_agent = $_SERVER['HTTP_USER_AGENT'];
            } else {
                throw new \InvalidArgumentException('parse_user_agent requires a user agent');
            }
        }
        $platform = null;
        $browser = null;
        $version = null;
        $empty = array('platform' => $platform, 'browser' => $browser, 'version' => $version);
        if (!$u_agent) return $empty;
        if (preg_match('/\((.*?)\)/im', $u_agent, $parent_matches)) {
            preg_match_all('/(?P<platform>BB\d+;|Android|CrOS|Tizen|iPhone|iPad|iPod|Linux|Macintosh|Windows(\ Phone)?|Silk|linux-gnu|BlackBerry|PlayBook|X11|(New\ )?Nintendo\ (WiiU?|3?DS)|Xbox(\ One)?)
				(?:\ [^;]*)?
				(?:;|$)/imx', $parent_matches[1], $result, PREG_PATTERN_ORDER);
            $priority = array('Xbox One', 'Xbox', 'Windows Phone', 'Tizen', 'Android', 'CrOS', 'Linux', 'X11');
            $result['platform'] = array_unique($result['platform']);
            if (count($result['platform']) > 1) {
                if ($keys = array_intersect($priority, $result['platform'])) {
                    $platform = reset($keys);
                } else {
                    $platform = $result['platform'][0];
                }
            } elseif (isset($result['platform'][0])) {
                $platform = $result['platform'][0];
            }
        }
        if ($platform == 'linux-gnu' || $platform == 'X11') {
            $platform = 'Linux';
        } elseif ($platform == 'CrOS') {
            $platform = 'Chrome OS';
        }
        preg_match_all('%(?P<browser>Camino|Kindle(\ Fire)?|Firefox|Iceweasel|Safari|MSIE|Trident|AppleWebKit|TizenBrowser|Chrome|
				Vivaldi|IEMobile|Opera|OPR|Silk|Midori|Edge|CriOS|
				Baiduspider|Googlebot|YandexBot|bingbot|Lynx|Version|Wget|curl|
				Valve\ Steam\ Tenfoot|
				NintendoBrowser|PLAYSTATION\ (\d|Vita)+)
				(?:\)?;?)
				(?:(?:[:/ ])(?P<version>[0-9A-Z.]+)|/(?:[A-Z]*))%ix',
            $u_agent, $result, PREG_PATTERN_ORDER);
        // If nothing matched, return null (to avoid undefined index errors)
        if (!isset($result['browser'][0]) || !isset($result['version'][0])) {
            if (preg_match('%^(?!Mozilla)(?P<browser>[A-Z0-9\-]+)(/(?P<version>[0-9A-Z.]+))?%ix', $u_agent, $result)) {
                return array('platform' => $platform ?: null, 'browser' => $result['browser'], 'version' => isset($result['version']) ? $result['version'] ?: null : null);
            }
            return $empty;
        }
        if (preg_match('/rv:(?P<version>[0-9A-Z.]+)/si', $u_agent, $rv_result)) {
            $rv_result = $rv_result['version'];
        }
        $browser = $result['browser'][0];
        $version = $result['version'][0];
        $lowerBrowser = array_map('strtolower', $result['browser']);
        $find = function ($search, &$key) use ($lowerBrowser) {
            $xkey = array_search(strtolower($search), $lowerBrowser);
            if ($xkey !== false) {
                $key = $xkey;
                return true;
            }
            return false;
        };
        $key = 0;
        $ekey = 0;
        if ($browser == 'Iceweasel') {
            $browser = 'Firefox';
        } elseif ($find('Playstation Vita', $key)) {
            $platform = 'PlayStation Vita';
            $browser = 'Browser';
        } elseif ($find('Kindle Fire', $key) || $find('Silk', $key)) {
            $browser = $result['browser'][$key] == 'Silk' ? 'Silk' : 'Kindle';
            $platform = 'Kindle Fire';
            if (!($version = $result['version'][$key]) || !is_numeric($version[0])) {
                $version = $result['version'][array_search('Version', $result['browser'])];
            }
        } elseif ($find('NintendoBrowser', $key) || $platform == 'Nintendo 3DS') {
            $browser = 'NintendoBrowser';
            $version = $result['version'][$key];
        } elseif ($find('Kindle', $key)) {
            $browser = $result['browser'][$key];
            $platform = 'Kindle';
            $version = $result['version'][$key];
        } elseif ($find('OPR', $key)) {
            $browser = 'Opera Next';
            $version = $result['version'][$key];
        } elseif ($find('Opera', $key)) {
            $browser = 'Opera';
            $find('Version', $key);
            $version = $result['version'][$key];
        } elseif ($find('Midori', $key)) {
            $browser = 'Midori';
            $version = $result['version'][$key];
        } elseif ($browser == 'MSIE' || ($rv_result && $find('Trident', $key)) || $find('Edge', $ekey)) {
            $browser = 'MSIE';
            if ($find('IEMobile', $key)) {
                $browser = 'IEMobile';
                $version = $result['version'][$key];
            } elseif ($ekey) {
                $version = $result['version'][$ekey];
            } else {
                $version = $rv_result ?: $result['version'][$key];
            }
            if (version_compare($version, '12', '>=')) {
                $browser = 'Edge';
            }
        } elseif ($find('Vivaldi', $key)) {
            $browser = 'Vivaldi';
            $version = $result['version'][$key];
        } elseif ($find('Valve Steam Tenfoot', $key)) {
            $browser = 'Valve Steam Tenfoot';
            $version = $result['version'][$key];
        } elseif ($find('Chrome', $key) || $find('CriOS', $key)) {
            $browser = 'Chrome';
            $version = $result['version'][$key];
        } elseif ($browser == 'AppleWebKit') {
            if (($platform == 'Android' && !($key = 0))) {
                $browser = 'Android Browser';
            } elseif (strpos($platform, 'BB') === 0) {
                $browser = 'BlackBerry Browser';
                $platform = 'BlackBerry';
            } elseif ($platform == 'BlackBerry' || $platform == 'PlayBook') {
                $browser = 'BlackBerry Browser';
            } elseif ($find('Safari', $key)) {
                $browser = 'Safari';
            } elseif ($find('TizenBrowser', $key)) {
                $browser = 'TizenBrowser';
            }
            $find('Version', $key);
            $version = $result['version'][$key];
        } elseif ($key = preg_grep('/playstation \d/i', array_map('strtolower', $result['browser']))) {
            $key = reset($key);
            $platform = 'PlayStation ' . preg_replace('/[^\d]/i', '', $key);
            $browser = 'NetFront';
        }
        return array('platform' => $platform ?: null, 'browser' => $browser ?: null, 'version' => $version ?: null);
    }

    public static function moveFile($params)
    {
        $file_info = pathinfo($params['fileSource']);
        $extension = strtolower($file_info['extension']);
        $filename = $file_info['filename'];

        //check extension
        switch ($extension) {
            case 'swf':
                $extFolder = 'video/swf/';
                break;
            case 'mp4':
                $extFolder = 'video/mp4/';
                break;
            default:
                $extFolder = 'images/';
                break;
        }
        //Create folder
        $date = date('Y/m/d');
        $uploadDir = UPLOAD_PATH . $extFolder . $date;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0775, true);
            chown($uploadDir, 'ad-user');
        }
        $path = realpath($uploadDir);

        $hashed_name = md5($filename . uniqid()) . '.' . $extension;
        $target = $path . '/' . $hashed_name;

        try {
            //get file dimensions

            if ($extension == "mp4") {
                $convertedFile = str_replace('.mp4', 'c.mp4', $target);
                qtfaststart($target, $convertedFile);
                @unlink($target);
                $target = $convertedFile;
            }
            $params['fileSource'] = str_replace(UPLOAD_URL, UPLOAD_PATH, $params['fileSource']);
            $params['fileSource'] = ROOT_PATH . '/static' . $params['fileSource'];
            @copy($params['fileSource'], $target);

            $dimensions = @getimagesize($target);
            if ($extension == "mp4") {
                $ffmpegInstance = new ffmpeg_movie($target);
                return array(
                    'status' => 1,
                    'dimensions' => array('width' => $ffmpegInstance->getFrameHeight(), 'height' => $ffmpegInstance->getFrameWidth()),
                    'extension' => $extension,
                    'file_url' => $extFolder . $date . '/' . str_replace('.mp4', 'c.mp4', $hashed_name)
                );
            }
            return array(
                'status' => 1,
                'dimensions' => array('width' => $dimensions[0], 'height' => $dimensions[1]),
                'extension' => $extension,
                'file_url' => $extFolder . $date . '/' . str_replace('.mp4', 'c.mp4', $hashed_name),
            );
        } catch (Exception $e) {
            $response['message'] = $e->getMessage();
        }
    }

    public static function cropImage($params)
    {
        // in case copy creative must be replace upload url => upload path
        $need_crop = true;
        if (strpos($params['imageSource'], UPLOAD_URL) !== false) {
            $need_crop = false;
            $params['imageSource'] = str_replace(UPLOAD_URL, UPLOAD_PATH, $params['imageSource']);
        }

        $tokens = pathinfo($params['imageSource']);
        $filename = $tokens['filename'];

        if (self::str_len($filename) !== 32) {
            $filename = md5($filename . uniqid());
        }

        $basename = $filename . '.png';

        $thumb = new \Imagick();
        $thumb->readImage($params["imageSource"]);
        if (isset($params['transparent'])) {
            $thumb->setImageBackgroundColor('transparent');
        } else {
            $thumb->setImageBackgroundColor('white');
        }
        if ($need_crop) {
            $thumb->cropimage($params["selectorW"], $params["selectorH"], $params["selectorX"], $params["selectorY"]);

            if ($params["selectorW"] > $params["selectorH"]) {
                $max = $params["selectorW"];
                $min = round(($params["selectorW"] / $params["imageW"]) * $params["imageH"]);
            } else {
                $min = $params["selectorH"];
                $max = round(($params["selectorH"] / $params["imageH"]) * $params["imageW"]);
            }

            $thumb->extentImage($max, $min, -($max - $params["selectorW"]) / 2, -($min - $params["selectorH"]) / 2);
            $thumb->resizeimage($params["imageW"], $params["imageH"], null, 1);
        }

        $date = date('Y/m/d');

        $uploadDir = ROOT_PATH . '/static/uploads/images/' . $date;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
            chown($uploadDir, 'ad-user');
        }


        $thumb->setImageFormat("png32");
        $thumb->writeImage($uploadDir . '/' . $basename);

        $thumb->clear();
        $thumb->destroy();
        $image_url = 'uploads/images/' . $date . '/' . $basename;
//        $image_src = $uploadDir . '/' . $basename;


        return array(
            'status' => 1,
            'dimensions' => array('width' => $params['imageW'], 'height' => $params['imageH']),
            'extension' => $tokens['extension'],
            'file_url' => $image_url,
        );
    }

    public static function moveFolder($src, $dest = '')
    {
        // If source is not a directory stop processing
        if (!is_dir($src)) return false;

        // If the destination directory does not exist create it
        if (!is_dir($dest)) {
            if (!is_dir($dest)) {
                mkdir($dest, 0775, true);
                chown($dest, 'ad-user');
            }
        }

        // Open the source directory to read in files
        $i = new \DirectoryIterator($src);
        foreach ($i as $f) {
            if ($f->isFile()) {
                @copy($f->getRealPath(), "$dest/" . $f->getFilename());
            } else if (!$f->isDot() && $f->isDir()) {
                self::moveFolder($f->getRealPath(), "$dest/$f");
            }
        }
    }

    public static function transformStatic(&$data)
    {
        $export = array();
        $tmp = array();

        foreach ($data as $row) {
            foreach ($row as $key => $value)
                $tmp[strtolower($key)] = $value;
            $export[] = $tmp;
        }

        return $export;
    }

    public static function buildQueryOracleMonitor($data)
    {
        $arr_return = [];
        if (is_array($data)) {
            $data_binding = isset($data['data']) ? $data['data'] : array();
            $raw_sql = isset($data['raw_sql']) ? $data['raw_sql'] : '';
            $new_sql = '';
            $data_type = isset($data['data_type']) ? $data['data_type'] : array();
            //pr($data_type);
            if (!empty($data_type)) {
                $data_type = iterator_to_array($data_type, true);
            }
            foreach ($data_binding as $key => $value) {
                if (!is_numeric($value) && !is_array($value) && !is_null($value)) {
                    $value = "'" . $value . "'";
                }
                if (is_null($value)) {
                    $value = NULL;
                }
                if (is_array($value)) {
                    $type = $data_type[$key];
                    switch ($type) {
                        case 'arr_num': {
                            $value = 'T_ARRNUM(' . implode(',', $value) . ')';
                            break;
                        }
                        case 'arr_char': {
                            $arr_char = [];
                            foreach ($value as $a_c) {
                                $arr_char[] = "'" . $a_c . "'";
                            }
                            $value = 'T_ARRCHAR(' . implode(',', $arr_char) . ')';
                            break;
                        }
                        case 'cursor': {
                            $value = $key;
                            break;
                        }
                    }
                }
                $raw_sql = str_replace(":" . $key, $value, $raw_sql);
            }
            //
            $arr_return = array(
                'data' => $data_binding,
                'raw_sql' => str_replace('BEGINPKG', 'BEGIN PKG', str_replace(' ', '', str_replace(PHP_EOL, '', $raw_sql)))
            );
        }
        //
        return json_encode($arr_return);
    }

    public static function updateLogApi($data)
    {

        $log_api_id = isset($data['log_api_id']) ? $data['log_api_id'] : '';
        $index_name = isset($data['index_name']) ? $data['index_name'] : '';
        $function = isset($data['actor']) ? $data['actor'] : '';
        $user_id = isset($data['user_id']) ? isset($data['user_id']) : '';

        $network_id = isset($data['network_id']) ? isset($data['network_id']) : '';
        $manager_id = isset($data['manager_id']) ? isset($data['manager_id']) : '';
        $data_update_log = array(
            'log_api_id' => $log_api_id,
            'index_name' => $index_name,
            'actor' => $function,
            'user_id' => $user_id,
            'network_id' => $network_id,
            'manager_id' => $manager_id,
        );

        if (isset($data['data_proccess'])) {
            $data_update_log['data_proccess'] = $data['data_proccess'];
        }
        if (isset($data['setting'])) {
            $data_update_log['setting'] = $data['setting'];
        }
        if (isset($data['data_origin'])) {
            $data_update_log['data_origin'] = $data['data_origin'];
        }
        if (isset($data['data_update'])) {
            $data_update_log['data_update'] = $data['data_update'];
        }
        if (isset($data['data_respone'])) {
            $data_update_log['data_respone'] = $data['data_respone'];
        }
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
        $params = [];
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method == "PUT" || $method == "DELETE") {
            // Add these request vars into _REQUEST, mimicing default behavior, PUT/DELETE will override existing COOKIE/GET vars
            $_REQUEST = $params + $_REQUEST;
            $params = $_REQUEST;
        } else if ($method == "GET") {
            $params = $_GET;
        } else if ($method == "POST") {
            $params = $_POST;
        }

        $key = crc32($request_uri . '+' . microtime());
        $param_agent = [];
        if (isset($_SERVER['HTTP_USER_AGENT'])) {
            $param_agent = Utils::parse_user_agent($_SERVER['HTTP_USER_AGENT']);
        }
        if (!isset($param_agent['platform'])) {
            $param_agent['platform'] = '';
        }
        if (!isset($param_agent['browser_version'])) {
            $param_agent['browser_version'] = '';
        }
        $params_arr = '';
        if (isset($params['params'])) {
            $params_arr = $params['params'];
        }
        $params_string = is_array($params_arr) ? json_encode($params_arr) : $params_arr;

        $data_update_log['api_id'] = $key;
        $data_update_log['ip'] = self::getClientIp();
        $data_update_log['platform'] = isset($params['platform']) ? $params['platform'] : $param_agent['platform'];
        $data_update_log['browser'] = isset($params['platform']) ? $params['platform'] : $param_agent['browser'];
        $data_update_log['browser_version'] = isset($params['browser_version']) ? $params['browser_version'] : $param_agent['version'];
        $data_update_log['timestamp'] = $timestamp;
        $data_update_log['method'] = $method;
        $data_update_log['request_uri'] = isset($params['request_uri']) ? $params['request_uri'] : $request_uri;
        $data_update_log['params'] = isset($params['params']) && !is_null($params['params']) ? $params_string : '';
        $data_update_log['module'] = isset($params['module']) ? $params['module'] : $module;
        $data_update_log['action'] = isset($params['action']) ? $params['action'] : $action;
        $data_update_log['new_api_id'] = $key;
        $data_update_log['user_id'] = isset($data['user_id']) ? $data['user_id'] : '';
        $data_update_log['network_id'] = isset($data['network_id']) ? $data['network_id'] : '';
        $data_update_log['manager_id'] = isset($data['manager_id']) ? $data['manager_id'] : '';
        $data_update_log['params'] = $params;
        $data_update_log['body_params'] = json_decode(file_get_contents('php://input'), true);
        self::runJob(
            'info_buyer',
            'TASK\ElasticSearch',
            'updateLog',
            'doHighBackgroundTask',
            'elastic_helper',
            $data_update_log
        );
    }

    public static function getClientIp()
    {
        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if (isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if (isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if (isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }

    public static function buildQueryESMonitor($data)
    {
        //
        return json_encode($data);
    }

    public static function startTimer()
    {
        return (float)array_sum(explode(' ', microtime()));
    }

    public static function endTimer($startTime)
    {
        $endTimer = (float)array_sum(explode(' ', microtime()));
        return (sprintf("%.4f", ($endTimer - $startTime)) . " seconds");
    }

    public static function execInBackground($cmd)
    {
        if (substr(php_uname(), 0, 7) == "Windows") {
            pclose(popen("start /B " . $cmd, "r"));
        } else {
            exec($cmd . " > /dev/null &");
        }
    }

    public static function recursive($data = array(), $parent_id = 0, $key_id_name = '')
    {
        $result = array();

        foreach ($data as $element) {

            if (gettype($element['parent_id']) == 'string') {
                if ($element['parent_id'] === (string)$parent_id) {
                    $children = self::recursive($data, $element[$key_id_name], $key_id_name);

                    if (!empty($children)) {
                        $element['child'] = $children;
                    }
                    $result[] = $element;
                }
            } else {
                if ($element['parent_id'] == $parent_id) {
                    $children = self::recursive($data, $element[$key_id_name], $key_id_name);

                    if ($children) {
                        $element['child'] = $children;
                    }
                    $result[] = $element;
                }
            }

        }

        return $result;
    }

    public static function get_qr_code_url($username, $secret)
    {
        $h = 200;
        return 'http://chart.apis.google.com/chart?chs=' . $h . 'x' . $h .
        '&chld=M|0&cht=qr&chl=' . urlencode('otpauth://totp/ANTS:' . $username . '?secret=' . $secret . '&issuer=ANTS');
    }

    public static function get_qr_code($username, $secret)
    {
        if (FALSE === $secret) {
            return FALSE;
        }
        $url = self::get_qr_code_url($username, $secret);
        $curl_handle = curl_init();
        $headers = array('Expect:');
        $options = array(
            CURLOPT_URL => $url,
            CURLOPT_CONNECTTIMEOUT => 2,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_USERAGENT => 'My-Google-Auth',
            CURLOPT_HTTPHEADER => $headers
        );
        curl_setopt_array($curl_handle, $options);

        $query = curl_exec($curl_handle);
        curl_close($curl_handle);

        $base_64 = chunk_split(base64_encode($query));

        return '<img class="google_qrcode" src="data:image/gif;base64,' . $base_64 . '" alt="QR Code" />';
    }

    public static function getOS()
    {
        $user_agent = $_SERVER['HTTP_USER_AGENT'];

        $os_platform = "Unknown OS Platform";

        $os_array = array(
            '/windows nt 10/i' => 'Windows_10',
            '/windows nt 6.3/i' => 'Windows_8.1',
            '/windows nt 6.2/i' => 'Windows_8',
            '/windows nt 6.1/i' => 'Windows_7',
            '/windows nt 6.0/i' => 'Windows_Vista',
            '/windows nt 5.2/i' => 'Windows_Server_2003_XP_x64',
            '/windows nt 5.1/i' => 'Windows_XP',
            '/windows xp/i' => 'Windows_XP',
            '/windows nt 5.0/i' => 'Windows_2000',
            '/windows me/i' => 'Windows_ME',
            '/win98/i' => 'Windows_98',
            '/win95/i' => 'Windows_95',
            '/win16/i' => 'Windows_3_11',
            '/macintosh|mac os x/i' => 'Mac_OS_X',
            '/mac_powerpc/i' => 'Mac_OS_9',
            '/linux/i' => 'Linux',
            '/ubuntu/i' => 'Ubuntu',
            '/iphone/i' => 'iPhone',
            '/ipod/i' => 'iPod',
            '/ipad/i' => 'iPad',
            '/android/i' => 'Android',
            '/blackberry/i' => 'BlackBerry',
            '/webos/i' => 'Mobile'
        );

        foreach ($os_array as $regex => $value) {

            if (preg_match($regex, $user_agent)) {
                $os_platform = $value;
            }

        }

        return $os_platform;

    }

    public static function getCachingObject($object_name = '', $object_id = '', $option = '', $build_collection = false)
    {
        try {
            //
            $redis = Nosql\Redis::getInstance('caching_adx');
            //

            $key_cache = 'adx_v3:cache_' . $object_name . ':' . $object_id . ':' . $option;


            //
            $data_cache = $redis->GET($key_cache);


            if (!$data_cache) {
                return false;
            }

            //
            if ($build_collection) {
                $data = self::buildCollectionObject($data_cache);
            } else {
                $data = unserialize($data_cache);
            }

            return $data;

        } catch (Exception $ex) {
            return 0;
        }
    }

    public static function setCachingObject($object_name = '', $object_id = '', $option = '', $data_cache)
    {
        try {
            //
            $redis = Nosql\Redis::getInstance('caching_adx');
            //

            $key_cache = 'adx_v3:cache_' . $object_name . ':' . $object_id . ':' . $option;

            //
            if (is_object($data_cache)) {
                $data = $data_cache->serialize();
            } else {
                $data = serialize($data_cache);
            }

            //
            $result = $redis->SET($key_cache, $data);

            //expired 30s
            $redis->EXPIRE($key_cache, 30);

            return $result;

        } catch (Exception $ex) {
            return 0;
        }
    }

    public static function publishRedisCaching($params = array())
    {
        //
        $channel = $params['channel'];
        $data = $params['data'];
        //
        $config = Config::get('redis')['redis']['adapters']['subscribe_caching'];
        //
        $redis = new \Redis();
        $redis->connect($config['host'], $config['port']);

        $redis->publish($channel, json_encode($data));

        $redis->close();
    }

    public static function convertDateToDisplay($date, $format = "d/m/Y")
    {
        if (empty($date)) {
            return '';
        }

        return date($format, strtotime($date));
    }

    public static function array_sort($array, $on, $order = SORT_ASC)
    {
        $new_array = array();
        $sortable_array = array();

        if (count($array) > 0) {
            foreach ($array as $k => $v) {

                if (is_array($v)) {
                    foreach ($v as $k2 => $v2) {
                        if ($k2 == $on) {
                            $sortable_array[$k] = $v2;
                        }
                    }
                } else {
                    $sortable_array[$k] = $v;
                }
            }

            switch ($order) {
                case SORT_ASC:
                    asort($sortable_array);
                    break;
                case SORT_DESC:
                    arsort($sortable_array);
                    break;
            }

            foreach ($sortable_array as $k => $v) {
                $new_array[$k] = $array[$k];
            }
        }

        return $new_array;
    }
}