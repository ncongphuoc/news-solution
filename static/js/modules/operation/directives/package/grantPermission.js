/**
 * @auhor: Code nay la cua Thephuc ^^
 * @since: 21/11/2016
 */
define(['app', 'shared/services/search'], function (app) {

    app.directive('grantPermission', function ($rootScope, Find) {
        return {
            restrict: 'E',
            scope: {
                selected: '=ngModel'
            },
            require: 'ngModel',
            templateUrl: '/js/modules/operation/templates/directive/grantPermission.html',
            controller: function($scope) {

                var _promise;
                $scope.is_show_suggest = false;
                $scope.user_data = [];

                var getUserFullName = function() {
                    if($scope.selected.length > 0) {
                        angular.forEach($scope.selected, function(value, key){
                            var params = {
                                limit:1,
                                object:'users',
                                search:value,
                                all:true
                            };
                            Find.getList(params, function(res) {
                                if(res.code !== undefined && res.code === 200) {
                                    angular.forEach(res.data.rows, function(value2, key2){
                                        $scope.user_data.push({user_id:value2.user_id, fullname:value2.full_name});
                                    });
                                }
                            });
                        });
                    }
                }; // END getUserFullName
                getUserFullName();

                $scope.addUser = function(user_id, full_name) {
                    $scope.selected.push(user_id);
                    $scope.user_data.push({user_id:user_id, fullname:full_name});
                    $scope.is_show_suggest = false;
                    $scope.keyword = '';
                }; // END addUser

                $scope.removeUser = function(item) {
                    var index = $scope.selected.indexOf(item);
                    $scope.selected.splice(index, 1);
                    angular.forEach($scope.user_data, function(value, key){
                        if(item === value.user_id) {
                            var index = $scope.user_data.indexOf(value);
                            $scope.user_data.splice(index, 1);
                        }
                    });
                }; // END removeUser

                $scope.searchUser = function() {
                    $scope.list_user = [];
                    $scope.is_show_suggest = false;

                    if($scope.keyword !== '') {
                        var params = {
                            limit:10,
                            object:'users',
                            search:$scope.keyword,
                            all:true
                        };

                        if (_promise)
                            _promise.$cancelRequest();

                        _promise = Find.getList(params);
                        _promise.$promise.then(function (res) {
                            if(res.code !== undefined && res.code === 200) {
                                angular.forEach($scope.selected, function(value1, key1){
                                    angular.forEach(res.data.rows, function(value2, key2){
                                        if(value1 === value2.user_id) {
                                            var index = res.data.rows.indexOf(value2);
                                            res.data.rows.splice(index, 1);
                                        }
                                    });
                                });
                                if(res.data.rows !== undefined && res.data.rows.length > 0) {
                                    $scope.is_show_suggest = true;
                                    $scope.list_user = res.data.rows;
                                }
                            }
                        })
                    }
                }; // END searchUser

            },
            link: function(scope, element, attrs, ngModel) {
                if (attrs.required) {
                    // Listen form is submission
                    $rootScope.$on('is_submit_step_1', function(events, args) {
                        if(args === true && scope.selected.length <= 0)
                            ngModel.$setValidity('required', false);
                        else
                            ngModel.$setValidity('required', true);
                    });

                    // Listen user_data changed
                    scope.$watch('user_data', function(user_data) {
                        if(scope.user_data.length <= 0)
                            ngModel.$setValidity('required', false);
                        else
                            ngModel.$setValidity('required', true);
                    }, true);
                }
            }
        };
    });

});