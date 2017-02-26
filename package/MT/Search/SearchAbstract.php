<?php
/*
 * creator : Chien Nguyen
 * Mail : ngocchien01@gmail.com
 * Skype : ngocchien01
 */

namespace MT\Search;

abstract class SearchAbstract
{

    protected $_searchClient;
    protected $_searchIndex;
    protected $_searchType;
    protected $_params;
    protected $_resultSet;
    protected $_limit;
    protected $_offset;
    protected $_sort;
    protected $_source;
    protected $_paramsQuery;
    protected $_column;
    protected $_data_index;
    protected $_id;

    public function setId($id)
    {
        $this->_id = $id;
        return $this;
    }

    public function getId()
    {
        return $this->_id;
    }

    public function setDataIndex($dataIndex)
    {
        $this->_data_index = $dataIndex;
        return $this;

    }

    public function getDataIndex()
    {
        return $this->_data_index;
    }

    //
    public function setColumn($colum)
    {
        $this->_column = $colum;
        return $this;
    }

    public function getColumn()
    {
        return $this->_column;
    }

    /**
     * @return the $_searchIndex
     */
    public function getSearchIndex()
    {
        return $this->_searchIndex;
    }

    public function setSearchClient()
    {
        $this->_searchClient = \MT\Elastic::getInstances('info_slave');
        return $this;
    }

    public function getSearchClient()
    {
        return $this->_searchClient;
    }

    /**
     * @param field_type $_searchIndex
     */
    public function setSearchIndex($_searchIndex)
    {
        //get config
        $config = \MT\Config::get('elastic');
        $hosts = $config['elastic']['adapters']['info_slave'];
        $this->_searchIndex = isset($hosts['prefix']) ? $hosts['prefix'] . '.' . $_searchIndex : $_searchIndex;
        return $this;
    }

    /**
     * @return the $_searchType
     */
    public function getSearchType()
    {
        return $this->_searchType;
    }

    /**
     * @param field_type $_searchType
     */
    public function setSearchType($_searchType)
    {
        $this->_searchType = $_searchType;
    }

    /**
     * @return the $_limit
     */
    public function getLimit()
    {
        return $this->_limit;
    }

    /**
     * @param field_type $_limit
     */
    public function setLimit($_limit)
    {
        $this->_limit = $_limit;
        return $this;
    }

    /**
     * @return the $_resultSet
     */
    public function getResultSet()
    {
        return $this->_resultSet;
    }

    /**
     * @param field_type $_resultSet
     */
    public function setResultSet($_resultSet)
    {
        $this->_resultSet = $_resultSet;
    }

    /**
     * @return the $_params
     */
    public function getParams()
    {
        return $this->_params;
    }

    /**
     * @param field_type $_params
     */
    public function setParams($_params)
    {
        $this->_params = $_params;
        return $this;
    }

    public function setOffset($_offset)
    {
        $this->_offset = $_offset;
        return $this;
    }

    public function getOffset()
    {
        return $this->_offset;
    }

    public function setSort($_sort)
    {
        $this->_sort = $_sort;
        return $this;
    }

    public function getSort()
    {
        return $this->_sort;
    }

    public function setSoucre($_soucre)
    {
        $this->_source = $_soucre;
        return $this;
    }

    public function getSource()
    {
        return $this->_source;
    }

    public function setParamsQuery($params)
    {
        $this->_paramsQuery = $params;
    }

    public function getParamsQuery()
    {
        return $this->_paramsQuery;
    }

    public function deleteIndex()
    {
        try {
            return $this->getSearchClient()->indices()->delete([
                'index' => $this->getSearchIndex()
            ]);
        } catch (\Exception $ex) {
            if (APPLICATION_ENV !== 'production') {
                die($ex->getMessage());
            }
            return false;
        }
    }

    public function checkIndex()
    {
        try {
            return $this->getSearchClient()->indices()->exists([
                'index' => $this->getSearchIndex()
            ]);
        } catch (\Exception $ex) {
            if (APPLICATION_ENV !== 'production') {
                die($ex->getMessage());
            }
            return false;
        }
    }

    public function mapping()
    {
        try {
            $params = [
                'index' => $this->getSearchIndex(),
                'body' => [
                    'settings' => [
                        'name' => 'translations',
                        'number_of_shards' => 5,
                        'number_of_replicas' => 0,
                        'analysis' => [
                            'analyzer' => [
                                'translation_index_analyzer' => [
                                    'type' => 'custom',
                                    'tokenizer' => 'standard',
                                    'filter' => ['standard', 'lowercase', 'asciifolding', 'trim']
                                ],
                                'translation_search_analyzer' => [
                                    'type' => 'custom',
                                    'tokenizer' => 'standard',
                                    'filter' => ['standard', 'lowercase', 'asciifolding', 'trim']
                                ]
                            ]
                        ],
                        'filter' => [
                            'translation' => [
                                'type' => 'edgeNGram',
                                'token_chars' => ["letter", "digit", " whitespace"],
                                'min_gram' => 1,
                                'max_gram' => 30,
                            ]
                        ]
                    ],
                    'mappings' => [
                        $this->getSearchType() => [
                            '_source' => [
                                'enabled' => true
                            ],
                            'properties' => $this->getColumn()
                        ]
                    ]
                ]
            ];
            return $this->getSearchClient()->indices()->create($params);

        } catch (\Exception $e) {
            if (APPLICATION_ENV !== 'production') {
                die($e->getMessage());
            }
            return false;
        }
    }

    public function addDocument()
    {
        try {
            $data_index = [
                'index' => $this->getSearchIndex(),
                'type' => $this->getSearchType(),
                'id' => $this->getId(),
                'body' => $this->getDataIndex()
            ];
            $response = $this->getSearchClient()->index($data_index);
            if ((isset($response['created']) && $response['created'] == 1)) {
                return true;
            }
            return false;
        } catch (\Exception $ex) {
            if (APPLICATION_ENV !== 'production') {
                die($ex->getMessage());
            }
            return false;
        }
    }

    public function editDocument()
    {
        try {
            $data_update = [
                'index' => $this->getSearchIndex(),
                'type' => $this->getSearchType(),
                'id' => $this->getId(),
                'body' => [
                    'doc' => $this->getDataIndex()
                ]
            ];

            $response = $this->getSearchClient()->update($data_update);
            if ((isset($response['_version']) && $response['_version'] > 1)) {
                return true;
            }
            return false;
        } catch (\Exception $ex) {
            if (APPLICATION_ENV !== 'production') {
                die($ex->getMessage());
            }
            return false;
        }
    }

    public function getDocument()
    {
        try {
            $body = [
                'index' => $this->_searchIndex,
                'type' => $this->getSearchType(),
                'body' => [
                    'query' => [
                        'bool' => [
                            'must' => $this->_paramsQuery['must'],
                            'must_not' => $this->_paramsQuery['must_not'],
                            'should' => $this->_paramsQuery['should']
                        ]
                    ],
                    'from' => $this->_offset,
                    'size' => $this->_limit,
                    'sort' => $this->_sort,
                    '_source' => $this->_source
                ]
            ];
//            echo '<pre>';
//            print_r($body);
//            echo '</pre>';
//            die();
            $result = $this->_searchClient->search($body);

            $data = [
                'total' => $result['hits']['total'],
                'rows' => []
            ];

            foreach ($result['hits']['hits'] as $rows) {
                if (isset($rows['_source']) && !empty($rows['_source'])) {
                    $data['rows'][] = $rows['_source'];
                }
            }
            unset($result);

            return $data;
        } catch (\Exception $ex) {
            if (APPLICATION_ENV !== 'production') {
                die($ex->getMessage());
            }
            return false;
        }

    }
}
