/**
 * Created by truchq on 4/25/2016.
 */
define(['app'], function (app) {
    app.directive('btnTarget',['$stateParams','$state', function ($stateParams,$state) {
        return {
            restrict: 'E',
            scope: {
                type: '='
            },
            link: function (scope, element, attrs, ctrl) {
                scope.$state = $state;
                scope.link = 'campaigns.target.add';
                scope.param_link = {
                    target_type: scope.type
                };
                if($stateParams.lineitem_id != undefined){
                    scope.link = 'campaigns.lineitem.detail.target.add';
                }
                if($stateParams.campaign_id != undefined){
                    scope.link = 'campaigns.campaign.detail.target.add';
                }
                scope.click = function(){
                    $state.go(scope.link, scope.param_link)
                }
            },
            templateUrl: '/js/shared/templates/directive/btnTarget.html?v=' + ST_VERSION
        };
    }]);
});