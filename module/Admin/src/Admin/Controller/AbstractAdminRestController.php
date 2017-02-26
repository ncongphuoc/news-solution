<?php

namespace Admin\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;

abstract class AbstractAdminRestController extends AbstractRestfulController
{
    protected $eventIdentifier = 'Admin\Api\Controller';
}
