<?php
namespace MT\DAO;

use MT\Database,
    Zend\Db\Adapter as ZendDbAdapter,
    Zend\Db\Sql\Sql;

abstract class AbstractDAO
{
    protected $_limit;
    protected $_offset;
    protected $_page;
    protected $_table;
    protected $_sort;
    protected $_params;
    protected $_query;
    protected $_column;
    protected $_adapter;
    protected $_data_rsyn;

    public function setDataRsyn($data_rsyn)
    {
        $this->_data_rsyn = $data_rsyn;
        return $this;
    }

    public function getDataRsyn()
    {
        return $this->_data_rsyn;
    }

    public function setAdapter($adapter)
    {
        $this->_adapter = $adapter;
    }

    public function getAdapter()
    {
        return $this->_adapter;
    }

    public function setColumn($column = [])
    {
        $this->_column = $column;
        return $this;
    }

    public function getColumn()
    {
        return $this->_column;
    }

    public function setQuery($query)
    {
        $this->_query = $query;
        return $this;
    }

    public function getQuery()
    {
        return $this->_query;
    }

    public function setTable($_table)
    {
        $this->_table = $_table;
        return $this;
    }

    public function getTable()
    {
        return $this->_table;
    }

    public function setParams($params)
    {
        $this->_params = $params;
        return $this;
    }

    public function getParams()
    {
        return $this->_params;
    }

    public function setLimit($_limit)
    {
        $this->_limit = $_limit;
        return $this;
    }

    public function getLimit()
    {
        return $this->_limit;
    }

    public function setPage($_page)
    {
        $this->_page = $_page;
        return $this;
    }

    public function getPage()
    {
        return $this->_page ? $this->_page : 1;
    }

    public function setOffset($offset)
    {
        $this->_offset = $offset;
        return $this;
    }

    public function getOffset()
    {
        return $this->_offset;
    }

    public function setSort($sort)
    {
        $this->_sort = $sort;
        return $this;
    }

    public function getSort()
    {
        return $this->_sort;
    }

    public function insert()
    {
        try {
            $p_arrParams = $this->getParams();
            if (!is_array($p_arrParams) || empty($p_arrParams)) {
                return false;
            }
            $adapter = Database::getInstance('info_slave');
            $sql = new Sql($adapter);
            $insert = $sql->insert($this->getTable())->values($p_arrParams);
            $query = $sql->getSqlStringForSqlObject($insert);
            $adapter->createStatement($query)->execute();
            $result = $adapter->getDriver()->getLastGeneratedValue();
            return $result;
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return false;
        }
    }

    public function edit()
    {
        try {
            $param = $this->getParams();
            $query = $this->getQuery();
            if (!is_array($param) || empty($param) || empty($query)) {
                return false;
            }
            $adapter = Database::getInstance('info_slave');
            $sql = new Sql($adapter);
            $update = $sql->update($this->getTable())->set($param)->where('1=1 ' . $query);
            $statement = $sql->prepareStatementForSqlObject($update);
            $result = $statement->execute();
            return $result->getAffectedRows();
        } catch (\Exception $exc) {
            if (APPLICATION_ENV !== 'production') {
                die($exc->getMessage());
            }
            return false;
        }

    }

    public function get()
    {
        try {
            $strWhere = $this->getQuery();
            $adapter = Database::getInstance('info_slave');
            $sql = new Sql($adapter);
            $select = $sql->Select($this->getTable())
                ->where('1=1' . $strWhere)
                ->order($this->getSort())
                ->offset($this->getOffset())
                ->limit($this->getLimit());
            if ($this->getColumn()) {
                $select->columns($this->getColumn());
            }
            $query = $sql->getSqlStringForSqlObject($select);
            return $adapter->query($query, $adapter::QUERY_MODE_EXECUTE)->toArray();
        } catch (\Exception $e) {
            if (APPLICATION_ENV !== 'production') {
                echo '<pre>';
                print_r($e->getMessage());
                echo '</pre>';
                die();
            }
            return false;
        }
    }

    public function rsynDataEs()
    {
        try {
            $data = $this->getDataRsyn();
            \MT\Utils::runJob(
                'info',
                'TASK\SynDataEs',
                'rsynData',
                'doHighBackgroundTask',
                'admin_process',
                array(
                    'actor' => 'admin_rsyn',
                    'index' => $data['index'],
                    'params_es' => $data['params_es'],
                    'type' => $data['type']
                )
            );
        } catch (\Exception $e) {
            if (APPLICATION_ENV !== 'production') {
                echo '<pre>';
                print_r($e->getMessage());
                echo '</pre>';
                die();
            }
            return false;
        }

    }
} 