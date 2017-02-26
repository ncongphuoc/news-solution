$(function () {
    $(document).ready(function () {
        var chart;
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        $('#hchart-right').highcharts({
            chart: {
                type: 'column',
                events: {
                    load: function () {
                        chart = this;
                        var series = this.series[0];
                        var conn = new ab.connect(WEBSOCKET_SERVER + ':' + WEBSOCKET_PORT + '/click',
                            function (session) {
                                session._websocket.onmessage = function (e) {
                                    var tmp = JSON.parse(e.data);
                                    if (typeof (tmp.second) !== 'undefined') {
                                        var i = 0;
                                        tmp.second.forEach(function (item) {
                                            series.data[i].update({y: +item.y});
                                            i++;
                                        });
                                    }else{
                                        var temp = JSON.parse(tmp[2]);
                                        var x = temp.x;
                                        var y = temp.y;
                                        var shift = chart.series[0].data.length > 29;
                                        series.addPoint([x, y], true, shift);
                                    }
                                };



                                session.subscribe('click_chart', function (topic, data) {
                                    // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
                                });

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
                    duration: 200,
                    easing: 'transition'
                },
            },
            credits: {
                text: '',
                href: 'http://ants.vn'
            },
            title: {
                text: 'Click data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            tooltip: {
                formatter: function () {
                    return Highcharts.dateFormat('%S', (new Date()).getTime() - this.x + 2 * 1000) + 's before<br/>' +
                        'Click: ' + Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    animation: {
                        duration: 1000,
                        easing: 'transition'
                    }
                },
                column: {
                    pointWidth: 13,
                }
            },
            exporting: {
                enabled: false
            },
            series: [{
                data: (function () {
                    // generate an array of random data
                    var data = [], time = (new Date()).getTime(), i;
                    for (i = -29; i <= 0; i += 1) {
                        data.push([
                            time + i * 1000,
                            50
                        ]);
                    }
                    return data;
                }())
            }]
        });
    });
});
