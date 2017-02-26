/**
 * Created by truchq on 5/25/16.
 */
define(['app', 'libs/icheck/icheck', 'modules/operation/services/label',
    'modules/operation/directives/campaign/chooseTarget'], function (app) {
    app.directive('selectMulti', function (appConfig, Label, $rootScope, APP_EVENTS) {
        return {
            restrict: 'E',
            scope: {
                config: '=config',
                ng_model: '=ngModel',
                action: '&onClick',
                option: '=?',
                ng_model_object: '=?ngModelObject',
                new_tag: '=?newTag',
                get_label: '=?getLabel',
                text_drop_down: "=?textDropDown",
                edit: '=?'
            },
            link: function (scope, element, attrs) {
            },
            controller: ['$scope', '$filter', '$timeout', '$element', function ($scope, $filter, $timeout, $element) {
                var _promise;
                //drop_down label
                if ($scope.get_label != undefined && $scope.get_label) {
                    $scope.config_label = {
                        object: Label,
                        function: 'getList',
                        params: {
                            filter: 1,
                            limit: 10
                        },
                        object_id: 'label_id',
                        object_name: 'label_name',
                        is_search: 1,
                        type: 4
                    };
                    $scope.filter_label = '';
                }
                var getChild = function (list_target, list_target_out, parent_name) {
                    angular.forEach(list_target, function (target, index_target) {
                        if (parent_name != '') {
                            target.parent_name = parent_name;
                        }
                        list_target_out.push(target);
                        if (target.child_list != undefined && target.child_list.length) {
                            getChild(target.child_list, list_target_out, target.object_name);
                        }
                    });
                    return list_target_out;
                };
                $scope.group_target = {
                    interest_and_remarketing: 18
                };
                $scope.target_interest = appConfig.TARGET_INTEREST;
                $scope.target_inmarket = appConfig.TARGET_INMARKET;
                $scope.target_remarketing = appConfig.TARGET_REMARKETING;
                $scope.choose_target = {
                    key: $scope.group_target.interest_and_remarketing,
                    ng_model: {
                        target_info: {}
                    },
                    config: {
                        key: $scope.group_target.interest_and_remarketing,
                        value: 'Interests & remarketing (affinity audiences) – show ads to people based on their interests.',
                        config: {
                            heading: 'Interests & remarketing',
                            config_data: {
                                [$scope.target_interest]: {
                                    key: $scope.target_interest,
                                    value: 'Affinity audiences',
                                    columns: 'interest_id,interest_name_vn',
                                    private_key: 'interest_id',
                                    data: [],
                                    sort: 'interest_name_vn',
                                    az: 'asc',
                                    filter: 1
                                },
                                [$scope.target_inmarket]: {
                                    key: $scope.target_inmarket,
                                    value: 'In-market audiences',
                                    columns: 'inmarket_id,inmarket_name',
                                    private_key: 'inmarket_id',
                                    data: [],
                                    sort: 'inmarket_name',
                                    az: 'asc',
                                    filter: 1
                                },
                                [$scope.target_remarketing]: {
                                    key: $scope.target_remarketing,
                                    value: 'Remarketing lists',
                                    columns: 'remarketing_id,remarketing_name',
                                    private_key: 'remarketing_id',
                                    data: [],
                                    forecast_title: 'List size',
                                    forecast_id: 'uck',
                                    sort: 'remarketing_name',
                                    az: 'asc',
                                    filter: 1
                                }
                            },
                            data: ''
                        }
                    },
                    closed: false
                };

                var init = function () {
                    $scope.data_total = 0;
                    $scope.data_source = [];
                    $scope.data_source_selected = [];
                    var ng_model_edit = [];
                    $scope.ng_model_old = '';
                    if ($scope.ng_model != '') {
                        $scope.ng_model_old = angular.copy($scope.ng_model);

                        if ($scope.config.object_id == "audience_id") {
                            angular.forEach($scope.choose_target.config.config.config_data, function (target_config, index_target_config) {
                                var type_audience;
                                switch (+index_target_config) {
                                    case appConfig.TARGET_INTEREST:
                                        type_audience = appConfig.OBJ_LINK_TARGET_INTEREST;
                                        break;
                                    case appConfig.TARGET_INMARKET:
                                        type_audience = appConfig.OBJ_LINK_TARGET_INMARKET;
                                        break;
                                    case appConfig.TARGET_REMARKETING:
                                        type_audience = appConfig.OBJ_LINK_TARGET_REMARKETING;
                                        break;
                                }
                                angular.forEach($scope.option, function (target_db, index_target_db) {
                                    if (+index_target_db == type_audience) {
                                        var rebuild_target = getChild(target_db, [], '');
                                        target_config.target_db = rebuild_target;
                                        $scope.choose_target.ng_model.target_info[index_target_config] = {};
                                        $scope.choose_target.ng_model.target_info[index_target_config].data = rebuild_target;
                                    }
                                });
                            });
                        } else {
                            ng_model_edit = $scope.ng_model.split(',');
                        }
                    }
                    $scope.list_selected = [];
                    //get data
                    if ($scope.config.type != 3) { //khong phai audience
                        if ($scope.config.data_exits == undefined) {
                            angular.element($element).find('.loading').css('display', 'block');
                            $scope.config.params.page = 1;
                            $scope.config.object[$scope.config.function]($scope.config.params, function (resp) {
                                //rebuild status creative
                                if (($scope.config.option != undefined) && $scope.config.option == 'status_creative') {
                                    var rebuild_data = [];
                                    angular.forEach(resp.data, function (object) {
                                        var find_status_name = $filter('filter')(rebuild_data, {
                                                status_name: object.status_name
                                            }
                                        );
                                        if (find_status_name.length == 0) {
                                            rebuild_data.push(object);
                                        } else {
                                            find_status_name[0].status = find_status_name[0].status + ',' + object.status
                                        }
                                    })
                                    resp.data = rebuild_data;
                                }
                                //
                                var data_resp = '';
                                if (resp.data.rows != undefined) {
                                    data_resp = resp.data.rows;
                                } else {
                                    data_resp = resp.data;
                                }
                                //
                                if (resp.data.total != undefined) {
                                    $scope.data_total = resp.data.total;
                                }
                                //

                                angular.forEach(data_resp, function (object) {
                                    //case edit
                                    if ($scope.ng_model_object != undefined) {
                                        var object_filter = {}
                                        object_filter[$scope.config.object_id] = object[$scope.config.object_id];
                                        var find_data = $filter('filter')($scope.ng_model_object, object_filter);
                                        if (find_data.length) {
                                            object.checked = true;
                                        }
                                    } else {
                                        if (ng_model_edit.indexOf((object[$scope.config.object_id]).toString()) != -1) {
                                            object.checked = true;
                                            $scope.list_selected.push(object[$scope.config.object_id]);
                                            $scope.data_source_selected.push(object)
                                        }
                                    }
                                    $scope.data_source.push(object);
                                });
                                if ($scope.ng_model_object != undefined) {
                                    angular.forEach($scope.ng_model_object, function (object) {
                                        $scope.list_selected.push(object[$scope.config.object_id]);
                                        $scope.data_source_selected.push(object)
                                    })
                                }


                                //

                                //


                                //
                                if (resp.data.total != undefined) {
                                    $scope.data_total = resp.data.total;
                                }
                                $scope.ng_model = $scope.list_selected.join(',');
                                //
                                angular.element($element).find('.loading').css('display', 'none');
                            });
                        } else {
                            angular.forEach($scope.config.data_exits, function (object) {
                                //case edit
                                if (ng_model_edit.indexOf(object[$scope.config.object_id]) != -1) {
                                    object.checked = true;
                                    $scope.list_selected.push(object[$scope.config.object_id]);
                                    $scope.data_source_selected.push(object)
                                }
                                $scope.data_source.push(object);
                            });
                        }

                    }
                };
                var page = 2;
                $scope.loadMoreRecords = function () {
                    angular.element($element).find('.loading').css('display', 'block');
                    $scope.config.params.page = page;
                    $scope.config.object[$scope.config.function]($scope.config.params, function (resp) {

                        //rebuild status creative
                        if (($scope.config.option != undefined) && $scope.config.option == 'status_creative') {
                            var rebuild_data = [];
                            angular.forEach(resp.data, function (object) {
                                var find_status_name = $filter('filter')(rebuild_data, {
                                        status_name: object.status_name
                                    }
                                );
                                if (find_status_name.length == 0) {
                                    rebuild_data.push(object);
                                } else {
                                    find_status_name[0].status = find_status_name[0].status + ',' + object.status
                                }
                            })
                            resp.data = rebuild_data;
                        }
                        var data_resp = '';
                        if (resp.data.rows != undefined) {
                            data_resp = resp.data.rows;
                        } else {
                            data_resp = resp.data;
                        }
                        //
                        if (resp.data.total != undefined) {
                            $scope.data_total = resp.data.total;
                        }
                        //

                        angular.forEach(data_resp, function (object) {
                            //case edit
                            var object_filter = {}
                            object_filter[$scope.config.object_id] = object[$scope.config.object_id];
                            var find_data = $filter('filter')($scope.data_source_selected, object_filter);
                            if (find_data.length) {
                                object.checked = true;
                            }
                            $scope.data_source.push(object);
                        });
                        page++;
                        angular.element($element).find('.loading').css('display', 'none');
                    });

                };
                //select template affinity
                $scope.getTemplate = function () {
                    var template = 'type_two.html';
                    if ($scope.config.type == 1) {
                        template = 'type_one.html';
                    }
                    if ($scope.config.type == 3) {
                        template = 'type_three.html';
                    }
                    if ($scope.config.type == 4) {
                        template = 'type_four.html';
                    }
                    if ($scope.config.type == 5) {
                        template = 'type_five.html';
                    }
                    return template;
                };
                //type 1
                $scope.change = function (object) {
                    buildOutputTypeOne();
                };

                var buildOutputTypeOne = function () {
                    $scope.list_selected = [];
                    angular.forEach($scope.data_source, function (object_info, index_object_info) {
                        if (object_info.checked == true) {
                            $scope.list_selected.push(object_info[$scope.config.object_id]);
                        }
                    });
                    $scope.ng_model = $scope.list_selected.join(',');
                };
                //end type 1
                //type 2
                $scope.list_selected = [];
                $scope.data_source_selected = [];

                $scope.select = function (object) {
                    object.checked = true;
                    $scope.data_source_selected.push(object);
                    buildOutputTypeTwo();
                };
                $scope.remove = function (object, event) {
                    event.stopPropagation();
                    //delete from data_source_selected
                    var index_selected = $scope.data_source_selected.indexOf(object);
                    $scope.data_source_selected.splice(index_selected, 1);
                    //delete from data_source
                    var find_object_data_source = $filter('filter')($scope.data_source, {
                            [$scope.config.object_id]: object[$scope.config.object_id]
                        }
                    );
                    if (find_object_data_source.length) {
                        find_object_data_source[0].checked = false;
                    }
                    buildOutputTypeTwo();
                };
                var buildCheckedLeft = function () {
                    angular.forEach($scope.data_source_selected, function (data_source_selected, index_data_source_selected) {
                        var find_object_data_source = $filter('filter')($scope.data_source, {
                                [$scope.config.object_id]: data_source_selected[$scope.config.object_id]
                            }
                        );
                        if (find_object_data_source.length) {
                            find_object_data_source[0].checked = true;
                        }
                    });
                };
                var buildOutputTypeTwo = function () {
                    $scope.list_selected = [];
                    $scope.ng_model_object = [];
                    angular.forEach($scope.data_source_selected, function (data_source_selected, index_data_source_selected) {
                        if ($scope.config.object_id == "audience_id") {
                            $scope.list_selected.push({
                                audience_id: data_source_selected[$scope.config.object_id],
                                audience_type: data_source_selected[$scope.config.type]
                            });
                        } else {

                            $scope.list_selected.push(data_source_selected[$scope.config.object_id]);
                        }

                    });

                    if ($scope.config.object_id == "audience_id") {
                        $scope.ng_model = $scope.list_selected;
                    } else {
                        $scope.ng_model = $scope.list_selected.join(',');
                    }
                    $scope.ng_model_object = $scope.data_source_selected;

                };
                var search_server_text_timeout;
                $scope.$watch(
                    "search_server",
                    function valueChange() {
                        if ($scope.search_server != undefined && $scope.config.type != 3) {
                            angular.element($element).find('.loading').css('display', 'block');

                            if ($scope.search_server == '') {
                                //get data
                                if (_promise) {
                                    _promise.$cancelRequest();
                                }
                                $scope.config.params.page = 1;
                                _promise = $scope.config.object[$scope.config.function]($scope.config.params);
                                _promise.$promise.then(function (resp) {
                                    $scope.data_source = [];
                                    if (resp.data.length == undefined) {
                                        var data_resp = '';
                                        if (resp.data.rows != undefined) {
                                            data_resp = resp.data.rows;
                                        } else {
                                            data_resp = resp.data;
                                        }
                                        //
                                        if (resp.data.total != undefined) {
                                            $scope.data_total = resp.data.total;
                                        }
                                        //not array
                                        angular.forEach(data_resp, function (object) {
                                            $scope.data_source.push(object);
                                        });
                                    } else {
                                        // is array
                                        $scope.data_source = resp.data;
                                    }
                                    buildCheckedLeft();
                                    angular.element($element).find('.loading').css('display', 'none');
                                })
                            } else {
                                if (_promise) {
                                    _promise.$cancelRequest();
                                }

                                var params_search = angular.copy($scope.config.params);
                                params_search.search = $scope.search_server;
                                params_search.page = 1;
                                _promise = $scope.config.object[$scope.config.function](params_search);
                                _promise.$promise.then(function (resp) {
                                    $scope.data_source = [];
                                    if (resp.data.length == undefined) {
                                        var data_resp = '';
                                        if (resp.data.rows != undefined) {
                                            data_resp = resp.data.rows;
                                        } else {
                                            data_resp = resp.data;
                                        }
                                        //
                                        if (resp.data.total != undefined) {
                                            $scope.data_total = resp.data.total;
                                        }
                                        //not array
                                        angular.forEach(data_resp, function (object) {
                                            $scope.data_source.push(object);
                                        });
                                    } else {
                                        // is array
                                        $scope.data_source = resp.data;
                                    }
                                    angular.element($element).find('.loading').css('display', 'none');
                                    buildCheckedLeft();
                                })


                                /*if (search_server_text_timeout) $timeout.cancel(search_server_text_timeout);
                                 search_server_text_timeout = $timeout(function () {
                                 //get data

                                 var params_search = angular.copy($scope.config.params);
                                 params_search.search = $scope.search_server;
                                 params_search.page = 1;


                                 $scope.config.object[$scope.config.function](params_search, function (resp) {
                                 $scope.data_source = [];
                                 if (resp.data.length == undefined) {
                                 var data_resp = '';
                                 if(resp.data.rows != undefined){
                                 data_resp = resp.data.rows;
                                 }else{
                                 data_resp = resp.data;
                                 }
                                 //
                                 if(resp.data.total != undefined){
                                 $scope.data_total = resp.data.total;
                                 }
                                 //not array
                                 angular.forEach(data_resp, function (object) {
                                 $scope.data_source.push(object);
                                 });
                                 } else {
                                 // is array
                                 $scope.data_source = resp.data;
                                 }
                                 angular.element($element).find('.loading').css('display', 'none');
                                 buildCheckedLeft();
                                 });
                                 }, 250);*/ // delay 250 ms
                            }
                        }
                    }, true
                );
                //end type 2
                $scope.closeDropdown = function () {
                    $scope.is_open = false;
                    $scope.search_server = '';
                };
                init();
                /*$scope.$watch(
                 "config",
                 function handleParamChange(new_va,old_va) {
                 init();
                 }, true
                 );*/

                // Load more data when scroll to end
                $scope.jqueryScrollbarOptions = {
                    "onScroll": function (y, x) {
                        if (y.maxScroll != 0) {
                            if (y.scroll == y.maxScroll) {
                                $scope.loadMoreRecords();
                            }
                        }
                    }
                }
                //library audience select remarketing type of visitor specific tag
                $scope.is_undo_new_tag_remarketing = false;
                $scope.undoNewTagRemarketing = function () {
                    $scope.new_tag = false;
                    $scope.is_undo_new_tag_remarketing = false;
                }
                $scope.newTagRemarketing = function () {
                    $scope.new_tag = true;
                    $scope.is_undo_new_tag_remarketing = true;
                }
                //library audience popup select remarketing
                $scope.okPopupAction = function () {
                    $scope.$parent.options.ok();
                }
                $scope.closePopupAction = function () {
                    $scope.ng_model = $scope.ng_model_old;
                    $scope.$parent.options.close();
                }

                $scope.$watch(
                    "choose_target",
                    function handleParamChange() {
                        var rebuild_result = [];
                        $scope.total_affinity_output = 0;
                        angular.forEach($scope.choose_target.ng_model.target, function (object, object_id) {
                            switch (object_id) {
                                case appConfig.TARGET_INTEREST:
                                    if (object.length) {
                                        rebuild_result.push({
                                            type: appConfig.OBJ_LINK_TARGET_INTEREST,
                                            audience_id: object
                                        })
                                        $scope.total_affinity_output += object.length;
                                    }

                                    break;
                                case appConfig.TARGET_INMARKET:
                                    if (object.length) {
                                        rebuild_result.push({
                                            type: appConfig.OBJ_LINK_TARGET_INMARKET,
                                            audience_id: object
                                        })
                                        $scope.total_affinity_output += object.length;
                                    }

                                    break;
                                case appConfig.TARGET_REMARKETING:
                                    if (object.length) {
                                        rebuild_result.push({
                                            type: appConfig.OBJ_LINK_TARGET_REMARKETING,
                                            audience_id: object
                                        })
                                        $scope.total_affinity_output += object.length;
                                    }

                                    break;
                            }
                        });
                        $scope.ng_model = rebuild_result;
                    }, true
                );

                //Filter label

                $scope.closeDropDownLabel = function () {
                    if (!$scope.$$childTail.is_open) {
                        $rootScope.$broadcast(APP_EVENTS.shareLibraryRemarketingDropdownFilterLabel, {});
                    }
                }
                //
                //show error by add library audience specific tag
                $scope.$on(APP_EVENTS.shareLibraryRemarketingSubmitForm, function (params, args) {
                    $scope.error = true;
                })

                $scope.$on(APP_EVENTS.shareLibraryRemarketingDropdownFilterLabel, function (params, args) {
                    if ($scope.filter_label != undefined) {

                        angular.element($element).find('.loading').css('display', 'block');
                        var params_search = angular.copy($scope.config.params);
                        params_search.label_id = $scope.filter_label;
                        params_search.page = 1;


                        $scope.config.object[$scope.config.function](params_search, function (resp) {
                            $scope.data_source = [];
                            if (resp.data.length == undefined) {

                                //
                                if (resp.data.total != undefined) {
                                    $scope.data_total = resp.data.total;
                                }
                                //not array
                                angular.forEach(resp.data.rows, function (object) {
                                    $scope.data_source.push(object);
                                });
                            } else {
                                // is array
                                $scope.data_source = resp.data;
                            }
                            angular.element($element).find('.loading').css('display', 'none');
                            buildCheckedLeft();
                        });
                    }

                });

            }],
            //templateUrl: '/js/shared/templates/directive/select-multi.html',
            templateUrl: function (elem, attr) {
                var template_url = '';
                if (attr.urlTemplate != undefined && attr.urlTemplate != '') {
                    template_url = attr.urlTemplate;
                } else {
                    template_url = '/js/shared/templates/directive/select-multi.html?v=' + ST_VERSION
                }
                return template_url;
            }
        };
    });
});

//
