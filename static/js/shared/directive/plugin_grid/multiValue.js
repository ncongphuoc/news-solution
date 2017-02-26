/**
 * Created by truchq on 4/25/2016.
 */
define(['app'], function (app) {
    app.directive('multiValue', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    type: '=',
                    data: '=',
                    column_name: '=columnName',
                    config:'=?',
                    str_extend: '=?strExtend'
                },
                link: function (scope, element, attrs, ctrl) {
                    switch (scope.column_name) {
                        case 'rm_type':
                            scope.template = 'template_mv_1.html';
                            break;
                        case 'duration':
                            scope.template = 'template_mv_2.html';
                            break;
                        default:
                            scope.template = 'template_mv.html';
                    }
                },
                controller: function ($scope, $element, $attrs) {
                },
                templateUrl: '/js/shared/templates/grid/plugin/multiValue.html?v=' + ST_VERSION
            };
        }]);
});