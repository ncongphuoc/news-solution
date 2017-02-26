/**
 * Created by tuandv on 5/26/16.
 */
define(['app'], function (app) {
    app.directive('operations', function () {
        return {
            restrict: 'E',
            scope: {},
            link: function (scope, element, attrs) {

            },
            controller: function ($scope, $element, $attrs) {
                //register for chart
                this.registerChart = function (controller) {
                    $scope.chartController = controller;
                };

                this.renderChart = function (params) {
                    if (typeof $scope.chartController !== 'undefined') {
                        $scope.chartController.renderChart(params);
                    }else {
                        var interval = setInterval(function(){
                            if (typeof $scope.chartController !== 'undefined') {
                                clearInterval(interval);

                                $scope.chartController.renderChart(params);
                            }
                        }, 300);
                    }
                };

                //register for filter
                this.registerFilter = function (controller) {
                    $scope.filterController = controller;
                };

                this.renderFilter = function (params) {
                    if (typeof $scope.filterController !== 'undefined') {
                        $scope.filterController.renderFilter(params);
                    }
                };

                //register for grid
                this.registerGrid = function (controller) {
                    $scope.gridController = controller;
                };

                this.renderGrid = function (params) {
                    var async = function () {
                        var timer = setInterval(function () {
                            if (typeof $scope.gridController !== 'undefined') {
                                $scope.gridController.renderGrid(params);
                                clearInterval(timer);
                            }
                        }, 100);
                    };
                    async();
                };

                //register for filter top
                this.registerFilterTop = function (controller) {
                    $scope.filterTopController = controller;
                };

                this.reloadTime = function (params) {
                    if (typeof $scope.filterTopController !== 'undefined') {
                        $scope.filterTopController.reloadTime(params);
                    }
                };
                this.reloadSelectFilterInFilterTop = function (params) {
                    if (typeof $scope.filterTopController !== 'undefined') {
                        $scope.filterTopController.reloadSelectBoxFilter(params);
                    }
                };

                //register for demographic
                this.registerDemoGraphic = function (controller) {
                    $scope.demographicController = controller;
                };

                this.renderDemoGraphic = function (params) {
                    var async = function () {
                        var timer = setInterval(function () {
                            if (typeof $scope.demographicController !== 'undefined') {
                                $scope.demographicController.renderChart(params);
                                clearInterval(timer);
                            }
                        }, 100);
                    };
                    async();
                };

                //register for demographic
                this.registerFilterBottom = function (controller) {
                    $scope.filterBottomController = controller;
                };

                //register for filter drop down
                this.registerFilterDropDown = function (controller) {
                    $scope.filterDropDownController = controller;
                };

                this.reloadFilterDropDown = function () {
                    if (typeof $scope.filterDropDownController !== 'undefined') {
                        $scope.filterDropDownController.reloadFilterDropDown();
                    }
                };

                //register for stickyHeader
                this.registerStickyHeader = function (controller) {
                    $scope.stickyHeaderController = controller;
                };

                this.callStickyHeader = function () {
                    if (typeof $scope.stickyHeaderController !== 'undefined') {
                        $scope.stickyHeaderController.callStickyHeader();
                    }
                };

                //register for Summary
                this.registerSummary = function (controller) {
                    $scope.summaryController = controller;
                };

                this.renderSummary = function (params) {
                    if (typeof $scope.summaryController !== 'undefined') {
                        $scope.summaryController.renderSummary(params);
                    }else {
                        var interval = setInterval(function(){
                            if (typeof $scope.summaryController !== 'undefined') {
                                clearInterval(interval);

                                $scope.summaryController.renderSummary(params);
                            }
                        }, 300);
                    }
                };

                //register for report content
                this.registerReportContent = function (controller) {
                    $scope.reportContentController = controller;
                };

                this.renderReport = function (params) {
                    if (typeof $scope.reportContentController !== 'undefined') {
                        $scope.reportContentController.renderReport(params);
                    }else {
                        var interval = setInterval(function(){
                            if (typeof $scope.reportContentController !== 'undefined') {
                                clearInterval(interval);

                                $scope.reportContentController.renderReport(params);
                            }
                        }, 300);
                    }
                };

                //register for report search filter
                this.registerReportSearchFilter = function (controller) {
                    $scope.reportSearchFilterController = controller;
                };

                //register for search filter
                this.registerSearchFilter = function (controller) {
                    $scope.searchFilterController = controller;
                };

            }
        };
    });
});
