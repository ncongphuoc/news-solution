/**
 * Created by nhanva on 4/24/2016.
 */
define(['app', 'modules/operation/services/search',
    'shared/directive/filterDropDown'
    ], function (app) {
    app.directive('filtertop', ['Metric', 'Filter', 'Search', '$state', 'debounce', '$location', 'Modal', 'Storage', 'Session',
        function (Metric, Filter, Search, $state, debounce, $location, Modal, Storage, Session) {
            return {
                restrict: 'E',
                scope: {
                    filterTop: '&filtertop',
                    params: '=params',
                    typeitem: '=typeitem'
                },
                require: ["filtertop", "^operations"],
                link: function (scope, element, attrs, ctrl) {
                    ctrl[1].registerFilterTop(ctrl[0]);
                    var _promiseSearch;

                    // Update param on url
                    var updateUrl = debounce(function (param) {
                        // Make default param
                        // c: Column, m: Metric, mvs: Metric compare, q: Search, s: Segment, t: Time
                        var urlParam = angular.extend({
                            c: null,
                            m: null,
                            mvs: null,
                            q: null,
                            s: null
                        }, $location.search(), param);
                        $location.search(urlParam)
                    }, 500, false);

                    // Get param from url
                    var params = $location.search();

                    // Set default filter info
                    scope.arr_filter = {
                        filter: params.f || '',
                        text_search: params.q || '',
                        metric: params.m || 'CLICK',
                        metric_compare: params.mvs || 'IMPRESSION',
                        time: params.t || 'day',
                        isCompare: false,
                        metric_value: 'Clicks',
                        metric_compare_value: 'Impr.',
                        time_value: 'Daily'
                    };

                    scope.search_placeholder = 'Find ...';
                    scope.search_opened = false;
                    scope.search_not_found = false;
                    scope.show_navigate = true;
                    scope.show_box_search = false;
                    scope.search_object = 'Lineitems';

                    if (typeof scope.params.object != 'undefined') {
                        switch (scope.params.object) {
                            case 'lineitems':
                                scope.search_placeholder = 'Find line items';
                                scope.search_object = 'Lineitems';
                                scope.show_navigate = true;
                                scope.show_box_search = true;
                                break;
                            case 'campaigns':
                                scope.search_placeholder = 'Find campaigns';
                                scope.search_object = 'Campaigns';
                                scope.show_navigate = true;
                                scope.show_box_search = true;
                                break;
                            case 'creatives':
                                scope.search_placeholder = 'Find creatives';
                                scope.search_object = 'Creatives';
                                scope.show_navigate = false;
                                scope.show_box_search = true;
                                break;
                        }
                    }

                    angular.extend(scope.params || {}, scope.arr_filter);

                    //Init
                    scope.dataSource = {
                        filter: {
                            group1: {
                                name: '',
                                display: 0,
                                child: [
                                    {value: 'Create filter', key: '1'}
                                ]
                            },
                            group2: {
                                name: '',
                                display: 0,
                                child: [{value: 'Filter by label', key: '2', child: []}]
                            },
                            group3: {
                                name: '',
                                child: [],
                                display: 0
                            }
                        },
                        metric: [
                            {
                                value: 'Performance',
                                key: '5000',
                                child: [
                                    {value: 'Clicks', key: '5001'},
                                    {value: 'Impr.', key: '5002'},
                                    {value: 'CTR', key: '5003'},
                                    {value: 'Avg. CPC', key: '5004'},
                                    {value: 'Avg. CPM', key: '5005'},
                                    {value: 'Cost', key: '5006'},
                                    {value: 'Avg. Pos.', key: '5007'}
                                ]
                            },
                            {
                                value: 'Conversions', key: '6000', child: [
                                {value: 'Conversions', key: '6001'},
                                {value: 'Cost / conv.', key: '6002'},
                                {value: 'Conv. rate', key: '6003'},
                                {value: 'View-through conv.', key: '6004'},
                                {value: 'Cost / all conv.', key: '6005'},
                                {value: 'All conv. rate', key: '6006'},
                                {value: 'All conv. value / cost', key: '6007'}
                            ]
                            },
                            {
                                value: 'Attribution', key: '7000', child: [
                                {value: 'Click assisted conv.', key: '7001'},
                                {value: 'Impr. assisted conv.', key: '7001'},
                                {value: 'Click-assisted conv. / last click conv.', key: '7001'},
                                {value: 'Impr. assisted conv. / last click conv.', key: '7001'}
                            ]
                            },
                            {
                                value: 'Gmail Metrics', key: '8000', child: [
                                {value: 'Gmail saves', key: '8001'},
                                {value: 'Gmail forwards', key: '8002'},
                                {value: 'Gmail clicks to website', key: '8002'}
                            ]
                            }
                        ],
                        metric_compare: [
                            {
                                value: 'Performance', key: '5000', child: [
                                {value: 'Clicks', key: '5001'},
                                {value: 'Impr.', key: '5002'},
                                {value: 'CTR', key: '5003'},
                                {value: 'Avg. CPC', key: '5004'},
                                {value: 'Avg. CPM', key: '5005'},
                                {value: 'Cost', key: '5006'},
                                {value: 'Avg. Pos.', key: '5007'}
                            ]
                            },
                            {
                                value: 'Conversions', key: '6000', child: [
                                {value: 'Conversions', key: '6001'},
                                {value: 'Cost / conv.', key: '6002'},
                                {value: 'Conv. rate', key: '6003'},
                                {value: 'View-through conv.', key: '6004'},
                                {value: 'Cost / all conv.', key: '6005'},
                                {value: 'All conv. rate', key: '6006'},
                                {value: 'All conv. value / cost', key: '6007'}
                            ]
                            },
                            {
                                value: 'Attribution', key: '7000', child: [
                                {value: 'Click assisted conv.', key: '7001'},
                                {value: 'Impr. assisted conv.', key: '7001'},
                                {value: 'Click-assisted conv. / last click conv.', key: '7001'},
                                {value: 'Impr. assisted conv. / last click conv.', key: '7001'}
                            ]
                            },
                            {
                                value: 'Gmail Metrics', key: '8000', child: [
                                {value: 'Gmail saves', key: '8001'},
                                {value: 'Gmail forwards', key: '8002'},
                                {value: 'Gmail clicks to website', key: '8002'}
                            ]
                            }
                        ],
                        time: [
                            {value: 'Hourly', key: 'hour', enable: true},
                            {value: 'Daily', key: 'day', enable: true},
                            {value: 'Weekly', key: 'week', enable: true},
                            {value: 'Monthly', key: 'month', enable: true},
                            {value: 'Quarterly', key: 'quarter', enable: true}
                        ],
                        search: []
                    };

                    scope.search_change = true;

                    var arr_filter = Storage.read('filter');
                    if (arr_filter) {
                        angular.merge(scope.arr_filter, arr_filter);
                        angular.merge(scope.params, scope.arr_filter);
                    } else {
                        Storage.write('filter', scope.arr_filter)
                    }

                    //enable & disable select box time
                    var dataPicker = Storage.read('calendar');
                    if (dataPicker) {
                        var from_date = moment(dataPicker.from_date, 'DD/MM/YYYY'),
                            to_date = moment(dataPicker.to_date, 'DD/MM/YYYY'),
                            duration = moment.duration(to_date.diff(from_date)).asDays();

                        //
                        scope.arr_filter.isCompare = dataPicker.compare;

                        var time = [],
                            enable_quarterly = false,
                            enable_monthly = false,
                            enable_weekly = false,
                            enable_day = false,
                            enable_hourly = false;

                        //quarterly
                        if (duration >= 90) {
                            enable_quarterly = true;
                            enable_monthly = true;
                            enable_weekly = true;
                            enable_day = true;

                        } else if (duration >= 28) {
                            //monthly
                            enable_monthly = true;
                            enable_weekly = true;
                            enable_day = true;

                            //reset select time
                            if (scope.params.time == 'quarter') {
                                scope.params.time = 'day';
                                scope.arr_filter.time = 'day';
                                scope.arr_filter.time_value = 'Daily';
                            }

                        } else if (duration >= 6) {
                            //weekly
                            enable_weekly = true;
                            enable_day = true;

                            //reset select time
                            if (scope.params.time == 'month' && scope.params.time == 'quarter') {
                                scope.params.time = 'day';
                                scope.arr_filter.time = 'day';
                                scope.arr_filter.time_value = 'Daily';
                            }

                        } else {
                            //Day
                            enable_day = true;

                            //reset select time
                            if (scope.params.time != 'day' && scope.params.time != 'hour') {
                                scope.params.time = 'day';
                                scope.arr_filter.time = 'day';
                                scope.arr_filter.time_value = 'Daily';
                            }
                        }

                        //Hourly validate
                        var today = moment().format('DD/MM/YYYY');
                        today = moment(today, 'DD/MM/YYYY');
                        var hourly_duration = moment.duration(today.diff(from_date)).asDays();

                        if(hourly_duration < 8){
                            enable_hourly = true;
                        }else{
                            //reset select time to daily
                            if(scope.params.time == 'hour'){
                                scope.params.time = 'day';
                                scope.arr_filter.time = 'day';
                                scope.arr_filter.time_value = 'Daily';
                            }
                        }

                        time = [
                            {value: 'Hourly', key: 'hour', enable: enable_hourly},
                            {value: 'Daily', key: 'day', enable: enable_day},
                            {value: 'Weekly', key: 'week', enable: enable_weekly},
                            {value: 'Monthly', key: 'month', enable: enable_monthly},
                            {value: 'Quarterly', key: 'quarter', enable: enable_quarterly}
                        ];

                        // Update url param
                        updateUrl({t: scope.params.time});

                        scope.dataSource.time = time;
                    }

                    scope.init = function () {
                        //get list Metrics
                        scope.getMetrics();
                    };

                    scope.getMetrics = function () {

                        Metric.getList({
                            type: 1,
                            obj: 12
                        }, function (resp) {

                            scope.metric = [];
                            angular.forEach(resp.data, function (metric, index) {
                                var group = {
                                    value: metric.metric_name,
                                    key: metric.metric_id
                                };

                                if (metric.child) {
                                    group.child = [];
                                    angular.forEach(metric.child, function (child_metric, child_index) {
                                        var metrics = {
                                            value: child_metric.metric_name,
                                            key: child_metric.metric_code
                                        };
                                        group.child.push(metrics);
                                    });
                                }

                                scope.metric.push(group);

                            });

                            scope.dataSource.metric = scope.metric;

                            //
                            var metric_compare = [{
                                value: 'None', key: 'none'
                            }];

                            angular.forEach(scope.metric, function (value, key) {
                                metric_compare.push(value);
                            });

                            scope.dataSource.metric_compare = metric_compare;

                        });
                    };

                    scope.getFilter = function () {
                        Filter.getList(scope.params.params_get_filter, function (resp) {

                            scope.dataSource.filter.group3.child = {};
                            scope.dataSource.filter.group3.child = resp.data;
                        });

                    };
                    scope.config_filter = {
                        type: scope.params.params_get_filter.type
                    };

                    scope.init();


                    // Metric
                    scope.changeMetric = function (key, value) {
                        scope.params.metric = key;
                        scope.arr_filter.metric_value = value;

                        scope.filterTop();

                        // Update url param
                        updateUrl({m: key});
                    };

                    // Metric compare
                    scope.changeMetricCompare = function (key, value) {
                        scope.params.metric_compare = key;
                        scope.arr_filter.metric_compare_value = value;
                        scope.filterTop();

                        // Update url param
                        updateUrl({mvs: key});
                    };

                    // Time
                    scope.changeTime = function (key, value) {
                        scope.params.time = key;
                        scope.arr_filter.time_value = value;
                        scope.filterTop();

                        // Update url param
                        updateUrl({t: key});
                    };

                    scope.changeSearch = function (value) {
                        if (value == '') {
                            scope.search_opened = false;
                        } else {
                            //show search box
                            scope.search_opened = true;
                            scope.search_not_found = false;

                            var object = 'lineitems';
                            if (typeof scope.params.object != 'undefined') {
                                object = scope.params.object;
                            }

                            var search_params = {
                                search: value,
                                object: object,
                                limit: 5
                            };

                            if (object != 'creatives') {
                                // Cancel request if it was not finished
                                if(_promiseSearch ){
                                    _promiseSearch.$cancelRequest();
                                }

                                _promiseSearch = Search.getList(search_params);

                                _promiseSearch.$promise.then(function(resp){
                                    if (resp.data) {
                                        scope.search_change = false;
                                        var search = [];
                                        angular.forEach(resp.data, function (item, index) {
                                            switch (scope.params.object) {
                                                case 'lineitems':
                                                    search.push({
                                                        id: item.lineitem_id,
                                                        name: item.lineitem_name
                                                    });

                                                    break;
                                                case 'campaigns':
                                                    search.push({
                                                        id: item.campaign_id,
                                                        name: item.campaign_name
                                                    });

                                                    break;
                                                case 'creatives':
                                                    search.push({
                                                        id: item.creative_id,
                                                        name: item.creative_name
                                                    });

                                                    break;
                                            }

                                        });

                                        scope.dataSource.search = search;
                                        scope.show_navigate = true;
                                    } else {
                                        scope.search_not_found = true;
                                        scope.dataSource.search = [];
                                        scope.show_navigate = false;
                                    }

                                    _promiseSearch = null;
                                });
                            } else {
                                scope.search_not_found = false;
                                scope.show_navigate = false;
                            }
                        }
                    };

                    angular.element('.search-listing').bind("keydown", function (event) {

                        if (event.which == 13 && scope.search) {
                            scope.filterSearch(scope.search);
                            scope.search_opened = false;
                        }
                    });

                    scope.clickSearch = function (value) {

                        if (value) {
                            scope.search_opened = true;
                        } else {
                            scope.search_opened = false;
                        }
                    };

                    scope.filterSearch = function (value) {
                        //call function filter
                        var metric_code = 'lineitem_name';
                        var filter = [];

                        switch (scope.search_object) {
                            case 'Lineitems':
                                metric_code = 'lineitem_name';

                                filter = [{
                                    lineitem_name: {
                                        'contain': value
                                    }
                                }];
                                break;
                            case 'Campaigns':
                                metric_code = 'campaign_name';

                                filter = [{
                                    campaign_name: {
                                        'contain': value
                                    }
                                }];
                                break;
                            case 'Creatives':
                                metric_code = 'creative_name';

                                filter = [{
                                    creative_name: {
                                        'contain': value
                                    }
                                }];
                                break;
                        }

                        var params = {
                            metric_code: metric_code,
                            operator: 'contain',
                            'value': value
                        };

                        ctrl[1].renderFilter(params);
                        ctrl[1].renderGrid({filter: filter, fc: 'search filter top'});
                        ctrl[1].renderChart({filter: filter});

                        //
                        scope.search_opened = false;
                    };

                    scope.gotoDetail = function (obj) {
                        var name, param;
                        if ($state.is('campaigns.lineitem')) {
                            name = 'campaigns.lineitem.detail.campaign';
                            param = {lineitem_id: obj.id};
                        } else if ($state.is('campaigns.campaign') || $state.is('campaigns.lineitem.detail.campaign')) {
                            name = 'campaigns.campaign.detail.creative';
                            param = {campaign_id: obj.id};
                        }

                        if (name != undefined) {
                            $state.go(name, param)
                        } else {
                            console.error('Could not resolved route');
                            console.log($state.current)
                        }

                    };

                    scope.reloadTime = function (params) {

                        if (typeof params.from_date !== 'undefined' && typeof params.to_date !== 'undefined') {
                            var from_date = moment(params.from_date, 'DD/MM/YYYY'),
                                to_date = moment(params.to_date, 'DD/MM/YYYY'),
                                duration = moment.duration(to_date.diff(from_date)).asDays();

                            var time = [],
                                enable_quarterly = false,
                                enable_monthly = false,
                                enable_weekly = false,
                                enable_day = false,
                                enable_hourly = false;

                            //quarterly
                            if (duration >= 90) {
                                enable_quarterly = true;
                                enable_monthly = true;
                                enable_weekly = true;
                                enable_day = true;

                            } else if (duration >= 28) {
                                //monthly
                                enable_monthly = true;
                                enable_weekly = true;
                                enable_day = true;

                                //reset select time
                                if (scope.params.time == 'quarter') {
                                    scope.params.time = 'day';
                                    scope.arr_filter.time = 'day';
                                    scope.arr_filter.time_value = 'Daily';
                                }

                            } else if (duration >= 6) {
                                //weekly
                                enable_weekly = true;
                                enable_day = true;

                                //reset select time
                                if (scope.params.time == 'month' && scope.params.time == 'quarter') {
                                    scope.params.time = 'day';
                                    scope.arr_filter.time = 'day';
                                    scope.arr_filter.time_value = 'Daily';
                                }

                            } else {
                                //Day
                                enable_day = true;

                                //reset select time
                                if (scope.params.time != 'day' && scope.params.time != 'hour') {
                                    scope.params.time = 'day';
                                    scope.arr_filter.time = 'day';
                                    scope.arr_filter.time_value = 'Daily';
                                }
                            }

                            //Hourly validate
                            var today = moment().format('DD/MM/YYYY');
                            today = moment(today, 'DD/MM/YYYY');
                            var hourly_duration = moment.duration(today.diff(from_date)).asDays();

                            if(hourly_duration < 8){
                                enable_hourly = true;
                            }else{
                                //reset select time to daily
                                if(scope.params.time == 'hour'){
                                    scope.params.time = 'day';
                                    scope.arr_filter.time = 'day';
                                    scope.arr_filter.time_value = 'Daily';
                                }
                            }

                            time = [
                                {value: 'Hourly', key: 'hour', enable: enable_hourly},
                                {value: 'Daily', key: 'day', enable: enable_day},
                                {value: 'Weekly', key: 'week', enable: enable_weekly},
                                {value: 'Monthly', key: 'month', enable: enable_monthly},
                                {value: 'Quarterly', key: 'quarter', enable: enable_quarterly}
                            ];

                            // Update url param
                            updateUrl({t: scope.params.time});

                            scope.dataSource.time = time;
                        }

                        //
                        if (typeof params.from_range != 'undefined' && typeof params.to_range != 'undefined' &&
                            params.from_range != '' && params.to_range != '') {
                            scope.arr_filter.isCompare = true;
                        } else {
                            scope.arr_filter.isCompare = false;
                        }

                    };

                    // Watch value change
                    scope.$watch(
                        "params",
                        function handleParamChange(old_value, new_value) {

                            if (typeof old_value.reload == 'undefined') {
                                var arr_filter = {
                                    metric_show: [
                                        {
                                            metric_code: scope.params.metric ? scope.params.metric : scope.arr_filter.metric,
                                            metric_name: scope.arr_filter.metric_value
                                        },
                                        {
                                            metric_code: scope.params.metric_compare ? scope.params.metric_compare : scope.arr_filter.metric_compare,
                                            metric_name: scope.arr_filter.metric_compare_value
                                        }],
                                    metric: scope.params.metric ? scope.params.metric : scope.arr_filter.metric,
                                    metric_compare: scope.params.metric_compare ? scope.params.metric_compare : scope.arr_filter.metric_compare,
                                    time: scope.params.time ? scope.params.time : scope.arr_filter.time
                                };

                                //save local
                                angular.extend(scope.arr_filter, arr_filter);
                                //localStorage.setItem("adxFilter", JSON.stringify(scope.arr_filter));
                                Storage.write('filter', scope.arr_filter);

                                //reload render chart
                                ctrl[1].renderChart(angular.extend(arr_filter, {filter_top: true}));
                            }


                            scope.filterTop();
                        }, true
                    );
                },
                controller: function ($scope, $element, $attrs) {
                    this.reloadTime = function (params) {
                        $scope.reloadTime(params);
                    };
                },
                templateUrl: '/js/modules/operation/templates/filterTop.html?v=' + ST_VERSION
            }
        }]);
});