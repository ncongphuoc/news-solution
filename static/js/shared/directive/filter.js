/**
 * Created by truchq on 4/25/2016.
 */
define(['app', 'shared/directive/select-multi',
    'modules/operation/services/lineitemType',
    'modules/operation/services/lineitem',
    'modules/operation/services/search',
    'modules/operation/services/campaign',
    'modules/operation/services/label',
    'modules/operation/services/creative',
    'modules/operation/services/target',
    'modules/operation/services/metric',
    'modules/operation/services/filter',
    "shared/directive/datepicker",
    "modules/operation/services/remarketing",
], function (app) {
    app.directive('filter', function (debounce, $q, Metric, appConfig, Filter, $stateParams, Modal, LineItemType,
                                      LineItemInfo, Search, Label, $location, $state, CreativeInfo, Target, $rootScope,
                                      RemarketingInfo) {
        return {
            restrict: 'E',
            scope: {
                filter_params: '=filterParams',
                action: '&action',
                filter_options: '=filterOptions'
            },
            require: ["filter", "^operations"],
            link: function (scope, element, attrs, controllers) {
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

                var checkUrlParam = function () {
                    var param_url = $location.search();
                    if (param_url.f != undefined && param_url.f > 1) {

                        var interval = setInterval(function () {
                            if (typeof scope.calFilter !== 'undefined') {
                                clearInterval(interval);
                                scope.calFilter({key: param_url.f});
                            }
                        }, 300);
                    }
                    if (param_url.f != undefined && param_url.f == 1 && param_url.filter != undefined) {
                        var output_filter = [],
                            metric_list = JSON.parse(scope.metric),
                            filter_param = [];
                        scope.list_filter = [];

                        angular.forEach(JSON.parse(param_url.filter), function (filter) {
                            var metric_code = Object.keys(filter)[0],
                                operator = Object.keys(filter[metric_code])[0],
                                filter_value = filter[metric_code][operator],
                                metric = {},
                                operator_name = '';

                            angular.forEach(metric_list.metric, function (metric_info, metric_id) {
                                var met_code = metric_info.code;
                                if (angular.lowercase(met_code) == angular.lowercase(metric_code)) {

                                    metric_info.metric_id = metric_id;
                                    metric = metric_info;

                                    angular.forEach(metric.operator, function (operator_info) {
                                        if (operator_info.value == operator) {
                                            operator_name = operator_info.name;
                                        }
                                    });
                                }
                            })

                            scope.list_filter.push(
                                {
                                    metric_name: metric.value,
                                    metric_key: metric.metric_id,
                                    metric_code: metric.code,
                                    operator_name: operator_name,
                                    operator_value: operator,
                                    operator: metric.operator,
                                    filter_value: filter_value,
                                    data_type: metric.data_type,
                                    config_select: getConfigSelect(metric.code, {metric_id: metric.metric_id})
                                }
                            );

                        });

                        scope.show_filter_box = true;
                        // Broadcast event to add/remove class custom-height on box account, lineitem info, campaign info
                        $rootScope.$broadcast('filter-popup-change-state', {toggle: true})

                    }
                };


                scope.show_filter_box = false;
                controllers[1].registerFilter(controllers[0]);

                scope.filter_options_default = {
                    params_get_metric: {
                        columns: 'METRIC_ID,METRIC_NAME,METRIC_LEVEL,OPERATOR,PARENT_ID,METRIC_CODE,DATA_TYPE, LEVEL_POSITION'
                    },
                    params_get_filter: {
                        columns: 'FILTER_ID,FILTER_NAME,RULES'
                    }
                };

                angular.merge(scope.filter_options || {}, scope.filter_options_default);

                //hide filter box
                scope.hideBoxFilter = function () {
                    scope.show_filter_box = false;
                    scope.init();
                    scope.filter_params.result = {};
                    scope.filter_params.key = '';

                    //reload chart
                    controllers[1].renderChart({filter: ''});
                    controllers[1].renderGrid({
                        filter: '',
                        page: 1,
                        message_no_data: 'match all of the filters',
                        fc: 'Filter'
                    });
                    scope.action();
                    //reset link
                    if (Object.keys($location.search()).length > 0) {
                        var params_link = $location.search();
                        params_link = null;
                        $location.search({})
                    }

                    // Broadcast event to add/remove class custom-height on box account, lineitem info, campaign info
                    $rootScope.$broadcast('filter-popup-change-state', {toggle: false})
                };
                //metric default
                scope.list_filter = [];
                scope.metric = {};

                scope.addFilterOperator = function () {
                    scope.list_filter.push(
                        {
                            metric_name: scope.dataSource.default.value,
                            metric_key: scope.dataSource.default.key,
                            metric_code: scope.dataSource.default.code,
                            operator_name: scope.dataSource.default.operator[0].name,
                            operator_value: scope.dataSource.default.operator[0].value,
                            operator: scope.dataSource.default.operator,
                            filter_value: '',
                            data_type: scope.dataSource.default.data_type,
                            config_select: getConfigSelect(scope.dataSource.default.code, {metric_id: scope.dataSource.default.key})
                        }
                    );
                };

                //
                scope.metric_select_multi = ['LABEL_NAME', 'CREATIVE_ID', 'CAMPAIGN_ID', 'LINEITEM_ID',
                    'LINEITEM_TYPE_NAME', 'FORMAT', 'SCHEDULE', 'DATE_RANGE_COMP',
                    'CT_OBJECT_NAME', 'APPROVAL_STATUS', 'SECTION_ID', 'AGE_NAME', 'TOPIC_ID', 'GENDER_NAME',
                    'AUDIENCE_ID', 'DATE_RANGE', 'STATUS', 'RM_TYPE'];
                scope.metric_choose_multi = ['LINEITEM_ID'];
                //
                var getConfigSelect = function (metric_code, option) {
                    var config_select = {};
                    switch (metric_code) {
                        case 'LINEITEM_TYPE_NAME':
                            config_select = {
                                object: LineItemType,
                                function: 'getList',
                                params: {},
                                object_id: 'lineitem_type_id',
                                object_name: 'lineitem_type_name',
                                is_search: 1,
                                type: 1 //1: all ,2 : limit
                            };
                            break;
                        case 'LINEITEM_ID':
                            config_select = {
                                object: Search,
                                function: 'getList',
                                params: {
                                    object: 'lineitems',
                                    limit: 20
                                },
                                object_id: 'lineitem_id',
                                object_name: 'lineitem_name',
                                is_search: 1,
                                type: 2
                            };
                            break;
                        case 'CAMPAIGN_ID':
                            config_select = {
                                object: Search,
                                function: 'getList',
                                params: {
                                    object: 'campaigns',
                                    limit: 20
                                },
                                object_id: 'campaign_id',
                                object_name: 'campaign_name',
                                is_search: 1,
                                type: 2
                            };
                            break;
                        case 'CREATIVE_ID':
                            config_select = {
                                object: Search,
                                function: 'getList',
                                params: {
                                    object: 'creatives',
                                    limit: 20
                                },
                                object_id: 'creative_id',
                                object_name: 'creative_name',
                                is_search: 1,
                                type: 2
                            };
                            break;
                        case 'LABEL_NAME':
                            config_select = {
                                object: Label,
                                function: 'getList',
                                params: {
                                    filter: 1
                                },
                                object_id: 'label_id',
                                object_name: 'label_name',
                                is_search: 1,
                                type: 5
                            };
                            break;
                        case 'CT_OBJECT_NAME':
                            config_select = {
                                object: CreativeInfo,
                                function: 'getList',
                                params: {
                                    'creative-component': 'CREATIVE_OBJECT'
                                },
                                object_id: 'ct_object_id',
                                object_name: 'ct_object_name',
                                is_search: 0,
                                type: 1
                            };
                            break;
                        case 'APPROVAL_STATUS':
                            config_select = {
                                object: CreativeInfo,
                                function: 'getList',
                                params: {
                                    'creative-component': 'STATUS'
                                },
                                object_id: 'status',
                                object_name: 'status_name',
                                is_search: 0,
                                type: 1,
                                option: 'status_creative'
                            };
                            break;
                        case 'SECTION_ID':
                            config_select = {
                                object: Search,
                                function: 'getList',
                                params: {
                                    object: 'sections',
                                    limit: 20,
                                    all: true
                                },
                                object_id: 'section_id',
                                object_name: 'section_name',
                                is_search: 1,
                                type: 2
                            };
                            break;
                        case 'TOPIC_ID':
                            config_select = {
                                object: Search,
                                function: 'getList',
                                params: {
                                    object: 'topics',
                                    limit: 20,
                                    all: true
                                },
                                object_id: 'topic_id',
                                object_name: 'topic_name_en',
                                is_search: 1,
                                type: 2
                            };
                            break;
                        case 'AGE_NAME':
                            config_select = {
                                object: Search,
                                function: 'getList',
                                params: {
                                    object: 'ages',
                                    limit: 20,
                                    all: true
                                },
                                object_id: 'age_id',
                                object_name: 'age_name',
                                is_search: 0,
                                type: 1
                            };
                            break;
                        case 'GENDER_NAME':
                            config_select = {
                                object: Target,
                                function: 'get',
                                params: {
                                    target: appConfig.TARGET_GENDER
                                },
                                object_id: 'gender_id',
                                object_name: 'gender_name',
                                is_search: 0,
                                type: 1
                            };
                            break;
                        case 'AUDIENCE_ID':
                            config_select = {
                                object_id: 'audience_id',
                                type: 3
                            };
                            break;
                        case 'DATE_RANGE':
                            config_select = {
                                object: Filter,
                                function: 'getList',
                                params: {
                                    type: appConfig.TYPE_METRIC_REPORT_FILTER_LISTING,
                                    metric_id: option.metric_id
                                },
                                object_id: 'object_id',
                                object_name: 'object_name',
                                is_search: 0,
                                type: 1
                            };
                            break;
                        case 'SCHEDULE':
                            config_select = {
                                object: Filter,
                                function: 'getList',
                                params: {
                                    type: appConfig.TYPE_METRIC_REPORT_FILTER_LISTING,
                                    metric_id: option.metric_id
                                },
                                object_id: 'object_id',
                                object_name: 'object_name',
                                is_search: 0,
                                type: 1
                            };
                            break;
                        case 'FORMAT':
                            config_select = {
                                object: Filter,
                                function: 'getList',
                                params: {
                                    type: appConfig.TYPE_METRIC_REPORT_FILTER_LISTING,
                                    metric_id: option.metric_id
                                },
                                object_id: 'object_id',
                                object_name: 'object_name',
                                is_search: 0,
                                type: 1
                            };
                            break;
                        case 'DATE_RANGE_COMP':
                            config_select = {
                                object: Filter,
                                function: 'getList',
                                params: {
                                    type: appConfig.TYPE_METRIC_REPORT_FILTER_LISTING,
                                    metric_id: option.metric_id
                                },
                                object_id: 'object_id',
                                object_name: 'object_name',
                                is_search: 0,
                                type: 1
                            };
                            break;
                        case 'STATUS':
                            config_select = {
                                data_exits: [
                                    {
                                        object_id: 1,
                                        object_name: 'Open'
                                    },
                                    {
                                        object_id: 2,
                                        object_name: 'Closed'
                                    },
                                    {
                                        object_id: 0,
                                        object_name: 'Removed'
                                    }
                                ],
                                object_id: 'object_id',
                                object_name: 'object_name',
                                is_search: 0,
                                type: 1
                            };
                            break;
                        case 'RM_TYPE':
                            config_select = {
                                object: RemarketingInfo,
                                function: 'getList',
                                params: {
                                    type: 'get-remarketing-type'
                                },
                                object_id: 'object_name',
                                object_name: 'object_name',
                                is_search: 0,
                                type: 1
                            };
                            break;


                    }
                    return config_select;
                };
                //select metric
                scope.changeFilter = function (index, metric) {
                    scope.list_filter[index] = {};
                    scope.list_filter[index].config_select = getConfigSelect(metric.code, {metric_id: metric.key});
                    scope.list_filter[index].metric_name = metric.value;
                    scope.list_filter[index].metric_key = metric.key;
                    scope.list_filter[index].metric_code = metric.code;
                    scope.list_filter[index].operator = metric.operator;

                    scope.list_filter[index].operator_name = metric.operator[0].name;
                    scope.list_filter[index].operator_value = metric.operator[0].value;
                    scope.list_filter[index].data_type = metric.data_type;
                    scope.list_filter[index].filter_value = '';

                    //allow save
                    scope.filter_params.disable_save_filter = false;
                    scope.str_save_filter = 'Save filter';
                };
                //select operator
                scope.changeOperator = function (index, operator) {
                    scope.list_filter[index].operator_name = operator.name;
                    scope.list_filter[index].operator_value = operator.value;

                    //allow save
                    scope.filter_params.disable_save_filter = false;
                    scope.str_save_filter = 'Save filter';
                };
                scope.valueChange = function () {
                    //allow save
                    scope.filter_params.disable_save_filter = false;
                    scope.str_save_filter = 'Save filter';
                };

                scope.removeRowFilter = function (index) {
                    scope.list_filter.splice(index, 1);
                };

                scope.applyFilter = function () {
                    //reset params filter
                    var output_filter = [],
                        error = false;
                    angular.forEach(scope.list_filter, function (value) {
                        var filter = {};
                        var operator = {};
                        operator[value.operator_value] = value.filter_value;
                        filter[value.metric_code] = operator;
                        output_filter.push(filter);
                        //check gia tri la % || 3:%
                        if (+value.data_type == 3 && +value.filter_value > 100) {
                            value.error = 'Value is too large';
                            error = true;
                        } else {
                            if (value.filter_value == '') {
                                value.error = 'Value filter empty';
                                error = true;
                            } else {
                                value.error = '';
                            }

                        }
                    });
                    if (error)
                        return false;


                    //return result
                    scope.filter_params.result = output_filter;

                    //reload chart
                    controllers[1].renderChart({filter: output_filter});
                    controllers[1].renderGrid({
                        filter: output_filter,
                        page: 1,
                        message_no_data: 'match all of the filters',
                        fc: 'Filter'
                    });

                    updateUrl({filter: JSON.stringify(output_filter), f: 1, page: 1});
                    //
                    if (scope.filter_params.save_filter == true) {
                        var check_update = false,
                            filter_update_id = '';
                        angular.forEach(scope.list_filter_saved, function (value) {
                            if (value.value === scope.filter_params.filter_name) {
                                check_update = true;
                                filter_update_id = value.key;
                            }
                        });


                        if (check_update == true) {
                            Modal.showModal({
                                actionText: 'OK',
                                closeText: 'Close',
                                headerText: 'Message',
                                bodyText: 'The filter "' + scope.filter_params.filter_name + '" already exists.Would you like to write over it ?',
                                onAction: function () {
                                    Filter.update({
                                        id: filter_update_id,
                                        filter_name: scope.filter_params.filter_name,
                                        rules: scope.list_filter
                                    }, function (response) {
                                        //
                                        if (response.code == 200 && response.data == 1) {
                                            scope.filter_params.disable_save_filter = true;
                                            scope.filter_params.save_filter = false;
                                            scope.str_save_filter = 'Saved';
                                            scope.action();
                                            getListFilter();
                                        } else {
                                            Modal.showModal({
                                                closeText: 'Close',
                                                headerText: 'Message',
                                                bodyText: 'Error,Please again !'
                                            })
                                        }
                                        controllers[1].reloadFilterDropDown();
                                    });
                                }
                            })
                        } else {
                            Filter.create({
                                type: scope.filter_options.params_get_filter.type,
                                filter_name: scope.filter_params.filter_name,
                                rules: scope.list_filter
                            }, function (response) {
                                //
                                if (response.code == 200 && response.data >= 1) {
                                    scope.filter_params.disable_save_filter = true;
                                    scope.filter_params.save_filter = false;
                                    scope.str_save_filter = 'Saved';
                                    scope.action();
                                    getListFilter();
                                } else {
                                    Modal.showModal({
                                        closeText: 'Close',
                                        headerText: 'Message',
                                        bodyText: 'Error,Please again !'
                                    })
                                }
                                controllers[1].reloadFilterDropDown();
                            });

                        }
                        // Broadcast event to add/remove class custom-height on box account, lineitem info, campaign info
                        $rootScope.$broadcast('filter-popup-change-state', {toggle: false})
                    } else {
                        scope.action();
                    }
                };
                var getListFilter = function () {
                    //Get list Filter
                    Filter.getList(scope.filter_options.params_get_filter, function (resp) {
                        scope.list_filter_saved = resp.data;
                    });
                };
                scope.init = function () {
                    scope.filter_params.disable_save_filter = false;
                    scope.filter_params.save_filter = false;
                    scope.filter_params.filter_name = '';
                    scope.str_save_filter = 'Save filter';
                    scope.title_filter_box = '';
                    Metric.getList(scope.filter_options.params_get_metric, function (resp) {
                        if (resp.data == undefined || resp.data == '' || (resp.data.length != undefined && resp.data.length < 0 )) {
                            Modal.showModal({
                                closeText: 'Close',
                                headerText: 'Message',
                                bodyText: 'Metric for filter empty !'
                            });
                            return;
                        }
                        scope.metric = resp.data;
                        scope.dataSource = JSON.parse(scope.metric);


                        //cal label
                        var params_url = $location.search();
                        if (params_url.label != undefined) {
                            var params_cal_label = {
                                metric_code: 'label_name',
                                operator: 'contains_any',
                                value: params_url.label
                            };
                            if (scope.calFilter == undefined) {
                                var interval = setInterval(function () {

                                    if (scope.calFilter !== undefined) {
                                        scope.calFilter(params_cal_label);
                                        var filter = [{
                                            label_name: {
                                                'contains_any': params_url.label
                                            }
                                        }];
                                        controllers[1].renderGrid({
                                            filter: filter,
                                            fc: 'Filter param label in link'
                                        });
                                        clearInterval(interval);
                                    }
                                }, 300);
                            } else {
                                scope.calFilter(params_cal_label);
                                var filter = [{
                                    label_name: {
                                        'contains_any': params_url.label
                                    }
                                }];
                                controllers[1].renderGrid({filter: filter, fc: 'Filter param label in link'});
                            }
                        } else {
                            scope.list_filter = [
                                {
                                    metric_name: scope.dataSource.default.value,
                                    metric_key: scope.dataSource.default.key,
                                    metric_code: scope.dataSource.default.code,
                                    operator_name: scope.dataSource.default.operator[0].name,
                                    operator_value: scope.dataSource.default.operator[0].value,
                                    operator: scope.dataSource.default.operator,
                                    filter_value: '',
                                    data_type: scope.dataSource.default.data_type,
                                    config_select: getConfigSelect(scope.dataSource.default.code, {metric_id: scope.dataSource.default.key})
                                }
                            ];
                            checkUrlParam();
                        }
                    });
                    //Get list Filter to validate overwrite filter
                    Filter.getList(scope.filter_options.params_get_filter, function (resp) {
                        scope.list_filter_saved = resp.data;
                    });
                };
                scope.init();
                scope.buildListFilter = function () {
                    if (scope.filter_params.key !== '' && scope.filter_params.key != undefined) {
                        if (scope.filter_params.key > 2) {
                            //
                            scope.show_content_filter = false;
                            //sub 2 value first : is edit
                            //edit
                            Filter.get({
                                id: scope.filter_params.key,
                                columns: scope.filter_options.params_get_filter.columns
                            }, function (resp) {
                                var output_filter = [];
                                //build edit box filter
                                angular.forEach(resp.data, function (filter_info) {
                                    scope.title_filter_box = filter_info.value;
                                    scope.list_filter = [];
                                    angular.forEach(JSON.parse(filter_info.rules), function (rules) {
                                        var filter = {},
                                            metric_list = JSON.parse(scope.metric),
                                            metric = metric_list.metric[rules.metric_id],
                                            operator_name = '';

                                        angular.forEach(metric.operator, function (operator) {
                                            if (operator.value == rules.operator) {
                                                operator_name = operator.name;
                                            }
                                        });

                                        scope.list_filter.push(
                                            {
                                                metric_name: metric.value,
                                                metric_key: rules.metric_id,
                                                metric_code: metric.code,
                                                operator_name: operator_name,
                                                operator_value: rules.operator,
                                                operator: metric.operator,
                                                filter_value: rules.value,
                                                data_type: metric_list.metric[rules.metric_id].data_type,
                                                config_select: getConfigSelect(metric.code, {metric_id: rules.metric_id})
                                            }
                                        );
                                        //buil reload
                                        var operator = {};
                                        operator[rules.operator] = rules.value;
                                        filter[metric.code] = operator;
                                        output_filter.push(filter);
                                    });
                                });
                                scope.filter_params.result = output_filter;
                                scope.filter_params.key = '';

                                //reload chart
                                controllers[1].renderChart({filter: output_filter});
                                controllers[1].renderGrid({
                                    filter: output_filter,
                                    page: 1,
                                    message_no_data: 'match all of the filters',
                                    fc: 'Filter'
                                });

                                scope.action();
                            });
                        } else {
                            scope.show_content_filter = true;
                            scope.init();
                        }
                        scope.show_filter_box = true;
                    }
                };
                scope.$watch(
                    "filter_params.reset",
                    function handleParamChange(newValue, oldValue) {
                        if (newValue != oldValue) {
                            scope.init();
                        }
                    }, true
                );

                scope.calFilter = function (params) {
                    if (params.key !== '' && params.key != undefined) {
                        if (params.key > 2) {
                            //
                            scope.show_content_filter = false;
                            //sub 2 value first : is edit
                            //edit
                            Filter.get({
                                id: params.key,
                                columns: scope.filter_options.params_get_filter.columns
                            }, function (resp) {

                                var output_filter = [];
                                //build edit box filter
                                angular.forEach(resp.data, function (filter_info) {
                                    if (filter_info.data_audience != undefined) {
                                        scope.data_audience = filter_info.data_audience;
                                    }

                                    scope.title_filter_box = filter_info.value;
                                    scope.list_filter = [];
                                    angular.forEach(JSON.parse(filter_info.rules), function (rules) {
                                        var filter = {},
                                            metric_list = JSON.parse(scope.metric),
                                            metric = metric_list.metric[rules.metric_id],
                                            operator_name = '';

                                        angular.forEach(metric.operator, function (operator) {
                                            if (operator.value == rules.operator) {
                                                operator_name = operator.name;
                                            }
                                        });

                                        scope.list_filter.push(
                                            {
                                                metric_name: metric.value,
                                                metric_key: rules.metric_id,
                                                metric_code: metric.code,
                                                operator_name: operator_name,
                                                operator_value: rules.operator,
                                                operator: metric.operator,
                                                filter_value: rules.value,
                                                data_type: metric_list.metric[rules.metric_id].data_type,
                                                config_select: getConfigSelect(metric.code, {metric_id: rules.metric_id})
                                            }
                                        );
                                        //buil reload
                                        var operator = {};
                                        operator[rules.operator] = rules.value;
                                        filter[metric.code] = operator;
                                        output_filter.push(filter);
                                    });
                                });
                                /*scope.filter_params.result = output_filter;
                                 scope.filter_params.key = '';*/

                                //reload chart
                                controllers[1].renderChart({filter: output_filter});
                                controllers[1].renderGrid({
                                    filter: output_filter,
                                    page: 1,
                                    message_no_data: 'match all of the filters',
                                    fc: 'Filter'
                                });

                                scope.action();
                                // Broadcast event to add/remove class custom-height on box account, lineitem info, campaign info
                                $rootScope.$broadcast('filter-popup-change-state', {toggle: true})
                            });
                        } else {
                            scope.show_content_filter = true;
                            scope.init();
                        }
                        scope.show_filter_box = true;
                    } else {
                        var params_metric_code = params.metric_code,
                            params_filter_value = params.value,
                            params_filter_operator = params.operator,
                            metric_list;

                        function getAsync() {
                            var timer = setInterval(function () {
                                if (Object.keys(scope.metric).length > 0) {
                                    scope.list_filter = [];
                                    metric_list = JSON.parse(scope.metric);
                                    angular.forEach(metric_list.metric, function (metric, metric_id) {
                                        var met_code = metric.code;
                                        if (angular.lowercase(met_code) == params_metric_code) {
                                            //get operator
                                            var operator_name = operator_value = '';
                                            angular.forEach(metric.operator, function (operator) {
                                                var op_value = operator.value;
                                                if (angular.lowercase(op_value) == params_filter_operator) {
                                                    operator_name = operator.name;
                                                    operator_value = operator.value;
                                                }
                                            });
                                            scope.list_filter.push(
                                                {
                                                    metric_name: metric.value,
                                                    metric_key: metric_id,
                                                    metric_code: metric.code,
                                                    operator_name: operator_name,
                                                    operator_value: operator_value,
                                                    operator: metric.operator,
                                                    filter_value: params_filter_value,
                                                    data_type: metric_list.metric[metric_id].data_type,
                                                    config_select: getConfigSelect(metric.code, {metric_id: metric_id})
                                                }
                                            );

                                        }
                                    });
                                    scope.$apply();
                                    clearInterval(timer);
                                }

                            }, 100);
                        }

                        getAsync();
                        scope.filter_params.disable_save_filter = false;
                        scope.filter_params.save_filter = false;
                        scope.filter_params.filter_name = '';
                        scope.str_save_filter = 'Save filter';
                        scope.show_filter_box = true;
                        // Broadcast event to add/remove class custom-height on box account, lineitem info, campaign info
                        $rootScope.$broadcast('filter-popup-change-state', {toggle: true})
                    }

                };


            },
            controller: function ($scope, $element, $attrs) {
                this.renderFilter = function (params) {
                    $scope.calFilter(params);
                };
            },
            templateUrl: '/js/shared/templates/filter/filter.html?v=' + ST_VERSION
        };
    });
});