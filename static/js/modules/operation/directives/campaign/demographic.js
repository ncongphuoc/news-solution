/**
 * Created by tuandv on 6/28/16.
 */
define(['app', 'libs/highcharts/highcharts', 'modules/operation/services/forecast'], function (app) {
    app.directive('demographic', ['Forecast', function (Forecast) {
        return {
            restrict: 'E',
            scope: {
                settings: '='
            },
            require: ["demographic", "^operations"],
            link: function (scope, element, attrs, controllers) {
                controllers[1].registerDemoGraphic(controllers[0]);
                var DEMOGRAPHIC_TYPE = 2,
                    AGE_UNKNOWN = -1;

                scope.gender = {
                    male: 0,
                    female: 0,
                    unknown: 0
                };

                scope.options = {
                    colors: {
                        gender: {
                            male: '#bbd531',
                            female: '#dae686',
                            unknown: '#cdcccc'
                        },
                        age: {
                            default: '#62c9d5',
                            unknown: '#d8d8d8'
                        }
                    }
                };

                scope.params = {
                    columns: 'imp',
                    filters: '',
                    type: DEMOGRAPHIC_TYPE
                };

                scope.ageChart = function(data){

                    var  series = [];
                    if(data.length){
                        var total = 0;

                        angular.forEach(data, function(row, key) {
                            total +=  typeof row.value != 'undefined' ? row.value : 0
                        });

                        angular.forEach(data, function(row, key) {
                            var series_row = {
                                name: row.name ? row.name : '',
                                y: typeof row.value != 'undefined' ? Math.round((row.value / total) * 100) : 0,
                                color: row.id && row.id == AGE_UNKNOWN ? scope.options.colors.age.unknown : scope.options.colors.age.default
                            };

                            series.push(series_row);
                        });

                        angular.element('.demographic-age-chart').highcharts({
                            chart: {
                                type: 'column',
                                height: 177,
                                width: 400
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                type: 'category',
                                plotLines: [
                                    {
                                        color: '#fafafa', // Color value
                                        value: 0, // Value of where the line will appear
                                        width: 30 // Width of the line
                                    },
                                    {
                                        color: '#fafafa', // Color value
                                        value: 1, // Value of where the line will appear
                                        width: 30 // Width of the line
                                    },
                                    {
                                        color: '#fafafa', // Color value
                                        value: 2, // Value of where the line will appear
                                        width: 30 // Width of the line
                                    },
                                    {
                                        color: '#fafafa', // Color value
                                        value: 3, // Value of where the line will appear
                                        width: 30 // Width of the line
                                    },
                                    {
                                        color: '#fafafa', // Color value
                                        value: 4, // Value of where the line will appear
                                        width: 30 // Width of the line
                                    },
                                    {
                                        color: '#fafafa', // Color value
                                        value: 5, // Value of where the line will appear
                                        width: 30 // Width of the line
                                    }
                                ]
                            },
                            yAxis: {
                                allowDecimals: false,
                                visible: false
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                column: {
                                    pointWidth: 30
                                },
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y:.1f}%'
                                    }
                                }
                            },
                            series: [{
                                name: 'Age',
                                data: series
                            }],
                            credits: {
                                text: '',
                                href: 'http://ants.vn'
                            }
                        });


                    }
                };

                scope.genderChart = function(data){

                    var  series = [];
                    if(data.length) {
                        var total = 0;
                        angular.forEach(data, function (row, key) {

                            var color = '',
                                name = '';
                            if(typeof row.key !== 'undefined'){
                                total += typeof row.value !== 'undefined' ? row.value : 0;
                                if(row.key != 'undefined'){
                                    color = scope.options.colors.gender[row.key];
                                    name = typeof row.name !== 'undefined' ? row.name : '';
                                }else{
                                    color = scope.options.colors.gender.unknown;
                                    name = 'UnKnown';
                                }
                            }

                            var series_row = {
                                name: name,
                                y: typeof row.value !== 'undefined' ? row.value : 0,
                                color: color
                            };

                            series.push(series_row);
                        });

                        angular.forEach(data, function (row, key) {
                            if(typeof row.key !== 'undefined'){
                                switch (row.key){
                                    case 'male':
                                        scope.gender.male = (row.value / total) * 100;
                                        break;
                                    case 'female':
                                        scope.gender.female = (row.value / total) * 100;
                                        break;
                                    default:
                                        scope.gender.unknown = (row.value / total) * 100;
                                        break;
                                }
                            }
                        });

                        angular.element('.demographic-gender-chart').highcharts({
                            chart: {
                                type: 'pie',
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false,
                                height: 150
                            },
                            title: {
                                text: ''
                            },
                            plotOptions: {
                                pie: {
                                    innerSize: 60,
                                    depth: 0,
                                    dataLabels: {
                                        enabled: false
                                    }
                                }
                            },
                            series: [{
                                name: 'Gender',
                                innerSize: '70%',
                                data: series
                            }],
                            credits: {
                                text: '',
                                href: 'http://ants.vn'
                            }
                        });
                    }
                };

                scope.closePopup = function(){
                    var demographic_panel = angular.element('.demographic-panel');
                    var popup_demographic = angular.element('.popup-demographic');

                    popup_demographic.fadeOut();
                    demographic_panel.hide();
                    angular.element('.demographic').find('.loading').fadeIn();
                };

                scope.render = function(params){
                    var demographic = angular.element('.demographic'),
                        demographic_panel = angular.element('.demographic-panel'),
                        popup_demographic = angular.element('.popup-demographic');

                    demographic.show();
                    demographic.find('.loading').fadeIn();
                    demographic_panel.show();

                    popup_demographic.fadeIn();
                    if(popup_demographic.offset().top - $(window).scrollTop() === 0){
                        popup_demographic.stop().animate({top:'-300px'}, 1000);
                    } else {
                        popup_demographic.stop().animate({top: $(window).scrollTop() + 100 +'px'}, 1000);
                        popup_demographic.offset().top = 0;
                    }

                    popup_demographic.css('opacity', 1);

                    if(typeof params !== 'undefined' && typeof params.target_id !== 'undefined' && typeof params.target_define !== 'undefined'){
                        var value = {};
                        value[params.target_define] = params.target_id;
                        scope.params.filters = JSON.stringify([
                            {
                                t: params.target_define,
                                v: value
                            }
                        ]);
                    }

                    /*scope.params.filters = JSON.stringify([
                        {
                            t: 1,
                            v: {
                                1: 529490688
                            }
                        }
                    ]);*/

                    Forecast.getList(scope.params, function (resp) {

                        if(typeof resp.data.rows !== 'undefined'){

                            if(typeof resp.data.rows.age !== 'undefined'){
                                scope.ageChart(resp.data.rows.age);
                            }

                            if(typeof resp.data.rows.gender !== 'undefined'){
                                scope.genderChart(resp.data.rows.gender);
                            }

                            demographic.find('.loading').fadeOut();
                        }
                    });
                };
            },
            controller: function ($scope, $element, $attrs) {
                this.renderChart = function(params){

                    $scope.render(params);
                };
            },
            templateUrl: '/js/modules/operation/templates/campaign/demographic.html?v=' + ST_VERSION
        };
    }]);

    app.directive('ngEsc', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress keyup", function (event) {
                if(event.which === 27) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEsc);
                    });

                    event.preventDefault();
                }
            });
        };
    });
});
