$(function () {
    $(document).ready(function () {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        $('#hchart-right').highcharts({
            chart: {
                type: 'column',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {
                        var series = this.series[0];
                        var conn = new WebSocket(WEBSOCKET_SERVER + ':8899/click-debug');
                        conn.onopen = function (e) {
                            setInterval(function () {
                                conn.send("send request");
                            }, 1000);
                        };
                        conn.onmessage = function (e) {
                            var tmp = JSON.parse(e.data);
                            if (typeof (tmp.second) !== 'undefined') {
                                var j = 0;
                                tmp.second.forEach(function (item) {
                                    series.data[j].update({y: +item.y});
                                    j++;
                                });
                            } else {
                                var x = tmp.x;
                                var y = tmp.y;
                                series.addPoint([x, y], true, true);
                            }
                        }

                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    animation: {
                        duration: 2000,
                        easing: 'easeOutBounce'
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
                name: 'Random data',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -29; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: 50
                        });
                    }
                    return data;
                }())
            }]
        });
    });
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}