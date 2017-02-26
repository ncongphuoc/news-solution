<?php

namespace MT\DAO;

class Category extends AbstractDAO
{
    protected $_table = 'tbl_categories';

    public function __construct()
    {
        $this->setTable($this->_table);
    }

    public function getData($arrCondition = [])
    {
        return $this->get($this->__buildWhere($arrCondition));
    }

    private function __buildWhere($arrCondition)
    {
        $strWhere = '';
        if (isset($arrCondition['cate_id'])) {
            $strWhere .= " AND cate_id=" . $arrCondition['cate_id'];
        }
        return $strWhere;
    }
}