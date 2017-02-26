/**
 * Created by nhanva on 6/14/2016.
 */
define(['app'], function (app) {
    app.directive(
        'adxCampaignBreadcumb', [
        function () {
            return {
                restrict: 'E',
                replace: false,
                scope: {
                    title: '=',
                    options: '=?'
                },
                controller: ['$scope', '$stateParams', '$state', 'LineItemInfo', 'CampaignInfo', 'Auth', 'Session',
                    '$rootScope', 'AUTH_EVENTS', '$filter', 'appConfig', 'PrivateStorage', 'APP_EVENTS',
                    function ($scope, $stateParams, $state, LineItemInfo, CampaignInfo, Auth, Session, $rootScope,
                              AUTH_EVENTS, $filter, appConfig, PrivateStorage, APP_EVENTS) {
                        // Get Line item name
                        var getLineItemInfo = function (id, callback) {
                            // Get Line item info
                            LineItemInfo.get({id: id}, function (result) {
                                if (result.code == 200 && result.data) {
                                    callback(result.data)
                                } else {
                                    callback(null)
                                }
                            })
                        };

                        // Get campaign info
                        var getCampaignInfo = function (campaignId, callback) {
                            if(!campaignId){
                                callback(null);
                            }
                            // Get Line item info
                            CampaignInfo.get({id: campaignId, columns: 'LINEITEM_ID'}, function (result) {
                                if (result.code == 200 && result.data) {
                                    callback(result.data)
                                } else {
                                    callback(null)
                                }
                            })
                        };

                        // Build breadcumb list line item
                        var breadcumbLineItem = function () {
                            if (Session.user.user_id != Auth.supportUser().user_id) {
                                $scope.breadcumbTitle = 'All Line Items: ';
                                $scope.targetName = Auth.supportUser().full_name;
                            } else {
                                $scope.breadcumbTitle = '';
                                $scope.targetName = 'All Line Items ';
                            }

                        };

                        // Breadcumb for line item detail
                        var breadcumbLineItemDetail = function () {
                            var titleLineItem = 'All Line Items';
                            if (Auth.supportUser().user_id != Session.user.user_id && Auth.supportUser().role == appConfig.USER_ROLES.BUYER) {
                                titleLineItem += ': ' + Auth.supportUser().full_name;
                            }
                            var arrTmp = $scope.arrBreadcumd.filter(function (item) {
                                return item.key == 'lineitem'
                            });
                            if (arrTmp.length) {
                                arrTmp[0].name = titleLineItem;
                            } else {
                                $scope.arrBreadcumd.push({
                                    name: titleLineItem,
                                    link: 'campaigns.lineitem',
                                    key: 'lineitem',
                                    param: {}
                                });
                            }

                            $scope.breadcumbTitle = 'Line Item:';
                            // Get Line item info
                            if ($stateParams.lineitem_id) {
                                getLineItemInfo($stateParams.lineitem_id, function (liInfo) {
                                    if (liInfo) {
                                        $scope.targetName = liInfo.lineitem_name;
                                    }
                                })
                            }

                            // Listen event to update line item name
                            $scope.$on(APP_EVENTS.breadcumb.showBreadcumb, function(event, args){
                                if(args && args.type == 'line-item-detail' && args.name){
                                    $scope.targetName = args.name;
                                }
                            })
                        };

                        // Build breadcumb all label
                        var breadcumbLabelList = function () {
                            if (Auth.supportUser().role == appConfig.USER_ROLES.BUYER) {
                                $scope.breadcumbTitle = '';
                                $scope.targetName = 'Label';
                            }

                        };

                        // Build breadcumb all report
                        var breadcumbReportList = function () {
                            if (Auth.supportUser().role == appConfig.USER_ROLES.BUYER) {
                                $scope.breadcumbTitle = '';
                                $scope.targetName = 'Report';
                            }

                        };

                        // Build breadcumb campaign detail
                        var breadcumbCampaignDetail = function () {
                            var titleLineItem = 'All Line Items';
                            if (Auth.supportUser().user_id != Session.user.user_id && Auth.supportUser().role == appConfig.USER_ROLES.BUYER) {
                                titleLineItem += ': ' + Auth.supportUser().full_name;
                            }
                            $scope.arrBreadcumd.push({
                                name: titleLineItem,
                                link: 'campaigns.lineitem',
                                key: 'lineitem',
                                param: {}
                            });
                            $scope.arrBreadcumd.push({
                                name: '',
                                link: 'campaigns.lineitem.detail.campaign',
                                key: 'campaign',
                                param: {lineitem_id: 0}
                            });

                            $scope.breadcumbTitle = 'Campaign: ';

                            getCampaignInfo($stateParams.campaign_id, function (camInf) {
                                if (camInf) {
                                    $scope.targetName = camInf.campaign_name;

                                    // Get detail lineitem from lineitem id
                                    if (camInf.lineitem_id != undefined) {
                                        getLineItemInfo(camInf.lineitem_id, function (liInfo) {
                                            if (liInfo.lineitem_name != undefined) {
                                                var breadCumb = $filter('filter')($scope.arrBreadcumd, {key: 'campaign'})
                                                if (breadCumb.length) {
                                                    breadCumb[0].name = liInfo.lineitem_name;
                                                    breadCumb[0].param.lineitem_id = liInfo.lineitem_id;
                                                }
                                            }

                                        })
                                    }

                                }
                            });

                        };

                        // Build breadcumb share library
                        var breadcumbShareLibraryAudiences = function () {
                            // if(Auth.supportUser().role == appConfig.USER_ROLES.BUYER) {
                            //     $scope.breadcumbTitle = '';
                            //     $scope.targetName = 'New remarketing list';
                            // }

                            $scope.breadcumbTitle = '';
                            $scope.targetName = 'New remarketing list';
                            if($state.current.name == 'campaigns.library.audience'){
                                $scope.targetName = 'Audiences';
                            }
                            if($state.current.name == 'campaigns.library.audience.edit' && $scope.title != undefined){
                                $scope.breadcumbTitle = 'Remarketing list : ';
                                $scope.targetName = $scope.title;
                            }
                            if (Auth.supportUser().user_id != Session.user.user_id && Auth.supportUser().role == appConfig.USER_ROLES.BUYER) {
                                $scope.arrBreadcumd.push({
                                    name: Auth.supportUser().full_name,
                                    link: 'accounts',
                                    key: 'buyer',
                                    param: {user_id: Auth.supportUser().user_id}
                                });
                            }

                            $scope.arrBreadcumd.push({
                                name: 'Shared library',
                                link: 'campaigns.library',
                                key: 'library',
                                param: {}
                            });

                            $scope.arrBreadcumd.push({
                                name: 'Audience',
                                link: 'campaigns.library.audience',
                                key: 'audience',
                                param: {}
                            });

                        };

                        // Build tree relative
                        var buildTreeUserRelative = function (arrRelativeUser) {
                            if (!arrRelativeUser) {
                                arrRelativeUser = PrivateStorage.read('tree-user-support');
                            }
                            if (!arrRelativeUser) {
                                return;
                            }
                            var arrTmp = $scope.arrBreadcumd;
                            var total = arrRelativeUser.length;
                            if (total) {

                                var arrFound = $filter('filter')(arrTmp, {key: 'support'});
                                if (arrFound && arrFound.length) {
                                    for (var i = 0; i < arrFound.length; i++) {
                                        arrTmp.splice(arrTmp.indexOf(arrFound[i]), 1);
                                    }
                                }

                                for (var index = total - 1; index >= 0; index--) {
                                    arrTmp.unshift({
                                        name: arrRelativeUser[index].full_name,
                                        link: 'accounts',
                                        param: {user_id: arrRelativeUser[index].user_id},
                                        key: 'support',
                                        user: arrRelativeUser[index]
                                    })
                                }
                            }
                        };
                        $scope.arrBreadcumd = [];
                        if (Session.user && Auth.supportUser().user_id != Session.user.user_id) {
                            buildTreeUserRelative();
                        }
                        switch ($state.current.name) {
                            // Line item detail
                            case 'campaigns.lineitem.detail.campaign':
                            case 'campaigns.lineitem.detail.setting':
                            case 'campaigns.lineitem.detail.creative':
                            case 'campaigns.lineitem.detail.target.add':
                            case 'campaigns.lineitem.detail.target.summary':
                            case 'campaigns.lineitem.detail.target.topic':
                            case 'campaigns.lineitem.detail.target.section':
                            case 'campaigns.lineitem.detail.target.audience':
                            case 'campaigns.lineitem.detail.target.demographic.age':
                            case 'campaigns.lineitem.detail.target.demographic.gender':
                                breadcumbLineItemDetail();

                                break;
                            case 'campaigns.campaign.detail.creative':
                            case 'campaigns.campaign.detail.setting':
                            case 'campaigns.campaign.detail.target.add':
                            case 'campaigns.campaign.detail.target.summary':
                            case 'campaigns.campaign.detail.target.topic':
                            case 'campaigns.campaign.detail.target.section':
                            case 'campaigns.campaign.detail.target.audience':
                            case 'campaigns.campaign.detail.target.demographic.age':
                            case 'campaigns.campaign.detail.target.demographic.gender':
                                breadcumbCampaignDetail();

                                break;
                            case 'campaigns.lineitem':
                            case 'campaigns.campaign':
                            case 'campaigns.setting':
                            case 'campaigns.creative':
                            case 'campaigns.dimension':
                            case 'campaigns.target.add':
                            case 'campaigns.target.summary':
                            case 'campaigns.target.topic':
                            case 'campaigns.target.section':
                            case 'campaigns.target.audience':
                            case 'campaigns.target.demographic.age':
                            case 'campaigns.target.demographic.gender':
                                breadcumbLineItem();
                                break;
                            case 'campaigns.label':
                                breadcumbLabelList();
                                break;
                            case 'report':
                                breadcumbReportList();
                                break;
                            case 'campaigns.library.audience':
                            case 'campaigns.library.audience.create':
                            case 'campaigns.library.audience.edit':
                                // TODO - Add breadcumb for library audiences
                                breadcumbShareLibraryAudiences();
                                break;
                            case 'report.create':
                            case 'report.detail':
                            case 'report.detail.predefined':
                                var titleLineItem = 'All Reports';
                                if (Auth.supportUser().user_id != Session.user.user_id && Auth.supportUser().role == appConfig.USER_ROLES.BUYER) {
                                    titleLineItem += ': ' + Auth.supportUser().full_name;
                                }
                                $scope.arrBreadcumd.push({
                                    name: titleLineItem,
                                    link: 'report',
                                    key: 'report',
                                    param: {}
                                });
                                $scope.targetName = 'Unsaved report';

                                if($state.current.name == 'report.detail'){
                                    // Listen event to update report name
                                    var listenFnc = $scope.$on(APP_EVENTS.breadcumb.showBreadcumb, function(event, args){
                                        if(args && args.type == 'report' && args.name){
                                            $scope.targetName = args.name;
                                            listenFnc(); // Unwatch listen
                                        }
                                    })
                                }

                                break;
                            case 'campaigns.creative.edit':
                                var viewBy = $state.params.view_by ? +$state.params.view_by : 0;
                                if (viewBy == 0) {
                                    breadcumbLineItem();
                                } else if (viewBy == 5) {
                                    if ($scope.options) {
                                        if ($scope.options.lineitem_id) {
                                            getLineItemInfo($scope.options.lineitem_id, function (liInfo) {
                                                console.log('liInfoliInfo', liInfo);
                                                if (liInfo) {
                                                    $scope.targetName = liInfo.lineitem_name;
                                                }
                                            })
                                        }
                                    }
                                    breadcumbLineItemDetail();
                                } else if (viewBy == 10) {

                                    if ($scope.options && $scope.options.campaign_id) {
                                        $stateParams.campaign_id = $scope.options.campaign_id;
                                    }

                                    breadcumbCampaignDetail();

                                }
                                break;

                        }

                        $scope.goTo = function (info) {
                            // Change ro user login
                            if (info.key == 'loggin') {
                                // Broadcast event to update user
                                $rootScope.$broadcast(AUTH_EVENTS.selectSupportUser, {
                                    user: Session.user,
                                    broadcast: false
                                });
                            } else if (info.key == 'support') {
                                // User display on breadcumb always support user
                                info.user.role = appConfig.USER_ROLES.SUPPORT;

                                // Broadcast event to update user
                                $rootScope.$broadcast(AUTH_EVENTS.selectSupportUser, {
                                    user: info.user,
                                    broadcast: false
                                });
                            }
                            // Go to page
                            $state.go(info.link, info.param);
                        };

                        $scope.$on(AUTH_EVENTS.changeSupportUser, function (event, args) {
                            switch ($state.current.name) {
                                case 'campaigns.lineitem':
                                    breadcumbLineItem();
                                    break;
                                case 'campaigns.lineitem.detail.campaign':
                                    breadcumbLineItemDetail();
                                    break;
                            }

                            if (args) {
                                var itemLogin = $filter('filter')($scope.arrBreadcumd, {key: 'loggin'})
                                    , itemSupport = $filter('filter')($scope.arrBreadcumd, {key: 'support'})
                                    ;

                                if (args.role == appConfig.USER_ROLES.BUYER) {
                                    // User support, hide breadcumb user
                                    if (itemLogin[0]) {
                                        itemLogin[0].name = '';
                                    }
                                    if (itemSupport[0]) {
                                        itemSupport[0].name = '';
                                    }
                                } else {

                                    var mustAddUser = Auth.supportUser().user_id != Session.user.user_id

                                    // User buyer, show breadcumb user
                                    if (itemSupport[0]) {
                                        itemSupport[0].name = Auth.supportUser().full_name;
                                    } else {
                                        // User support was not add to breadcumb
                                        if (mustAddUser && Auth.supportUser().role == 1) {
                                            $scope.arrBreadcumd.unshift({
                                                name: Auth.supportUser().full_name,
                                                link: 'accounts',
                                                param: {user_id: Auth.supportUser().user_id},
                                                key: 'support'
                                            });
                                        }
                                    }
                                    if (itemLogin[0]) {
                                        itemLogin[0].name = Session.user.full_name;
                                    } else {
                                        // User login was not add to breadcumb
                                        if (mustAddUser) {
                                            $scope.arrBreadcumd.unshift({
                                                name: Session.user.full_name,
                                                link: 'accounts',
                                                param: {user_id: Session.user.user_id},
                                                key: 'loggin'
                                            });
                                        }
                                    }

                                }
                            }
                        });

                        $scope.$on(AUTH_EVENTS.changeParentUser, function (event, args) {
                            buildTreeUserRelative(args.parent);
                        });


                    }],
                templateUrl: '/js/modules/operation/templates/breadcrumb.html?v=' + ST_VERSION
            }
        }
    ])
})