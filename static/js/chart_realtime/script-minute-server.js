$(function () {

    // Create the chart
    $('#hchart-left').highcharts('StockChart', {
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