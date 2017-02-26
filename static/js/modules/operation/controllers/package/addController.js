/**
 * @auhor: Code nay la cua Thephuc ^^
 * @since: 21/11/2016
 */
define(['app', 'modules/operation/services/package/package'], function (app) {
    app.controller('operationPackageAddController',
        ['$scope', '$rootScope', '$filter', 'appConfig', 'APP_EVENTS', 'Modal', 'ActionPackage', '$state', '$stateParams',
            function ($scope, $rootScope, $filter, appConfig, APP_EVENTS, Modal, ActionPackage, $state, $stateParams) {

                var current_date = $filter('date')(new Date(), 'dd/MM/yyyy');
                var showStepAvailable = function(step, status = true) {
                    switch(step) {
                        case 1:
                            $scope.is_show_step_1 = status;
                            $scope.is_show_step_2 = !status;
                            $scope.is_show_step_3 = !status;
                            break;
                        case 2:
                            $scope.is_show_step_1 = !status;
                            $scope.is_show_step_2 = status;
                            $scope.is_show_step_3 = !status;
                            break;
                        case 3:
                            $scope.is_show_step_1 = !status;
                            $scope.is_show_step_2 = !status;
                            $scope.is_show_step_3 = status;
                            break;
                        default:
                            break;
                    }
                }; // END showStepAvailable
                showStepAvailable(1);

                var initParams = function() {
                    // data step 1
                    $scope.params_step_one = {
                        package_name: '',
                        sale_price: 0,
                        buy_price: 0,
                        discount: 0,
                        bid_strategy: '1',
                        available_duration_from: current_date,
                        available_duration_to: current_date,
                        grant_permission: []//'1020103459', '1600000622'
                    };
                    // data step 2
                    $scope.params_step_two = {
                        locations_search: '',
                        locations_target: '',
                        placement: '',
                        create_scheduling: {},
                        device:{},
                        device_selected: '',
                        use_dynamic: 0,
                        create_delivery: {
                            option: 0,
                            freq_type: 1,
                            freq_opt: 1,
                            frequency: ''
                        }
                    };
                    // data step 3
                    $scope.params_step_three = {};
                }; // END initParams
                initParams();

                var getDataStepThree = function(search_key) {
                    var data = {};
                    angular.forEach($scope.params_step_three.group_target_selected, function(value, key) {
                        if(value.key === search_key) {
                            angular.forEach(value.ng_model.target, function(value2, key2) {
                                data[key2] = value2;
                            });
                        }
                    });
                    return data;
                }; // END getDataStepThree

                /*this function will receive all data and submit to server*/
                $rootScope.$on('submit_final_step', function(events, args) {
                    var list_os_id = '';
                    angular.forEach($scope.params_step_two.device.os_target, function(value, key) {
                        list_os_id += value.child.join() + ',';
                    });
                    var list_device_id = ($scope.params_step_two.device_selected === '1,2,3') ? '' : $scope.params_step_two.device_selected;
                    var params_total = {
                        package_name: $scope.params_step_one.package_name,
                        sale_price: $scope.params_step_one.sale_price,
                        buy_price: $scope.params_step_one.buy_price,
                        discount: $scope.params_step_one.discount,
                        payment_model: $scope.params_step_one.bid_strategy,//(bid strategy)
                        from_date: $scope.params_step_one.available_duration_from,
                        to_date: $scope.params_step_one.available_duration_to,
                        list_user_id: $scope.params_step_one.grant_permission.join(),//(grant permission)
                        list_location_id: $scope.params_step_two.locations_search,
                        list_device_id: list_device_id,
                        list_os_version_id: (list_device_id === '') ? '' : list_os_id.replace(/,+$/, ''),
                        list_carrier_id: (list_device_id === '') ? '' : $scope.params_step_two.device.carrier_target,
                        list_browser_id: (list_device_id === '') ? '' : $scope.params_step_two.device.browser_target,
                        list_placement_id: $scope.params_step_two.placement,
                        list_frame_time_id: ($scope.params_step_two.create_scheduling.time_frames !== undefined) ? $scope.params_step_two.create_scheduling.time_frames : '',
                        use_dynamic: $scope.params_step_two.use_dynamic,
                        frequency_number: ($scope.params_step_two.create_delivery.option == '1') ? $scope.params_step_two.create_delivery.frequency : '',
                        frequency_lifetime: ($scope.params_step_two.create_delivery.option == '1') ? $scope.params_step_two.create_delivery.freq_opt : '',
                        frequency_type: ($scope.params_step_two.create_delivery.option == '1') ? $scope.params_step_two.create_delivery.freq_type : '',
                        interest_marketing_id: getDataStepThree(18),
                        section_id: getDataStepThree(1),
                        topic_id: getDataStepThree(5),
                        demographic_id: getDataStepThree(13),
                    };

                    if(!params_total.package_name) return;

                    Modal.process(ActionPackage.create(params_total), {
                        onAction: function (res) {
                            if (res.code !== undefined && res.code === 200) {
                                // Show message create creative success
                                Modal.showModal({
                                    closeText: 'No',
                                    actionText: 'Yes',
                                    headerText: '',
                                    bodyText: 'Package creation successful. Do you want to create another package?',
                                    type: 'success',
                                    onAction: function(){
                                        initParams();
                                        $state.go($state.current, {}, {reload: true});
                                    },
                                    onCancel: function(){
                                        $state.go('operations.private-deal');
                                    }
                                })
                            } else {
                                Modal.show({'bodyText': res.message, 'headerText': 'Error', type: 'error'});
                            }
                        },
                        onError: function (error) {
                            Modal.show({'bodyText': error.message, 'headerText': 'Error', type: 'error'});
                        }
                    })

                }) // END submit_final_step

                /*Listen directive `formStepOne`, step one always available*/
                $rootScope.$on('directive_call_show_step', function(events, args) {
                    switch(args.step) {
                        case 1:
                            showStepAvailable(1, args.is_show);
                            $scope.step_2_available = false;
                            $scope.step_3_available = false;
                            break;
                        case 2:
                            showStepAvailable(2, args.is_show);
                            $scope.step_2_available = args.is_show;
                            $scope.step_3_available = false;
                            break;
                        case 3:
                            showStepAvailable(3, args.is_show);
                            $scope.step_3_available = args.is_show;
                            break;
                        default:
                            break;
                    }
                }) // directive_call_show_step

                /*Listen from leftnav*/
                $rootScope.$on('left_nav_call_show_step', function(events, args) {
                    if(typeof args.is_show === 'boolean') {
                        switch(args.step) {
                            case 1:
                                showStepAvailable(1, args.is_show);
                                $rootScope.$broadcast('call_back_left_nav_active_step', {step:1, is_show:true});
                                $scope.step_2_available = false;
                                $scope.step_3_available = false;
                                break;
                            case 2:
                                if($scope.step_2_available){
                                    showStepAvailable(2, args.is_show);
                                    $scope.step_3_available = false;
                                    $rootScope.$broadcast('call_back_left_nav_active_step', {step:2, is_show:true});
                                } else {
                                    $rootScope.$broadcast('call_back_left_nav_active_step', {step:2, is_show:false});
                                }
                                break;
                            case 3:
                                if($scope.step_3_available) {
                                    showStepAvailable(3, args.is_show);
                                    $rootScope.$broadcast('call_back_left_nav_active_step', {step:3, is_show:true});
                                } else {
                                    $rootScope.$broadcast('call_back_left_nav_active_step', {step:3, is_show:false});
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }) // left_nav_call_show_step

            }
        ]
    );
});