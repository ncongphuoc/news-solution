/**
 * Created by tuandv on 7/13/16.
 */
define(['app'], function (app) {
    app.directive('realTimeChart', ['AUTH_EVENTS', function (AUTH_EVENTS) {
        return {
            restrict: 'E',
            scope: {
                settings: '='
            },
            link: function (scope, element, attrs, controllers) {

                /*Highcharts.StockChart(element[0], {
                    chart: {
                        events: {
                            load: function () {
                                chart = this;
                                var series = this.series[0];
                                var y = 0;
                                var i = 0;
                                // set up the updating of the chart each second
                                var conn = new ab.connect(WEBSOCKET_SERVER + ':' + WEBSOCKET_PORT + '/click',
                                    function (session) {
                                        session._websocket.onmessage = function (e) {
                                            var tmp = JSON.parse(e.data);
                                            console.log('tmp', tmp);
                                            if (typeof (tmp.minitue) !== 'undefined') {
                                                var j = 0;
                                                tmp.minitue.forEach(function (item) {
                                                    series.data[j].update({y: +item.y});
                                                    j++;
                                                });
                                            } else {
                                                var temp = JSON.parse(tmp[2]);
                                                y += temp.y;
                                                if (i < 60) {
                                                    var lengthSeries = chart.series[0].data.length;
                                                    var x = chart.series[0].data[lengthSeries - 1].x;
                                                    chart.series[0].data[lengthSeries - 1].update([x, y]);
                                                    i++;
                                                } else {
                                                    var x = temp.x;
                                                    var shift = chart.series[0].data.length > 30;
                                                    chart.series[0].addPoint([x, 0], true, shift);
                                                    i = 0;
                                                    y = 0;
                                                }
                                            }
                                            chart.redraw();
                                        };


                                        session.subscribe('click_chart', function (topic, data) {
                                            // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
                                        });

                                        session.unsubscribe = function(e){
                                            console.log("123123");
                                        }

                                    },
                                    function (code, reason, deatail) {
                                        console.warn('WebSocket connection closed');
                                    },
                                    {
                                        // 'skipSubprotocolCheck': true
                                    }
                                );
                            }
                        },
                        animation: {
                            duration: 500
                        },
                        height: 170,
                        width: 450
                    },
                    rangeSelector: {
                        buttons: [],
                        inputEnabled: false,
                        selected: 1
                    },
                    plotOptions: {
                        series: {
                            animation: {
                                duration: 500,
                                easing: 'transition'
                            }
                        },
                        column: {
                            pointWidth: 10,
                            color: '#f4f4f4',
                            groupPadding: 0.1,
                            pointPadding: 0.1,
                            states: {
                                hover: {
                                    color: '#c4eaf5'
                                }
                            }
                        }
                    },
                    scrollbar: {
                        enabled: false
                    },
                    xAxis: {
                        ordinal: false
                    },
                    credits: {
                        text: '',
                        href: 'http://ants.vn'
                    },
                    navigator: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    yAxis: {
                        opposite: false
                    },
                    series: [{
                        name: 'Click: ',
                        type: 'column',
                        data: (function () {
                            // generate an array of random data
                            var data = [], time = (new Date()).getTime(), i;
                            for (i = -29; i < 0; i += 1) {
                                data.push([
                                    time + i * 1000 * 60,
                                    2000
                                ]);
                            }
                            data.push([
                                time,
                                0
                            ]);
                            return data;
                        }()),
                        tooltip: {
                            valueDecimals: 2
                        }
                    }]
                });*/

                /*var conn = new ab.connect(WEBSOCKET_SERVER + ':' + WEBSOCKET_PORT + '/click',
                    function(session){
                        session._websocket.onmessage = function (e) {
                            var tmp = JSON.parse(e.data);
                            console.log('tmp', tmp);
                        };

                        session.subscribe('click_chart', function (topic, data) {
                            // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
                        });

                        session.unsubscribe = function(e){
                            console.log("unsubscribe");
                        }
                    },
                    function (code, reason, deatail) {
                        console.warn('WebSocket connection closed');
                    },
                    {

                    }
                );

                console.log('conn', conn);*/

                /*Highcharts.chart(element[0], {
                    chart: {
                        type: 'column',
                        height: 170,
                        width: 450
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: ''
                        }
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            pointWidth: 10,
                            states: {
                                hover: {
                                    color: '#c4eaf5'
                                }
                            }
                        }
                    },
                    series: [
                        {
                            data: [0.5, 0.5]
                        },
                        {
                            data: [12, 12],
                            color: '#f4f4f4'
                        }
                    ],
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        text: '',
                        href: 'http://ants.vn'
                    }
                });*/

            },
            controller: function ($scope, $element, $attrs) {

            }
        };
    }]);
});
