/**
 * Created by tuandv on 10/25/16.
 */
define(['app', 'shared/services/search'], function (app) {
    app.directive('searchFilter', ['Search', '$state', function (Search, $state) {
        return {
            restrict: 'E',
            scope: {
                settings: '='
            },
            require: ["searchFilter", "?^operations"],
            link: function (scope, element, attrs, ctrl) {
                ctrl[1].registerSearchFilter(ctrl[0]);
                scope.search_opened = false;
                scope.search_not_found = false;
                scope.show_navigate = true;
                scope.show_box_search = false;
                scope.search_data = [];
                scope.search_number = 0;
                scope.last_number = 0;

                scope.changeSearch = function (value) {
                    if (value == '') {
                        scope.search_opened = false;
                    } else {
                        scope.search_number++;
                        angular.element(element[0].querySelector(".btn-report-search-icon")).fadeOut();
                        angular.element(element[0].querySelector(".report-filter-icon")).fadeIn();

                        //show search box
                        scope.search_opened = true;
                        scope.search_not_found = false;

                        var search_params = {
                            object: 'remarketing',
                            search: value,
                            limit: 5
                        };

                        scope.last_number = scope.search_number;
                        Search.getList(search_params, function (resp) {
                            if(scope.last_number == scope.search_number){
                                angular.element(element[0].querySelector(".report-filter-icon")).fadeOut();
                                angular.element(element[0].querySelector(".btn-report-search-icon")).fadeIn();

                                if(resp.data && resp.data.length){
                                    var search = [];
                                    angular.forEach(resp.data, function (item, index) {
                                        search.push({
                                            id: item.remarketing_id,
                                            name: item.remarketing_name
                                        });
                                    });

                                    scope.search_data = search;
                                    scope.show_navigate = true;
                                }else {
                                    scope.search_not_found = true;
                                    scope.search_data = [];
                                    scope.show_navigate = false;
                                }
                            }
                        });
                    }
                };

                scope.filterSearch = function (value) {
                    if(value){
                        //call function filter
                        var params = {
                            metric_code: 'remarketing_name',
                            operator: 'contain',
                            'value': value
                        };

                        var filter = [{
                            remarketing_name: {
                                'contain': value
                            }
                        }];

                        ctrl[1].renderFilter(params);
                        ctrl[1].renderGrid({filter: filter, fc: 'search filter report'});

                        //
                        scope.search_opened = false;
                    }
                };

                scope.gotoDetail = function (obj) {
                    if(obj.id){
                        $state.go('campaigns.library.audience.edit', {remarketing_id: obj.id})
                    }else{
                        console.error('Could not found report id');
                    }
                };

                angular.element('.search-listing').bind("keydown", function (event) {
                    if (event.which == 13 && scope.search) {
                        scope.filterSearch(scope.search);
                        scope.search_opened = false;
                    }
                });

            },
            controller: function ($scope, $element, $attrs) {
                $scope.static_url = $scope.$parent.static_url;

            },
            templateUrl: '/js/shared/templates/search/search-filter.html?v=' + ST_VERSION
        };
    }]);
});
