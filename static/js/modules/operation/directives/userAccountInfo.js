/**
 * Created by nhanva on 4/24/2016.
 */
define(['app'], function (app) {
    app.directive('useraccountinfo', function (AUTH_EVENTS, Account, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                params: '=accountinfo',
            },
            link: function (scope, element, attrs) {
                var reload = function () {
                    angular.element(element[0].querySelector('.loading')).fadeIn();
                    Account.get({
                        id: 517218636,
                        type: 'balance',
                    }, function (resp) {
                        scope.data = resp.data;
                    });
                    //
                    var interval = setInterval(function () {
                        angular.element(element[0].querySelector('.loading')).fadeOut();
                    }, 3000);
                };
                //
                reload();
                scope.$on(AUTH_EVENTS.changeSupportUser, function () {
                    reload();
                });

                scope.$on('filter-popup-change-state', function(event, args){
                    if(args.toggle != undefined){
                        scope.filterIsOpen = args.toggle;
                    }
                });


            },
            templateUrl: '/js/modules/operation/templates/useraccountinfo.html'
        }
    });
});