<?php
define('LOG_FOLDER', ROOT_PATH . '/data/logs');
define('KEY_PREFIX', 'mt_');
define('PRODUCT_VERSION', 'v1');

if (php_sapi_name() != 'cli') {
    $protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"], 0, 5)) == 'https' ? 'https' : 'http';
    //
    define('HTTP_PROTOCOL', $protocol);
    //
    $file_config = CONFIG_PATH . '/domain/' . APPLICATION_ENV . '/' . $_SERVER['SERVER_NAME'] . '.php';
    //
    if (file_exists($file_config)) {
        include_once CONFIG_PATH . '/domain/' . APPLICATION_ENV . '/' . $_SERVER['SERVER_NAME'] . '.php';
    } else {
        switch (APPLICATION_ENV) {
            case 'development':
                include_once CONFIG_PATH . '/domain/' . APPLICATION_ENV . '/' . $_SERVER['SERVER_NAME'] . '.php';
                break;
            case 'production':
                include_once CONFIG_PATH . '/domain/' . APPLICATION_ENV . '/default.php';
                break;
        }
    }
}
