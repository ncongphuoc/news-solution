<?php
namespace MT;

use Zend\Stdlib\ArrayObject;

class Collection extends ArrayObject
{
    protected $_totalRecords = 0;

    /**
     * @param mixed $totalRecords
     */
    public function setTotalRecords($totalRecords)
    {
        $this->_totalRecords = $totalRecords;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTotalRecords()
    {
        return $this->_totalRecords;
    }

    public function filter()
    {
        $args = func_get_args();
        $collection = get_called_class();
        $collection = new $collection();
        $remove = array();
        if (is_string($args[0])) {
            list($field, $value, $clone) = $args;
            foreach ($this as $offset => $row) {
                if ($row->$field == $value) {
                    $collection->append($row);
                    !$clone && $remove[] = $offset;
                }
            }
        } else if (is_callable($args[0])) {
            $fn = $args[0];
            $clone = isset($args[1]) ? $args[1] : 0;
            foreach ($this as $offset => $row) {
                if ($fn($row)) {
                    $collection->append($row);
                    !$clone && $remove[] = $offset;
                }
            }
        }
        if (!empty($remove)) {
            foreach ($remove as $offset) {
                $this->offsetUnset($offset);
            }
        }

        return $collection;
    }

    public function pluck($key)
    {
        $result = array();

        foreach ($this as $v) {
            if (isset($v->$key) && !in_array($v->$key, $result)) $result[] = $v->$key;
        }

        return $result;
    }

    public function groupBy($key, $sort = "", $key_is_date = false)
    {
        $result = array();
        if ($key_is_date) {
            foreach ($this as $row) {
                $temp = date("Y-m-d", strtotime($row->$key));
                $result[$temp][] = $row;
            }
        } else {
            foreach ($this as $row) {
                $result[$row->$key][] = $row;
            }
        }
        $sort = strtolower($sort);
        if ($sort == "asc") ksort($result);
        else if ($sort == "desc") krsort($result);

        return $result;
    }

    public function merge(Collection $collection)
    {
        if ($collection instanceof Collection) {
            $this->exchangeArray(array_merge($this->getArrayCopy(), $collection->getArrayCopy()));
        }

        return $this;
    }

    public function slice($offset, $limit)
    {
        $this->exchangeArray(array_slice($this->getArrayCopy(), $offset, $limit));
        return $this;
    }

    public function serialize_adx()
    {
        return $this->serialize();
    }
}