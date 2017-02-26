/**
 * Created by truchq on 4/25/2016.
 */
define(['app', 'libs/async/async', 'shared/directive/icheck',
        'shared/directive/common', 'shared/directive/reviewAd',
        'shared/directive/popupreview', 'shared/directive/plugin_grid/changeBid',
        'shared/directive/plugin_grid/linkGrid',
        'shared/directive/creativename',
        "shared/directive/plugin_grid/multiValue",
        "shared/directive/plugin_grid/gridSelect",
        "shared/directive/plugin_grid/gridSelectDateRange"],
    function (app, async) {
        app.directive('grid', function (debounce, Modal, appConfig, $stateParams, Storage) {
            return {
                restrict: 'E',
                scope: {
                    params: '=params',
                    grid_options: '=gridOptions',
                    action: '&onClick',
                    ng_model: '=?ngModel',
                    ng_model_object: '=?ngModelObject',
                    call: '=?'
                },
                require: ["grid", "^operations"],
                link: function (scope, element, attributes, controllers) {
                    controllers[1].registerGrid(controllers[0]);
                    scope.callStickyHeader = function () {
                        controllers[1].callStickyHeader();
                    }
                },
                controller: ["$scope", 'appConfig', '$sce', '$state', '$window', '$rootScope', 'AUTH_EVENTS',
                    '$timeout', '$filter', 'APP_EVENTS', '$element', '$location',
                    function ($scope, appConfig, $sce, $state, $window, $rootScope, AUTH_EVENTS, $timeout, $filter, APP_EVENTS, $element, $location) {
                        angular.extend($scope.ng_model | {}, $scope.ng_model);
                        angular.extend($scope.ng_model_object | {}, $scope.ng_model_object);
                        angular.element(document).find($scope.grid_options.loading).fadeIn();
                        angular.element($element).css('display', 'none');
                        switch ($state.current.name) {
                            case 'campaigns.campaign.detail.creative':
                                $scope.view_by = 10; // Campaign detail
                                break;
                            case 'campaigns.lineitem.detail.creative':
                                $scope.view_by = 5; // Line item
                                break;
                            default:
                                $scope.view_by = 0; // all
                        }

                        $scope.define_day_of_week = {
                            1: 'Sunday',
                            2: 'Monday',
                            3: 'Tuesday',
                            4: 'Wednesday',
                            5: 'Thursday',
                            6: 'Friday',
                            7: 'Saturday'
                        };
                        $scope.grid_options.pagination_page_sizes = [$scope.params.limit, 30, 50, 100, 200, 500];
                        $scope.data_source = {};
                        $scope.az_default = 'DESC';

                        var getParamFromUrl = function () {
                            if ($location.search().filter != undefined) {
                                $scope.params.filter = $location.search().filter;
                            }
                            if ($location.search().sort != undefined && $location.search().az != undefined) {
                                $scope.params.sort = $location.search().sort;
                                $scope.params.az = $location.search().az;
                            }
                            if ($location.search().page != undefined) {
                                $scope.params.page = $location.search().page;
                            }

                            if ($location.search().from_date != undefined) {
                                $scope.params.from_date = $location.search().from_date;
                            }
                            if ($location.search().to_date != undefined) {
                                $scope.params.to_date = $location.search().to_date;
                            }

                        }
                        var rebuildUrl = function(){
                            var param_url = {page : $scope.params.page};
                            if($scope.params.sort != undefined && $scope.params.az != undefined){
                                param_url.sort = $scope.params.sort;
                                param_url.az = $scope.params.az;
                            }
                            if($scope.params.from_date != undefined){
                                param_url.from_date = $scope.params.from_date;
                            }
                            if($scope.params.to_date != undefined){
                                param_url.to_date = $scope.params.to_date;
                            }
                            updateUrl(param_url);
                        }

                        $scope.list_field_compare = [];
                        $scope.getCompare = function (field_info) {
                            field_info.is_compare = !field_info.is_compare;
                            if ($scope.list_field_compare.indexOf(field_info.name) !== -1) {
                                $scope.list_field_compare.splice($scope.list_field_compare.indexOf(field_info.name), 1);
                            } else {
                                $scope.list_field_compare.push(field_info.name);
                            }
                            $scope.params.field_compare = $scope.list_field_compare.join(',');
                            getData('compare');
                        };
                        //
                        var getData = function (function_name) {
                            $scope.message_no_data = '';
                            if (!$scope.params.sort_cp) {
                                $scope.params.fc = function_name;
                                if (typeof $scope.grid_options.loading !== 'undefined' && $scope.grid_options.loading) {
                                    angular.element(document).find($scope.grid_options.loading).fadeIn();
                                    angular.element($element).css('display', 'block');
                                    angular.element($element).find('.wrap-table-footer').css('min-height', '145px');
                                }
                                arr_func = {};
                                arr_func.f1 = function (cb) {
                                    //
                                    if ($scope.params[$scope.grid_options.row_key] != undefined || $scope.params[$scope.grid_options.row_key] == '') {
                                        delete $scope.params[$scope.grid_options.row_key];
                                    }


                                    rebuildUrl();



                                    $scope.grid_options.object.getList($scope.params, function (resp) {
                                        if (resp.code == 500 || resp.data == undefined || resp.data.length == 0) {
                                            $scope.data_source.data = [];
                                        } else {
                                            if (resp.data.column_defs == undefined) {
                                                Modal.showModal({
                                                    closeText: 'Close',
                                                    headerText: 'Message',
                                                    bodyText: 'Lasted Modify Column Empty !'
                                                })
                                            } else {

                                                $scope.data_source.data = resp.data.rows;
                                                $scope.data_source.total = resp.data.total_records;
                                                $scope.data_source.total_column = resp.data.total_column;
                                                $scope.data_source.fields = resp.data.fields;
                                                //rebuild column_defs by some do not sort
                                                var metric_disable = [];
                                                switch ($scope.grid_options.type) {
                                                    case appConfig.TYPE_LINE_ITEM :
                                                    {
                                                        metric_disable = ['label_name'];
                                                        break;
                                                    }
                                                    case appConfig.TYPE_CAMPAIGN :
                                                    {
                                                        metric_disable = ['label_name'];
                                                        break;
                                                    }
                                                    case appConfig.TYPE_CREATIVE :
                                                    {
                                                        metric_disable = ['label_name'];
                                                        break;
                                                    }
                                                }
                                                //end rebuild column_defs by some do not sort
                                                // define label if label posision
                                                angular.forEach(resp.data.column_defs, function (metric_info, index) {
                                                    if (metric_disable.indexOf(metric_info.name) != -1) {
                                                        resp.data.column_defs[index].enableSorting = false;
                                                    }
                                                    var class_head = '';

                                                    if (metric_info.name.toLowerCase() == 'label_name') {

                                                        $scope.classlabel = 'show-all-lable';
                                                        if (index + 1 == resp.data.column_defs.length || index == resp.data.column_defs.length - 2) {
                                                            $scope.classlabel = 'show-all-lable show-all-lable-right';
                                                        }
                                                        if ($scope.grid_options.type != 0) {
                                                            class_head = 'label-color';
                                                        }
                                                    }

                                                    resp.data.column_defs[index].class_head = class_head;
                                                });

                                                $scope.data_source.column_defs = resp.data.column_defs;
                                                $scope.data_source.segment_current = resp.data.segment_current;
                                                if (typeof resp.data.segment_key != undefined) {
                                                    $scope.data_source.segment_key = resp.data.segment_key;
                                                }
                                                //show start end
                                                if ($scope.end > $scope.data_source.total) {
                                                    $scope.end = $scope.data_source.total;
                                                }
                                                checkedSelectAll();
                                                $rootScope.$broadcast(APP_EVENTS.resizeStickyHeader, {});

                                            }

                                        }
                                        //show message
                                        showMessageEmpty($scope.params);
                                        if ($scope.params.field_compare == undefined || $scope.params.field_compare == '') {
                                            if (typeof $scope.grid_options.loading !== 'undefined' && $scope.grid_options.loading) {
                                                angular.element(document).find($scope.grid_options.loading).fadeOut();
                                                angular.element($element).find('.wrap-table-footer').css('min-height', '');
                                            }
                                        }
                                        cb(null, $scope.data_source)
                                    });

                                };
                                async.series(arr_func, function (err, results) {
                                    if ($scope.params.field_compare != undefined && $scope.params.field_compare != '') {
                                        $scope.params_compare = angular.copy($scope.params);
                                        var arr_object_id = [];
                                        //get object_id
                                        angular.forEach(results.f1.data, function (object_info) {
                                            arr_object_id.push(object_info[$scope.grid_options.row_key]);
                                        });
                                        $scope.params_compare[$scope.grid_options.row_key] = arr_object_id.join(',');

                                        $scope.params_compare.fields = $scope.params.field_compare;
                                        $scope.params_compare.from_date = $scope.params.from_range;
                                        $scope.params_compare.to_date = $scope.params.to_range;

                                        if ($scope.params_compare.sort != undefined && $scope.params_compare.sort != '') {
                                            $scope.params_compare.sort = "";
                                        }
                                        $scope.grid_options.object.getList($scope.params_compare, function (resp) {
                                            if (resp.code == 500 || resp.data.length == 0) {
                                                $scope.data_source.data = [];
                                            } else {
                                                //build data compare
                                                angular.forEach($scope.data_source.data, function (object_info) {
                                                    var find_data = $filter('filter')(resp.data.rows, {[$scope.grid_options.row_key]: object_info[$scope.grid_options.row_key]});
                                                    if (find_data.length > 0) {
                                                        object_info.data_compare = {};
                                                        angular.forEach($scope.list_field_compare, function (field, index_field) {
                                                            object_info.data_compare[field] = find_data[0][field];
                                                        })
                                                        //segment compare
                                                        if (find_data[0]['segment']) {
                                                            object_info.data_compare.segment = find_data[0]['segment'];
                                                        }
                                                    }
                                                });
                                                //build head th
                                                angular.forEach($scope.data_source.column_defs, function (column_info) {
                                                    if ($scope.list_field_compare.indexOf(column_info.name) !== -1) {
                                                        column_info.is_compare = true;
                                                    }
                                                });

                                            }
                                            if (typeof $scope.grid_options.loading !== 'undefined' && $scope.grid_options.loading) {
                                                angular.element(document).find($scope.grid_options.loading).fadeOut();
                                            }
                                        });
                                        var callStickyHeader = debounce(function (param) {
                                            $scope.callStickyHeader();
                                        }, 2000, false);
                                        callStickyHeader();
                                    }
                                });
                                buildStartEnd();
                            } else {
                                getDataCompare('page');
                            }


                        };
                        var getDataCompare = function (function_name) {
                            $scope.params.fc = function_name;
                            if (typeof $scope.grid_options.loading !== 'undefined' && $scope.grid_options.loading) {
                                angular.element(document).find($scope.grid_options.loading).fadeIn();
                            }
                            arr_func = {};
                            arr_func.f1 = function (cb) {
                                var params_sort = angular.copy($scope.params);
                                params_sort.fields = $scope.params.field_compare;
                                params_sort.from_date = $scope.params.from_range;
                                params_sort.to_date = $scope.params.to_range;

                                if (params_sort[$scope.grid_options.row_key] != undefined) {
                                    delete params_sort[$scope.grid_options.row_key];
                                }

                                $scope.grid_options.object.getList(params_sort, function (resp) {
                                    if (resp.code == 500 || resp.data.length == 0) {
                                        $scope.data_source.data = [];
                                    } else {
                                        $scope.data_sort_compare = resp;
                                        cb(null, resp)
                                    }
                                });

                            };

                            async.series(arr_func, function (err, results) {
                                var arr_object_id = [];
                                //get object_id
                                angular.forEach(results.f1.data.rows, function (object_info) {
                                    arr_object_id.push(object_info[$scope.grid_options.row_key]);
                                });
                                $scope.params[$scope.grid_options.row_key] = arr_object_id.join(',');
                                //active arrow sort
                                $scope.params.sort_cp = true;
                                $scope.grid_options.object.getList($scope.params, function (resp) {
                                    if (resp.code == 500 || resp.data.length == 0) {
                                        $scope.data_source.data = [];
                                    } else {
                                        $scope.data_source.data = resp.data.rows;
                                        //build data compare
                                        angular.forEach($scope.data_source.data, function (object_info) {
                                            var find_data = $filter('filter')($scope.data_sort_compare.data.rows, {[$scope.grid_options.row_key]: object_info[$scope.grid_options.row_key]});
                                            if (find_data.length > 0) {
                                                object_info.data_compare = {};
                                                angular.forEach($scope.list_field_compare, function (field, index_field) {
                                                    object_info.data_compare[field] = find_data[0][field];
                                                })
                                                //segment compare
                                                if (find_data[0]['segment']) {
                                                    object_info.data_compare.segment = find_data[0]['segment'];
                                                }
                                            }
                                        });
                                        if (typeof $scope.grid_options.loading !== 'undefined' && $scope.grid_options.loading) {
                                            angular.element(document).find($scope.grid_options.loading).fadeOut();
                                        }
                                    }
                                });
                            });
                            buildStartEnd();
                        };

                        var item_per_page = Storage.read('item_per_page');
                        if (item_per_page != null && item_per_page != $scope.params.limit) {
                            $scope.params.limit = item_per_page;
                        }
                        var checkedSelectAll = function () {
                            $scope.ng_model = [];
                            $scope.ng_model_object = [];
                            var count = 0;
                            angular.forEach($scope.data_source.data, function (item) {
                                if (item.selected == true) {
                                    $scope.ng_model.push(item[$scope.grid_options.row_key]);
                                    $scope.ng_model_object.push(item);
                                    count++;
                                }
                            });
                            if ($scope.data_source.data != undefined && count == $scope.data_source.data.length && $scope.data_source.data.length != 0) {

                                $scope.selected_all = true;
                            } else {
                                angular.element('#dropdown-label').attr('disabled', true);
                                angular.element('#management_label_remove_button').attr('disabled', true);
                                $scope.selected_all = false;
                            }
                        };
                        //
                        $scope.selectedAll = function () {
                            var count_check_box = [];
                            if ($scope.selected_all) {
                                //Count neu khong co checkbox nao thi khong enable dropdown
                                $('input[type=checkbox].custom-checkbox').each(function () {
                                    count_check_box.push($(this).val())
                                });
                                if (count_check_box.length > 0) {
                                    angular.element('#dropdown-label').attr('disabled', false);
                                }
                                angular.element('#management_label_remove_button').attr('disabled', false);
                            } else {
                                angular.element('#dropdown-label').attr('disabled', true);
                                angular.element('#management_label_remove_button').attr('disabled', true);
                            }
                            angular.forEach($scope.data_source.data, function (item) {
                                if ($scope.selected_all) {
                                    angular.element('#dropdown-label').attr('disabled', false);
                                    angular.element('#management_label_remove_button').attr('disabled', false);
                                }
                                item.selected = $scope.selected_all;
                            });
                            $scope.checkChecbox(1, 1);
                        };
                        $scope.checkChecbox = function (case_reload, is_check_all) {
                            checkedSelectAll();
                        };

                        $scope.setItemPerPage = function () {
                            if ($scope.item_per_page != $scope.params.limit) {
                                //Save localStorage
                                Storage.write('item_per_page', $scope.params.limit);
                            }
                            $scope.item_per_page = $scope.params.limit;
                        }
                        $scope.sort = function (event, sort, compare = 0) {

                            $scope.selected_all = false;

                            if (typeof(event) !== 'undefined') {
                                current_sort = event.currentTarget.getAttribute("aria-sort");
                                if (current_sort == '') {
                                    //click lan 2
                                    if (sort == $scope.params.sort) {
                                        if ($scope.params.az == 'ASC') {
                                            current_sort = 'DESC';
                                        } else {
                                            current_sort = 'ASC';
                                        }
                                    } else {
                                        //click lan 1
                                        current_sort = 'DESC';
                                    }
                                }
                                if (current_sort === 'ASC') {
                                    $scope.class_arrow = 'icon-circle-up';
                                } else {
                                    $scope.class_arrow = 'icon-circle-down';
                                }
                            }


                            if (typeof(sort) !== 'undefined') {
                                $scope.params.sort = sort;
                                $scope.params.az = current_sort;
                                updateUrl({
                                    sort: sort,
                                    az: current_sort
                                })

                            }

                            if ($scope.params.page == 1) {
                                if (compare == 1) {
                                    $scope.params.sort_cp = true;
                                    getDataCompare('sort');
                                } else {
                                    $scope.params.sort_cp = false;
                                    getData('sort');
                                    //disable sort compare

                                }

                            } else {
                                $scope.params.page = 1;
                            }
                        };
                        $scope.changePage = function (newPage) {
                            $scope.params.page = newPage;
                            getData('changePage');
                        }
                        $scope.link = function (object) {
                            $scope.action({object: object});
                        };
                        $scope.parseStringToDate = function (s) {
                            return Date.parse(s);
                        };
                        var buildStartEnd = function () {
                            var offset = parseInt(+$scope.params.limit) * (Math.max(1, $scope.params.page) - 1);
                            var end = offset + (+$scope.params.limit);
                            $scope.start = offset + 1;
                            $scope.end = end;
                        };
                        var showMessageEmpty = function (params) {
                            var message_no_data = '';
                            if ($scope.tmp_message_no_data == undefined) {
                                switch ($scope.grid_options.type) {
                                    case appConfig.TYPE_TARGET_SECTION:
                                    case appConfig.TYPE_TARGET_TOPIC:
                                    case appConfig.TYPE_TARGET_AUDIENCE:
                                    case appConfig.TYPE_TARGET_AGE:
                                    case appConfig.TYPE_TARGET_GENDER:
                                        var object_name = $scope.grid_options.grid_name;
                                        if ($scope.grid_options.type == appConfig.TYPE_TARGET_AGE) {
                                            object_name = 'Age range';
                                        }
                                        if ($scope.grid_options.type == appConfig.TYPE_TARGET_AUDIENCE) {
                                            object_name = 'Audience';
                                        }
                                        $scope.message_no_data = "You haven't targeted any " + object_name + " in this account. Click Add targeting button to add one.";
                                        break;
                                    case appConfig.TYPE_METRIC_REPORT_FILTER_LISTING:
                                        $scope.message_no_data = 'You have no reports at this time';
                                        break;
                                    default:
                                        $scope.message_no_data = 'No ' + $scope.grid_options.grid_name + ' ';
                                }
                            } else {
                                $scope.message_no_data = 'No ' + $scope.grid_options.grid_name + ' ';
                                message_no_data = $scope.tmp_message_no_data ? $scope.tmp_message_no_data : '';
                                $scope.message_no_data += message_no_data;
                            }
                        }
                        // Update param on url
                        var updateUrl = debounce(function (param) {

                            // Make default param
                            // c: Column, m: Metric, mvs: Metric compare, q: Search, s: Segment, t: Time
                            var urlParam = angular.extend({
                                c: null,
                                m: null,
                                mvs: null,
                                q: null,
                                s: null,
                                t: null
                            }, $location.search(), param)
                            $location.search(urlParam)
                        }, 500, false);
                        $scope.callGrid = function (params) {

                            if (params.segment != undefined) {
                                $scope.params.seg_grid = params.segment;
                            }
                            if (params.columns != undefined) {
                                $scope.params.columns = params.columns;
                            }

                            if ($scope.params.seg_grid != undefined && $scope.params.seg_grid != '') {
                                var segment_current = $scope.params.seg_grid;
                                var arrRange = Storage.read('calendar');
                                if (arrRange) {
                                    var //arrRange = JSON.parse(localStorage.getItem("dataPicker")),
                                        from_date = moment(arrRange.from_date, appConfig.MOMENT_DATE_FORMAT),
                                        to_date = moment(arrRange.to_date, appConfig.MOMENT_DATE_FORMAT),
                                        duration = moment.duration(to_date.diff(from_date)).asDays(),
                                        error_segment = false;
                                    switch (segment_current) {
                                        case "DAY":
                                            if (duration > 17) {
                                                error_segment = true;
                                            }
                                            break;
                                        case "WEEK":
                                            //1 week
                                            if (duration < 6) {
                                                error_segment = true;
                                            }
                                            break;
                                        case "MONTH":
                                            //1 month
                                            if (duration < 29) {
                                                error_segment = true;
                                            }
                                            break;

                                        case "QUARTER":
                                            //3 month
                                            if (duration < 90) {
                                                error_segment = true;
                                            }
                                            break;
                                        case "YEAR":
                                            //3 year
                                            if (duration < 360) {
                                                error_segment = true;
                                            }
                                            break;
                                        case "DAY_OF_WEEK":
                                            break;
                                        case "HOUR_OF_DAY":
                                            //Hourly validate
                                            var today = moment().format(appConfig.MOMENT_DATE_FORMAT);
                                            today = moment(today, appConfig.MOMENT_DATE_FORMAT);
                                            var hourly_duration = moment.duration(today.diff(from_date)).asDays();
                                            if (hourly_duration >= 8) {
                                                error_segment = true;
                                            }
                                            break;
                                    }
                                    if (error_segment) {
                                        $scope.params.seg_grid = "";
                                        updateUrl({s: null});
                                    }

                                }
                            }

                            $scope.params.page = params.page != undefined ? params.page : $scope.params.page;
                            //
                            if (params.from_date != undefined) {
                                $scope.params.from_date = params.from_date;
                            }
                            //
                            if (params.to_date != undefined) {
                                $scope.params.to_date = params.to_date;
                            }
                            //
                            if (params.from_range != undefined && params.from_range != '' && params.to_range != undefined && params.to_range != '' ) {
                                $scope.params.from_range = params.from_range;
                                $scope.params.to_range = params.to_range;
                            }else{
                                $scope.list_field_compare = [];
                                delete $scope.params.field_compare;
                                delete $scope.params.from_range;
                                delete $scope.params.to_range;
                            }

                            if (params.filter != undefined && params.filter != '') {

                                if ($scope.grid_options.detail_filter != undefined && $scope.grid_options.detail_filter != '') {
                                    var filter = angular.copy($scope.grid_options.detail_filter);
                                    angular.forEach(params.filter, function (filter_info) {
                                        filter.push(filter_info);
                                    });
                                    $scope.params.filter = JSON.stringify(filter);
                                } else {
                                    $scope.params.filter = JSON.stringify(params.filter);
                                }

                            } else {
                                //detail
                                if ($scope.grid_options.detail_filter != undefined && $scope.grid_options.detail_filter != '') {
                                    $scope.params.filter = JSON.stringify($scope.grid_options.detail_filter);
                                } else {
                                    //detail
                                    if (params.filter == '') {
                                        $scope.params.filter = '';
                                    }
                                }

                            }


                            if (params.fc != undefined && params.fc != '') {
                                if (params.message_no_data) {
                                    $scope.tmp_message_no_data = params.message_no_data;
                                }
                                getData(params.fc);
                            } else {
                                console.log('not params fc');
                            }

                        };
                        this.renderGrid = function (params) {
                            $scope.callGrid(params);
                        };
                        if ($scope.call == true) {
                            $scope.params.fc = 'self';
                            $scope.callGrid($scope.params);
                        }
                        getParamFromUrl();


                        //LABEL
                        $scope.st_url_upload = ST_URL_UPLOAD;
                        $scope.classlabel = '';
                        $scope.object_checked = [];
                        $scope.intersect_arrays = function (a, b) {
                            var sorted_a = a.concat().sort();
                            var sorted_b = b.concat().sort();
                            var common = [];
                            var a_i = 0;
                            var b_i = 0;

                            while (a_i < a.length
                            && b_i < b.length) {
                                if (sorted_a[a_i] === sorted_b[b_i]) {
                                    common.push(sorted_a[a_i]);
                                    a_i++;
                                    b_i++;
                                }
                                else if (sorted_a[a_i] < sorted_b[b_i]) {
                                    a_i++;
                                }
                                else {
                                    b_i++;
                                }
                            }
                            return common;
                        }

                        $scope.buildColumnCreativeName = function (json, format, creative_id) {
                            var url_image = '';
                            if ($.inArray(+format, [1, 2, 3, 4, 5]) != -1) {
                                if (typeof(json) !== 'undefined' && json != '') {
                                    if (typeof(angular.fromJson(json)) !== 'undefined') {
                                        if (typeof(angular.fromJson(json).image) !== 'undefined') {
                                            url_image = angular.fromJson(json).image.url;
                                        }
                                    }
                                }

                            }
                            return url_image;
                        };
                        $scope.loadPreviewAd = function (creative_id) {
                            angular.element('#review_' + creative_id).modal({
                                keyboard: true,
                                backdrop: true
                            });
                        };
                        //

                        //END LABEL

                        $scope.showChangBid = function (data) {
                            //disable box_change_bid
                            if (!data.dismiss) {
                                angular.forEach($scope.data_source.data, function (row) {
                                    row.show_change_bid = false;
                                });
                                data.show_change_bid = true;
                            } else {
                                data.dismiss = false;
                                data.show_change_bid = false;
                            }
                        };

                        $scope.$on(AUTH_EVENTS.changeSupportUser, function () {
                            if ($scope.params.filter != undefined) {
                                $scope.params.filter = [];
                            }
                            $scope.selected_all = false;
                            //getData();
                        });
                        $scope.$on(AUTH_EVENTS.autoloadColumn, function (params, args) {
                            if ($scope.params.sort != undefined) {
                                //reset sort when modify columns
                                $scope.params.sort = '';
                            }
                            getData('change column');
                        });
                        $scope.$on(AUTH_EVENTS.reloadGridLabel, function (params, args) {
                            if ($scope.params.sort != undefined) {
                                //reset sort when modify columns
                                $scope.params.sort = '';
                            }
                            getData('change label');
                        });
                        $scope.$on(AUTH_EVENTS.reloadGridLabel, function (params, args) {
                            if ($scope.params.sort != undefined) {
                                //reset sort when modify columns
                                $scope.params.sort = '';
                            }
                            getData('change label');
                        });
                        $scope.$on(APP_EVENTS.reloadGrid, function (params, args) {
                            if (args.list_account_filter != undefined) {
                                $scope.params.list_account_filter = args.list_account_filter;
                            }
                            getData('reload');
                        });


                        var lazyLoad = function () {
                            var docViewTop = $(window).scrollTop();
                            var docViewBottom = docViewTop + $(window).height();
                            $('.img-placeholder').each(function () {
                                var elemTop = $(this).offset().top;
                                var elemBottom = elemTop + $(this).height();
                                if (((elemBottom <= docViewBottom) && (elemTop >= docViewTop))) {
                                    //the element in view, we load
                                    var iframe = $('<iframe></iframe>')
                                        .attr('src', $(this).data('iframe'))
                                        .attr('width', $(this).data('width'))
                                        .attr('height', $(this).data('height'))
                                        .attr('style', $(this).data('style'))
                                        ;
                                    $(this).replaceWith(iframe);
                                }
                            })
                        };

                        $scope.getClassByRow = function (object) {
                            var arr_status_text_grey = [60, 0];
                            if (object.status_id != undefined && arr_status_text_grey.indexOf(+object.status_id) !== -1) {
                                return 'text-grey';
                            }
                            switch ($scope.grid_options.type) {
                                case appConfig.TYPE_METRIC_REMARKETING:
                                    if (object.status != undefined && arr_status_text_grey.indexOf(+object.status) !== -1) {
                                        return 'text-grey';
                                    }
                                    break;
                            }
                        }

                        angular.element($window).bind("scroll", function () {
                            lazyLoad();
                        });

                    }],
                templateUrl: '/js/shared/templates/grid/grid.html?v=' + ST_VERSION
            };
        });


    });