<?php

namespace My\Job\Client\Adapter;

abstract class AbstractClient
{

    /**
     * Available options
     *
     * @var array available options
     */
    protected $_options = array();

    /**
     * Constructor
     *
     * @param  array $options Associative array of options
     * @throws MTFW_Job_Client_Exception
     * @return void
     */
    public function __construct(array $options = array())
    {
        while (list($name, $value) = each($options)) {
            $this->setOption($name, $value);
        }
    }

    /**
     * Set an option
     *
     * @param  string $name
     * @param  mixed $value
     * @throws MTFW_Job_Client_Exception
     * @return void
     */
    public function setOption($name, $value)
    {

        if (array_key_exists($name, $this->_options)) {
            $this->_options[$name] = $value;
        }
    }

    /**
     * Run background register task to server job
     * @param string $register_function
     * @param array $array_data
     * @param int $unique
     */
    abstract protected function doBackgroundTask($register_function, $array_data, $unique = null);

    /**
     * Run background register task to server job
     * @param string $register_function
     * @param array $array_data
     * @param int $unique
     */
    abstract protected function doHighBackgroundTask($register_function, $array_data, $unique = null);

    /**
     * Run background register task to server job
     * @param string $register_function
     * @param array $array_data
     * @param int $unique
     */
    abstract protected function doLowBackgroundTask($register_function, $array_data, $unique = null);

    /**
     * Run foreground register task to server job
     * @param string $register_function
     * @param array $array_data
     * @param int $unique
     */
    abstract protected function doTask($register_function, $array_data, $unique = null);

    /**
     * Run foreground register task to server job
     * @param string $register_function
     * @param array $array_data
     * @param int $unique
     */
    abstract protected function doHighTask($register_function, $array_data, $unique = null);

    /**
     * Run foreground register task to server job
     * @param string $register_function
     * @param array $array_data
     * @param int $unique
     */
    abstract protected function doLowTask($register_function, $array_data, $unique = null);
}

