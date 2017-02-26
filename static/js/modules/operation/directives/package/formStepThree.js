/**
 * @auhor: Code nay la cua Thephuc ^^
 * @since: 21/11/2016
 */
define(['app', 'shared/directive/icheck',
               'modules/operation/directives/campaign/targetDemoGraphics',
               'modules/operation/directives/campaign/forecast',
               'modules/operation/directives/campaign/demographic'], function (app) {

    app.directive('formStepThree', function (appConfig, AUTH_EVENTS) {
        return {
            restrict: 'E',
            scope: {
                package: '=ngModel',
            },
            require: 'ngModel',
            templateUrl: '/js/modules/operation/templates/directive/formStepThree.html',
            controller: function($scope, $rootScope, APP_EVENTS, $filter) {
                $scope.group_target = {
                    interest_and_remarketing: 18,
                    topic: 5,
                    section: 1,
                    demographics: 13
                };
                $scope.target_interest = appConfig.TARGET_INTEREST;
                $scope.target_inmarket = appConfig.TARGET_INMARKET;
                $scope.target_remarketing = appConfig.TARGET_REMARKETING;
                $scope.target_topic = appConfig.TARGET_TOPIC;
                $scope.target_section = appConfig.TARGET_WEBSITE;
                $scope.target_age = appConfig.TARGET_AGE;
                $scope.target_gender = appConfig.TARGET_GENDER;
                $scope.campaign_info = {};
                $scope.isPrivateDeal  = false;

                $scope.addTarget = function (group_target) {
                    var prepare = {
                        key: group_target,
                        ng_model: {},
                        config: $scope.config_group_target[group_target].config,
                        closed: false
                    };
                    $scope.package.group_target_selected.push(prepare);
                    $scope.config_group_target[group_target].hidden = true;
                };

                $scope.changeTarget = function (group_target) {
                    var key_target_old = $scope.package.group_target_selected[0].key;
                    $scope.package.group_target_selected = [];
                    var prepare = {
                        key: group_target,
                        ng_model: {},
                        config: $scope.config_group_target[group_target].config,
                        closed: false
                    };
                    $scope.package.group_target_selected.push(prepare);
                    $scope.config_group_target[key_target_old].hidden = false;
                    //show reset
                    angular.forEach($scope.config_group_target, function (target_selected) {
                        target_selected.hidden = false;
                    });
                    //
                    $scope.config_group_target[group_target].hidden = true;
                }; // END changeTarget

                $scope.removeTarget = function (id) {
                    $scope.config_group_target[id].hidden = false;
                    //get index
                    for (k = 0; k < $scope.package.group_target_selected.length; k++) {
                        if ($scope.package.group_target_selected[k].key === +id) {
                            $scope.package.group_target_selected.splice(k, 1);
                        }
                    }
                }; // END removeTarget

                var getConfig = function () {
                    $scope.config_group_target = {
                        [$scope.group_target.interest_and_remarketing]: {
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
                                        az: 'asc'
                                    },
                                    [$scope.target_inmarket]: {
                                        key: $scope.target_inmarket,
                                        value: 'In-market audiences',
                                        columns: 'inmarket_id,inmarket_name',
                                        private_key: 'inmarket_id',
                                        data: [],
                                        sort: 'inmarket_name',
                                        az: 'asc'
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
                                        az: 'asc'
                                    }
                                },
                                data: $scope.line_item_info
                            }
                        },
                        [$scope.group_target.topic]: {
                            key: $scope.group_target.topic,
                            value: 'Topics',
                            config: {
                                heading: 'Topic',
                                config_data: {
                                    [$scope.target_topic]: {
                                        key: $scope.target_topic,
                                        value: 'Topic list',
                                        columns: 'topic_id,topic_name_vn',
                                        private_key: 'topic_id',
                                        data: [],
                                        sort: 'topic_name_vn',
                                        az: 'asc'
                                    }
                                }
                            }
                        },
                        [$scope.group_target.section]: {
                            key: $scope.group_target.section,
                            value: 'Sections',
                            config: {
                                heading: 'Section',
                                config_data: {
                                    [$scope.target_section]: {
                                        key: $scope.target_section,
                                        value: 'Section list',
                                        columns: 'section_id,section_name',
                                        private_key: 'section_id',
                                        data: [],
                                        forecast_title: 'impressions/week',
                                        forecast_id: 'impression',
                                        sort: 'section_name',
                                        az: 'asc'
                                    }
                                }
                            }
                        },
                        [$scope.group_target.demographics]: {
                            key: $scope.group_target.demographics,
                            value: 'Demographics',
                            config: {
                                heading: 'Demographics',
                                config_data: {
                                    [$scope.target_age]: {
                                        key: $scope.target_age,
                                        value: 'AGE'
                                    },
                                    [$scope.target_gender]: {
                                        key: $scope.target_gender,
                                        value: 'GENDER'
                                    }

                                }
                            }
                        }
                    };
                    $scope.package.group_target_selected = [];
                    var prepare = {
                        key: $scope.group_target.interest_and_remarketing,
                        ng_model: {},
                        config: $scope.config_group_target[$scope.group_target.interest_and_remarketing].config,
                        closed: false
                    };
                    $scope.package.group_target_selected.push(prepare);
                    $scope.config_group_target[$scope.group_target.interest_and_remarketing].hidden = true;
                    $scope.target_radio_choose = $scope.group_target.interest_and_remarketing;
                }; // END getConfig
                getConfig();

                $scope.ng_model_campaign_target = {};
                var buildParamForecastPerformance = function(){
                    var interests_remarketing = [$scope.target_interest, $scope.target_inmarket, $scope.target_remarketing];
                    var filters = [];
                    var info_selected = [];
                    var set_group_target = {};
                    //gom nhom
                    angular.forEach($scope.ng_model_campaign_target, function (list_object_target,target_id) {
                        if (interests_remarketing.indexOf(+target_id) !== -1) {
                            if(set_group_target[appConfig.TARGET_INTEREST_AND_REMARKETING] == undefined){
                                set_group_target[appConfig.TARGET_INTEREST_AND_REMARKETING] = {};
                            }
                            set_group_target[appConfig.TARGET_INTEREST_AND_REMARKETING][target_id] = list_object_target;
                        }else{
                            set_group_target[target_id] = list_object_target;
                        }
                    });
                    angular.forEach(set_group_target, function (list_object_target,target_id) {
                        var target = {};
                        var define = {};
                        if([appConfig.TARGET_INTEREST_AND_REMARKETING,appConfig.TARGET_DEMO_GRAPHICS].indexOf(+target_id) !== -1){
                            target.t = target_id;
                            target.v = {};
                            var total = 0;
                            angular.forEach(list_object_target, function (target_child, target_id_child) {
                                total += target_child.length;
                                if (target_child.length) {
                                    target.v[target_id_child] = target_child.join();
                                }
                            });
                            if (Object.keys(target.v).length) {
                                filters.push(target);
                                define = {
                                    key: target_id,
                                    name: $scope.config_group_target[target_id].value,
                                    total: total
                                };
                                info_selected.push(define);
                            }
                        }else{
                            target.t = target_id;
                            target.v = {};
                            target.v[target_id] = list_object_target.join();
                            if (Object.keys(target.v).length) {
                                define = {
                                    key: target_id,
                                    name: $scope.config_group_target[target_id].value,
                                    total: list_object_target.length
                                };
                                filters.push(target);
                                info_selected.push(define);
                            }
                        }
                    });

                    $scope.forecast_performance = {
                        columns: 'imp',
                        filters: JSON.stringify(filters),
                        type: 1
                    };
                    // console.log(filters);
                    // console.log(info_selected);
                    $scope.forecast_data = {
                        filters: JSON.stringify(filters),
                        info_selected: info_selected
                    };
                    // $rootScope.$broadcast(AUTH_EVENTS.createCampaignSuccess, {
                    //     filters: JSON.stringify(filters),
                    //     info_selected: info_selected
                    // });
                }; // END buildParamForecastPerformance

                var buildCampaignTarget = function () {
                    $scope.error_max_bid_price = false;
                    $scope.error_min_bid_price = false;
                    //reset use_dynamic_remarketing truong hop chon lai
                    $scope.campaign_info.use_dynamic_remarketing = 0;

                    var result = {
                        error: false,
                        campaign_target: {}
                    };
                    var campaign_target = {};
                    var demographic = [$scope.target_age, $scope.target_gender];
                    // Get target from user selected
                    if(!$scope.isPrivateDeal){
                        angular.forEach($scope.package.group_target_selected, function (target_selected) {
                            if (Object.keys(target_selected.ng_model) == 0 || target_selected.ng_model.total_selected == undefined || (target_selected.ng_model.total_selected != undefined && target_selected.ng_model.total_selected == 0)) {
                                result.error = true;
                                if($scope.save_click){
                                    target_selected.errors = [1];
                                }

                            } else {
                                delete target_selected.errors;
                                if(+target_selected.key == +$scope.group_target.demographics){
                                    if(target_selected.ng_model.count_data == target_selected.ng_model.total_selected){
                                        result.error = true;
                                        target_selected.errors = [2];
                                    }else{
                                        delete target_selected.errors;
                                    }
                                }
                                angular.forEach(target_selected.ng_model.target, function (target_list_object, index_target) {
                                    if (target_list_object.length > 0) {
                                        if (demographic.indexOf(+index_target) !== -1) {
                                            if (campaign_target[appConfig.TARGET_DEMO_GRAPHICS] == undefined) {
                                                campaign_target[appConfig.TARGET_DEMO_GRAPHICS] = {};
                                            }
                                            campaign_target[appConfig.TARGET_DEMO_GRAPHICS][index_target] = target_list_object;
                                        } else {
                                            campaign_target[index_target] = target_list_object;
                                        }

                                    }
                                });
                                if (target_selected.ng_model.use_dynamic_remarketing != undefined) {
                                    $scope.campaign_info.use_dynamic_remarketing = target_selected.ng_model.use_dynamic_remarketing;
                                }
                            }

                        });
                    }else{
                        // Get target from package
                        for(var _key in $scope.campaign_target){
                            var targetType = parseInt(_key)
                            var mappingTarget = _key;
                            // 11, 12 --> 13 (appConfig.TARGET_DEMO_GRAPHICS), otherwise keep targetType
                            if([appConfig.TARGET_AGE, appConfig.TARGET_GENDER].indexOf(targetType)!=-1){
                                mappingTarget = appConfig.TARGET_DEMO_GRAPHICS;
                            }else if([appConfig.TARGET_REMARKETING, appConfig.TARGET_INTEREST, appConfig.TARGET_INMARKET].indexOf(targetType)!=-1){
                                // 4,6, 10 ==> 18 (appConfig.TARGET_INTEREST_AND_REMARKETING)
                                mappingTarget = appConfig.TARGET_INTEREST_AND_REMARKETING;
                            }
                            if(mappingTarget == targetType){
                                campaign_target[mappingTarget] = $scope.campaign_target[mappingTarget].map( item => item.object_id);
                            }else{
                                if(campaign_target[mappingTarget] == undefined){
                                    campaign_target[mappingTarget] = {}
                                }
                                campaign_target[mappingTarget][targetType] = $scope.campaign_target[targetType].map( item => item.object_id)
                            }
                        }
                    }

                    $scope.ng_model_campaign_target = campaign_target;
                    result.campaign_target = campaign_target;
                    $scope.save_click = false;
                    //
                    if (+$scope.campaign_info.bid_price > $scope.max_bid_price) {
                        $scope.error_max_bid_price = true;
                        $scope.show_error = true;
                        result.error = true;
                    }
                    if (+$scope.campaign_info.bid_price < $scope.on_bid_strategy) {
                        $scope.error_min_bid_price = true;
                        $scope.show_error = true;
                        result.error = true;
                    }
                    return result;
                }; // END buildCampaignTarget

                $scope.$watch(
                    "package.group_target_selected",
                    function handleParamChange(new_value,old_value) {
                        buildCampaignTarget();
                    }, true
                );

                $scope.$watch(
                    "ng_model_campaign_target",
                    function handleParamChange() {
                        buildParamForecastPerformance();
                    }, true
                )

                $scope.back = function() {
                    $rootScope.$broadcast('directive_call_show_step', {step:2, is_show:true});
                    $rootScope.$broadcast('call_back_left_nav_active_step', {step:2, is_show:true});
                };

                $scope.submitStepThree = function() {
                    $scope.save_click = true;
                    $scope.is_error = true;
                    var data = buildCampaignTarget();
                    if(!data.error) {
                        $rootScope.$broadcast('submit_final_step', data);
                    }
                };
            },
            link: function($scope, element, $attrs, ngModel) {
            }
        };
    });

});