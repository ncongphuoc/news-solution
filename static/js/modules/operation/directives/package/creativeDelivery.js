/**
 * @auhor: Code nay la cua Thephuc ^^
 * @since: 21/11/2016
 */
define(['app', 'shared/directive/icheck'], function (app) {

    app.directive('creativeDelivery', function ($rootScope, Find) {
        return {
            restrict: 'E',
            scope: {
                package: '=ngModel'
            },
            require: 'ngModel',
            templateUrl: '/js/modules/operation/templates/directive/creativeDelivery.html',
            controller: function($scope) {

                $scope.arrOpt = [
                    {name: 'per hour', value: 1},
                    {name: 'per day', value: 2},
                    {name: 'per week', value: 3},
                    {name: 'per month', value: 5},
                ];

                $scope.arrType = [
                    {name: 'per Creatives', value: 1},
                    {name: 'per Campaign', value: 2},
                    {name: 'for this Line Item', value: 3},
                ];

            },
            link: function(scope, element, attrs, ngModel) {
                $rootScope.$on('is_submit_step_2', function(events, args) {
                    if(scope.$parent.package_form_step_2 !== undefined) {
                        if(args === true && !scope.$parent.package_form_step_2.$valid)
                            scope.is_error = true;
                        else
                            scope.is_error = false;
                    }
                });
            }
        };
    });

});