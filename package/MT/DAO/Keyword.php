<?php

namespace MT\DAO;

class Keyword extends AbstractDAO
{
    protected $_table = 'tbl_keyword';
    protected $_index = 'keyword';

    public function __construct()
    {
        $this->setTable($this->_table);
    }

    public function add($params)
    {
        $this->_params = $params;
        $result = $this->insert();

        //call job syn data to ES
        if ($result) {
            $params['key_id'] = $result;
            $this->setDataRsyn(
                [
                    'params_es' => $params,
                    'type' => __FUNCTION__,
                    'index' => $this->_index
                ]
            );
            $this->rsynDataEs();
        }
        return $result;
    }

    public function update($params, $condition)
    {
        $this->setParams($params);
        $this->setQuery($this->__buildWhere($condition));
        $result = $this->edit();
        if ($result) {
            $params['keyword'] = $condition['key_id'];
            $this->setDataRsyn(
                [
                    'params_es' => $params,
                    'type' => __FUNCTION__,
                    'index' => $this->_index
                ]
            );
            $this->rsynDataEs();
        }
        return $result;
    }

    public function getData($params)
    {
        //build params
        $limit = empty($params['limit']) ? 20 : (int)$params['limit'];
        $page = empty($params['page']) ? 1 : (int)$params['page'];
        $offset = $limit * ($page - 1);
        $column = !empty($params['column']) && is_array($params['column']) ? $params['column'] : '';
        $sort = !empty($params['order_by']) ? $params['order_by'] : 'key_id DESC';

        //build query
        $query = $this->__buildWhere($params);
        $this->setLimit($limit)->setOffset($offset)->setColumn($column)->setQuery($query)->setSort($sort);
        return $this->get();
    }

    private function __buildWhere($arrCondition)
    {
        $strWhere = '';
        if (isset($arrCondition['key_id'])) {
            $strWhere .= " AND key_id=" . $arrCondition['key_id'];
        }
        return $strWhere;
    }
}