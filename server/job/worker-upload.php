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

//
require_once CONFIG_PATH . '/autoload/' . APPLICATION_ENV . '/global.php';

//Print information environment
if ($verbose) {
    echo "ROOT_PATH : " . ROOT_PATH . "\n";
    echo "ENVIRONMENT : " . APPLICATION_ENV . "\n";
}

//Get Configuration
$jobConfiguration = \MT\Job\Client::getConfig();
$adapter = $jobConfiguration['adapter'];

//Create job worker
$worker = \My\Job\Worker::factory($adapter, $jobConfiguration);

//Add function to worker
$worker->addFunction($jobConfiguration['function']['admin_upload'], 'adxReduceFn');

$return = $worker->run();

//Print result
if ($verbose) {
    echo "Result : $return\n";
}

//Function worker
function adxReduceFn($job)
{
    global $worker, $verbose, $configuration;

    $fileNameSuccess = "Worker_Upload_Action";
    $fileNameError = "Worker_Upload_Error";
    $arrData = array();

    //Try execute
    $result = 0;

    //Close Connection
    \MT\Database::closeAllConnections();

    try {
        $params = json_decode($job->workload(), true);

        if (!is_array($params)) {
            //Parameter
            $params = $worker->getNotifyData($job);
        }

        $arrData['Param'] = $params;


        //Get class
        $className = $params['class'];

        //Check class
        if (empty($className)) {
            return false;
        }

        //Get function
        $function = $params['function'];

        //Check function
        if (empty($function)) {
            return false;
        }

        \MT\Utils::writeLog('Monitor_Worker', array(
            'worker_name' => 'server-upload.php',
            'class' => $className,
            'function' => $function
        ));

        //check params
        $args = $params['args'];

        //Starting execute script
        if (empty($args)) {
            $result = call_user_func_array(array($className, $function), array());
        } else {
            $result = call_user_func_array(array($className, $function), array($args));
        };

        //Debug
        if ($verbose) {
            echo "\n" . date('H:i:s') . " Execute function: '" . $function . "' at class : '" . $className . "' with params :" . Zend\Json\Json::encode($args) . "\n";
        }

        //Log Success
        $arrData['Data'] = $result;

        //Log
        \MT\Utils::writeLog($fileNameSuccess, $arrData);
    } catch (Exception $ex) {
        //Print
        echo "Error :" . $ex->getMessage();

        $arrData['Exception'] = array('Message' => $ex->getMessage(), 'Code' => $ex->getCode(), 'File' => $ex->getFile(), 'Line' => $ex->getLine());

        //Log Error
        \MT\Utils::writeLog($fileNameError, $arrData);
    }

    //Close Connection
    \MT\Database::closeAllConnections();

    //Return
    return $result;
}