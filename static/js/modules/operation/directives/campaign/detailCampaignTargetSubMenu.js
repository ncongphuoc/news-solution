/**
 * Created by manhtoan on 08/08/16.
 */
define(['app'], function (app) {
    app.directive('detailCampaignTargetSubMenu', function (debounce) {
        return {
            restrict: 'E',
            scope: {},
            replace: true,
            controller: ['$scope', '$state', 'Auth', 'AUTH_EVENTS', 'appConfig',
                function ($scope, $state, Auth, AUTH_EVENTS, appConfig) {
                    $scope.statName = $state.current.name;

                    // Update nav bar
                    var updateNavigation = function () {
                        $scope.isBuyer = (Auth.supportUser() && Auth.supportUser().role == appConfig.USER_ROLES.BUYER) ? true : false;
                    };

                    updateNavigation();

                    $scope.$on(AUTH_EVENTS.changeSupportUser, function (event, args) {
                        updateNavigation();
                    });
                }],
            templateUrl: '/js/modules/operation/templates/campaign/directives/detailCampaignTargetSubMenu.html'
        }
    });
});