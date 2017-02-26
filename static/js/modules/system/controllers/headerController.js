/**
 * Created by nhanva on 4/19/2016.
 */
define(['app', "modules/operation/directives/allLineItems"], function (app) {
    app.controller('systemLeftController',
        ['$scope', '$rootScope', 'AUTH_EVENTS', 'Auth', '$uibModal', 'appConfig', '$state',
            function ($scope, $rootScope, AUTH_EVENTS, Auth, $uibModal, appConfig, $state) {
                $scope.static_url = appConfig.ST_HOST;

                $scope.supportUserId = Auth.supportUser() ? Auth.supportUser().user_id : null

                $scope.ROLE_SUPPORT = appConfig.USER_ROLES.SUPPORT
                $scope.ROLE_BUYER = appConfig.USER_ROLES.BUYER

                $scope.getActiveMenu = function () {
                    return $state.is('campaigns.lineitem') || $state.is('campaigns.campaign')
                        || $state.is('campaigns.setting') || $state.is('campaigns.creative')
                        || $state.is('campaigns.lineitem.create') || $state.is('campaigns.campaign.create')
                        || $state.is('campaigns.creative.create') || $state.is('campaigns.dimension')
                        || $state.includes('campaigns.lineitem.detail') || $state.includes('campaigns.campaign.detail')
                        || $state.includes('campaigns.target') || $state.includes('campaigns.campaign.detail.target');
                }
            }]
    );
    app.controller('systemHeaderController',
        ['$scope', '$rootScope', 'Auth', '$state', 'AUTH_EVENTS', 'appConfig',
            function ($scope, $rootScope, Auth, $state, AUTH_EVENTS, appConfig) {
                $scope.isOpenUserTree = false;

                $scope.supportUserId = Auth.supportUser() ? Auth.supportUser().user_id : null

                // Show support user
                $scope.showSupportUser = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.isOpenUserTree = !$scope.isOpenUserTree;
                };

                // Change user support from list recent or search
                $scope.changeUser = function (user) {
                    if (Auth.supportUser().user_id != user.user_id) {
                        $rootScope.$broadcast(AUTH_EVENTS.selectSupportUser, {user: user, broadcast: true});
                        if (Auth.supportUser().role == appConfig.USER_ROLES.SUPPORT) {
                            //$state.go('accounts', {user_id: Auth.supportUser().user_id})
                            $state.go('campaigns.lineitem', {user_id: Auth.supportUser().user_id});
                        } else {
                            $state.go('campaigns.lineitem', {user_id: user.user_id});
                        }
                    }
                }

                $scope.logOut = function () {
                    $rootScope.showLoading = true;
                    Auth.logout();
                    $state.go('login');
                }

                // Close tree user when user click
                $scope.$on(AUTH_EVENTS.selectSupportUser, function (params, args) {
                    $scope.isOpenUserTree = false;
                });

                // Listen support user id change to active menu
                $scope.$on(AUTH_EVENTS.changeSupportUser, function (event, args) {
                    $scope.supportUserId = Auth.supportUser() ? Auth.supportUser().user_id : null
                })
            }]
    );

    app.controller('systemUnAuthorizeController',
        ['$scope', '$rootScope', 'Auth', '$state', 'AUTH_EVENTS', 'appConfig',
            function ($scope, $rootScope, Auth, $state, AUTH_EVENTS, appConfig) {
                var arrMessage = {}, code = $state.params.code || 0;
                arrMessage[0] = {message: 'You are not authorize', title: '403 Forbidden'};
                arrMessage[1] = {message: "You don't have permission to support client", title: '403 Forbidden'};
                if (arrMessage[code] == undefined) {
                    code = 0;
                }
                $scope.message = arrMessage[code].message;
                $scope.title = arrMessage[code].title;
            }]
    );
});