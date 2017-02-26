/**
 * Created by GiangBeo on 7/26/16.
 */

define(['app', "libs/bootstrap/bootstrap.min", 'libs/jquery-ui/jquery-ui.min', "modules/operation/services/label", 'modules/operation/directives/label'], function (app) {
    app.directive('dropdownLabel', function ($timeout, $state, Metric, Label, appConfig, AUTH_EVENTS,APP_EVENTS, $rootScope, Auth) {
        return {
            restrict: 'E',
            //replace: true,
            scope: {
                typeitem: '=typeitem'
            },
            link: function (scope, element, attrs) {
                var _promiseLabelSearch;
                scope.isopen = false;
                scope.idmodallabel = 'modallabel';
                var showLabel = function () {
                    scope.showLabel = (Auth.supportUser() && Auth.supportUser().role == appConfig.USER_ROLES.BUYER) ? true : false;
                };
                showLabel();
                if (scope.typeitem == appConfig.TYPE_METRIC_REMARKETING) {
                    scope.showLabel = true;
                }
                scope.dataSource = {
                    label: {
                        action: [
                            {value: 'Create new', key: '9009', is_show: true},
                            {value: 'Manage labels', key: '9010', is_show: true},
                            {value: 'Apply', key: '9011', is_show: false}
                        ],
                        list: []
                    }
                };
                scope.keyPressSearch = function (event) {
                    //Get all id of checkbox had checked before press click
                    $('input[type=checkbox].label-check').each(function () {
                        if ($(this).prop('checked')) {
                            scope.arr_label.push($(this).val());
                        }

                    });
                    scope.getListLabel(scope.search_str_label);
                    if (event.keyCode == 13) {
                        return false;
                    }

                };
                scope.getListLabel = function (search_str) {
                    if (_promiseLabelSearch) {
                        _promiseLabelSearch.$cancelRequest();
                    }
                    var labelList = [];

                    _promiseLabelSearch = Label.getList({search: search_str, filter: 1});

                    _promiseLabelSearch.$promise.then(function (resp) {
                        scope.list_account = [];
                        if (resp) {
                            angular.forEach(resp.data, function (value, key) {
                                labelList.push({value: value.label_name, key: value.label_id})
                            });
                            scope.dataSource.label.list = labelList;
                            //Add event auto check if search label
                            $timeout(function () {
                                //get id checkbox from array checked and using iCheck for auto check when search or do something else
                                angular.forEach(scope.arr_label, function (value, index) {
                                    $('#input_label_check_' + value).iCheck('check');
                                });
                            });
                            //
                        }
                        _promiseLabelSearch = null;
                    });
                };
                scope.reloadLabelList = function (case_reload) {
                    var stringObject = '';
                    $('input[type=checkbox].custom-checkbox').each(function () {
                        if (case_reload == 0) {
                            if ($(this).prop('checked')) {
                                stringObject = stringObject + ',' + $(this).val();
                            }
                        }
                        else {
                            stringObject = stringObject + ',' + $(this).val();
                        }

                    });

                    //Check label checked
                    Label.getList({
                        arr_object: stringObject,
                        type_label: scope.typeitem,
                        type: 0
                    }, function (resp) {
                        var arr_label = angular.fromJson(resp.data.label_list);
                        $rootScope.$broadcast(AUTH_EVENTS.showApplyLabel, {
                            arr_label: arr_label
                        });
                        angular.element('.label-check').each(function (index, value) {
                            // console.log(value.value)
                            //console.log($.inArray(value.value,arr_label));
                            if ($.inArray(value.value, arr_label) != -1) {
                                $timeout(function () {
                                    $('#input_label_check_' + value.value).iCheck('check');
                                });
                            }
                            else {
                                $timeout(function () {
                                    $('#input_label_check_' + value.value).iCheck('uncheck');
                                });
                            }
                        });

                    });
                };
                //Catch event click out side dropdown label
                scope.toggleLabel = function (open) {
                    if (open) {
                        // console.log('is open');
                    } else {
                        angular.forEach(scope.dataSource.label.action, function (valueLabel, indexLabel) {
                            var is_show = true;
                            if (valueLabel.key == 9011) {
                                is_show = false;
                            }
                            scope.dataSource.label.action[indexLabel].is_show = is_show;
                        });
                        scope.reloadLabelList(0);
                    }
                };
                scope.searchLabel = function () {
                    scope.getListLabel(scope.search_str_label);
                };
                scope.$on(AUTH_EVENTS.changeLabel, function () {
                    scope.getListLabel(scope.search_str_label);
                });

                scope.$on(AUTH_EVENTS.changeSupportUser, function () {
                    angular.element('#dropdown-label').attr('disabled', true);
                    //Auto reload label when change support user
                    scope.getListLabel('');
                });
                //Load list label first time
                scope.getListLabel('');
                scope.search_str_label = '';
                scope.arr_label = [];
                // Change label
                scope.changeLabel = function (value) {
                    if (value == 9011) {
                        scope.applyLabel();
                        scope.search_str_label = '';
                        scope.label_name = '';
                        scope.getListLabel('');
                        value = '';
                        return;
                    }
                    if (value == 9010) {
                        $state.go('campaigns.label');
                        return;
                    }
                    if (value == 9009) {
                        scope.isopen = false;
                        angular.element('#' + scope.idmodallabel).modal('show');
                        return;
                    }
                };

                scope.label_checked = [];
                scope.object_checked = [];
                scope.label_delete = [];
                scope.checkLabel = function (id_label) {

                    var object_checked = [];
                    $('input[type=checkbox].custom-checkbox').each(function () {
                        if ($(this).prop('checked')) {
                            if ($.inArray($(this).val(), object_checked) == -1) {
                                object_checked.push($(this).val());
                            }
                        }
                    });
                    $('input[type=checkbox].label-check').each(function () {
                        if ($(this).prop('checked')) {
                            if ($.inArray($(this).val(), object_checked) == -1) {
                                object_checked.push($(this).val());
                            }
                        }
                    });
                    if (object_checked.length > 0) {
                        angular.forEach(scope.dataSource.label.action, function (valueLabel, indexLabel) {
                            var is_show = false;
                            if (valueLabel.key == 9011) {
                                is_show = true;
                            }
                            scope.dataSource.label.action[indexLabel].is_show = is_show;
                        });
                    }
                    if ($('#input_label_check_' + id_label).prop('checked')) {
                        angular.forEach(scope.label_checked, function (valueLable, indexLabel) {
                            if (valueLable == id_label) {
                                scope.label_checked.splice(indexLabel, 1);
                            }
                        })
                    }
                    else {
                        if ($.inArray(id_label, scope.label_checked) == -1) {
                            scope.label_checked.push(id_label);
                        }
                    }
                    if (scope.label_checked.length == 0) {
                        angular.forEach(scope.dataSource.label.action, function (valueLabel, indexLabel) {
                            var is_show = false;
                            if (valueLabel.key == 9011) {
                                is_show = true;
                            }
                            scope.dataSource.label.action[indexLabel].is_show = is_show;
                        });
                    }

                };
                scope.$on(AUTH_EVENTS.showApplyLabel, function (params, args) {
                    scope.label_checked = args.arr_label;
                    //console.log( scope.label_checked );
                });

                scope.applyLabel = function () {
                    scope.isopen = false;
                    var label_arr = [];
                    var label_delete = [];
                    $('input[type=checkbox].label-check').each(function () {
                        if ($(this).prop('checked')) {
                            label_arr.push($(this).val());
                        }
                        else {
                            label_delete.push($(this).val());
                        }
                    });
                    var object_arr = [];
                    $('input[type=checkbox].custom-checkbox').each(function () {
                        if ($(this).prop('checked')) {
                            object_arr.push($(this).val());
                        }
                    });
                    $rootScope.showLoading = true;
                    Label.create({
                        type_add: 0,
                        obj_id_arr: object_arr,
                        label_id_arr: label_arr,
                        type: scope.typeitem,
                        label_delete: label_delete
                    }, function (resp) {
                        // 3 seconds and go to next line of code.
                        $rootScope.$broadcast(AUTH_EVENTS.autoloadColumn, {
                            fields: '',
                            type: scope.typeitem,
                            colId: "_" + Math.floor((Math.random() * 100) + 1)
                        });
                        scope.$broadcast(AUTH_EVENTS.changeLabel, {
                            colId: "_" + Math.floor((Math.random() * 100) + 1)
                        });
                        scope.$broadcast(APP_EVENTS.reloadGrid, {
                            colId: "_" + Math.floor((Math.random() * 100) + 1)
                        });
                        angular.forEach(scope.dataSource.label.action, function (valueLabel, indexLabel) {
                            var is_show = true;
                            if (valueLabel.key == 9011) {
                                is_show = false;
                            }
                            scope.dataSource.label.action[indexLabel].is_show = is_show;
                        });
                        angular.element('#dropdown-label').attr('disabled', true);
                        scope.getListLabel('');
                        $rootScope.showLoading = false;
                    });
                };
            },
            templateUrl: '/js/modules/operation/templates/dropdown-label/dropdown-label.html?v=' + ST_VERSION
        }
    })
})
