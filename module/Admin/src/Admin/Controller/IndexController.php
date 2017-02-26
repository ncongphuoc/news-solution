<?php

namespace Admin\Controller;

use ADX\PubSub;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use ADX\Model;
use ADX\Business;
use ADX\Utils;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        echo '<pre>';
        print_r('22');
        echo '</pre>';
        die();
        return new ViewModel();
    }
}
