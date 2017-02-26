/**
 * Created by truchq on 4/25/2016.
 */
define(['app', 'modules/operation/services/campaign'], function (app) {
    app.directive('changeBid', ['appConfig', 'CampaignInfo', 'APP_EVENTS','$rootScope', 'Modal', function (appConfig, CampaignInfo, APP_EVENTS, $rootScope, Modal) {
        return {
            restrict: 'E',
            scope: {
                type: '=',
                data: '=',
                column_name: '=columnName'
            },
            link: function (scope, element, attrs, ctrl) {
                var TYPE_UPDATE_ENABLE_UPDATE_BID = 3,
                    CASE_UPDATE_BIDDING_PRICE = 2,

                    type_allow = [
                        appConfig.TYPE_TARGET_TOPIC, appConfig.TYPE_TARGET_SECTION,
                        appConfig.TYPE_TARGET_AUDIENCE
                    ];
                //appConfig.TYPE_TARGET_AGE,appConfig.TYPE_TARGET_GENDER
                scope.is_enable_custom_price = false;
                scope.is_edit_custom_price = false;
                if (type_allow.indexOf(scope.type) !== -1 && scope.data[scope.column_name] != '--' && scope.data.status_id != 0) {

                    if(+scope.data.is_custom_price == 0){
                        scope.is_enable_custom_price = true;
                    }
                    if((+scope.data.is_custom_price == 1 || +scope.data.is_custom_price == 2)){
                        scope.is_edit_custom_price = true;
                    }

                }

                //config get data
                switch (scope.type) {
                    case appConfig.TYPE_TARGET_TOPIC:
                        scope.private_key = 'topic_id';
                        scope.target_type = appConfig.TARGET_TOPIC;
                        break;
                    case appConfig.TYPE_TARGET_SECTION:
                        scope.private_key = 'section_id';
                        scope.target_type = appConfig.TARGET_WEBSITE;
                        break;
                    case appConfig.TYPE_TARGET_AGE:
                        scope.private_key = 'age_range_id';
                        scope.target_type = appConfig.TARGET_AGE;
                        break;
                    case appConfig.TYPE_TARGET_GENDER:
                        scope.private_key = 'gender_id';
                        scope.target_type = appConfig.TARGET_GENDER;
                        break;
                    case appConfig.TYPE_TARGET_AUDIENCE:
                        scope.private_key = 'audience_id';
                        //get type in audience
                        if(scope.data.type != undefined){
                            switch (+scope.data.type){
                                case appConfig.OBJ_LINK_TARGET_INTEREST:
                                    scope.target_type = appConfig.TARGET_INTEREST;
                                    break;
                                case appConfig.OBJ_LINK_TARGET_INMARKET:
                                    scope.target_type = appConfig.TARGET_INMARKET;
                                    break;
                                case appConfig.OBJ_LINK_TARGET_REMARKETING:
                                    scope.target_type = appConfig.TARGET_REMARKETING;
                                    break;
                            }
                        }
                        break;
                }
                scope.dismiss = function (data) {
                    data.dismiss = true;
                };
                scope.getEditTemplate = function(){
                    var template = '';
                    if(scope.is_enable_custom_price && scope.data.show_change_bid){
                        template = 'enable.html';
                    }
                    if(scope.is_edit_custom_price && scope.data.show_change_bid){
                        template = 'edit.html';
                    }
                    return template;
                };
                scope.enable = function (data) {
                    console.log('data',data);
                    data.dismiss = true;
                    var params = {
                        id: data.campaign_id,
                        target_id: data[scope.private_key],
                        target_type: scope.target_type,
                        case_update: TYPE_UPDATE_ENABLE_UPDATE_BID
                    };
                    Modal.process(CampaignInfo.update(params), {
                        onAction: function (res) {
                            if(res.code == 200){
                                Modal.showModal({
                                    headerText: 'Success',
                                    closeText: 'Close',
                                    bodyText: 'Your changes have been made.',
                                    onCancel: function(){
                                        $rootScope.$broadcast(APP_EVENTS.reloadGrid, {});
                                    },
                                    type: 'success'
                                });
                            } else {
                                Modal.showModal({
                                    closeText: 'Close',
                                    headerText: 'Error',
                                    bodyText: res.message || 'Your change was not applicable to any of the selected rows. No changes have been made.',
                                    type: 'error'
                                });
                            }
                        },
                        onError: function (error) {
                            Modal.showModal({
                                closeText: 'Close',
                                headerText: 'Error',
                                bodyText: 'Error occurred when save line item! Try again',
                                type: 'error'
                            })
                        },
                        delay: appConfig.DELAY_LOADING
                    });
                };
                scope.save = function (data) {
                    data.dismiss = true;
                    var params = {
                        id: data.campaign_id,
                        target_id: data[scope.private_key],
                        target_type: scope.target_type,
                        bid_price: +scope.bid_price,
                        payment_model: data.camp_payment_model,
                        case_update: CASE_UPDATE_BIDDING_PRICE
                    };
                    // Save location target
                    Modal.process(CampaignInfo.update(params), {
                        onAction: function (res) {
                            if(res.code == 200){
                                Modal.showModal({
                                    headerText: 'Success',
                                    closeText: 'Close',
                                    bodyText: 'Your changes have been made.',
                                    onCancel: function(){
                                        $rootScope.$broadcast(APP_EVENTS.reloadGrid, {});
                                    },
                                    type: 'success'
                                });
                            } else {
                                Modal.showModal({
                                    closeText: 'Close',
                                    headerText: 'Error',
                                    bodyText: res.message || 'Your change was not applicable to any of the selected rows. No changes have been made.',
                                    type: 'error'
                                });
                            }
                        },
                        onError: function (error) {
                            Modal.showModal({
                                closeText: 'Close',
                                headerText: 'Error',
                                bodyText: 'Error occurred when save line item! Try again',
                                type: 'error'
                            })
                        },
                        delay: appConfig.DELAY_LOADING
                    });
                }
            },
            controller: function ($scope, $element, $attrs) {

            },
            templateUrl: '/js/shared/templates/grid/plugin/changeBid.html?v=' + ST_VERSION
        };
    }]);
});