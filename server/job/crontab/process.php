<?php
// Define root path
define('ROOT_PATH', realpath(dirname(__FILE__) . '/../../..'));

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
chdir(dirname(__DIR__) . '/../..');

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

//Load namespaces
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
    'type-s' => 'type',
    'v-i' => 'verbose option'
));

//Get info console
$env = $opts->getOption('env');
$type = $opts->getOption('type');
$verbose = $opts->getOption('v');

if (empty($env) || !in_array($env, array('development', 'sandbox', 'production'))) {
    echo 'Error Environment server-name.php --env [development, sandbox, production]';
    exit();
}

// Define application environment
defined('APPLICATION_ENV')
|| define('APPLICATION_ENV', $env);

//
require_once CONFIG_PATH . '/autoload/' . APPLICATION_ENV . '/global.php';

//Print information environment
if ($verbose) {
    echo "ROOT_PATH : " . ROOT_PATH . "\n";
    echo "ENVIRONMENT : " . APPLICATION_ENV . "\n";
}

switch ($type) {
    case 'dk':
        ADX\Utils::runJob(
            'info',
            'TASK\Test',
            '__FUNCTION__',
            'doHighBackgroundTask',
            'admin_process',
            array(//params
            )
        );
        break;
    default :
        break;
}