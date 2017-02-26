$(function () {

    // Create the chart
    $('#hchart-left').highcharts('StockChart', {
        chart: {
            events: {
                load: function () {
                    var chart = this;
                    // set up the updating of the chart each second
                    var conn = new WebSocket(WEBSOCKET_SERVER + ':8899/click-debug');
                    var i = 0;
                    var y = 0;
                    conn.onopen = function (e) {
                        setInterval(function () {
                            conn.send("send request");
                            i++;
                        }, 1000);
                    };
                    conn.onmessage = function (e) {
                        var tmp = JSON.parse(e.data);
                        if (typeof (tmp.minitue) !== 'undefined') {
                            var j = 0;
                            tmp.minitue.forEach(function (item) {
                                chart.series[0].data[j].update({y: +item.y});
                                j++;
                            });
                        } else {
                            y += tmp.y;
                            if (i < 60) {
                                var lengthSeries = chart.series[0].data.length;
                                var x = chart.series[0].data[lengthSeries - 1].x;
                                chart.series[0].data[lengthSeries - 1].update([x, y]);
                            } else {
                                var x = tmp.x;
                                var shift = chart.series[0].data.length > 30;
                                chart.series[0].addPoint([x, 0], true, shift);
                                i = 0;
                                y = 0;
                            }
                        }
                        chart.redraw();
                    }
                }

            },
            animation: {
                duration: 500,
            }
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
                pointWidth: 17,
                color: '#96dff4',
                states: {
                    hover: {
                        color: '#c4eaf5'
                    }
                },
            }
        },
        scrollbar: {
            enabled: true,
            height: 0,
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
                        2000,
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
            },
        }]
    });

});
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}