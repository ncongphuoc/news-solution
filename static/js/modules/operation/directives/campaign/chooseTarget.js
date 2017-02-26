/**
 * Created by truchq on 6/01/2016.
 */
define(['app', 'modules/operation/services/target', 'modules/operation/directives/campaign/demographic'], function (app) {
    app.directive('chooseTarget', function (Target, appConfig, $stateParams) {
            return {
                restrict: 'EC',
                replace: true,
                scope: {
                    model_value: '=ngModel',
                    is_open: '=isOpen',
                    data_source: '=source',
                    init_load: '=isLoad',
                    remove: '&remove',
                    id: '=id',
                    show_remove: '=showRemove',
                    close: '&close',
                    show_close: '=showClose',
                    edit: '=',
                    in_drop_down: '=?inDropDown',
                    options: '=?'

                },
                require: ["chooseTarget", "^operations"],
                controller: ['$scope', '$element', '$filter', '$timeout', function ($scope, $element, $filter, $timeout) {
                    //

                    $scope.target_interest = appConfig.TARGET_INTEREST;
                    $scope.target_inmarket = appConfig.TARGET_INMARKET;
                    $scope.target_remarketing = appConfig.TARGET_REMARKETING;
                    $scope.target_topic = appConfig.TARGET_TOPIC;
                    $scope.target_section = appConfig.TARGET_WEBSITE;

                    $scope.page = 1;
                    $scope.limit = 15;

                    //config_data to array
                    $scope.config_data_array = [];
                    angular.forEach($scope.data_source.config_data, function (config_data_info) {
                        $scope.config_data_array.push({
                            key: config_data_info.key,
                            value: config_data_info.value,
                            columns: config_data_info.columns,
                            data: config_data_info.data
                        });
                    });

                    $scope.selectAffinity = function (affinity_current) {
                        angular.element($element).find('.large.loading').css('display', 'block');
                        $scope.page = 1;
                        $scope.affinity_current = affinity_current;

                        var params = {
                            target: $scope.affinity_current,
                            columns: $scope.data_source.config_data[$scope.affinity_current].columns,
                            limit: $scope.limit,
                            page: $scope.page,
                            must: JSON.stringify({parent_id: {equals: 0}}),
                            sort: $scope.data_source.config_data[$scope.affinity_current].sort,
                            az: $scope.data_source.config_data[$scope.affinity_current].az
                        }
                        if ($stateParams.lineitemId != undefined && $stateParams.lineitemId != '') {
                            params.lineitem_id = $stateParams.lineitemId;
                        }
                        if ($stateParams.campaign_id != undefined && $stateParams.campaign_id != '') {
                            params.campaign_id = $stateParams.campaign_id;
                        }
                        if ($scope.options != undefined && $scope.options.campaign_id != undefined && $scope.options.campaign_id != '') {
                            params.campaign_id = $scope.options.campaign_id;
                        }
                        //support filter
                        if($scope.data_source.config_data[$scope.affinity_current].filter != undefined && $scope.data_source.config_data[$scope.affinity_current].filter != ''){
                            params.filter = 1;
                        }
                        Target.get(params, function (resp) {
                            //build un_check
                            var data = rebuild_data_target_left(resp);
                            $scope.target_left = [];

                            if ($scope.data_source.config_data[$scope.affinity_current].target_db != undefined &&
                                $scope.data_source.config_data[$scope.affinity_current].target_db.length > 0
                            ) {
                                $scope.first_load = true;
                                $scope.data_source.config_data[$scope.affinity_current].data = $scope.data_source.config_data[$scope.affinity_current].target_db;

                                build_output();
                            }


                            //object to array
                            angular.forEach(data.data.rows, function (rows, index_resp_data_rows) {
                                if ($scope.data_source.config_data[$scope.affinity_current].target_db != undefined &&
                                    $scope.data_source.config_data[$scope.affinity_current].target_db.length > 0
                                ) {
                                    var find_data = $filter('filter')($scope.data_source.config_data[$scope.affinity_current].data, {object_id: rows.object_id});
                                    if (find_data.length) {
                                        rows.checked = true;
                                    }
                                }
                                $scope.target_left.push(rows);
                            });


                            $scope.target_left_total = data.data.total;
                            $scope.page = 2;
                            angular.element($element).find('.large.loading').css('display', 'none');
                        });
                        $scope.prepare_data = {
                            target: $scope.affinity_current,
                            columns: $scope.data_source.config_data[$scope.affinity_current].columns,
                            limit: 0,
                            sort: $scope.data_source.config_data[$scope.affinity_current].sort,
                            az: $scope.data_source.config_data[$scope.affinity_current].az
                        }

                    };

                    //select template affinity
                    $scope.getTargetTemplate = function () {

                        var template = 'two_columns.html';
                        if ($scope.affinity_current == $scope.target_remarketing || $scope.affinity_current == $scope.target_section) {
                            template = 'three_columns.html';
                        }
                        return template;
                    };
                    //select template affinity
                    $scope.getDropDownTemplate = function () {

                        var template = 'uib_drop_down.html';
                        if ($scope.in_drop_down == true) {
                            template = 'drop_down_select.html';
                        }
                        return template;
                    };


                    //init
                    $scope.init = function () {
                        angular.element($element).find('.large_init.loading').css('display', 'block');
                        $scope.page = 1;
                        //get first
                        var object_first_key = Object.keys($scope.data_source.config_data)[0];
                        //get default target
                        if (object_first_key == 4 && Object.keys($scope.data_source.config_data).length > 2) {
                            object_first_key = $scope.target_interest;
                        }
                        var object_first = $scope.data_source.config_data[object_first_key];
                        $scope.affinity_current = object_first_key;
                        var target_db = [];
                        var data_db = '';
                        var params = {
                            target: $scope.affinity_current,
                            columns: $scope.data_source.config_data[$scope.affinity_current].columns,
                            limit: $scope.limit,
                            page: $scope.page,
                            must: JSON.stringify({parent_id: {equals: 0}}),
                            sort: $scope.data_source.config_data[$scope.affinity_current].sort,
                            az: $scope.data_source.config_data[$scope.affinity_current].az,
                        }
                        if ($stateParams.lineitemId != undefined && $stateParams.lineitemId != '') {
                            params.lineitem_id = $stateParams.lineitemId;
                        }
                        if ($stateParams.campaign_id != undefined && $stateParams.campaign_id != '') {
                            params.campaign_id = $stateParams.campaign_id;
                        }
                        if ($scope.options != undefined && $scope.options.campaign_id != undefined && $scope.options.campaign_id != '') {
                            params.campaign_id = $scope.options.campaign_id;
                        }
                        //support filter
                        if($scope.data_source.config_data[$scope.affinity_current].filter != undefined && $scope.data_source.config_data[$scope.affinity_current].filter != ''){
                            params.filter = 1;
                        }
                        Target.get(params, function (resp) {
                            $scope.target_left = [];
                            //object to array

                            if ($scope.edit) {
                                angular.forEach($scope.data_source.config_data, function (target_config) {
                                    if (target_config.target_db != undefined && target_config.target_db.length > 0) {
                                        target_config.data = target_config.target_db;
                                    }
                                });
                                $scope.first_load = true;
                                build_output();
                            }


                            angular.forEach(resp.data.rows, function (rows, index_resp_data_rows) {
                                if ($scope.data_source.config_data[$scope.affinity_current].target_db != undefined &&
                                    $scope.data_source.config_data[$scope.affinity_current].target_db.length > 0
                                ) {
                                    var find_data = $filter('filter')($scope.data_source.config_data[$scope.affinity_current].data, {object_id: rows.object_id});
                                    if (find_data.length) {
                                        rows.checked = true;
                                    }
                                }
                                $scope.target_left.push(rows);
                            });
                            $scope.target_left_total = resp.data.total;
                            $scope.page = 2;
                            angular.element($element).find('.large_init.loading').css('display', 'none');
                        });
                        //reset data cua config
                        if (target_db.length == 0) {
                            angular.forEach($scope.data_source.config_data, function (config_data, index_config_data) {
                                $scope.data_source.config_data[index_config_data].data = [];
                            });
                        }
                        //check show multy config
                        $scope.count_data_source = Object.keys($scope.data_source.config_data).length;

                        $scope.prepare_data = {
                            target: $scope.affinity_current,
                            columns: $scope.data_source.config_data[$scope.affinity_current].columns,
                            limit: 0,
                            sort: $scope.data_source.config_data[$scope.affinity_current].sort,
                            az: $scope.data_source.config_data[$scope.affinity_current].az
                        }


                    };

                    $scope.onSelectObject = function (object) {
                        object.checked = true;
                        //remove property remove in case da remove
                        if (object.removed != undefined) {
                            delete object.removed;
                        }
                        var find_data = $filter('filter')($scope.data_source.config_data[$scope.affinity_current].data, {object_id: object.object_id});
                        if (find_data.length == 0) {
                            $scope.data_source.config_data[$scope.affinity_current].data.push(object);

                            //kiem tra neu co child thi add vao data luon
                            checkedChild(object);

                            //xu ly cho check cha neu chon het con
                            if (object.parent_id != 0) {
                                checkedParrent(object);
                            }
                        }
                    };

                    var getParent = function (object) {
                        var get_target_left = [];
                        if (object.full_parent != undefined) {
                            var arr_full_parent = object.full_parent.toLocaleString().split(',');
                            if (arr_full_parent.length <= 3) {
                                get_target_left = $scope.target_left;
                            } else {
                                var j = 1;
                                for (var i = 0; i < arr_full_parent.length; i++) {
                                    if (i > 0 && i < arr_full_parent.length - 1) {
                                        if (j == 1) { // dau tien duoc lay

                                            var find_first = $filter('filter')($scope.target_left, {object_id: arr_full_parent[i]});
                                            if (find_first.length > 0) {
                                                get_target_left = find_first[0].child_list;
                                            }
                                            j++;
                                        } else {
                                            var find_last = $filter('filter')(get_target_left, {object_id: arr_full_parent[i]});
                                            if (find_last.length == 0) {
                                                get_target_left = find_last[0].child_list;
                                            }
                                            j++;
                                        }
                                    }
                                }
                            }
                        }
                        return get_target_left;
                    };

                    var checkedParrent = function (object) {
                        var count_checked = 0;
                        get_target_left = getParent(object);
                        find_object_target_left = $filter('filter')(get_target_left, {object_id: object.parent_id});
                        if (find_object_target_left.length) {
                            var index = get_target_left.indexOf(find_object_target_left[0]);
                            if (find_object_target_left[0].checked == undefined || find_object_target_left[0].checked == false) {
                                angular.element($element).find('.large.loading').css('display', 'block');
                                var params = {
                                    target: $scope.affinity_current,
                                    columns: $scope.data_source.config_data[$scope.affinity_current].columns,
                                    limit: 0,
                                    must: JSON.stringify({parent_id: {equals: find_object_target_left[0].object_id}}),
                                    sort: $scope.data_source.config_data[$scope.affinity_current].sort,
                                    az: $scope.data_source.config_data[$scope.affinity_current].az
                                }
                                if ($stateParams.lineitemId != undefined && $stateParams.lineitemId != '') {
                                    params.lineitem_id = $stateParams.lineitemId;
                                }
                                if ($stateParams.campaign_id != undefined && $stateParams.campaign_id != '') {
                                    params.campaign_id = $stateParams.campaign_id;
                                }
                                if ($scope.options != undefined && $scope.options.campaign_id != undefined && $scope.options.campaign_id != '') {
                                    params.campaign_id = $scope.options.campaign_id;
                                }
                                //support filter
                                if($scope.data_source.config_data[$scope.affinity_current].filter != undefined && $scope.data_source.config_data[$scope.affinity_current].filter != ''){
                                    params.filter = 1;
                                }
                                Target.get(params, function (resp) {
                                    //search child added
                                    angular.forEach(resp.data.rows, function (object_info, index_object_info) {
                                        find_object = $filter('filter')($scope.data_source.config_data[$scope.affinity_current].data, {object_id: object_info.object_id});
                                        if (find_object.length > 0) {
                                            count_checked++;
                                        }
                                    });
                                    if (count_checked >= resp.data.total) {
                                        get_target_left[index].checked = true;
                                        $scope.data_source.config_data[$scope.affinity_current].data.push(get_target_left[index]);

                                        if (get_target_left[index].parent_id != 0) {
                                            checkedParrent(get_target_left[index]);
                                        }
                                        build_output();
                                    }
                                    angular.element($element).find('.large.loading').css('display', 'none');
                                });


                            }
                        }
                    };
                    var checkedChild = function (object) {

                        /*if (object.child_list != undefined && object.child_list.length > 0) {
                         angular.forEach(object.child_list, function (object_info, object_id) {
                         var find_date_child = $filter('filter')($scope.data_source.config_data[$scope.affinity_current].data, {object_id: object_info.object_id});
                         if (find_date_child.length == 0) {
                         object_info.checked = true;
                         object_info.parent_name = object.object_name;
                         //remove property removed in case da remove
                         if(object_info.removed != undefined){
                         delete object_info.removed;
                         }
                         $scope.data_source.config_data[$scope.affinity_current].data.push(object_info);
                         if (object_info.child) {
                         checkedChild(object_info);
                         }
                         }
                         });
                         build_output();
                         } else {*/
                        //neu co child thi get va add vao data
                        if (object.child) {
                            angular.element($element).find('.large.loading').css('display', 'block');
                            var params = {
                                target: $scope.affinity_current,
                                columns: $scope.data_source.config_data[$scope.affinity_current].columns,
                                limit: 0,
                                must: JSON.stringify({parent_id: {equals: object.object_id}}),
                                sort: $scope.data_source.config_data[$scope.affinity_current].sort,
                                az: $scope.data_source.config_data[$scope.affinity_current].az
                            };
                            if ($stateParams.lineitemId != undefined && $stateParams.lineitemId != '') {
                                params.lineitem_id = $stateParams.lineitemId;
                            }

                            if ($stateParams.campaign_id != undefined && $stateParams.campaign_id != '') {
                                params.campaign_id = $stateParams.campaign_id;
                            }
                            if ($scope.options != undefined && $scope.options.campaign_id != undefined && $scope.options.campaign_id != '') {
                                params.campaign_id = $scope.options.campaign_id;
                            }
                            //support filter
                            if($scope.data_source.config_data[$scope.affinity_current].filter != undefined && $scope.data_source.config_data[$scope.affinity_current].filter != ''){
                                params.filter = 1;
                            }
                            Target.get(params, function (resp) {
                                //object.child_list = [];
                                angular.forEach(resp.data.rows, function (rows, index_resp_target) {
                                    var find_data = $filter('filter')($scope.data_source.config_data[$scope.affinity_current].data, {object_id: rows.object_id});
                                    rows.checked = true;
                                    if (find_data.length == 0) {

                                        rows.parent_name = object.object_name;
                                        //remove property removed in case da remove
                                        if (rows.removed != undefined) {
                                            delete rows.removed;
                                        }
                                        $scope.data_source.config_data[$scope.affinity_current].data.push(rows);
                                        if (rows.child) {
                                            checkedChild(rows);
                                        }
                                    }

                                    if (object.child_list == undefined) {
                                        object.child_list = [];
                                    }
                                    var find_data_left = $filter('filter')(object.child_list, {object_id: rows.object_id});
                                    if (find_data_left.length == 0) {
                                        object.child_list.push(rows);
                                    } else {
                                        find_data_left[0].checked = true;
                                    }


                                });
                                var index = $scope.data_source.config_data[$scope.affinity_current].data.indexOf(object);
                                $scope.data_source.config_data[$scope.affinity_current].data[index].child_list = object.child_list;
                                angular.element($element).find('.large.loading').css('display', 'none');
                                build_output();

                            });
                        } else {
                            build_output();
                        }
                        //}
                    };


                    $scope.removeObject = function (object, target) {
                        object.checked = false;
                        if (target == $scope.affinity_current) {
                            if (object.parent_id != 0) {
                                unCheckSelf(object);
                            } else {
                                //un check self
                                var find_self = $filter('filter')($scope.target_left, {object_id: object.object_id});
                                if (find_self.length) {
                                    find_self[0].checked = false;
                                }
                            }
                            if (object.child_list != undefined && object.child_list.length) {
                                unCheckChild(object);
                            }
                        }
                        //remove data cuoi
                        removeData(object, target);

                        //remove
                        for (var i = $scope.data_source.config_data[target].data.length - 1; i >= 0; i--) {
                            if ($scope.data_source.config_data[target].data[i].removed == true) {
                                $scope.data_source.config_data[target].data.splice(i, 1);
                            }
                        }
                        //neu co cha thi remove cha
                        if (object.parent_id != 0) {
                            var find_date_parent = $filter('filter')($scope.data_source.config_data[target].data, {object_id: object.parent_id});
                            if (find_date_parent.length) {
                                index = $scope.data_source.config_data[target].data.indexOf(find_date_parent[0]);
                                //remove
                                $scope.data_source.config_data[target].data.splice(index, 1);
                            }
                            //uncheck target left
                            find_object = $filter('filter')($scope.target_left, {object_id: object.parent_id});
                            if (find_object.length) {
                                find_object[0].checked = false;
                            }
                        }
                        build_output();
                    };

                    var unCheckSelf = function (object) {
                        //
                        get_target_left = getParent(object);
                        var find_parent_object = $filter('filter')(get_target_left, {object_id: object.parent_id});
                        if (find_parent_object.length) {

                            //un check parent
                            find_parent_object[0].checked = false;

                            if (find_parent_object[0].child_list != undefined) {
                                var find_child_object = $filter('filter')(find_parent_object[0].child_list, {object_id: object.object_id});
                                if (find_child_object.length) {
                                    find_child_object[0].checked = false;
                                }
                            }
                        }
                    };
                    var unCheckChild = function (object) {
                        if (object.child_list != undefined && object.child_list.length) {
                            angular.forEach(object.child_list, function (target_info, index_target) {
                                target_info.checked = false;
                                if (target_info.child_list != undefined && target_info.child_list.length) {
                                    unCheckChild(target_info);
                                }
                            });
                        }
                    };

                    var removeData = function (object, target) {
                        var index_parent = $scope.data_source.config_data[target].data.indexOf(object);
                        //remove
                        //$scope.data_source.config_data[target].data.splice(index_parent, 1);

                        $scope.data_source.config_data[target].data[index_parent].removed = true;


                        if ($scope.data_source.config_data[target].data[index_parent].child_list != undefined && $scope.data_source.config_data[target].data[index_parent].child_list.length != undefined && $scope.data_source.config_data[target].data[index_parent].child_list.length > 0) {
                            angular.forEach($scope.data_source.config_data[target].data[index_parent].child_list, function (target_info, index_target) {
                                var find_object = $filter('filter')($scope.data_source.config_data[target].data, {object_id: target_info.object_id});
                                if (find_object.length) {
                                    find_object[0].removed = true;
                                    if (find_object[0].child_list != undefined && find_object[0].child_list.length > 0) {
                                        removeData(find_object[0], target);
                                    }
                                }
                            });
                        }
                    }

                    //call total selected
                    $scope.total_affinity_output = 0;
                    var build_output = function () {
                            $scope.total_affinity_output = 0;
                            var list_affinity_key_output = [];
                            angular.forEach($scope.data_source.config_data, function (info_target, index_target) {
                                $scope.total_affinity_output += info_target.data.length;
                                list_affinity_key_output[index_target] = [];
                                angular.forEach(info_target.data, function (target, index) {
                                    list_affinity_key_output[index_target].push(+target.object_id);
                                });
                            });
                            if ($scope.first_load == true) {
                                $scope.first_load = false;
                                $scope.model_value = angular.extend($scope.model_value, $scope.model_value);
                            } else {
                                $scope.model_value = {};
                            }

                            $scope.model_value.target = list_affinity_key_output;
                            $scope.model_value.total_selected = $scope.total_affinity_output;
                            if ($scope.use_dynamic_remarketing != undefined) {
                                $scope.model_value.use_dynamic_remarketing = $scope.use_dynamic_remarketing;
                            }
                            $scope.model_value.target_info = $scope.data_source.config_data;
                        },
                        rebuild_data_target_left = function (data) {
                            //build un_check
                            angular.forEach(data.data.rows, function (resp_target, index_resp_target) {
                                angular.forEach($scope.data_source.config_data[$scope.affinity_current].data, function (data_target, index_data_target) {
                                    if (index_resp_target == data_target.object_id) {
                                        data.data.rows[index_resp_target].checked = true;
                                    }
                                });
                                //build sub un_check
                                if (resp_target.child_list) {
                                    angular.forEach(resp_target.child_list, function (child_resp_target, index_child_resp_target) {
                                        var find_child_object = $filter('filter')($scope.data_source.config_data[$scope.affinity_current].data, {object_id: child_resp_target.object_id});
                                        if (find_child_object.length) {
                                            child_resp_target.checked = true;
                                        }
                                    })
                                }
                            });
                            return data;
                        };


                    $scope.removeSelf = function (id) {
                        $scope.remove({id: id});
                        //reset data cua config
                        angular.forEach($scope.data_source.config_data, function (config_data, index_config_data) {
                            $scope.data_source.config_data[index_config_data].data = [];
                        });
                        //uncheck target left
                        angular.forEach($scope.target_left, function (target_left, index_target_left) {
                            target_left.checked = false;
                        });
                        $scope.total_affinity_output = 0;
                    };
                    $scope.closeTarget = function (id) {
                        $scope.close({id: id});
                    };

                    $scope.changeUserDynamicRemarketing = function () {
                        build_output();
                    };

                    $scope.loadMoreRecords = function () {
                        if ($scope.page <= Math.ceil($scope.target_left_total / $scope.limit)) {
                            angular.element($element).find('.large.loading').css('display', 'block');
                            //angular.element('#' + el).fadeIn();

                            var params = {
                                target: $scope.affinity_current,
                                columns: $scope.data_source.config_data[$scope.affinity_current].columns,
                                limit: $scope.limit,
                                page: $scope.page,
                                must: JSON.stringify({parent_id: {equals: 0}}),
                                sort: $scope.data_source.config_data[$scope.affinity_current].sort,
                                az: $scope.data_source.config_data[$scope.affinity_current].az
                            }
                            if ($stateParams.lineitemId != undefined && $stateParams.lineitemId != '') {
                                params.lineitem_id = $stateParams.lineitemId;
                            }
                            if ($stateParams.campaign_id != undefined && $stateParams.campaign_id != '') {
                                params.campaign_id = $stateParams.campaign_id;
                            }
                            if ($scope.options != undefined && $scope.options.campaign_id != undefined && $scope.options.campaign_id != '') {
                                params.campaign_id = $scope.options.campaign_id;
                            }
                            //support filter
                            if($scope.data_source.config_data[$scope.affinity_current].filter != undefined && $scope.data_source.config_data[$scope.affinity_current].filter != ''){
                                params.filter = 1;
                            }
                            Target.get(params, function (resp) {
                                //build un_check
                                var data = rebuild_data_target_left(resp);
                                //object to array
                                angular.forEach(data.data.rows, function (rows, index_resp_data_rows) {
                                    $scope.target_left.push(rows);
                                });
                                $scope.target_left_total = data.data.total;
                                $scope.page++;
                                //angular.element('#' + el).fadeOut();
                                angular.element($element).find('.large.loading').css('display', 'none');
                            });
                        }
                    };

                    $scope.jqueryScrollbarOptions = {
                        "onScroll": function (y, x) {
                            if (y.maxScroll != 0) {
                                if (y.scroll == y.maxScroll) {
                                    $scope.loadMoreRecords();
                                }
                            }
                        }
                    }

                    var search_server_text_timeout;
                    $scope.$watch(
                        "search",
                        function valueChange() {

                            if (search_server_text_timeout) $timeout.cancel(search_server_text_timeout);
                            search_server_text_timeout = $timeout(function () {
                                if ($scope.search != undefined) {
                                    angular.element($element).find('.large.loading').css('display', 'block');
                                    var params_search = {
                                        target: $scope.affinity_current,
                                        columns: $scope.data_source.config_data[$scope.affinity_current].columns,
                                        limit: $scope.limit,
                                        search: $scope.search,
                                        full_parent: true,
                                        sort: $scope.data_source.config_data[$scope.affinity_current].sort,
                                        az: $scope.data_source.config_data[$scope.affinity_current].az
                                    };
                                    if ($scope.search == '') {
                                        params_search.must = JSON.stringify({parent_id: {equals: 0}});
                                        params_search.limit = $scope.limit;
                                        params_search.page = 1;
                                    }

                                    if ($stateParams.lineitemId != undefined && $stateParams.lineitemId != '') {
                                        params_search.lineitem_id = $stateParams.lineitemId;
                                    }

                                    if ($stateParams.campaign_id != undefined && $stateParams.campaign_id != '') {
                                        params_search.campaign_id = $stateParams.campaign_id;
                                    }
                                    if ($scope.options != undefined && $scope.options.campaign_id != undefined && $scope.options.campaign_id != '') {
                                        params_search.campaign_id = $scope.options.campaign_id;
                                    }
                                    //support filter
                                    if($scope.data_source.config_data[$scope.affinity_current].filter != undefined && $scope.data_source.config_data[$scope.affinity_current].filter != ''){
                                        params_search.filter = 1;
                                    }
                                    Target.get(params_search, function (resp) {
                                        $scope.target_left = [];
                                        var data = rebuild_data_target_left(resp);
                                        //object to array
                                        angular.forEach(data.data.rows, function (rows, index_resp_data_rows) {
                                            if ($scope.search != '' && rows.child != undefined) {
                                                rows.showed = true;
                                            } else {
                                                rows.showed = false;
                                            }
                                            var find_data = $filter('filter')($scope.data_source.config_data[$scope.affinity_current].data, {object_id: rows.object_id});
                                            if (find_data.length) {
                                                rows.checked = true;
                                            }
                                            $scope.target_left.push(rows);
                                        });
                                        $scope.target_left_total = data.data.total;
                                        angular.element($element).find('.large.loading').css('display', 'none');
                                    });
                                }
                            }, 550); // delay 250 ms
                        }
                    );

                    if ($scope.init_load == true) {
                        $scope.init();
                    }

                    $scope.$watch(
                        'is_open',
                        function valueChange(new_value, old_value) {
                            if (old_value == false && new_value == true) {
                                $scope.init();
                            }
                        }
                    );

                    $scope.$watch(
                        'data_source',
                        function valueChange(new_value, old_value) {
                            if (old_value != new_value) {
                                if (new_value == '') {
                                    return;
                                }
                                $scope.init();
                                build_output();
                            }
                        }
                    );

                }],
                link: function (scope, element, attrs, ctrl) {

                    //call detail demographic
                    scope.demographic = function (target_info) {

                        ctrl[1].renderDemoGraphic(target_info);
                    };
                },
                templateUrl: '/js/modules/operation/templates/campaign/chooseTarget.html?v=' + ST_VERSION
            }
        })
        .directive('ulTarget', function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    targets: '=',
                    onSelectObject: '&',
                    config: '=',
                    data: '='
                },
                link: function (scope, element, attrs) {
                    scope.handlingSelectObject = function (ob) {
                        scope.onSelectObject({target: ob});
                    }
                },
                template: "<ul class=\"list-collapse\">" +
                "<target ng-repeat=\"target in targets\" target='target' config='config' " +
                "data='data' on-select-object='handlingSelectObject(target)' ></target></ul>"
            };
        })
        .directive('target', function ($compile, $rootScope, AUTH_EVENTS, Auth, Target, $state, appConfig, $filter, $stateParams) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    target: '=',
                    onSelectObject: '&',
                    config: '=',
                    data: '='
                },
                templateUrl: 'li.html',
                require: ["target", "^operations"],
                link: function (scope, element, attrs, ctrl) {
                    if (angular.isArray(scope.target.child_list)) {
                        var content = $compile("<ul-target targets='target.child_list' config='config' data='data' on-select-object='onSelectObject({target:target})'></ul-target>")(scope);
                        element.append(content);
                    }

                    scope.getListChild = function (object, $event) {
                        if (object.child_list == undefined) {
                            angular.element($event.target).parents('.target-parent').find('.loading').fadeIn();
                            var params = {
                                target: scope.config.target,
                                columns: scope.config.columns,
                                limit: scope.config.limit,
                                must: JSON.stringify({parent_id: {equals: object.object_id}}),
                                sort: scope.config.sort,
                                az: scope.config.az
                            };
                            if ($stateParams.lineitemId != undefined && $stateParams.lineitemId != '') {
                                params.lineitem_id = $stateParams.lineitemId;
                            }
                            if ($stateParams.campaign_id != undefined && $stateParams.campaign_id != '') {
                                params.campaign_id = $stateParams.campaign_id;
                            }
                            if (scope.options != undefined && scope.options.campaign_id != undefined && scope.options.campaign_id != '') {
                                params.campaign_id = $scope.options.campaign_id;
                            }
                            //support filter
                            if(scope.config.filter != undefined && scope.config.filter != ''){
                                params.filter = 1;
                            }
                            Target.get(params, function (resp) {
                                object.child_list = [];
                                //is checked in data fn
                                angular.forEach(resp.data.rows, function (resp_target, index_resp_target) {
                                    resp_target.parent_name = object.object_name;

                                    angular.forEach(scope.data[scope.config.target].data, function (data_target, index_data_target) {
                                        if (resp_target.object_id == data_target.object_id) {
                                            resp_target.checked = true;
                                        }
                                    });
                                    object.child_list.push(resp_target);
                                });
                                //show collapse
                                object.showed = !object.showed;

                                scope.children = resp.data.rows;
                                var content = $compile("<ul-target targets='children' config='config' data='data' on-select-object='onSelectObject({target:target})'></ul-target>")(scope);
                                element.append(content);

                                angular.element($event.target).parents('.target-parent').find('.loading').fadeOut();
                            });
                        } else {
                            object.showed = !object.showed;

                            angular.forEach(scope.target.child_list, function (child_list, index_child_list) {
                                var find_child_object = $filter('filter')(scope.data[scope.config.target].data, {object_id: child_list.object_id});
                                if (find_child_object.length) {
                                    child_list.checked = true;
                                }
                            });
                            //closest : get parent first
                            if (angular.element($event.target).closest('li').find('ul').length == 0) {
                                var content = $compile("<ul-target targets='target.child_list' config='config' data='data' on-select-object='onSelectObject({target:target})'></ul-target>")(scope);
                                element.append(content);
                            }


                        }
                    }
                    scope.handlingSelectObject = function (ob) {

                        /*scope.re_data_child = ob.child_list;
                         console.log('ob',ob);
                         console.log('element',element);
                         //closest : get parent first
                         if(element.find('ul').length > 0){
                         var content = $compile("<ul-target targets='re_data_child' config='config' data='data' on-select-object='onSelectObject({target:target})'></ul-target>")(scope);
                         element.append(content);
                         }*/

                        scope.onSelectObject({target: ob});
                    }
                    //call detail demographic
                    scope.demographic = function (target_info) {
                        ctrl[1].renderDemoGraphic(target_info);
                    };

                },
                controller: function ($scope, $element, $attrs) {

                }
            };
        });
});