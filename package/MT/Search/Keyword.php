<?php
namespace MT\Search;

class Keyword extends SearchAbstract
{
    const INDEX_NAME = 'mt_keyword';
    const INDEX_TYPE = 'keywordList';

    public static $column_mapping = [
        'key_id' => [
            'type' => 'long',
            'index' => 'not_analyzed'
        ],
        'key_name' => [
            'type' => 'string',
            'index' => 'analyzed',
            'store' => 'yes',
            'analyzer' => 'translation_index_analyzer',
            'search_analyzer' => 'translation_search_analyzer',
            'term_vector' => 'with_positions_offsets'
        ],
        'key_slug' => [
            'type' => 'string',
            'index' => 'not_analyzed'
        ],
        'is_crawler' => [
            'type' => 'integer',
            'index' => 'not_analyzed'
        ],
        'created_date' => [
            'type' => 'long',
            'index' => 'not_analyzed'
        ],
        'updated_date' => [
            'type' => 'long',
            'index' => 'not_analyzed'
        ],
        'key_description' => [
            'type' => 'string',
            'index' => 'analyzed'
        ]
    ];

    public function __construct()
    {
        $this->setSearchIndex(self::INDEX_NAME);
        $this->setSearchType(self::INDEX_TYPE);
        $this->setSearchClient();
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

    public function add($params)
    {
        $this->setId($params['key_id']);
        $this->setDataIndex($params);
        return $this->addDocument();
    }

    public function update($params)
    {
        $this->setId($params['key_id']);
        $this->setDataIndex($params);
        return $this->editDocument();
    }

    public function searchData($params = [])
    {
        //build params
        $limit = empty($params['limit']) ? 20 : (int)$params['limit'];
        $page = empty($params['page']) ? 1 : (int)$params['page'];
        $offset = $limit * ($page - 1);
        $sort = !empty($params['sort']) && is_array($params['sort']) ? $params['sort'] : ['key_id' => ['order' => 'desc']];
        $source = !empty($params['source']) && is_array($params['source']) ? $params['source'] : [];

        //build query
        $query = $this->__buildQuery($params);

        $this->setLimit($limit)->setOffset($offset)->setSort($sort)->setSoucre($source);
        $this->setParamsQuery($query);

        //excute
        return $this->getDocument();
    }

    public function __buildQuery($params)
    {
        $must = [];
        $must_not = [];
        $should = [];
        if (isset($params['key_id'])) {
            array_push($must, array(
                "term" => array(
                    'key_id' => $params['key_id']
                )
            ));
        }


        if (!empty($params['in_key_id'])) {
            array_push($must, array(
                "terms" => array(
                    'key_id' => $params['in_key_id']
                )
            ));
        }

        if (!empty($params['key_slug'])) {
            array_push($must, array(
                "term" => array(
                    'key_slug' => $params['key_slug']
                )
            ));
        }

        if (!empty($params['match_key_name'])) {
            array_push($must, array(
                "match" => array(
                    'key_name' => $params['match_key_name']
                )
            ));
        }

        if (!empty($params['like_key_name'])) {
//            'query_string' => array(
//                'default_field' => 'ads_id',
//                'query' => implode(' ', $params['list_user_id'])
//            )
                array_push($must, array(
                    'query_string' => array(
                        'default_field' => 'key_name',
                        'query' => $params['like_key_name']
                    )
                ));
//            array_push($must, array(
//                "wildcard" => array(
//                    'key_name' => '*' . $params['like_key_name'] . '*'
//                )
//            ));
        }

        $result = [
            'must' => $must,
            'must_not' => $must_not,
            'should' => $should
        ];

        return $result;
    }
}