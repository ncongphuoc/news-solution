/**
 * Created by nhanva on 4/19/2016.
 */
define(['angular', 'shared/services/user', 'shared/services/search'], function (angular) {
    angular.module('app.root', ['app.user', 'app.search']).controller('systemRootController',
        ['$scope', '$rootScope', 'AUTH_EVENTS', 'Auth', '$uibModal', 'appConfig', 'User', '$filter', '$timeout',
            'PrivateStorage', 'Search', '$state', 'APP_EVENTS',
            function ($scope, $rootScope, AUTH_EVENTS, Auth, $uibModal, appConfig, User, $filter, $timeout, PrivateStorage,
                      Search, $state, APP_EVENTS) {
                var _promiseAccountSearch;

                // Variable
                $scope.ST_HOST = appConfig.ST_HOST;
                $scope.ROLE_SUPPORT = appConfig.USER_ROLES.SUPPORT;
                $scope.ROLE_BUYER = appConfig.USER_ROLES.BUYER;

                $scope.supportUser = Auth.supportUser();
                $scope.autoCloseLefNav = false; // Auto collapse sub left nav when collapse left menu
                $scope.showSubLeftNav = false; // FLag sub lef nav show or hide
                $scope.originalShowSubLeftNav = false; // FLag restore show left nav
                $scope.searchAccountError = false;

                // Loading indicator
                $rootScope.showLoading = false;

                var showLoginDialog = function () {
                    console.log('Show login')

                };

                var showNotAuthorized = function () {
                    alert("Not Authorized");
                };

                // Get support user
                if ($scope.isAuthenticated) {
                    // Get list support user
                    User.getSupported({type: 'support', 'manager': true}, function (response) {
                        $scope.arrSupportUser = response.data.account;
                        $scope.arrRecentUser = response.data.recent;
                    });
                }

                // PUBLIC
                // Toggle nav bar
                $scope.collapseNavbar = function (val) {
                    if(val == true){
                        $scope.autoCloseLefNav = true;
                        // Auto set toggle sub menu
                        if($scope.showSubLeftNav == true){
                            $scope.showSubLeftNav = false;
                            $scope.originalShowSubLeftNav = true;
                        }
                    }else{
                        if($scope.originalShowSubLeftNav == true){
                            $scope.showSubLeftNav = true;
                        }
                    }



                    return $scope.toggleNavbar = val;
                };

                var _showLevEditNav = function(){
                    if($state.is('campaigns.lineitem.create') || $state.is('campaigns.campaign.create') || $state.is('campaigns.creative.create')
                        || $state.is('campaigns.creative.edit')
                    ){
                        return false;
                    }
                    return true;
                };

                $scope.getToggleNavbar = function (val) {
                    if(!_showLevEditNav()){
                        return false;
                    }
                    return $scope.toggleNavbar;
                };

                $scope.getNavbarClass = function (value) {
                    if(!_showLevEditNav()){
                        return '';
                    }
                    return value ? 'sidebar-mini' : '';
                };

                $scope.collapseAllLineItem = function ($event) {
                    var css = '';
                    if($scope.autoCloseLefNav == true){
                        $scope.autoCloseLefNav = false;
                    }
                    // Toggle line item
                    $scope.showSubLeftNav = !$scope.showSubLeftNav;

                    // Add border top or bottom
                    if ($scope.showSubLeftNav) {
                        css = '<style id="pseudo">.left-nav > li .btn-collapse:after{border-top:none;border-bottom:6px solid #666}</style>';
                    } else {
                        css = '<style id="pseudo">.left-nav > li .btn-collapse:after{border-bottom:none;border-top:6px solid #666}</style>';
                    }
                    document.head.insertAdjacentHTML('beforeEnd', css);
                    $scope.$broadcast(APP_EVENTS.updateHeightLeft, {target: $event, toggle: $scope.showSubLeftNav});
                };

                // If info of userId is not loaded in client, get it from server
                var getAndChangeSupportUser = function (userId, broadcastEvent) {
                    broadcastEvent = broadcastEvent || false;
                    $rootScope.showLoading = true;
                    User.getList({type: 'parent', user_id: userId}, function (response) {
                        $rootScope.showLoading = false;
                        if (response.code == 200 && response.data.user_info) {
                            changeSupportUser(response.data.user_info, broadcastEvent);
                            $rootScope.$broadcast(APP_EVENTS.lineItem.updateSubMenu, {is_buyer: response.data.user_info.role == appConfig.USER_ROLES.BUYER});
                        } else {
                            console.log('CAN NOT GET USER SUPPORT');
                            return $state.transitionTo('unauthorize', {user_id: Session.user? Session.user.user_id : null,code: appConfig.UN_AUTHORIZE.SUPPORT});
                        }

                    })
                };

                // Show left menu or not
                $scope.hasLeftNav = function () {
                    return $state.is('report') || $state.is('buyer') || $state.is('login') || $state.is('monitoring');
                };

                $scope.containerCus = function () {
                    if($state.is('report') || $state.is('report.create') || $state.is('report.detail') ||
                        $state.is('report.detail.predefined')){
                        return '';
                    }else{
                        return 'container-cus';
                    }
                };

                $scope.formatUserId = function (userId) {
                    if (!userId || !userId.length) {
                        return '';
                    } else {
                        userId = userId.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
                        return userId;
                    }
                };

                $scope.currentUser = null;
                $scope.isAuthenticated = Auth.isAuthenticated;
                $scope.isAuthorized = Auth.isAuthorized;
                $scope.showLoginDialog = showLoginDialog;

                // Listen to events of unsuccessful logins, to run the login dialog
                $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (event, args) {
                    $rootScope.currentUser = null;
                    $scope.currentUser = null;
                });

                // Listen event user login success to update menu
                $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event, args) {
                    // Assign user received from event
                    $scope.currentUser = args.user;
                    $rootScope.currentUser = $scope.currentUser;
                });

                // Monitor Auth change
                $scope.$watch(function () {
                        return Auth.isAuthenticated();
                    },
                    function (newVal, oldVal) {
                        $scope.isAuthenticated = newVal;
                        $scope.currentUser = $rootScope.currentUser;
                        if ($scope.isAuthenticated) {
                            // Get list support user
                            User.getSupported({type: 'support', 'manager': true}, function (response) {
                                var arrUser = response.data.account;

                                $scope.arrSupportUser = arrUser;
                                $scope.arrRecentUser = response.data.recent;

                            });
                            $scope.supportUser = Auth.supportUser();
                        }
                    }, true
                );

                // Public function allow user change support user. Ex: Call when user click detail line item
                $rootScope.changeSupportUser = function (userId, broadcastEvent) {
                    // Change user support if it has diff
                    if ($scope.supportUser.user_id != userId) {
                        // Find user id in list support user
                        var arrUser = $filter('filter')($scope.arrSupportUser, {user_id: userId});
                        if (arrUser && arrUser.length) {
                            changeSupportUser(arrUser[0], broadcastEvent);
                        } else {
                            getAndChangeSupportUser(userId, broadcastEvent)
                        }
                    }
                };


                // Common function to change support user
                var changeSupportUser = function (user, broadcastEvent) {
                    if ($scope.supportUser.user_id != user.user_id) {
                        Auth.changeSupportUser(user);
                        $scope.supportUser = user;
                    }

                    if (broadcastEvent) {
                        $scope.$broadcast(AUTH_EVENTS.changeSupportUser, user);
                    }

                    //update recent user
                    User.getSupported({type: 'recent', user_id: user.user_id}, function (response) {
                        $scope.arrRecentUser = response.data.recent;
                        PrivateStorage.write('tree-user-support', response.data.parent || []);
                        $rootScope.$broadcast(AUTH_EVENTS.changeParentUser, {parent: response.data.parent});
                    });
                };

                // Listen event from tree account
                $scope.$on(AUTH_EVENTS.selectSupportUser, function (params, args) {
                    changeSupportUser(args.user, args.broadcast);
                });

                $timeout(function () {
                    //Storage.clean();
                }, 10000, false);

                $scope.searchAccount = function (value) {

                    var height = angular.element('.account-tree-wrapper').height();
                    angular.element('.search-account-wrapper').height(height - 30);

                    if (value != '') {
                        angular.element('.search-account-wrapper').show();
                        angular.element('.search-account-wrapper').find('.loading').fadeIn();
                        var search_params = {
                            search: value,
                            object: 'users',
                            limit: 100,
                            all: true,
                            type: 'account_tree'
                        };

                        // Cancel request if it was not finished
                        if(_promiseAccountSearch ){
                            _promiseAccountSearch.$cancelRequest();
                        }

                        _promiseAccountSearch = Search.getList(search_params);

                        _promiseAccountSearch.$promise.then(function(resp){
                            if (resp.data && resp.data.length) {
                                $scope.searchAccountError = false;
                                $scope.arrSearch = resp.data;

                            }else{
                                $scope.searchAccountError = true;
                            }

                            angular.element('.search-account-wrapper').find('.loading').fadeOut();

                            _promiseAccountSearch = null;
                        });
                    } else {
                        angular.element('.search-account-wrapper').hide();
                    }
                };

                // Change support user when user change dropdown support
                $scope.changeSupportUser = function (user) {
                    changeSupportUser(user, true);
                };

                // Checking object existing
                $rootScope.checkingObject = function(){
                    if($state.includes('campaigns.lineitem.detail')){
                        Search.detailLineItem({id: +$state.params.lineitem_id}, function(result){
                            if(result && result.code == 200 && !result.data){
                                $state.go('campaigns.lineitem', {user_id: $state.params.user_id})
                                return;
                            }
                        })
                    }else if($state.includes('campaigns.campaign.detail')){
                        Search.detailCampaign({id: +$state.params.campaign_id}, function(result){
                            if(result && result.code == 200 && !result.data){
                                $state.go('campaigns.lineitem', {user_id: $state.params.user_id})
                                return;
                            }
                        })
                    }
                }

                // Check only buyer can usage action
                // Redirect to page operation
                $rootScope.checkBuyerOnly = function(){
                    var supportUser = Auth.supportUser() || {};
                    if(supportUser.role != appConfig.USER_ROLES.BUYER){
                        console.log('This action allowed only buyer');
                        $state.go('campaigns.lineitem', {user_id: supportUser.user_id})
                        return false;
                    }
                    return true;
                }
            }]
        )
        .directive('collection', function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    collection: '=',
                    buyerOnly: '=?', // Can choose buyer
                    onSelectUser: '&?' // Custom function when click choose user
                },
                link: function (scope, element, attrs) {
                },
                template: "<ul class='sub'><member ng-repeat='member in collection' member='member' collection='collection' buyer-only='buyerOnly' on-select-user='onSelectUser()'></member></ul>"
            };
        })
        .directive('member', function ($compile, $rootScope, AUTH_EVENTS, Auth, User, $state, appConfig) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    member: '=',
                    collection: '=',
                    buyerOnly: '=?', // Can choose buyer
                    onSelectUser: '&?' // Custom function when click choose user
                },
                template: "<li ng-class='{\"has-child\":member.has_child, open:member.root, loaded:member.root, root_account:member.root}'>" +
                "<div class='heading'>" +
                "<strong ng-click='showSupportedUser(member, $event)'></strong>" +
                "<span ng-click='changeUser(member)'><a href=''>{{ member.full_name }}</a></span>" +
                "<a ng-click='changeUser(member)' href=''>{{ formatUserId(member.user_id) }}</a>" +
                "<div class='loading'><div class='loading-icon'></div></div>" +
                "</div>" +
                "<div class='li-border'></div>" +
                "</li>",
                link: function (scope, element, attrs) {
                    if (angular.isArray(scope.member.children)) {
                        element.append("<collection collection='member.children' buyer-only='buyerOnly' on-select-user='onSelectUser()'></collection>");
                        $compile(element.contents())(scope);
                    }

                    scope.supportUser = Auth.supportUser();

                    scope.showSupportedUser = function (user, $event) {
                        $event.stopImmediatePropagation();

                        if (!element.hasClass('loaded')) {
                            element.find('.loading').show();
                        }

                        if (element.hasClass('open')) {
                            element.removeClass('open');
                            element.find('.sub').first().hide();
                            element.find('.loading').hide();
                        } else {
                            if (element.hasClass('loaded')) {
                                element.find('.sub').first().show();
                            } else {
                                User.getSupported({type: 'support', user_id: user.user_id}, function (response) {
                                    scope.children = response.data.account;

                                    var content = $compile("<collection collection='children' buyer-only='buyerOnly' on-select-user='onSelectUser()'></collection>")(scope);
                                    element.append(content);

                                    element.addClass('loaded');
                                    element.find('.loading').hide();
                                });
                            }

                            element.addClass('open');
                        }
                    };

                    // Change support user when user change dropdown support
                    scope.changeUser = function (user) {

                        // Not allow choose user support
                        if (appConfig.USER_ROLES.SUPPORT == user.role && scope.buyerOnly) {
                            return;
                        }
                        // Check choose the same user
                        if (Auth.supportUser().user_id != user.user_id) {
                            // Call callback when choose buyer
                            if (scope.buyerOnly) {
                                $rootScope.$broadcast(AUTH_EVENTS.selectSupportUser, {user: user, broadcast: false});
                                scope.onSelectUser();
                            } else {
                                var broadcast = true;//$state.is('campaigns.lineitem') || $state.is('accounts');
                                $rootScope.$broadcast(AUTH_EVENTS.selectSupportUser, {
                                    user: user,
                                    broadcast: broadcast
                                });
                                if (Auth.supportUser().role == appConfig.USER_ROLES.SUPPORT) {
                                    //$state.go('accounts', {user_id: Auth.supportUser().user_id})
                                    $state.go('campaigns.lineitem', {user_id: Auth.supportUser().user_id});
                                } else {
                                    $state.go('campaigns.lineitem', {user_id: Auth.supportUser().user_id});
                                }
                            }
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
                }
            };
        });
});