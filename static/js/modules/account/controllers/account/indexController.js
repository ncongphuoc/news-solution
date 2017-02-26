/**
 * Created by nhanva on 6/16/2016.
 */
define(['app'], function (app) {
    app.controller('accountsAccountIndexController', ['$scope', 'Campaign', 'Session', 'appConfig', 'AUTH_EVENTS', '$state',
        function ($scope, Campaign, Session, appConfig, AUTH_EVENTS, $state) {
                $scope.static_url = appConfig.ST_HOST;
        }]
    )
})