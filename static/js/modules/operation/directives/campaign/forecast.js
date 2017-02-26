/**
 * Created by tuandv on 6/2/16.
 */
define(['app', 'modules/operation/services/forecast', 'libs/vennjs/d3.min', 'libs/vennjs/venn.min', 'libs/vennjs/forecast-venn'], function (app) {
    app.directive('forecast', ['Forecast', 'AUTH_EVENTS', function (Forecast, AUTH_EVENTS) {
        return {
            restrict: 'E',
            scope: {
                modelData: '=ngModel',
            },
            link: function (scope, element, attrs, controllers) {
                scope.$watch('rangeSelected', function(rangeSelected) {
                    scope.updateHealth(rangeSelected);
                });
            },
            controller: function ($scope, $element, $attrs) {
                var FORECAST_TYPE = 1;
                var forecastChart = angular.element('.forecastChart');

                $scope.rangeSelected = '0';
                $scope.selected = 0;

                $scope.options = {
                    min_r: 37.5,
                    max_r: 50,
                    min_intersection: 10,
                    colors: ['#03a9f4', '#e91e63', '#ffe155'],
                    intersection_color: ['#e37e7e', '#D5BAA9'],
                    range: [
                        {
                            min: 0,
                            max: 50000,
                            name: '0 - 50K'
                        },
                        {
                            min: 50000,
                            max: 100000,
                            name: '50K - 100K'
                        },
                        {
                            min: 100000,
                            max: 500000,
                            name: '100K - 500K'
                        },
                        {
                            min: 500000,
                            max: 1000000,
                            name: '500K - 1M'
                        },
                        {
                            min: 1000000,
                            max: 10000000,
                            name: '1M - 10M'
                        },
                        {
                            min: 10000000,
                            max: 500000000,
                            name: '10M - 500M'
                        }
                    ]
                };

                $scope.params = {
                    columns: 'imp',
                    filters: '',
                    type: FORECAST_TYPE
                };

                $scope.target_method = [];
                $scope.color_intersect = [];

                $scope.vennData = [
                    {sets: ['t1'], size: 50}
                ];

                $scope.updateHealth = function(rangeSelected) {
                    $scope.health_persen = '0';
                    $scope.health_color = '';
                    switch(rangeSelected) {
                        case '0':
                        case '0 - 1k':
                            $scope.health_persen = '0%';
                            $scope.health_color = 'f0f0f0';
                            break;
                        case '1k - 1.5k':
                        case '1.5k - 2k':
                        case '2k - 5k':
                        case '5k - 10k':
                        case '10k - 15k':
                        case '15k - 20k':
                        case '20K - 49k':
                        case '50k - 100k':
                        case '100k - 150k':
                        case '150k - 200k':
                        case '200k - 500k':
                            $scope.health_persen = '12.5%';
                            $scope.health_color = 'ff4f4f';
                            break;
                        case '500k - 1M':
                            $scope.health_persen = '25%';
                            $scope.health_color = 'ff4f4f';
                            break;
                        case '1M - 1.5M':
                        case '1.5M - 2M':
                        case '2M - 5M':
                            $scope.health_persen = '37.5%';
                            $scope.health_color = 'fa9f1b';
                            break;
                        case '5M - 10M':
                            $scope.health_persen = '50%';
                            $scope.health_color = 'fa9f1b';
                            break;
                        case '10M - 15M':
                            $scope.health_persen = '62.5%';
                            $scope.health_color = 'bdd630';
                            break;
                        case '15M - 20M':
                            $scope.health_persen = '75%';
                            $scope.health_color = 'bdd630';
                            break;
                        case '20M - 50M':
                            $scope.health_persen = '87.5%';
                            $scope.health_color = '63c9d5';
                            break;
                        case '50M+':
                            $scope.health_persen = '100%';
                            $scope.health_color = '63c9d5';
                            break;
                        default:
                            break;
                    }
                };

                $scope.reloadChart = function(params){
                    forecastChart.find('.loading').show();

                    if(typeof params !== 'undefined' && typeof params.info_selected !== 'undefined' && params.info_selected.length > 0){
                        $scope.rangeSelected = 'Updating...';
                        $scope.selected = params.info_selected.length;

                        $scope.params.filters = params.filters ? params.filters :  {};
                        Forecast.getList($scope.params, function (resp) {
                            if(resp.data && resp.data.num >= 1){
                                if(resp.data.range){
                                    $scope.options.range = resp.data.range;
                                }

                                var data = [];
                                switch (resp.data.num){
                                    case 1:
                                        if($scope.options.range){
                                            angular.forEach($scope.options.range, function(range, key) {
                                                if(resp.data.rows.t1.imp >= range.min && resp.data.rows.t1.imp <= range.max){
                                                    $scope.rangeSelected = $scope.selected > 0 ? range.name : $scope.rangeSelected;
                                                }
                                            });
                                        }

                                        data = [
                                            {sets: ['t1'], size: 50}
                                        ];
                                        break;
                                    case 2:
                                        var r1 = $scope.options.max_r,
                                            r2 = $scope.options.max_r,
                                            r12 = $scope.options.min_intersection;
                                        if(resp.data.rows && resp.data.num == 2){
                                            if(resp.data.rows.t1.imp > resp.data.rows.t2.imp && resp.data.rows.t1.imp > 0){
                                                r2 = (resp.data.rows.t2.imp / resp.data.rows.t1.imp) * 50;

                                                if(r2 < $scope.options.min_r){
                                                    r2 = $scope.options.min_r;
                                                }

                                                if(resp.data.rows.t12.imp){
                                                    r12 = (resp.data.rows.t12.imp / resp.data.rows.t1.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t12.imp / resp.data.rows.t1.imp) * 50;
                                                }else {
                                                    r12 = (resp.data.rows.t2.imp / resp.data.rows.t1.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t2.imp / resp.data.rows.t1.imp) * 50;
                                                }

                                            }else if(resp.data.rows.t2.imp > 0){
                                                r1 = (resp.data.rows.t1.imp / resp.data.rows.t2.imp) * 50;

                                                if(r1 < $scope.options.min_r){
                                                    r1 = $scope.options.min_r;
                                                }

                                                if(resp.data.rows.t12.imp){
                                                    r12 = (resp.data.rows.t12.imp / resp.data.rows.t2.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t12.imp / resp.data.rows.t2.imp) * 50;
                                                }else {
                                                    r12 = (resp.data.rows.t1.imp / resp.data.rows.t2.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t1.imp / resp.data.rows.t2.imp) * 50;
                                                }
                                            }

                                            //t1 or t2 = 0
                                            if(resp.data.rows.t1.imp <= 0){
                                                r1 = $scope.options.min_r;
                                            }

                                            if(resp.data.rows.t2.imp <= 0){
                                                r2 = $scope.options.min_r;
                                            }
                                        }

                                        if($scope.options.range){
                                            angular.forEach($scope.options.range, function(range, key) {
                                                if(resp.data.rows.t12.imp >= range.min && resp.data.rows.t12.imp <= range.max){
                                                    $scope.rangeSelected = $scope.selected > 0 ? range.name : $scope.rangeSelected;
                                                }
                                            });
                                        }

                                        //set color avaiable impression
                                        $scope.color_intersect = $scope.options.intersection_color[0] ? $scope.options.intersection_color[0] : '';

                                        data = [
                                            {sets: ['t1'], size: r1},
                                            {sets: ['t2'], size: r2},
                                            {sets: ['t1','t2'], size: r12}
                                        ];

                                        break;
                                    case 3:
                                        var r1 = $scope.options.max_r,
                                            r2 = $scope.options.max_r,
                                            r3 = $scope.options.max_r,
                                            r12 = $scope.options.min_intersection,
                                            r13 = $scope.options.min_intersection,
                                            r23 = $scope.options.min_intersection,
                                            r123 = $scope.options.min_intersection,
                                            t123 = 0;
                                        if(resp.data.rows && resp.data.num == 3){
                                            if(resp.data.rows.t1.imp > resp.data.rows.t2.imp && resp.data.rows.t1.imp > resp.data.rows.t3.imp && resp.data.rows.t1.imp > 0){
                                                r2 = (resp.data.rows.t2.imp / resp.data.rows.t1.imp) * 50;
                                                r3 = (resp.data.rows.t3.imp / resp.data.rows.t1.imp) * 50;

                                                if(r2 < $scope.options.min_r){
                                                    r2 = $scope.options.min_r;
                                                }

                                                if(r3 < $scope.options.min_r){
                                                    r3 = $scope.options.min_r;
                                                }

                                                if(resp.data.rows.t12.imp){
                                                    r12 = (resp.data.rows.t12.imp / resp.data.rows.t1.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t12.imp / resp.data.rows.t1.imp) * 50;
                                                }

                                                if(resp.data.rows.t13.imp){
                                                    r13 = (resp.data.rows.t13.imp / resp.data.rows.t1.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t13.imp / resp.data.rows.t1.imp) * 50;
                                                }

                                                if(resp.data.rows.t23.imp){
                                                    r23 = (resp.data.rows.t23.imp / resp.data.rows.t1.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t23.imp / resp.data.rows.t1.imp) * 50;
                                                }

                                                if(typeof resp.data.rows.t123 !== 'undefined' && typeof resp.data.rows.t123.imp !== 'undefined'){
                                                    r123 = (resp.data.rows.t123.imp / resp.data.rows.t1.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t123.imp / resp.data.rows.t1.imp) * 50;
                                                }
                                            }

                                            if(resp.data.rows.t2.imp > resp.data.rows.t3.imp && resp.data.rows.t2.imp > resp.data.rows.t1.imp && resp.data.rows.t2.imp > 0){
                                                r1 = (resp.data.rows.t1.imp / resp.data.rows.t2.imp) * 50;
                                                r3 = (resp.data.rows.t3.imp / resp.data.rows.t2.imp) * 50;

                                                if(r1 < $scope.options.min_r){
                                                    r1 = $scope.options.min_r;
                                                }

                                                if(r3 < $scope.options.min_r){
                                                    r3 = $scope.options.min_r;
                                                }

                                                if(resp.data.rows.t12.imp){
                                                    r12 = (resp.data.rows.t12.imp / resp.data.rows.t2.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t12.imp / resp.data.rows.t2.imp) * 50;
                                                }

                                                if(resp.data.rows.t13.imp){
                                                    r13 = (resp.data.rows.t13.imp / resp.data.rows.t2.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t13.imp / resp.data.rows.t2.imp) * 50;
                                                }

                                                if(resp.data.rows.t23.imp){
                                                    r23 = (resp.data.rows.t23.imp / resp.data.rows.t2.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t23.imp / resp.data.rows.t2.imp) * 50;
                                                }

                                                if(typeof resp.data.rows.t123 !== 'undefined' && typeof resp.data.rows.t123.imp !== 'undefined'){
                                                    r123 = (resp.data.rows.t123.imp / resp.data.rows.t2.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t123.imp / resp.data.rows.t2.imp) * 50;
                                                }

                                            }

                                            if(resp.data.rows.t3.imp > resp.data.rows.t2.imp && resp.data.rows.t3.imp > resp.data.rows.t1.imp && resp.data.rows.t3.imp > 0){
                                                r1 = (resp.data.rows.t1.imp / resp.data.rows.t3.imp) * 50;
                                                r2 = (resp.data.rows.t2.imp / resp.data.rows.t3.imp) * 50;

                                                if(r1 < $scope.options.min_r){
                                                    r1 = $scope.options.min_r;
                                                }

                                                if(r2 < $scope.options.min_r){
                                                    r2 = $scope.options.min_r;
                                                }

                                                if(resp.data.rows.t12.imp){
                                                    r12 = (resp.data.rows.t12.imp / resp.data.rows.t3.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t12.imp / resp.data.rows.t3.imp) * 50;
                                                }

                                                if(resp.data.rows.t13.imp){
                                                    r13 = (resp.data.rows.t13.imp / resp.data.rows.t3.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t13.imp / resp.data.rows.t3.imp) * 50;
                                                }

                                                if(resp.data.rows.t23.imp){
                                                    r23 = (resp.data.rows.t23.imp / resp.data.rows.t3.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t23.imp / resp.data.rows.t3.imp) * 50;
                                                }

                                                if(typeof resp.data.rows.t123 !== 'undefined' && typeof resp.data.rows.t123.imp !== 'undefined'){
                                                    r123 = (resp.data.rows.t123.imp / resp.data.rows.t3.imp) * 50 < $scope.options.min_intersection ? $scope.options.min_intersection : (resp.data.rows.t123.imp / resp.data.rows.t3.imp) * 50;
                                                }
                                            }

                                            //t1 or t2, t3 = 0
                                            if(resp.data.rows.t1.imp <= 0){
                                                r1 = $scope.options.min_r;
                                            }

                                            if(resp.data.rows.t2.imp <= 0){
                                                r2 = $scope.options.min_r;
                                            }

                                            if(resp.data.rows.t3.imp <= 0){
                                                r3 = $scope.options.min_r;
                                            }

                                            //t123 not exist
                                            if(typeof resp.data.rows.t123 == 'undefined' || typeof resp.data.rows.t123.imp == 'undefined'){
                                                if(resp.data.rows.t1 <= resp.data.rows.t2.imp && resp.data.rows.t1.imp <= resp.data.rows.t3.imp){
                                                    r123 = r1;
                                                    t123 = resp.data.rows.t1.imp;
                                                }

                                                if(resp.data.rows.t2.imp <= resp.data.rows.t1.imp && resp.data.rows.t2.imp <= resp.data.rows.t3.imp){
                                                    r123 = r2;
                                                    t123 = resp.data.rows.t2.imp;
                                                }

                                                if(resp.data.rows.t3.imp <= resp.data.rows.t1.imp && resp.data.rows.t3.imp <= resp.data.rows.t2.imp){
                                                    r123 = r3;
                                                    t123 = resp.data.rows.t3.imp;
                                                }
                                            }else {
                                                t123 = resp.data.rows.t123.imp;
                                            }
                                        }

                                        if($scope.options.range){
                                            angular.forEach($scope.options.range, function(range, key) {
                                                if(t123 >= range.min && t123 <= range.max){
                                                    $scope.rangeSelected = $scope.selected > 0 ? range.name : $scope.rangeSelected;
                                                }
                                            });
                                        }

                                        //set color avaiable impression
                                        $scope.color_intersect = $scope.options.intersection_color[1] ? $scope.options.intersection_color[1] : '';

                                        data = [
                                            {sets: ['t1'], size: r1},
                                            {sets: ['t2'], size: r2},
                                            {sets: ['t3'], size: r3},
                                            {sets: ['t1','t2'], size: r12},
                                            {sets: ['t1','t3'], size: r13},
                                            {sets: ['t2','t3'], size: r23},
                                            {sets: ['t1','t2', 't3'], size: r123}
                                        ];

                                        break;
                                    case 4:
                                        var t1234 = 0;

                                        if(resp.data.rows){
                                            angular.forEach(resp.data.rows, function(target, key) {
                                                if(target.imp > 0 && target.imp < t1234){
                                                    t1234 = target.imp;
                                                }
                                            });
                                        }

                                        if($scope.options.range){
                                            angular.forEach($scope.options.range, function(range, key) {
                                                if(t1234 >= range.min && t1234 <= range.max){
                                                    $scope.rangeSelected = $scope.selected > 0 ? range.name : $scope.rangeSelected;
                                                }
                                            });
                                        }

                                        data = [];
                                        break;
                                }

                                if(data.length){
                                    $scope.vennData = data;
                                }

                                forecastChart.find('.loading').hide();
                            }

                        });

                        /*$scope.vennData = [
                            {sets: ['t1'], size: 50},
                            {sets: ['t2'], size: 37.5},
                            {sets: ['t2'], size: 37.5},
                            {sets: ['t1','t2'], size: 30}
                        ];*/

                    }else {
                        $scope.rangeSelected = '0';
                        $scope.selected = 0;
                    }
                };

                /**
                 * @author Thephuc
                 * @since 29/11/2016
                 * @description: custom forecast to professional ^^
                 */
                $scope.$watch(
                    "modelData",
                    function handleParamChange(new_value,old_value) {
                        $scope.target_method = [];
                        if($scope.modelData !== undefined && $scope.modelData.info_selected){
                            angular.forEach($scope.modelData.info_selected, function(info, key) {
                                var target = {
                                    name: info.key == 18 ? 'Interests & remarketing' : info.name,
                                    number: info.total ? info.total : 0,
                                    color: typeof $scope.options.colors[key] !== 'undefined' ? $scope.options.colors[key] : ''
                                };
                                $scope.target_method.push(target);
                            });
                        }
                        $scope.reloadChart($scope.modelData);
                    }, true
                );

                // $scope.$on(AUTH_EVENTS.createCampaignSuccess, function (params, args) {
                //     $scope.target_method = [];
                //     if(args.info_selected){
                //         angular.forEach(args.info_selected, function(info, key) {
                //             var target = {
                //                 name: info.key == 18 ? 'Interests & remarketing' : info.name,
                //                 number: info.total ? info.total : 0,
                //                 color: typeof $scope.options.colors[key] !== 'undefined' ? $scope.options.colors[key] : ''
                //             };
                //             $scope.target_method.push(target);
                //         });
                //     }
                //     $scope.reloadChart(args);
                // });
            },
            templateUrl: '/js/modules/operation/templates/campaign/forecast.html?v=' + ST_VERSION
        };
    }]);
});
