/**
 * Created by truchq on 4/25/2016.
 */
define(['app','modules/operation/services/filter'], function (app) {
    app.directive('filterDropDown', function ($rootScope, Filter, debounce, $location, Modal) {
        return {
            restrict: 'E',
            scope: {
                config:'='
            },
            require: ["filterDropDown", "^operations"],
            link: function (scope, element, attrs, ctrl) {
                ctrl[1].registerFilterDropDown(ctrl[0]);
                //Init
                scope.dataSource = {
                    filter: {
                        group1: {
                            name: '',
                            display: 0,
                            child: [
                                {value: 'Create filter', key: '1'}
                            ]
                        },
                        group2: {
                            name: '',
                            display: 0,
                            child: [{value: 'Filter by label', key: '2', child: []}]
                        },
                        group3: {
                            name: '',
                            child: [],
                            display: 0
                        }
                    }
                };
                scope.init = function(){
                    Filter.getList({
                        type:scope.config.type,
                        columns: 'FILTER_ID,FILTER_NAME,RULES'
                    }, function (resp) {
                        scope.dataSource.filter.group3.child = {};
                        scope.dataSource.filter.group3.child = resp.data;
                    });
                };
                scope.init();
                // Change segment
                scope.changeFilter = function (key) {
                    ctrl[1].renderFilter({key: key});
                    // Update url param
                    updateUrl({f: key});

                    // Broadcast event to add/remove class custom-height on box account, lineitem info, campaign info
                    $rootScope.$broadcast('filter-popup-change-state', {toggle: true})
                };
                // removeFilter
                scope.removeFilter = function (value) {
                    Modal.showModal({
                        actionText: 'OK',
                        closeText: 'Close',
                        headerText: 'Message',
                        bodyText: 'Are you sure remove the filter "' + scope.dataSource.filter.group3.child[value].value + '" ?',
                        onAction: function () {
                            Filter.delete({
                                id: value
                            }, function (resp) {
                                //reload filter top
                                if (resp.code == 200 && resp.data == 1) {
                                    Modal.showModal({
                                        closeText: 'Close',
                                        headerText: 'Message',
                                        bodyText: 'The filter "' + scope.dataSource.filter.group3.child[value].value + '" removed .'
                                    });
                                    delete scope.dataSource.filter.group3.child[value];
                                } else {
                                    Modal.showModal({
                                        closeText: 'Close',
                                        headerText: 'Message',
                                        bodyText: 'Error,Please again !'
                                    });
                                }


                            });
                        }
                    });
                };
                // Update param on url
                var updateUrl = debounce(function (param) {
                    // Make default param
                    // c: Column, m: Metric, mvs: Metric compare, q: Search, s: Segment, t: Time
                    var urlParam = angular.extend({
                        c: null,
                        m: null,
                        mvs: null,
                        q: null,
                        s: null,
                        t: null
                    }, $location.search(), param)
                    $location.search(urlParam)
                }, 500, false);
            },
            controller: function ($scope, $element, $attrs) {
                this.reloadFilterDropDown = function () {
                    $scope.init();
                };
            },
            templateUrl: '/js/shared/templates/dropdown/filter.html?v=' + ST_VERSION
        };
    });
});