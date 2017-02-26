/**
 * Created by nhanva on 4/28/2016.
 */
define(['app', 'shared/directive/common',
    'libs/icheck/icheck', 'shared/directive/segmentDropDown',
    'shared/directive/dropdown-column',
    'modules/operation/directives/editAction'], function (app) {
    app.directive('filterbottom',
        function ($timeout, debounce, Column, $state, appConfig, AUTH_EVENTS, $rootScope, Segment, $location, Modal, Auth, Storage, Search, $http) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    data: '=',
                    dataSource: '=datasource',
                    filter: '&filter',
                    params: '=params',
                    typeitem: '=typeitem',
                    idmodalcolumn: '=idmodalcolumn',
                    selectedObject: '=?'
                },
                require: ["filterbottom", "^operations"],
                link: function (scope, element, attrs, ctrl) {

                    //show button create campaign, creative
                    scope.showCreateMenu = true;
                    if (scope.typeitem) {
                        switch (scope.typeitem) {
                            case appConfig.TYPE_TARGET_TOPIC:
                            case appConfig.TYPE_TARGET_AUDIENCE:
                            case appConfig.TYPE_TARGET_SECTION:
                            case appConfig.TYPE_TARGET_GENDER:
                            case appConfig.TYPE_TARGET_AGE:
                                scope.showCreateMenu = false;
                                break;
                        }
                    }

                    ctrl[1].registerFilterBottom(ctrl[0]);
                    // Show label with user is buyer
                    var showLabel = function () {
                        scope.showLabel = (Auth.supportUser() && Auth.supportUser().role == appConfig.USER_ROLES.BUYER) ? true : false;
                    };

                    showLabel();
                    scope.show_label_dropdown = false;

                    if ($.inArray(+scope.typeitem, appConfig.SHOW_LABEL_DROPDOWN) != -1) {
                        scope.show_label_dropdown = true;
                    }

                    // Update param on url
                    var updateUrl = debounce(function (param) {

                        // Make default param
                        // c: Column, m: Metric, mvs: Metric compare, q: Search, s: Segment, t: Time
                        var urlParam = angular.extend({
                            c: null,
                            m: null,
                            mvs: null,
                            q: null,
                            s: null,
                            t: null
                        }, $location.search(), param)
                        $location.search(urlParam)
                    }, 500, false);

                    var init = function () {
                        // Get param from url
                        var params = $location.search();

                        // Get column and segment from url
                        if (typeof scope.params.column == 'undefined') {
                            if (params.c != 1000) {
                                scope.params.column = params.c;
                            }
                            else {
                                scope.params.column = '';
                            }
                        }

                        if (params.s != undefined) {
                            ctrl[1].renderGrid({segment: params.s, fc: 'segment'});
                        }
                    };

                    init();

                    scope.dataSource = {
                        status: {
                            group1: [
                                {value: 'Enable', key: '1001', class: 'enable'},
                                {value: 'Pause', key: '1001', class: 'pause'},
                                {value: 'Remove', key: '1001', class: 'remove'}
                            ],
                            group2: [
                                {value: 'Change budgets...', key: '2001'},
                                {value: 'Copy', key: '2002'},
                                {value: 'Paste...', key: '2003'}
                            ],
                            group3: [
                                {value: 'Download spreadsheet...', key: '3001'},
                                {value: 'Upload spreadsheet...', key: '3002'}
                            ],
                            group4: [
                                {value: 'Recent bulk edits', key: '3003'}
                            ]
                        },
                        auction: [
                            {value: 'Selected', key: '1001', group_name: 'AUCTION INSIGHTS'},
                            {value: 'All', key: '1002'}
                        ],
                        strategy: [
                            {value: 'Change bid strategy', key: '1001'},
                            {value: 'Manage flexible bid strategies...', key: '1002'}
                        ],
                        rule: {
                            group1: [
                                {
                                    value: 'Change daily budget when...',
                                    key: '9001',
                                    group_name: 'CREATE RULE FOR CAMPAIGNS'
                                },
                                {value: 'Pause campaigns when...', key: '9002'},
                                {value: 'Enable campaigns when...', key: '9003'},
                                {value: 'Send email when...', key: '9005'},
                                {value: 'Change bid strategy', key: '1001'},
                                {value: 'Change bid strategy', key: '1001'}
                            ],
                            group2: [
                                {
                                    value: 'Create rule for ad groups', key: '7001', child: [
                                    {value: 'Option A', key: '7002'},
                                    {value: 'Option B', key: '7003'},
                                ]
                                },
                                {
                                    value: 'Create rule for ad groups', key: '7001', child: [
                                    {value: 'Option A', key: '7004'},
                                    {value: 'Option B', key: '7005'},
                                ]
                                }
                            ],
                            group3: [
                                {value: 'Manage rules', key: '9006'},
                                {value: 'Create and manage scripts', key: '9007'}
                            ]
                        },
                        label: {
                            action: [
                                {value: 'Create new', key: '9009', is_show: true},
                                {value: 'Manage labels', key: '9010', is_show: true},
                                {value: 'Apply', key: '9011', is_show: false}
                            ],
                            list: []
                        },
                        columns: {
                            current: [
                                {value: 'Modify columns...', key: '1000'}
                            ],
                            custom: {
                                name: 'Your saved columns',
                                child: []
                            },
                            defined: {
                                name: 'Pre-defined column sets',
                                child: []
                            }
                        }
                    };

                    if (scope.source != undefined) {
                        angular.extend(scope.dataSource, scope.source)
                    }
                    //angular.extend(scope.dataSource, tmp);

                    var debouncedSearch = debounce(function () {
                        scope.filter();
                    }, 300, false);

                    // Change status
                    scope.changeStatus = function (value) {
                        scope.params.time = value
                    }

                    // Change Auction
                    scope.changeAuction = function (value) {
                        scope.params.auction = value
                    }

                    // Change segment
                    scope.changeColumn = function (value, values_mod, mod_name, mod_type, type) {
                        scope.params.column = value;
                        if ((scope.params.column == '' || scope.params.column == value) && value == 1000) {

                            scope.filter();
                        } else {
                        }

                        // Update url
                        updateUrl({c: value})
                    }

                    // Change strategy
                    scope.changeStrategy = function (value) {
                        scope.params.strategy = value
                    }

                    // Time
                    scope.changeTime = function (value) {
                        scope.params.time = value
                    }
                    // Change rule
                    scope.changeRule = function (value) {
                        scope.params.rule = value;
                    }
                    // Watch value change
                    scope.$watch(
                        "params",
                        function handleParamChange(newValue, oldValue) {
                            if (newValue.segment != oldValue.segment) {
                                scope.filter();
                            } else {
                                debouncedSearch();
                            }
                        }, true
                    );
                    scope.$watch(
                        "scope.source",
                        function handleParamChange(newValue, oldValue) {
                            angular.extend(scope.dataSource, scope.source);
                        }, true
                    );
                    // Show or hide dropdown Label by role of support user
                    scope.$on(AUTH_EVENTS.changeSupportUser, function (event, args) {
                        showLabel();
                    });


                },
                controller: function ($scope, $element, $attrs) {

                },
                templateUrl: '/js/modules/operation/templates/filterBottom.html?v=' + ST_VERSION
            }
        });

    app.directive('adxCampaignCreator', function ($timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: ['$scope', '$state', 'debounce', '$http', 'appConfig', 'Auth', 'Modal', 'CampaignInfo', 'LineItemType', 'Find',
                function ($scope, $state, debounce, $http, appConfig, Auth, Modal, CampaignInfo, LineItemType, Find) {
                    $scope.lineItemname = '';
                    $scope.isOpen = false;
                    $scope.arrLineItem = {rows: [], total: 0}
                    $scope.arrLineCampaign = [];
                    $scope.objectId = 0; // LineItemId, campaignId
                    $scope.loadMore = false; // Show loading when search line item
                    $scope.loadDetail = false; // Show loading when get campaign of line item
                    $scope.ownerLineItem = null; // Keep owner of selected lineitem to change to support user
                    $scope.selectedLineItemId = 0; // Selected lineitem
                    var LIMIT = 20, selectedLineItem;
                    $scope.offsetCampaign = 0;
                    $scope.offsetLineItem = 0;
                    $scope.totalCampaign = 0;

                    var promiseSearchLineItem = null, promiseGetListCamp = null;


                    $scope.isBuyer = Auth.supportUser().role == appConfig.USER_ROLES.BUYER;

                    // Get list campaign of line item
                    $scope.getCampaign = function (lineitem) {
                        var searchParams = {
                            limit: 20,
                            offset: $scope.offsetCampaign > 0 ? $scope.offsetCampaign: 0,
                            object: 'campaigns',
                            fields:'campaign_id,campaign_name,lineitem_name,ads_id,status'
                        }
                        if(lineitem){
                            var lineItenId = lineitem.lineitem_id ? lineitem.lineitem_id : lineitem;
                            if (lineitem.ads_id) {
                                $scope.ownerLineItem = lineitem.ads_id;
                            }
                            searchParams.must = [{"LINEITEM_ID":{"equals": lineItenId}}]
                            selectedLineItem = lineitem
                            $scope.selectedLineItemId = lineItenId;
                        }else{
                            //searchParams.object_search = 'lineitems';
                            searchParams.search = $scope.lineItemname;
                            selectedLineItem = null
                        }
                        if(!$scope.selectedLineItemId && !$scope.lineItemname){
                            return;
                        }

                        if(promiseGetListCamp){
                            promiseGetListCamp.$cancelRequest();
                        }
                        promiseGetListCamp = Find.getList(searchParams);
                        promiseGetListCamp.$promise.then(function (result) {
                            if (result.data && result.data.rows) {
                                if (!result.data.rows.length) {
                                    // No campaign to load
                                    $scope.offsetCampaign = 0;
                                    $scope.arrLineCampaign = [];
                                    $scope.totalCampaign = 0;
                                } else {
                                    if ($scope.offsetCampaign == 0) {
                                        $scope.arrLineCampaign = result.data.rows;
                                    } else {
                                        angular.forEach(result.data.rows, function (item) {
                                            $scope.arrLineCampaign.push(item);
                                        })
                                    }
                                    $scope.totalCampaign = result.data.total;
                                }


                            } else {
                                $scope.arrLineCampaign = [];
                                $scope.totalCampaign = 0;
                            }
                            promiseGetListCamp = null;
                            //$scope.loadDetail = false;
                        });
                    }

                    $scope.loadMoreCampaign = function () {
                        if ($scope.offsetCampaign == -1) {
                            return;
                        }
                        $scope.offsetCampaign += 20;
                        $scope.getCampaign($state.params.lineitem_id)
                    }

                    if ($state.is('campaigns.lineitem') || $state.is('campaigns.setting')) {
                        $scope.name = 'line items';
                        $scope.cssClass = 'line-item-type';
                        $scope.autoClose = 'outsideClick'
                        $scope.arrMenu = appConfig.AVAIL_NETWORK;

                        // Only get package when support user is buyer.
                        if (Auth.supportUser().role == appConfig.USER_ROLES.BUYER) {
                            LineItemType.getList({type: 'lineitem-type'}).$promise.then(function (result) {
                                if (result && result.code == 200 && result.data) {
                                    var arrTmp = []
                                    angular.forEach(result.data, function (item) {
                                        arrTmp.push({
                                            name: item.lineitem_type_name,
                                            id: item.lineitem_type_id,
                                            value: item.lineitem_type_id
                                        })
                                    })
                                    $scope.arrMenu = arrTmp
                                }
                            })
                        }

                    } else if ($state.is('campaigns.campaign') || $state.is('campaigns.lineitem.detail.campaign')) {
                        $scope.name = 'campaigns';
                        $scope.cssClass = 'campaign-type';
                        $scope.arrMenu = [];
                        $scope.autoClose = 'outsideClick'
                        $scope.objectId = $state.params.lineitem_id || 0;
                    } else if ($state.is('campaigns.lineitem.detail.creative')) {
                        // At page line item detail, tab creative. Get list campaign of current creative to show
                        $scope.name = 'creatives';
                        $scope.cssClass = 'lineitem-detail-creative-type';
                        $scope.autoClose = 'outsideClick'
                        $scope.arrLineCampaign = []
                        $scope.getCampaign($state.params.lineitem_id)
                    } else if ($state.is('campaigns.campaign.detail.creative')) {
                        // At page campaign detail, tab creative. Go to creative when click Add
                        $scope.name = 'creatives';
                        $scope.cssClass = 'campaign-detail-creative-type';
                        $scope.autoClose = 'outsideClick'
                        $scope.arrLineCampaign = []
                        $scope.objectId = $state.params.campaign_id || 0;
                    } else {
                        $scope.name = 'creatives';
                        $scope.cssClass = 'creative-type';
                        $scope.autoClose = 'disabled'
                    }

                    // Menu create campaign
                    $scope.onSelectLineItem = function (lineItem) {
                        goToCreatePage(lineItem.lineitem_id)
                    }
                    $scope.getLineItem = function (val) {

                        $scope.loadMore = true;
                        if(promiseSearchLineItem){
                            promiseSearchLineItem.$cancelRequest();
                        }
                        promiseSearchLineItem = Find.getList({search: val, object: 'lineitems', limit: LIMIT, offset: $scope.offsetLineItem, fields:'lineitem_id,lineitem_name,ads_id,status'});

                        promiseSearchLineItem.$promise.then(function(response) {
                            $scope.loadMore = false;
                            var objResult = angular.copy($scope.arrLineItem)
                            if (response.code == 200) {
                                // When lazy load, append to result
                                if($scope.offsetLineItem){
                                    angular.forEach(response.data.rows, function(row){
                                        objResult.rows.push(row);
                                    })
                                }else{
                                    objResult = response.data
                                }

                                $scope.arrLineItem = objResult;
                            }
                            promiseSearchLineItem = null;
                        });

                    };

                    // Action on menu create.
                    // If current support user is buyer, go to page create
                    // If current support user is support, show popup to allow user choose buyer.
                    $scope.createAction = function (link) {
                        // When user support is buyer
                        if (Auth.supportUser().role == appConfig.USER_ROLES.BUYER) {
                            goToCreatePage(link);
                        } else {
                            // Show popup to choose user buyer
                            Modal.showModal({}, {
                                templateUrl: 'adx-choose-buyer.html',
                                controller: ['$scope', '$rootScope', 'User', '$uibModalInstance', 'Search', 'appConfig', 'AUTH_EVENTS',
                                    function (scope, rootScope, User, $uibModalInstance, Search, appConfig, AUTH_EVENTS) {
                                        scope.options = {};
                                        // Action ok
                                        scope.options.ok = function (result) {
                                            $uibModalInstance.close(result);
                                            goToCreatePage(link);
                                        };

                                        scope.onSelectUser = function (user) {
                                            scope.options.ok();
                                        };

                                        // Action cancel
                                        scope.options.close = function (result) {
                                            $uibModalInstance.dismiss('cancel');
                                        };
                                        scope.arrSupportUser = [];
                                        scope.showLoading = true;
                                        scope.searchAccountError = false;
                                        User.getSupported({type: 'filter', 'manager': true}, function (response) {
                                            scope.searchAccountError = response.data.account.length ? false : true;

                                            scope.arrSupportUser = response.data.account;
                                            scope.showLoading = false;
                                        });
                                        // Selected search user
                                        scope.changeUser = function (user) {
                                            rootScope.$broadcast(AUTH_EVENTS.selectSupportUser, {
                                                user: user,
                                                broadcast: false
                                            });
                                            // Close popup
                                            scope.onSelectUser();
                                        };

                                        // Search buyer
                                        var _promiseAccountSearch;
                                        scope.searchAccount = function (search) {
                                            if (search != '') {
                                                var search_params = {
                                                    search: search,
                                                    object: 'users',
                                                    limit: 100,
                                                    all: true,
                                                    type: 'account',
                                                    role: appConfig.USER_ROLES.BUYER
                                                };
                                                scope.showLoading = true;

                                                // Cancel request if it was not finished
                                                if(_promiseAccountSearch ){
                                                    _promiseAccountSearch.$cancelRequest();
                                                }

                                                // Call search api
                                                _promiseAccountSearch = Search.getList(search_params);

                                                _promiseAccountSearch.$promise.then(function(resp){
                                                    scope.searchAccountError =  resp.data.length ? false : true;

                                                    // Check error
                                                    if (resp && resp.code == 200) {
                                                        var arrResult = [];
                                                        angular.forEach(resp.data, function (item) {
                                                            arrResult.push({
                                                                full_name: item.full_name,
                                                                role: item.role,
                                                                user_id: item.user_id
                                                            })
                                                        });

                                                        scope.arrSearch = arrResult;
                                                    } else {
                                                        scope.arrSearch = []
                                                    }

                                                    scope.showLoading = false;

                                                    _promiseAccountSearch = null;
                                                });
                                            }

                                        };

                                        scope.formatUserId = function (userId) {
                                            if (!userId || !userId.length) {
                                                return '';
                                            } else {
                                                userId = userId.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
                                                return userId;
                                            }
                                        };
                                    }]
                            });
                        }
                    };

                    $scope.closeDropdown = function () {
                        $scope.isOpen = false;
                        // #A3-355: Reset search name
                        $scope.lineItemname = '';
                        $scope.arrLineCampaign = [];
                    };

                    // On select campaign, go to page create creative
                    $scope.onSelectCampaign = function (campaignId) {
                        goToCreatePage(campaignId)
                    };

                    // Go to create page
                    var goToCreatePage = function (id) {
                        var userId;
                        if ($scope.ownerLineItem) {
                            userId = $scope.ownerLineItem;
                        } else {
                            userId = Auth.supportUser().user_id;
                        }
                        if ($state.is('campaigns.lineitem') || $state.is('campaigns.setting')) {
                            return $state.go('campaigns.lineitem.create', {network_type: id, user_id: userId})
                        } else if ($state.is('campaigns.campaign')) {
                            return $state.go('campaigns.campaign.create', {lineitemId: id, user_id: userId})
                        } else {
                            return $state.go('campaigns.creative.create', {campaignId: id, user_id: userId})
                        }

                    };

                    $scope.$watch('lineItemname', function (newVal, oldVal) {
                        debounce(function (val) {
                            $scope.offsetLineItem = 0;
                            $scope.offsetCampaign = 0;
                            $scope.selectedLineItemId = 0;
                            $scope.getLineItem(val);
                            $scope.getCampaign()
                        }, 500, false)(newVal)
                    });

                    $scope.checkToggle = function (open) {
                        if ($scope.cssClass == 'campaign-type' && $scope.objectId) {
                            return $state.go('campaigns.campaign.create', {lineitemId: $scope.objectId})
                        } else if ('campaign-detail-creative-type' == $scope.cssClass && $scope.objectId) {
                            return $state.go('campaigns.creative.create', {campaignId: $scope.objectId})
                        }
                    }

                    $scope.jScrollLineItemOptions = {
                        "onScroll": function (y, x) {
                            if (y.maxScroll > 0 && y.scroll >= y.maxScroll) {
                                $scope.offsetLineItem += LIMIT;
                                $scope.getLineItem($scope.lineItemname);
                            }
                        }
                    }
                    $scope.jScrollCampaignOptions = {
                        "onScroll": function (y, x) {
                            if (y.maxScroll > 0 && y.scroll >= y.maxScroll) {
                                $scope.offsetCampaign += LIMIT;
                                $scope.getCampaign(selectedLineItem);

                            }
                        }
                    }
                }],
            link: function (scope, element) {
                scope.offsetCampaign = 0;
                scope.onToggle = function (open) {
                    var input = angular.element('input[name="line-item-name"]', element);
                    if (open) {
                        input.focus()
                        input.trigger("input")
                    } else {
                        input.val('')
                    }
                }

                scope.updateScrollbar = function(){
                    $timeout(function(){
                        element.find('div.list-camppaign').perfectScrollbar('destroy')
                        //element.perfectScrollbar();
                    }, 100);
                }

                var removeClass = function(){
                    element.find('div.list-campaign').removeClass('auto-height')
                }

                var addClass = function(){
                    var el =element.find('div.list-campaign')
                    if(!el.hasClass('auto-height')){
                        el.addClass('auto-height')
                    }
                }

                // Watch lineItemname to add/remove auto height
                var watchFunc = {name: scope.$watch('lineItemname', function(newVal, odlVal){
                    if(newVal){
                        removeClass()
                    }else{
                        if(!scope.selectedLineItemId){
                            addClass();
                        }

                    }
                })};
                watchFunc.id =  scope.$watch('selectedLineItemId', function(newVal, odlVal){
                    if(newVal){
                        removeClass()
                    }else{
                        if(!scope.lineItemname){
                            addClass();
                        }

                    }
                })
            },
            templateUrl: '/js/modules/operation/templates/createMenu.html?v=' + ST_VERSION
        }
    })
});