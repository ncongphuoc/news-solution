/**
 * @auhor: Code nay la cua Thephuc ^^
 * @since: 21/11/2016
 */
define(['app', 'shared/directive/icheck',
               'modules/operation/directives/package/grantPermission',
               'shared/services/search'], function (app) {

    app.directive('formStepOne', function (Package) {
        return {
            restrict: 'E',
            scope: {
                package: '=ngModel',
            },
            require: 'ngModel',
            templateUrl: '/js/modules/operation/templates/directive/formStepOne.html',
            controller: function($scope, $rootScope, APP_EVENTS, $filter) {
                var _promise;
                $scope.bid_strategy_data_source = [
                    {value:'1',          name:'CPC'},
                    {value:'2', name:'Viewable CPM'},
                    {value:'5',          name:'CPM'},
                ];
                $scope.is_exist_package_name = false;

                $scope.checkExistPackageName = function() {
                    if($scope.package.package_name !== undefined && $scope.package.package_name !== '') {
                        if (_promise)
                            _promise.$cancelRequest();

                        var params = {
                            'package_name':$scope.package.package_name,
                            'manager':true,
                            'type':'checkName'
                        };
                        _promise = Package.getList(params);
                        _promise.$promise.then(function (res) {
                            if(res.data.total > 0) {
                                $scope.is_exist_package_name = true;
                            } else {
                                $scope.is_exist_package_name = false;
                            }
                        })
                    }
                }; // END checkExistPackageName

                checkFromDateValid = function() {
                    var current_date = $filter('date')(new Date(), 'dd/MM/yyyy');
                    var str_cur_date = current_date.split("/");
                    str_cur_date = str_cur_date[2] + '/' + str_cur_date[1] + '/' + str_cur_date[0];
                    var curr_date = new Date(str_cur_date);
                    if($scope.package.available_duration_from.length > 0) {
                        var get_from_date = $scope.package.available_duration_from;
                        var str_from_date = get_from_date.split("/");
                        str_from_date = str_from_date[2] + '/' + str_from_date[1] + '/' + str_from_date[0];
                        var from_date = new Date(str_from_date);

                        if(from_date < curr_date)
                            $scope.is_error_available_duration_from = true;
                        else
                            $scope.is_error_available_duration_from = false;
                    }
                }; // END checkFromDateValid

                checkEndDateValid = function() {
                    if($scope.package.available_duration_to.length > 0 && $scope.package.available_duration_from.length > 0) {
                        var get_to_date = $scope.package.available_duration_to;
                        var str_to_date = get_to_date.split("/");
                        str_to_date = str_to_date[2] + '/' + str_to_date[1] + '/' + str_to_date[0];
                        var to_date = new Date(str_to_date);

                        var get_from_date = $scope.package.available_duration_from;
                        var str_from_date = get_from_date.split("/");
                        str_from_date = str_from_date[2] + '/' + str_from_date[1] + '/' + str_from_date[0];
                        var from_date = new Date(str_from_date);

                        if(from_date > to_date)
                            $scope.is_error_available_duration_to = true;
                        else
                            $scope.is_error_available_duration_to = false;
                    }
                }; // END checkFromDateValid

                $scope.submitStepOne = function() {
                    checkFromDateValid();
                    checkEndDateValid();
                    $rootScope.$broadcast('is_submit_step_1', true);
                    if($scope.package_form_step_1.$valid) {
                        $scope.is_error = false;
                         // inform for directive granPermisson to know form is submission
                        $rootScope.$broadcast('is_submit_step_1', false);
                         // If everything ok then show step 2
                        if(!$scope.is_error &&
                           !$scope.is_exist_package_name &&
                           !$scope.is_error_available_duration_from) {
                            // rend request show step 2 to leftnav and controller
                            $rootScope.$broadcast('directive_call_show_step', {step:2, is_show:true});
                        }
                    } else {
                        $scope.is_error = true;
                    }
                } // END submitStepOne
            },
            link: function($scope, element, $attrs, ngModel) {
            }
        };
    });

});