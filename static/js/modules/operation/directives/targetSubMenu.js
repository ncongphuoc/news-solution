/**
 * Created by tuandv on 7/20/16.
 */
define(['app'], function (app) {
    app.directive('targetSubMenu', function (debounce) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: ['$scope', '$state', 'Auth', 'AUTH_EVENTS', 'appConfig',
                function ($scope, $state, Auth, AUTH_EVENTS, appConfig) {
                    $scope.statName = $state.current.name;

                    // Update nav bar
                    var updateNavigation = function () {
                        $scope.isBuyer = (Auth.supportUser() && Auth.supportUser().role == appConfig.USER_ROLES.BUYER) ? true : false;
                    };

                    updateNavigation();

                    $scope.$on(AUTH_EVENTS.selectSupportUser, function (event, args) {
                        // Update nav bar when change user support
                        updateNavigation();
                    });
                }],
            templateUrl: '/js/modules/operation/templates/target/targetSubMenu.html?v=' + ST_VERSION
        }
    });
});