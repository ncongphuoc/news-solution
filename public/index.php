<?php
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_http_input('UTF-8');
mb_language('uni');
mb_regex_encoding('UTF-8');
ob_start('mb_output_handler');

//
//echo '<center><h1>WELCOME TO MT-PING</h1></center>';
//return;
ini_set("display_errors", 1);

//Root path
define('ROOT_PATH', realpath(dirname(__FILE__) . '/..'));

// Define application environment
defined('APPLICATION_ENV')
|| define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development'));

// Define path to config directory
defined('CONFIG_PATH')
|| define('CONFIG_PATH', ROOT_PATH . '/config');

defined('LANGUAGE_DEFAULT')
|| define('LANGUAGE_DEFAULT', 'vi_VN');

//Host Name
define('HOST_NAME', $_SERVER['HTTP_HOST']);

//
require_once CONFIG_PATH . '/common/defined.php';
//
require_once CONFIG_PATH . '/common/constant.php';

/**
 * This makes our life easier when dealing with paths. Everything is relative
 * to the application root now.
 */
chdir(dirname(__DIR__));

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

// Run the application!
Zend\Mvc\Application:: init(require 'config/application.config.php')->run();

//init function debug
if (isset($_GET['d_pro_p'])) {
    $domain = $_SERVER['SERVER_NAME'];
    if ($_GET['d_pro_p'] == 'true') {
        setcookie('d_pro_p', 'd_pro_p', time() + 3600, '/', $domain);
    } else {
        setcookie('d_pro_p', '', time() - 3600, '/', $domain);
    }
}
