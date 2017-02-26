<?php
namespace MT\Search;

class Content extends SearchAbstract
{
    const INDEX_NAME = 'mt_content';
    const INDEX_TYPE = 'contentList';

    public function __construct()
    {
        $this->setSearchIndex(self::INDEX_NAME);
        $this->setSearchType(self::INDEX_TYPE);
    }

    public function createIndex()
    {
        $checkIndex = $this->checkIndex();
        if ($checkIndex) {
            $this->deleteIndex();
        }
        $this->setColumn(self::$column_mapping);
        $result = $this->mapping();
        if (empty($result) || !$result['acknowledged']) {
            return false;
        }
        return true;
    }

    public function searchData($params = [])
    {
        //build params
        $limit = empty($params['limit']) ? 20 : (int)$params['limit'];
        $page = empty($params['page']) ? 1 : (int)$params['page'];
        $offset = $limit * ($page - 1);
        $sort = !empty($params['sort']) && is_array($params['sort']) ? $params['sort'] : ['cont_id' => ['order' => 'desc']];
        $source = !empty($params['source']) && is_array($params['source']) ? $params['source'] : [];

        //build query
        $query = $this->__buildQuery($params);

        $this->setLimit($limit)->setOffset($offset)->setSort($sort)->setSoucre($source);
        $this->getDocument($query);

        //excute
        return $this->excuteQuery();
    }

    public function __buildQuery($params)
    {
        $must = [];
        $must_not = [];
        $should = [];
        if (isset($params['cont_id'])) {
            array_push($must, array(
                "term" => array(
                    'age_id' => $params['age_id']
                )
            ));
        }


        if (!empty($params['in_cont_id'])) {
            array_push($must, array(
                "terms" => array(
                    'cont_id' => $params['in_cont_id']
                )
            ));
        }

        $result = [
            'must' => $must,
            'must_not' => $must_not,
            'should' => $should
        ];

        return $result;
    }
}