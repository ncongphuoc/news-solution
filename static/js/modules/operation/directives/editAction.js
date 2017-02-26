/**
 * Created by nhanva on 8/2/2016.
 */
define(['app'], function (app) {
    app.directive('adxGridEditAction', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: ['$scope', '$state', '$rootScope','APP_EVENTS', 'Auth', 'appConfig', 'AUTH_EVENTS',
                function ($scope, $state, $rootScope, APP_EVENTS, Auth, appConfig, AUTH_EVENTS) {
                    var init = function(){
                        switch ($state.current.name) {
                            case 'campaigns.lineitem':
                                if(Auth.supportUser().role == appConfig.USER_ROLES.BUYER){
                                    $scope.arrAction = {
                                        group1: [
                                            {class: 'remove', key:'remove', value:'Remove'},
                                            {class: 'enable', key:'enable', value:'Enable'},
                                            {class: 'pause', key:'pause', value:'Pause'}
                                        ],
                                        group2: [
                                            {class: '', key:'budget', value:'Change budget'}
                                        ]
                                    };
                                }
                                break;
                            case 'campaigns.campaign':
                            case 'campaigns.lineitem.detail.campaign':
                                $scope.arrAction = {
                                    group1: [
                                        {class: 'remove', key:'remove', value:'Remove'},
                                        {class: 'enable', key:'enable', value:'Enable'},
                                        {class: 'pause', key:'pause', value:'Pause'}
                                    ],
                                    group2: [
                                        {class: '', key:'change-bid', value:'Change bid', type:3}
                                    ]
                                };
                                break;
                            case 'campaigns.setting':
                                $scope.arrAction = {
                                    group1: [
                                        {class: 'remove', key:'remove', value:'Remove'}
                                    ],
                                    group2: [
                                        {class: '', key:'location', value:'Locations'}
                                        , {class: '', key:'budget', value:'Change budget'}
                                    ],
                                    group3: [
                                        {class: '', key:'schedule', value:'Change Creative Schedule'}
                                        , {class: '', key:'end-date', value:'Line item end date'}
                                        , {class: '', key:'device', value:'Devices'}
                                    ]
                                };
                                break;

                            case 'campaigns.creative':
                            case 'campaigns.lineitem.detail.creative':
                            case 'campaigns.campaign.detail.creative':
                                $scope.arrAction = {
                                    group1: [
                                        {class: 'enable', key:'enable', value:'Enable'},
                                        {class: 'pause', key:'pause', value:'Pause'},
                                        {class: 'remove', key:'remove_no_validate_server', value:'Remove'}
                                    ]
                                };
                                break;
                            case 'campaigns.target.topic':
                            case 'campaigns.target.section':
                            case 'campaigns.target.audience':
                            case 'campaigns.campaign.detail.target.section':
                            case 'campaigns.campaign.detail.target.audience':
                            case 'campaigns.campaign.detail.target.topic':
                                $scope.arrAction = {
                                    group1: [
                                        {class: 'enable', key:'enable', value:'Enable'},
                                        {class: 'pause', key:'pause', value:'Pause'},
                                        {class: 'remove', key:'remove_no_validate_server', value:'Remove'}
                                    ],
                                    group2: [
                                        {class: '', key:'change-max-bid', value:'Change CPC bid', type:1},
                                        {class: '', key:'change-max-bid', value:'Change CPM bid', type:2}
                                    ]
                                };
                                break;
                            case 'campaigns.target.demographic.gender':
                            case 'campaigns.target.demographic.age':
                                $scope.arrAction = {
                                    group1: [
                                        {class: 'enable', key:'enable', value:'Enable'},
                                        {class: 'pause', key:'pause', value:'Pause'},
                                        {class: 'remove', key:'remove_no_validate_server', value:'Remove'}
                                    ]
                                };
                                break;
                            case 'campaigns.lineitem.detail.target.topic':
                            case 'campaigns.lineitem.detail.target.section':
                            case 'campaigns.lineitem.detail.target.audience':
                                $scope.arrAction = {
                                    group1: [
                                        {class: 'enable', key:'enable', value:'Enable'},
                                        {class: 'pause', key:'pause', value:'Pause'},
                                        {class: 'remove', key:'remove_no_validate_server', value:'Remove'}
                                    ],
                                    group2: [
                                        {class: '', key:'change-max-bid', value:'Change CPC bid', type:1},
                                        {class: '', key:'change-max-bid', value:'Change CPM bid', type:2}
                                    ]
                                };
                                break;
                            case 'campaigns.lineitem.detail.target.demographic.gender':
                            case 'campaigns.lineitem.detail.target.demographic.age':
                                $scope.arrAction = {
                                    group1: [
                                        {class: 'enable', key:'enable', value:'Enable'},
                                        {class: 'pause', key:'pause', value:'Pause'},
                                        {class: 'remove', key:'remove_no_validate_server', value:'Remove'}
                                    ]
                                };
                                break;
                            case 'report':
                                $scope.arrAction = {
                                    group1: [
                                        {class: 'remove', key:'remove', value:'Remove'}
                                    ]
                                };
                                break;
                            default:
                                $scope.arrAction = null;
                        }
                    }

                    init()
                    // Action when select
                    $scope.onSelect = function(key, group){
                        var arrSelItem = [];
                        $rootScope.$broadcast(APP_EVENTS.editAction, {key: key, group: group, items: arrSelItem})
                    }
                    $scope.$on(AUTH_EVENTS.changeSupportUser, function (event, arg) {
                        init();
                    });
                }],
            templateUrl: '/js/modules/operation/templates/editAction.html?v=' + ST_VERSION
        }
    })

});