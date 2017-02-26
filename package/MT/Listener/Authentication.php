<?php

namespace MT\Listener;

use Zend\Mvc\MvcEvent;
use Zend\EventManager\EventManager;

class Authentication
{
    public function __invoke(MvcEvent $e)
    {
        try {
            //
            $params = null;
            $method = $e->getRequest()->getMethod();
            //
            switch ($method) {
                case 'GET':
                    $params = $e->getRequest()->getQuery()->toArray();
                    break;
                case 'POST':
                    $params = $e->getRequest()->getQuery()->toArray();
                    break;
                case 'PUT':
                case 'DELETE':
                    $params = $e->getRequest()->getQuery()->toArray();
                    break;
            }
            foreach ($params as $k => $v) {
                $e->setParam($k, $v);
            }
        } catch (\Exception $exc) {
            echo '<pre>';
            print_r($exc->getMessage());
            echo '</pre>';
            die();
        }

    }
}