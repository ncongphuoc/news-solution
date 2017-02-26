/**
 * Created by truchq on 27/07/2016.
 */
define(['app','modules/operation/services/search', 'modules/operation/services/lineitem', 'shared/directive/common'], function (app) {
    app.directive('dropDownLineItemCampaign', function (Search, LineItemInfo, $timeout,  $stateParams, Find) {
        return {
            restrict: 'EC',
            replace: true,
            scope: {
                selected_model_object: "=selectedModelObject",
                ng_model: "=ngModel",
                action: "&action",
                type: "@type"
            },
            controller: ['$scope', '$rootScope', '$filter','$timeout', 'Modal', 'RemarketingInfo', 'APP_EVENTS', function ($scope, $rootScope, $filter, $timeout, Modal, RemarketingInfo, APP_EVENTS) {
                $scope.selected_campaigns = [];
                $scope.flag_add_to_campaign_btn = false;

                // Show modal add to campaign shared library
                $scope.showPopupAddToCampaign = function () {
                    var add_to_campaign = Modal.showModal(
                        {
                            actionText: 'Save',
                            closeText: 'Close',
                            onAction: function(){
                                // Do action and call api
                                var select_campaign_id_arr = [];
                                var select_remarketing_id_arr = [];

                                angular.forEach($scope.selected_model_object, function (value, index) {
                                    select_remarketing_id_arr.push(value.remarketing_id);
                                });

                                angular.forEach($scope.selected_campaigns, function (value, index) {
                                    select_campaign_id_arr.push(value.campaign_id);
                                });

                                // Reset data popup
                                $scope.selected_campaigns = [];
                                $scope.campaigns = [];
                                $scope.search_server = '';

                                RemarketingInfo.create({
                                    campaign_id: select_campaign_id_arr,
                                    remarketing_id: select_remarketing_id_arr
                                }, function (resp) {
                                    if(resp.code == 200) {
                                        Modal.showModal({
                                            headerText: 'Success',
                                            closeText: 'Close',
                                            bodyText: 'Your changes have been made.',
                                            onCancel: function(){
                                                $rootScope.$broadcast(APP_EVENTS.reloadGrid, {});
                                            }
                                        });
                                    }
                                    else {
                                        Modal.showModal({
                                            closeText: 'Close',
                                            headerText: 'Error',
                                            bodyText: 'Your change was not applicable to any of the selected rows. No changes have been made.'
                                        });
                                    }
                                });
                            }, onCancel: function(){
                                // Reset data popup
                                $scope.search_server = '';
                                $scope.selected_campaigns = [];
                                $scope.campaigns = [];
                            }
                        },
                        {
                            templateUrl: 'adx-shared-lib-add-to-campaign.html',
                            scope: $scope
                        }
                    );
                };

                // Add unselected campaign to selected campaign
                $scope.addCampaign = function (campaign) {
                    var index = $scope.campaigns.findIndex(function (ele) {
                        return ele.campaign_id === campaign.campaign_id;
                    });

                    if(index >= 0) {
                        $scope.campaigns[index].selected = true;
                    }

                    campaign.selected = true;
                    $scope.selected_campaigns.push(campaign);
                };

                // Remove selected campaign to unselected campaign
                $scope.removeCampaign = function (campaign) {
                    var idx = $scope.selected_campaigns.findIndex(function (ele) {
                        return ele.campaign_id == campaign.campaign_id;
                    });
                    if(idx >= 0) {
                        $scope.selected_campaigns.splice(idx, 1);
                    }

                    var idx1 = $scope.campaigns.findIndex(function (ele) {
                        return ele.campaign_id == campaign.campaign_id;
                    });
                    if(idx1 >=0) {
                        $scope.campaigns[idx1].selected = false;
                    }
                };

                // Watch selected_model_object variable to enable or disable add_to_campaign button
                $scope.$watch('selected_model_object', function (newVal, oldVal) {
                    if($scope.type == 'shared_lib_add_campaign') {
                        // Show hide button add to campaign
                        if($scope.selected_model_object.length == 0) {
                            $scope.flag_add_to_campaign_btn = false;
                        }
                        else {
                            for(var i = 0; i < $scope.selected_model_object.length; i++) {
                                if(Number($scope.selected_model_object[i].status) == 0 || Number($scope.selected_model_object[i].status) == 2) {
                                    $scope.flag_add_to_campaign_btn = false;
                                    break;
                                }
                                if(Number($scope.selected_model_object[i].status) == 1) {
                                    $scope.flag_add_to_campaign_btn = true;
                                }
                            }
                        }
                    }
                });

                // Load more lineitem when scroll to end
                $scope.jqueryScrollbarLineItemOptions = {
                    "onScroll": function (y, x) {
                        if(y.maxScroll != 0) {
                            if(y.scroll == y.maxScroll) {
                                $scope.loadMoreRecords();
                            }
                        }
                    }
                }

            }],
            link: function (scope, element, attrs, ctrl) {
                scope.state_params = $stateParams;
                scope.total_lineitem = 0;
                scope.campaigns = [];

                scope.lineitems = [];
                scope.params = {
                    object: 'lineitems',
                    limit: 20,
                    page: 1,
                    fields: "lineitem_id,lineitem_name,ads_id,package_id"
                };

                scope.loadMoreRecords = function () {
                    if(attrs.type == 'shared_lib_add_campaign') {
                        angular.element('.popup-brand-7').find('.inner-left .warp-table-L .loading').css('display', 'block');
                    }
                    else {
                        angular.element('.dropdown-choose-two').find('.inner-left .loading').css('display','block');
                    }
                    if(angular.isDefined(scope.search_server)) {
                        if(scope.search_server == '') {
                            scope.params.page++;
                            if(attrs.type == 'shared_lib_add_campaign') {
                                if(typeof scope.params.must == 'undefined') {
                                    scope.params.must = {"package_id":{"equals":"0"}};
                                }
                                Find.getList(scope.params, function (resp) {
                                    angular.forEach(resp.data.rows, function (object) {
                                        scope.lineitems.push(object);
                                    });
                                    scope.total_lineitem = resp.data.line_item_not_package;
                                    angular.element('.popup-brand-7').find('.inner-left .warp-table-L .loading').css('display', 'none');
                                });
                            } else {
                                if(typeof scope.params.must != 'undefined') {
                                    delete scope.params.must;
                                }
                                Find.getList(scope.params, function (resp) {
                                    angular.forEach(resp.data.rows, function (object) {
                                        scope.lineitems.push(object);
                                    });
                                    scope.total_lineitem = resp.data.total;
                                    angular.element('.dropdown-choose-two').find('.inner-left .loading').css('display','none');
                                });
                            }
                        }
                        else {
                            scope.params.search = scope.search_server;
                            scope.params.page++;
                            if(attrs.type == 'shared_lib_add_campaign') {
                                if(typeof scope.params.must == 'undefined') {
                                    scope.params.must = {"package_id":{"equals":"0"}};
                                }
                                Find.getList(scope.params, function (resp) {
                                    angular.forEach(resp.data.rows, function (object) {
                                        scope.lineitems.push(object);
                                    });
                                    scope.total_lineitem = resp.data.line_item_not_package;
                                    angular.element('.popup-brand-7').find('.inner-left .warp-table-L .loading').css('display', 'none');
                                });
                            } else {
                                if(typeof scope.params.must != 'undefined') {
                                    delete scope.params.must;
                                }
                                Find.getList(scope.params, function (resp) {
                                    angular.forEach(resp.data.rows, function (object) {
                                        scope.lineitems.push(object);
                                    });
                                    scope.total_lineitem = resp.data.total;
                                    angular.element('.dropdown-choose-two').find('.inner-left .loading').css('display','none');
                                });
                            }
                        }
                    }
                    else {
                        if(attrs.type == 'shared_lib_add_campaign') {
                            if(typeof scope.params.must == 'undefined') {
                                scope.params.must = {"package_id":{"equals":"0"}};
                            }
                            Find.getList(scope.params, function (resp) {
                                angular.forEach(resp.data.rows, function (object) {
                                    scope.lineitems.push(object);
                                });
                                scope.total_lineitem = resp.data.line_item_not_package;
                                angular.element('.popup-brand-7').find('.inner-left .warp-table-L .loading').css('display', 'none');
                            });
                        } else {
                            if(typeof scope.params.must != 'undefined') {
                                delete scope.params.must;
                            }
                            Find.getList(scope.params, function (resp) {
                                angular.forEach(resp.data.rows, function (object) {
                                    scope.lineitems.push(object);
                                });
                                scope.total_lineitem = resp.data.total;
                                angular.element('.dropdown-choose-two').find('.inner-left .loading').css('display','none');
                            });
                        }
                    }

                };
                scope.loadMoreRecords();
                scope.getCampaign = function ($event,lineitem) {
                    var index = scope.lineitems.indexOf(lineitem);
                    if (scope.lineitems[index].list_campaign == undefined) {
                        if(attrs.type == 'shared_lib_add_campaign') {
                            angular.element('.popup-brand-7').find('.inner-left .warp-table-R .loading').css('display', 'block');
                        }
                        else {
                            angular.element($event.target).parents('.dropdown-choose-two').find('.inner-right .loading').css('display','block');
                        }
                        LineItemInfo.get({
                            fields: 'campaign_id, campaign_name',
                            id: lineitem.lineitem_id,
                            object: 'campaign'
                        }, function (resp) {
                            if (index != -1) {
                                scope.lineitems[index].list_campaign = resp.data;
                                scope.campaigns = resp.data;
                            }
                            if(attrs.type == 'shared_lib_add_campaign') {
                                angular.forEach(scope.campaigns, function (value, index) {
                                    value.lineitem_name = lineitem.lineitem_name;
                                    value.selected = false;
                                });
                                angular.element('.popup-brand-7').find('.inner-left .warp-table-R .loading').css('display', 'none');
                            }
                            else {
                                angular.element($event.target).parents('.dropdown-choose-two').find('.inner-right .loading').css('display','none');
                            }
                        });
                    }
                    else {
                        scope.campaigns = scope.lineitems[index].list_campaign;
                        if(attrs.type == 'shared_lib_add_campaign') {
                            angular.forEach(scope.campaigns, function (value, index) {
                                var idx = scope.selected_campaigns.findIndex(function (ele) {
                                    return ele.campaign_id == value.campaign_id;
                                });
                                if(idx >= 0) {
                                    value.selected = true;
                                }
                                else {
                                    value.selected = false;
                                }
                            });
                        }
                    }
                };
                var getCampaign = function(lineitem_id){
                    LineItemInfo.get({
                        fields: 'campaign_id, campaign_name',
                        id: lineitem_id,
                        object: 'campaign'
                    }, function (resp) {
                         scope.campaigns = resp.data;
                    });
                };
                if($stateParams.lineitem_id){
                    getCampaign($stateParams.lineitem_id);
                }
                scope.selectedCampaign = function (campaign) {
                    scope.auto_close = 'disabled';
                    scope.is_open = false;
                    scope.ng_model = campaign;
                    scope.action({object:campaign});
                };
                scope.onToggle = function(){
                    if(scope.is_open){
                        scope.auto_close = 'outsideClick';
                        scope.search_server = '';
                        if(!$stateParams.lineitem_id){
                            scope.campaigns = [];
                        }
                    }
                };
                scope.search_server = '';
                var search_server_text_timeout;
                scope.$watch(
                    "search_server",
                    function valueChange(new_val,old_value) {
                        if(new_val != old_value){
                            if(attrs.type == 'shared_lib_add_campaign') {
                                angular.element('.popup-brand-7').find('.inner-left .warp-table-L .loading').css('display', 'block');
                            }
                            else {
                                angular.element('.dropdown-choose-two').find('.inner-left .loading').css('display','block');
                            }
                            if (scope.search_server != undefined) {
                                if (scope.search_server == '') {
                                    if(angular.isDefined(scope.params.search)) {
                                        delete scope.params.search;
                                    }
                                    scope.lineitems = [];
                                    scope.params.page = 1;
                                    if(attrs.type == 'shared_lib_add_campaign') {
                                        if(typeof scope.params.must == 'undefined') {
                                            scope.params.must = {"package_id":{"equals":"0"}};
                                        }
                                        Find.getList(scope.params, function (resp) {
                                            angular.forEach(resp.data.rows, function (object) {
                                                scope.lineitems.push(object);
                                            });
                                            scope.total_lineitem = resp.data.line_item_not_package;
                                            angular.element('.popup-brand-7').find('.inner-left .warp-table-L .loading').css('display', 'none');
                                        });
                                    } else {
                                        if(typeof scope.params.must != 'undefined') {
                                            delete scope.params.must;
                                        }
                                        Find.getList(scope.params, function (resp) {
                                            angular.forEach(resp.data.rows, function (object) {
                                                scope.lineitems.push(object);
                                            });
                                            scope.total_lineitem = resp.data.total;
                                            angular.element('.dropdown-choose-two').find('.inner-left .loading').css('display','none');
                                        });
                                    }
                                } else {
                                    scope.lineitems = [];
                                    if (search_server_text_timeout) $timeout.cancel(search_server_text_timeout);
                                    search_server_text_timeout = $timeout(function() {
                                        //get data
                                        // var params_search = angular.copy(scope.params);
                                        scope.params.page = 1;
                                        scope.params.search = scope.search_server;

                                        if(attrs.type == 'shared_lib_add_campaign') {
                                            if(typeof scope.params.must == 'undefined') {
                                                scope.params.must = {"package_id":{"equals":"0"}};
                                            }
                                            Find.getList(scope.params, function (resp) {
                                                angular.forEach(resp.data.rows, function (object) {
                                                    scope.lineitems.push(object);
                                                });
                                                scope.total_lineitem = resp.data.line_item_not_package;
                                                angular.element('.popup-brand-7').find('.inner-left .warp-table-L .loading').css('display', 'none');
                                            });
                                        } else {
                                            if(typeof scope.params.must != 'undefined') {
                                                delete scope.params.must;
                                            }
                                            Find.getList(scope.params, function (resp) {
                                                angular.forEach(resp.data.rows, function (object) {
                                                    scope.lineitems.push(object);
                                                });
                                                scope.total_lineitem = resp.data.total;
                                                angular.element('.dropdown-choose-two').find('.inner-left .loading').css('display','none');
                                            });
                                        }
                                    }, 550); // delay 550 ms
                                }
                            }
                        }
                    }
                );
            },
            templateUrl: function(elem, attrs) {
                var template_url = '';
                switch (attrs.type) {
                    case 'shared_lib_add_campaign':
                        template_url = '/js/modules/operation/templates/shared/popUpAddCampaign.html?v=' + ST_VERSION;
                        break;
                    default:
                        template_url = '/js/modules/operation/templates/shared/dropDownLineItemCampaign.html?v=' + ST_VERSION;
                        break;
                }
                return template_url;
            }
        }
    });
});