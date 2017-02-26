/**
 * Created by truchq on 4/25/2016.
 */
define(['app', 'modules/operation/services/campaign', 'modules/operation/services/campaign',
    'modules/operation/services/creative'], function (app) {
    app.directive('linkGrid', ['appConfig', '$state', 'CampaignInfo', 'LineItemInfo', 'CreativeInfo', 'Modal',
        '$rootScope', 'APP_EVENTS', 'ReportInfo',
        function (appConfig, $state, CampaignInfo, LineItemInfo, CreativeInfo, Modal, $rootScope, APP_EVENTS, ReportInfo) {
            return {
                restrict: 'E',
                scope: {
                    type: '=',
                    data: '=',
                    column_name: '=columnName',
                    grid_options: '=option',
                    index: '=',
                    disable_edit:'=disableEdit'
                },
                link: function (scope, element, attrs, ctrl) {
                    var RENAME_CAMPAIGN = 6;
                    var showModal = function (msg) {
                        msg = msg || 'Error has occured when update'
                        Modal.showModal({
                            bodyText: msg,
                            type:'warning'
                        })
                    };
                    scope.config = {};
                    scope.object_name = angular.copy(scope.data[scope.column_name]);
                    switch (scope.column_name) {
                        case 'lineitem_name':
                            //get link
                            switch (scope.type) {
                                case appConfig.TYPE_TARGET_SECTION:
                                    scope.routeName = 'campaigns.lineitem.detail.target.section'
                                    scope.routeParams = {lineitem_id: scope.data.lineitem_id}
                                    break;
                                case appConfig.TYPE_TARGET_TOPIC:
                                    scope.routeName = 'campaigns.lineitem.detail.target.topic'
                                    scope.routeParams = {lineitem_id: scope.data.lineitem_id}
                                    break;
                                case appConfig.TYPE_TARGET_AUDIENCE:
                                    scope.routeName = 'campaigns.lineitem.detail.target.audience'
                                    scope.routeParams = {lineitem_id: scope.data.lineitem_id}
                                    break;
                                case appConfig.TYPE_TARGET_GENDER:
                                    scope.routeName = 'campaigns.lineitem.detail.target.demographic.gender'
                                    scope.routeParams = {lineitem_id: scope.data.lineitem_id}
                                    break;
                                case appConfig.TYPE_TARGET_AGE:
                                    scope.routeName = 'campaigns.lineitem.detail.target.demographic.age'
                                    scope.routeParams = {lineitem_id: scope.data.lineitem_id}
                                    break;
                                case appConfig.TYPE_SETTING:
                                    scope.routeName = 'campaigns.lineitem.detail.setting'
                                    scope.routeParams = {
                                        user_id: scope.data.ads_id,
                                        lineitem_id: scope.data.lineitem_id
                                    };
                                    break;
                                default:
                                    scope.routeName = 'campaigns.lineitem.detail.campaign'
                                    scope.routeParams = {
                                        user_id: scope.data.ads_id,
                                        lineitem_id: scope.data.lineitem_id
                                    }
                            }
                            //config params update name
                            scope.config = {
                                object: LineItemInfo,
                                params: {
                                    id: scope.data.lineitem_id
                                }
                            };
                            break;
                        case 'campaign_name':
                            //get link
                            switch (scope.type) {
                                case appConfig.TYPE_TARGET_SECTION:
                                    scope.routeName = 'campaigns.campaign.detail.target.section'
                                    scope.routeParams = {campaign_id: scope.data.campaign_id}
                                    break;
                                case appConfig.TYPE_TARGET_TOPIC:
                                    scope.routeName = 'campaigns.campaign.detail.target.topic'
                                    scope.routeParams = {campaign_id: scope.data.campaign_id}
                                    break;
                                case appConfig.TYPE_TARGET_AUDIENCE:
                                    scope.routeName = 'campaigns.campaign.detail.target.audience'
                                    scope.routeParams = {campaign_id: scope.data.campaign_id}
                                    break;
                                case appConfig.TYPE_TARGET_GENDER:
                                    scope.routeName = 'campaigns.campaign.detail.target.demographic.gender'
                                    scope.routeParams = {campaign_id: scope.data.campaign_id}
                                    break;
                                case appConfig.TYPE_TARGET_AGE:
                                    scope.routeName = 'campaigns.campaign.detail.target.demographic.age'
                                    scope.routeParams = {campaign_id: scope.data.campaign_id}
                                    break;
                                default:
                                    scope.routeName = 'campaigns.campaign.detail.creative'
                                    scope.routeParams = {
                                        campaign_id: scope.data.campaign_id
                                    }
                            }
                            //config params update name
                            scope.config = {
                                object: CampaignInfo,
                                params: {
                                    id: scope.data.campaign_id,
                                    case_update: RENAME_CAMPAIGN
                                }
                            };
                            break;
                        case 'full_name':
                            switch (scope.type) {
                                case appConfig.TYPE_METRIC_REPORT_FILTER_LISTING:
                                    scope.routeName = 'report'
                                    scope.routeParams = {user_id: scope.data.user_id}
                                    break;
                                case appConfig.TYPE_METRIC_REMARKETING:
                                    scope.template = 'template_1.html';
                                    scope.view_id = 'full_name';
                                    break;
                                default:
                                    scope.routeName = 'campaigns.lineitem'
                                    scope.routeParams = {user_id: scope.data.ads_id}
                            }
                            break;
                        case 'report_name':
                            scope.routeName = 'report.detail';
                            scope.routeParams = {report_id: scope.data.report_id};
                            //config params update name
                            scope.config = {
                                object: ReportInfo,
                                params: {
                                    id: scope.data.report_id
                                }
                            };
                            break;
                        case 'remarketing_name':
                            scope.routeName = 'campaigns.library.audience.edit';
                            scope.routeParams = {
                                remarketing_id: scope.data.remarketing_id
                            };
                            switch (scope.type) {
                                case appConfig.TYPE_METRIC_REMARKETING:
                                    scope.template = 'template_1.html';
                                    scope.view_id = 'object_list';
                                    break;
                            }
                            break;
                    }
                    scope.show_flag = '';
                    var getTemplate = function () {
                        scope.template_edit = 'box_edit.html';
                    };
                    scope.edit = function (column_name) {
                        getTemplate();
                        scope.show_flag = column_name;
                        scope.data['show_edit_name' + scope.column_name] = true;

                        $rootScope.$broadcast(APP_EVENTS.editNameObjectGrid, {
                            index: scope.index
                        });


                    };
                    scope.gotoPage = function (event) {
                        event.preventDefault();
                        var userId = scope.routeParams.user_id;
                        if (userId) {
                            // TODO: May check broadcast event change user support
                            /*
                             $rootScope.changeSupportUser(userId, true, function(){
                             console.log($state.href(scope.routeName, scope.routeParams))
                             })
                             */
                            $state.go(scope.routeName, scope.routeParams)
                        } else {
                            $state.go(scope.routeName, scope.routeParams)
                        }
                    };


                    scope.close = function () {
                        scope.data['show_edit_name' + scope.column_name] = false;
                    };
                    scope.save = function (object_name) {
                        if(scope.data[scope.column_name] != object_name){
                            scope.config.params[scope.column_name] = object_name;
                            scope.data['show_edit_name' + scope.column_name] = false;
                            Modal.process(scope.config.object.update(scope.config.params), {
                                onAction: function (res) {
                                    if (res.code == 200) {
                                        Modal.showModal({
                                            headerText: 'Success',
                                            closeText: 'Close',
                                            bodyText: 'Your changes have been made',
                                            type: 'success',
                                            onCancel: function(){
                                                //case reload grid
                                                switch (scope.type) {
                                                    case appConfig.TYPE_METRIC_REPORT_FILTER_LISTING:
                                                        $rootScope.$broadcast(APP_EVENTS.reloadGrid, {});
                                                        break;
                                                }
                                            }
                                        });
                                        scope.data[scope.column_name] = object_name;

                                    } else {
                                        /*switch (scope.type) {
                                            case appConfig.TYPE_METRIC_REPORT_FILTER_LISTING:
                                                $rootScope.$broadcast(APP_EVENTS.reloadGrid, {});
                                                break;
                                        }*/
                                        $rootScope.$broadcast(APP_EVENTS.reloadGrid, {});
                                        showModal(res.message);

                                    }
                                },
                                onError: function (error) {
                                    showModal();
                                }
                            })
                        }else{
                            scope.data['show_edit_name' + scope.column_name] = false;
                        }
                    }
                    scope.$on(APP_EVENTS.editNameObjectGrid, function (params, args) {
                        if (args.index != scope.index) {
                            scope.close();
                        }
                    });

                },
                controller: function ($scope, $element, $attrs) {
                },
                templateUrl: '/js/shared/templates/grid/plugin/linkGrid.html?v=' + ST_VERSION
            };
        }]);
});