/**
 * Created by truchq on 4/25/2016.
 */
define(['app'], function (app) {
    app.directive('innerContent', function (Filter, debounce, $location, Modal) {
        return {
            restrict: 'CE',
            scope: {
                config:'='
            },
            require: ["filterDropDown", "^operations"],
            link: function (scope, element, attrs, ctrl) {

            },
            controller: function ($rootScope,$scope, $element, $attrs) {
                console.log('$rootScope.status_truchq',$rootScope.status_truchq);
            },
            templateUrl: '/js/shared/templates/dropdown/filter.html?v=' + ST_VERSION
        };
    });
});