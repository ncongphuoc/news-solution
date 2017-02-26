/**
 * Created by GiangBeo on 5/25/16.
 */
define(['app'], function (app) {
    app.directive('creativename', function (debounce, AUTH_EVENTS, $rootScope,$http,appConfig) {
        return {
            restrict: 'E',
            //replace: true,
            scope: {
                data: '=data',
                columnname:'=columnname'
            },
            link: function (scope, element, attrs) {
                scope.ct_object_id = scope.data['ct_object_id'];
                scope.show_name = true;
                scope.show_width_height = true;
                scope.show_adaptive_size = false;
                if(scope.ct_object_id==55){
                    scope.show_name = false;
                    scope.show_width_height = false;
                }
                if(scope.ct_object_id==53 || scope.ct_object_id==54){
                    scope.show_name = true;
                    scope.show_width_height = false;
                    scope.show_adaptive_size = true;
                }
            },
            templateUrl: '/js/shared/templates/review-ad/creativename.html'
        };
    });
});

//
