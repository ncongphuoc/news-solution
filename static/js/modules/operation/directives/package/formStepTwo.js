/**
 * @auhor: Code nay la cua Thephuc ^^
 * @since: 21/11/2016
 */
define(['app', 'shared/directive/icheck',
               'modules/operation/directives/lineitem/locationSearch',
               'modules/operation/directives/lineitem/deviceTarget',
               'shared/directive/select-multi',
               'modules/operation/services/remarketing',
               'modules/operation/directives/package/creativeDelivery',
               'modules/operation/directives/campaign/forecast',
               'modules/operation/services/package/placement'], function (app) {

    app.directive('formStepTwo', function (appConfig, Placement) {
        return {
            restrict: 'E',
            scope: {
                package: '=ngModel',
            },
            require: 'ngModel',
            templateUrl: '/js/modules/operation/templates/directive/formStepTwo.html',
            controller: function($scope, $rootScope, APP_EVENTS, $filter) {
                $scope.static_url = appConfig.ST_HOST;
                $scope.isOpenTarget = false;

                $scope.filters = [
                    // { t:'14', v: { '14': '' } },
                    // { t:'15', v: { '15': '' } },
                    // { t:'17', v: { '17': '' } },
                ];
                $scope.info_selected = [
                    // { key:'14', name: 'Locations', total: 0 },
                    // { key:'15', name: 'Devices', total: 0 },
                    // { key:'17', name: 'Placements', total: 0 },
                ];

                $scope.config_type_of_visitor_specific_tag = {
                    object: Placement,
                    function: 'getList',
                    params: {
                        type: 'support',
                        manager:true
                    },
                    object_id: 'placement_id',
                    object_name: 'placement_name',
                    is_search: 1,
                    type: 2
                };

                var getIndexFilters = function(find) {
                    var index = '';
                    angular.forEach($scope.filters, function(value, key){
                        if(value.t === find)
                            index = $scope.filters.indexOf(value);
                    });
                    return index;
                }; // END getIndex
                var getIndexInfoSelected = function(find) {
                    var index = '';
                    angular.forEach($scope.info_selected, function(value, key){
                        if(value.key === find)
                            index = $scope.info_selected.indexOf(value);
                    });
                    return index;
                }; // END getIndexInfoSelected
                var checkNull = function() {
                    angular.forEach($scope.filters, function(value, key){
                        var data = Object.values(value.v);
                        if(data[0] === '')
                            $scope.filters.splice(key, 1);
                    });
                    angular.forEach($scope.info_selected, function(value, key){
                        if(value.total === 0)
                            $scope.info_selected.splice(key, 1);
                    });
                }; // END checkNull
                var prepareData = function(str_data, key_number, name) {
                    var index_filter = getIndexFilters(key_number);
                    var index_selected = getIndexInfoSelected(key_number);

                    if(index_filter === '') {
                        var prepare = { t:key_number, v: { [key_number]: '' } };
                        $scope.filters.push(prepare);
                        index_filter = getIndexFilters(key_number);
                    }
                    if(index_selected === '') {
                        var prepare = { key:key_number, name: name, total: 0 };
                        $scope.info_selected.push(prepare);
                        index_selected = getIndexInfoSelected(key_number);
                    }

                    if($scope.filters[index_filter] !== undefined)
                        $scope.filters[index_filter].v = { [key_number]: str_data };

                    if($scope.info_selected[index_selected] !== undefined) {
                        if(str_data !== '') {
                            $scope.info_selected[index_selected].total = str_data.split(",").length;
                        } else {
                            $scope.info_selected[index_selected].total = 0;
                        }
                    }
                    checkNull();
                    $scope.forecast_data = {
                        filters: JSON.stringify($scope.filters),
                        info_selected: $scope.info_selected
                    };
                }; // END prepareData
                var buildDataForecas = function(type){
                    switch(type) {
                        case 1:
                            var str_data = '';
                            var location_id = [];
                            angular.forEach($scope.package.locations_target.location, function(value, key) {
                                if(value.location_id)
                                    location_id.push(value.location_id.toString());
                            });
                            str_data += location_id.join();
                            if($scope.package.locations_search)
                                str_data += ',' + $scope.package.locations_search;

                            prepareData(str_data, "14", "Locations");
                            $scope.package.locations_search = str_data;
                            break;
                        case 2:
                            var str_data = '';
                            var device = [];
                            if(Object.keys($scope.package.device).length > 0) {
                                if($scope.package.device._desktop_osv_target) {
                                    var data = $scope.package.device._desktop_osv_target.split(",");
                                    angular.forEach(data, function(value, key) {
                                        device.push(value);
                                    });
                                }
                                if($scope.package.device._mobile_osv_target) {
                                    var data = $scope.package.device._mobile_osv_target.split(",");
                                    angular.forEach(data, function(value, key) {
                                        device.push(value);
                                    });
                                }
                                if($scope.package.device.browser_target) {
                                    var data = $scope.package.device.browser_target.split(",");
                                    angular.forEach(data, function(value, key) {
                                        device.push(value);
                                    });
                                }
                                if($scope.package.device.carrier_target) {
                                    var data = $scope.package.device.carrier_target.split(",");
                                    angular.forEach(data, function(value, key) {
                                        device.push(value);
                                    });
                                }
                                if($scope.package.device.device_display) {
                                    var data = $scope.package.device.device_display.split(",");
                                    angular.forEach(data, function(value, key) {
                                        device.push(value);
                                    });
                                }
                                if($scope.package.device.mfr_target) {
                                    var data = $scope.package.device.mfr_target.split(",");
                                    angular.forEach(data, function(value, key) {
                                        device.push(value);
                                    });
                                }
                            }
                            str_data = device.join();
                            prepareData(str_data, "15", "Devices");
                            $scope.package.device_selected = str_data;
                            break;
                        case 3:
                            prepareData($scope.package.placement.toString(), "17", "Placements");
                            break;
                        default:
                            break;
                    }
                }; // END buildDataForecas
                $scope.updateOpenStatus = function() {
                    if(!$scope.isOpenTarget)
                        $scope.isOpenTarget = true;
                };// END updateOpenStatus
                $scope.back = function() {
                    $rootScope.$broadcast('directive_call_show_step', {step:1, is_show:true});
                    $rootScope.$broadcast('call_back_left_nav_active_step', {step:1, is_show:true});
                }; // END back
                var checkLocation = function() {
                    $scope.is_error_location = false;
                    if($scope.is_submitted &&
                        $scope.package.locations_target.type === 'custom' &&
                        $scope.package.locations_target.location.length === 0) {
                        $scope.is_error = true;
                        $scope.is_error_location = true;
                    }
                }; // END checkLocation
                var checkPlacement = function() {
                    $scope.is_error_placement = false;
                    if($scope.is_submitted &&
                        $scope.package.placement === '') {
                        $scope.is_error = true;
                        $scope.is_error_placement = true;
                    }
                }; // END checkPlacement
                var checkScheduling = function() {
                    $scope.is_error_scheduling = false;
                    if($scope.is_submitted &&
                        $scope.package.create_scheduling.time_frames === '') {
                        $scope.is_error = true;
                        $scope.is_error_scheduling = true;
                    }
                }; // END checkScheduling

                $scope.submitStepTwo = function() {
                    $scope.is_submitted = true;
                    $scope.is_error = false;
                    $scope.is_error_location = false;
                    checkLocation();// check data location
                    checkPlacement();// check data placement
                    checkScheduling();// check data scheduling
                    $rootScope.$broadcast(APP_EVENTS.lineItem.saveLineItem);
                    $rootScope.$broadcast('is_submit_step_2', true);
                    if($scope.package_form_step_2.$valid &&
                        !$scope.is_error &&
                        !$scope.is_error_location &&
                        !$scope.is_error_placement &&
                        !$scope.is_error_scheduling) {
                        $rootScope.$broadcast('directive_call_show_step', {step:3, is_show:true});
                    }
                };

                $scope.$watch(
                    "package.locations_target",
                    function handleParamChange(new_value,old_value) {
                        buildDataForecas(1);
                        checkLocation();
                    }, true
                );
                $scope.$watch(
                    "package.device",
                    function handleParamChange(new_value,old_value) {
                        buildDataForecas(2);
                    }, true
                );
                $scope.$watch(
                    "package.placement",
                    function handleParamChange(new_value,old_value) {
                        buildDataForecas(3);
                        checkPlacement();
                    }, true
                );
                $scope.$watch(
                    "package.create_scheduling",
                    function handleParamChange(new_value,old_value) {
                        checkScheduling();
                    }, true
                );
            },
            link: function($scope, element, $attrs, ngModel) {
            }
        };
    });

});