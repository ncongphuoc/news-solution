/**
 * Created by nhanva on 5/30/2016.
 */
define(['app','modules/operation/services/target'], function (app) {
    app.directive('targetDemoGraphics', function (Target, appConfig) {
        return {
            restrict: 'EC',
            replace: true,
            scope: {
                model_value: '=ngModel',
                loadTarget: '=isOpen',
                remove: '&remove',
                id: '=id',
                show_remove: '=showRemove',
                is_reset: '=isReset',
                close: '&close',
                show_close: '=showClose'
            },
            controller: ['$scope', '$filter','$element', function ($scope, $filter, $element) {
                if($scope.model_value == undefined){
                    $scope.model_value = {}
                }
                if($scope.model_value.target_info == undefined){
                    $scope.model_value.target_info = {}
                }
                angular.extend($scope.model_value || {},{
                    target: {}
                });
                $scope.selectAge = function () {
                    if($scope.model_value.target_info == undefined){
                        $scope.model_value.target_info = {}
                    }
                    $scope.model_value.target[appConfig.TARGET_AGE] = [];
                    $scope.model_value.target_info[appConfig.TARGET_AGE] = {};
                    $scope.model_value.target_info[appConfig.TARGET_AGE].data = [];
                    if ($scope.demo_graphics.age.length) {
                        angular.forEach($scope.demo_graphics.age, function (type, index) {
                            if (type.checked != undefined && type.checked == true) {
                                $scope.model_value.target[appConfig.TARGET_AGE].push(+type.age_range_id);
                                $scope.model_value.target_info[appConfig.TARGET_AGE].data.push({
                                    object_id: type.age_range_id,
                                    object_name: type.age_name
                                });
                            }
                        });
                    }
                    count_selected();
                };
                $scope.selectGender = function () {
                    $scope.model_value.target[appConfig.TARGET_GENDER] = [];
                    $scope.model_value.target_info[appConfig.TARGET_GENDER] = {};
                    $scope.model_value.target_info[appConfig.TARGET_GENDER].data = [];
                    if (Object.keys($scope.demo_graphics.gender).length) {
                        angular.forEach($scope.demo_graphics.gender, function (type, index) {
                            if (type.checked != undefined && type.checked == true) {
                                $scope.model_value.target[appConfig.TARGET_GENDER].push(+type.gender_id);
                                $scope.model_value.target_info[appConfig.TARGET_GENDER].data.push({
                                    object_id: type.gender_id,
                                    object_name: type.gender_name
                                });
                            }
                        });
                    }
                    count_selected();
                };
                var count_selected = function () {
                    $count_age = $scope.model_value.target[appConfig.TARGET_AGE] != undefined ? $scope.model_value.target[appConfig.TARGET_AGE].length : 0;
                    $count_gender = $scope.model_value.target[appConfig.TARGET_GENDER] != undefined ? $scope.model_value.target[appConfig.TARGET_GENDER].length : 0;
                    $scope.model_value.total_selected = $count_age + $count_gender;
                };


                $scope.$watch(
                    "is_reset",
                    function valueChange(new_value, old_value) {
                        if($scope.demo_graphics != undefined){
                            angular.forEach($scope.demo_graphics.gender, function (type, index) {
                                type.checked = false;
                            });
                            angular.forEach($scope.demo_graphics.age, function (type, index) {
                                type.checked = false;
                            });
                        }

                    }
                );
                var init = function () {
                    //angular.extend($scope.model_value,model_value);
                    angular.element($element).find('.demo_graphic_loading.loading').css('display', 'block');
                    Target.get({target: appConfig.TARGET_DEMO_GRAPHICS}, function (resp) {
                        $scope.model_value.count_data = 0;
                        $scope.demo_graphics = resp.data;
                        if (Object.keys($scope.demo_graphics.gender).length) {
                            $scope.model_value.count_data += Object.keys($scope.demo_graphics.gender).length;
                        }
                        if ($scope.demo_graphics.age.length) {
                            $scope.model_value.count_data += $scope.demo_graphics.age.length;
                        }
                        //build case edit
                        if($scope.model_value.target_info != undefined){
                            $scope.model_value.target[appConfig.TARGET_AGE] = [];
                            $scope.model_value.target[appConfig.TARGET_GENDER] = [];
                            angular.forEach($scope.model_value.target_info, function (target_info, index_target_info) {
                                angular.forEach(target_info.data, function (object, index_object) {
                                    if(index_target_info == appConfig.TARGET_AGE){
                                        var find_age = $filter('filter')($scope.demo_graphics.age, {age_range_id: object.object_id});
                                        if (find_age.length) {
                                            find_age[0].checked = true;
                                            $scope.model_value.target[appConfig.TARGET_AGE].push(+find_age[0].age_range_id);
                                        }
                                    }
                                    if(index_target_info == appConfig.TARGET_GENDER){
                                        var find_gender = $filter('filter')($scope.demo_graphics.gender, {gender_id: object.object_id});
                                        if (find_gender.length) {
                                            find_gender[0].checked = true;
                                            $scope.model_value.target[appConfig.TARGET_GENDER].push(+find_gender[0].gender_id);
                                        }
                                    }
                                })
                            })
                        }
                        angular.element($element).find('.demo_graphic_loading.loading').css('display', 'none');
                    });
                };
                init();
                $scope.removeSelf = function (id) {
                    $scope.remove({id: id});
                };
                $scope.closeTarget = function (id) {
                    $scope.close({id: id});
                };
            }],
            templateUrl: '/js/modules/operation/templates/campaign/targetDemoGraphics.html?v=' + ST_VERSION
        }
    });
});