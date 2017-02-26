/**
 * Created by tuandv on 4/27/16.
 */

define(['app'], function (app) {
    app.directive('chart', function (AUTH_EVENTS, appConfig, APP_EVENTS, $location) {
        return {
            restrict: 'E',
            scope: {
                settings: '='
            },
            require: ["chart", "^operations"],
            link: function (scope, element, attrs, controllers) {
                scope.static_url = appConfig.ST_HOST;
                controllers[1].registerChart(controllers[0]);

                //Init
                var charts = Array();
                scope.chart = {
                    LineChart: {data: []}
                };

                scope.options = {
                    model: null,
                    compare: false,
                    container: {
                        LineChart: null
                    },
                    chartType: null,
                    metric_code: ['impression', 'click'],
                    metric_name: ['Impr.', 'Clicks'],
                    color: ['#ed7e17', '#058dc7'],
                    compare_color: ['#f2d5bd', '#7dc1de']
                };

                scope.params = {
                    metric_code: ['impression', 'click'],
                    from_date: '',
                    to_date: '',
                    time: 'day',
                    filter: ''
                };

                if(scope.settings){
                    angular.extend(scope.options, scope.settings);
                }

                //Render
                scope.chartLine = function(){

                    var tooltipFormatter = [],
                        tooltipFormatterComp = [],
                        series = [],
                        categories = [],
                        tickInterval = 2,
                        comp = [];

                    var now = moment().format('DD/MM/YYYY'),
                        hour = moment().format('HH');
                        now = moment(now, 'DD/MM/YYYY').valueOf();

                    if (scope.chart.LineChart.data.fields && scope.chart.LineChart.data.rows) {
                        var index = 2;

                        //category
                        angular.forEach(scope.chart.LineChart.data.rows, function (row, key) {
                            categories.push(row['title']);
                            //
                            if (jQuery.inArray(row['title'], tooltipFormatter) == -1) {
                                tooltipFormatter.push(row['title']);
                            }
                        });

                        angular.forEach(scope.chart.LineChart.data.fields, function(name, key) {
                            var metric_name =  typeof scope.params.metric_name[key] != 'undefined' ? scope.params.metric_name[key] : '';

                            if (metric_name) {
                                var seriesData = [],
                                    seriesDataComp = [],
                                    visibleComp = false,
                                    visible = false;

                                angular.forEach(scope.chart.LineChart.data.rows, function (row, key) {
                                    var val = row[name][0] ? parseFloat(row[name][0]) : 0;
                                    //
                                    seriesData.push(val);
                                });

                                //Visible series
                                if (jQuery.inArray(name, scope.params.metric_code) != -1) {
                                    visible = true;
                                    index--;
                                }

                                var seriesInit = {
                                    name: metric_name,
                                    yAxis: index == 0 ? index : 1,
                                    data: seriesData,
                                    tooltip: {
                                        valueSuffix: ''
                                    },
                                    visible: visible,
                                    color: typeof scope.options.color[index] != 'undefined' ? scope.options.color[index] : '#058dc7',
                                    marker: {
                                        symbol: 'circle'
                                    }
                                };

                                //line chart dot at current day
                                if (scope.params.time == "day" && scope.params.to_date) {
                                    var end_date = moment(scope.params.to_date, 'DD/MM/YYYY').valueOf();
                                    if (end_date == now) {
                                        seriesInit['zoneAxis'] = 'x';
                                        seriesInit['zones'] = [{
                                            value: scope.chart.LineChart.data.rows.length - 1
                                        }, {
                                            dashStyle: 'ShortDash'
                                        }];
                                    }
                                }else if(scope.params.time == "hour"){
                                    var end_date = moment(scope.params.to_date, 'DD/MM/YYYY').valueOf();
                                    var line_length = scope.chart.LineChart.data.rows.length;

                                    if (end_date == now) {
                                        var doted = line_length >  24 ? line_length - (24 - (+hour)) : +hour;
                                        seriesInit['zoneAxis'] = 'x';
                                        seriesInit['zones'] = [{
                                            value: doted - 1
                                        }, {
                                            value: doted,
                                            dashStyle: 'ShortDash'
                                        }, {
                                            dashStyle: 'dot',
                                            color: '#fff'
                                        }];
                                    }
                                }

                                series.push(seriesInit);

                                //compare
                                if (scope.options.compare) {
                                    angular.forEach(scope.chart.LineChart.data.rows, function (row, key) {
                                        var val = row[name][1] ? parseFloat(row[name][1]) : 0;

                                        seriesDataComp.push(val);

                                        if (jQuery.inArray(row['compare'], tooltipFormatterComp) == -1) {
                                            tooltipFormatterComp.push(row['compare']);
                                        }
                                    });

                                    //Visible series
                                    if (jQuery.inArray(name, scope.params.metric_code) != -1) {
                                        visibleComp = true;
                                    }

                                    var seriesInitComp = {
                                        name: metric_name,
                                        yAxis: index == 0 ? index : 1,
                                        data: seriesDataComp,
                                        tooltip: {
                                            valueSuffix: ''
                                        },
                                        visible: visibleComp,
                                        color: typeof scope.options.compare_color[index] != 'undefined' ? scope.options.compare_color[index] : '#7dc1de',
                                        marker: {
                                            symbol: 'circle'
                                        }
                                    };

                                    //line chart dot at current day
                                    if (scope.params.time == "day" && scope.params.to_range) {
                                        var end_date = moment(scope.params.to_range, 'DD/MM/YYYY').valueOf();

                                        if (end_date == now) {
                                            seriesInitComp['zoneAxis'] = 'x';
                                            seriesInitComp['zones'] = [{
                                                value: scope.chart.LineChart.data.rows.length - 1
                                            }, {
                                                dashStyle: 'dot'
                                            }];
                                        }
                                    } else if(scope.params.time == "hour"){
                                        var end_date = moment(scope.params.to_range, 'DD/MM/YYYY').valueOf();

                                        if (end_date == now) {
                                            var doted = line_length >  24 ? line_length - (24 - (+hour)) : +hour;
                                            seriesInitComp['zoneAxis'] = 'x';
                                            seriesInitComp['zones'] = [{
                                                value: doted - 1
                                            }, {
                                                value: doted,
                                                dashStyle: 'ShortDash'
                                            }, {
                                                dashStyle: 'dot',
                                                color: '#fff'
                                            }];
                                        }
                                    }

                                    //
                                    series.push(seriesInitComp);
                                }

                                charts.push(key);
                            }
                        });

                        if (scope.chart.LineChart.data.rows.length > 7) {
                            tickInterval = Math.round(scope.chart.LineChart.data.rows.length / 7);

                            if(scope.params.time == "hour" || scope.params.time == "week"){
                                tickInterval = Math.round(scope.chart.LineChart.data.rows.length / 4);
                            }

                            if(tickInterval <= 1){
                                tickInterval = 2;
                            }
                        }
                    }

                    //plotBands
                    var plotBands = [];

                    if(typeof scope.chart.LineChart.data.rows !== 'undefined'){
                        if(tickInterval > 2){
                            for(var i = tickInterval; i < scope.chart.LineChart.data.rows.length; i = i + tickInterval * 2){
                                var plot = {
                                    color: '#fafafa',
                                    from: i,
                                    to: i + tickInterval
                                };
                                plotBands.push(plot);
                            }
                        }else {
                            for(var i = 1; i < scope.chart.LineChart.data.rows.length; i = i + 2){
                                var plot = {
                                    color: '#fafafa',
                                    from: i,
                                    to: i + 1
                                };
                                plotBands.push(plot);
                            }
                        }
                    }

                    angular.element(element[0].querySelector('.chart-container')).highcharts({
                        chart: {
                            zoomType: 'xy',
                            height: 170,
                            style: {
                                fontFamily: 'Roboto'
                            }
                        },
                        title: {
                            text: ''
                        },
                        xAxis: [{
                            minPadding: 0,
                            maxPadding: 0,
                            startOnTick: true,
                            tickWidth: 0,
                            lineColor: '#f4f4f4',
                            tickInterval: tickInterval,
                            labels: {
                                rotation: 0,
                                style: {
                                    color: "#b0b0b0"
                                },
                                useHTML: true,
                                formatter: function () {
                                    var label = '';
                                    if(typeof categories[this.value] !== 'undefined' && !scope.options.compare){
                                        label = '<p style="position: relative; width: 100px; text-align: center">'+ categories[this.value] +'</p>';
                                    }

                                    return label;
                                }
                            },
                            plotBands: plotBands
                        }],
                        yAxis: [{
                            // Primary yAxis
                            gridLineColor: '#f4f4f4',
                            labels: {
                                format: '',
                                style: {
                                    color: '#b0b0b0'
                                }
                            },
                            title: {
                                text: '',
                                style: {
                                    color: '#333'
                                }
                            },
                            opposite: true,
                            min: 0
                        }, {
                            // Secondary yAxis
                            gridLineColor: '#f4f4f4',
                            title: {
                                text: '',
                                style: {
                                    color: '#333'
                                }
                            },
                            labels: {
                                format: '',
                                style: {
                                    color: '#b0b0b0'
                                }
                            },
                            min: 0
                        }],
                        tooltip: {
                            shared: true,
                            crosshairs: true,
                            useHTML: true,
                            borderWidth: 0,
                            formatter: function () {
                                var me = this,
                                    html = '',
                                    arr_basket = [],
                                    arr_basket_comp = [],
                                    date = categories[me.x] ? categories[me.x] : me.x,
                                    index_comp = $.inArray(date, tooltipFormatter);

                                if(!$.isNumeric(date)){
                                    html += date + '<br>';
                                }

                                //Truong hop compare
                                if (scope.options.compare) {
                                    var date_comp = tooltipFormatterComp[index_comp];
                                    //
                                    var j = 0,
                                        html_basket = '',
                                        html_basket_comp = '';
                                    //
                                    angular.forEach(me.points, function (item, i) {

                                        //format CTR
                                        var name = me.points[i].series.name;
                                        var value = 0;

                                        if(name.toLowerCase().indexOf('ctr') > -1){
                                            value = scope.numberFormat(me.points[i].y, 3);
                                        }else{
                                            value = scope.numberFormat(me.points[i].y);
                                        }

                                        if (jQuery.inArray(me.points[i].series.name, arr_basket) == -1) {
                                            arr_basket.push(me.points[i].series.name);

                                            if(!$.isNumeric(date)){
                                                html_basket += ' <span style="display: inline-block; width: 7px; height: 7px; background: '+ me.points[i].series.color +'"></span> ' + me.points[i].series.name + ': ' + '<b>' + value + '</b><br>';
                                            }

                                        } else if(typeof date_comp != 'undefined'){
                                            arr_basket_comp.push(me.points[i].series.name);
                                            //
                                            if (j == 0 && !$.isNumeric(date_comp)) {
                                                html_basket_comp += date_comp + '<br>';
                                            }

                                            if(!$.isNumeric(date_comp)){
                                                html_basket_comp += ' <span style="display: inline-block; width: 7px; height: 7px; background: '+ me.points[i].series.color +'"></span> ' + me.points[i].series.name + ': ' + '<b>' + value + '</b><br>';
                                            }

                                            j++;
                                        }
                                    });

                                    //
                                    html += html_basket + html_basket_comp;
                                } else {
                                    //
                                    angular.forEach(me.points, function (item, i) {

                                        var name = me.points[i].series.name;
                                        var value = 0;

                                        //format CTR, True_ctr, CR, CIR
                                        if(name.toLowerCase().indexOf('ctr') > -1){
                                            value = scope.numberFormat(me.points[i].y, 3);
                                        }else{
                                            value = scope.numberFormat(me.points[i].y);
                                        }
                                        html += ' <span style="display: inline-block; width: 7px; height: 7px; background: '+ me.points[i].series.color +'"></span> ' + me.points[i].series.name + ': ' + '<b>' + value + '</b><br>';
                                    });
                                }
                                //
                                return html;
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        credits: {
                            text: '',
                            href: 'http://ants.vn'
                        },
                        series: series
                    });
                };

                scope.seriesVisible = function($object){
                    var chart = scope.chart.view.highcharts(),
                        index = jQuery.inArray($object, charts);

                    if (scope.settings.compare) {
                        //
                        index = index * 2;
                        var index_comp = index + 1;
                        //
                        if (index != -1) {
                            if (chart.series[index].visible) {
                                chart.series[index].hide();
                                chart.series[index_comp].hide();
                            } else {
                                chart.series[index].show();
                                chart.series[index_comp].show();
                            }
                        }
                    } else {
                        if (index != -1) {
                            if (chart.series[index].visible) {
                                chart.series[index].hide();
                            } else {
                                chart.series[index].show();
                            }
                        }
                    }
                };

                scope.numberFormat = function (number, decimals, dec_point, thousands_sep) {
                    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
                    var n = !isFinite(+number) ? 0 : +number,
                        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                        s = '',
                        toFixedFix = function (n, prec) {
                            var k = Math.pow(10, prec);
                            return '' + Math.round(n * k) / k;
                        };
                    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
                    if (s[0].length > 3) {
                        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
                    }
                    if ((s[1] || '').length < prec) {
                        s[1] = s[1] || '';
                        s[1] += new Array(prec - s[1].length + 1).join('0');
                    }
                    return s.join(dec);
                };

                scope.convertTime = function(from_date, to_date){
                    var duration = [];
                    if(typeof from_date !== 'undefined'  && typeof to_date !== 'undefined'){

                        from_date = moment(from_date, 'DD/MM/YYYY');
                        to_date = moment(to_date, 'DD/MM/YYYY');

                        switch (scope.params.time) {
                            case 'day':
                                while(from_date.diff(to_date, 'days') <= 0){
                                    duration.push(from_date.format('MMMM D, YYYY'));

                                    from_date = from_date.add(1, 'days');
                                }
                                break;
                            case 'week':
                                while(from_date.diff(to_date, 'days') <= 0){
                                    from_date = from_date.day("Monday");
                                    duration.push('Week of ' + from_date.format('MMMM D, YYYY'));

                                    from_date.add(1, 'weeks');
                                }

                                break;
                            case 'month':
                                while(from_date.diff(to_date, 'days') <= 0){
                                    from_date = from_date.day(1);
                                    duration.push(from_date.format('MMMM, YYYY'));

                                    from_date.add(1, 'months');
                                }

                                break;
                        }
                    }
                    return duration;
                };

                scope.compareChart = function(params, activity){
                    var chartjs = element[0];

                    var from_date = moment(scope.params.from_date, 'DD/MM/YYYY'),
                        to_date = moment(scope.params.to_date, 'DD/MM/YYYY'),
                        from_range = moment(scope.params.from_range, 'DD/MM/YYYY'),
                        to_range = moment(scope.params.to_range, 'DD/MM/YYYY');

                    var time_duration = moment.duration(to_date.diff(from_date)).asDays();
                    var compare_duration = moment.duration(to_range.diff(from_range)).asDays();

                    //xu ly datetime compare
                    var timeRange = [];

                    if(time_duration >= compare_duration){
                        if(typeof scope.params.from_range !== 'undefined'  && typeof scope.params.to_range !== 'undefined'){
                            timeRange = scope.convertTime(scope.params.from_range, scope.params.to_range);
                        }

                        //xu ly data compare
                        if(scope.chart[scope.options.chartType].data){

                            var compare = scope.chart[scope.options.chartType].compare;

                            if(scope.chart.LineChart.data.rows.length){
                                angular.forEach(scope.chart.LineChart.data.rows, function(row, index) {
                                    //
                                    if(!compare.rows.length){
                                        row['compare'] = typeof timeRange[index] !== 'undefined' ? timeRange[index] : index;

                                    }else{
                                        row['compare'] = compare.rows && compare.rows[index] ? compare.rows[index]['title'] : index;
                                    }

                                    angular.forEach(scope.chart.LineChart.data.fields, function(name, key) {
                                        if(row[name]){
                                            row[name][1] = compare.rows && compare.rows[index] ? compare.rows[index][name][0] : 0;
                                        }
                                    });
                                });


                            }else{
                                var timeDate = [];
                                if(typeof scope.params.from_date !== 'undefined'  && typeof scope.params.to_date !== 'undefined'){
                                    timeDate = scope.convertTime(scope.params.from_date, scope.params.to_date);
                                }

                                var rows = [];
                                angular.forEach(timeDate, function(time, index) {
                                    var row = {
                                        'title': time
                                    };

                                    if(!compare.rows.length){
                                        row['compare'] = typeof timeRange[index] !== 'undefined' ? timeRange[index] : index;

                                    }else{
                                        row['compare'] = compare.rows && compare.rows[index] ? compare.rows[index]['title'] : index;
                                    }

                                    angular.forEach(scope.chart.LineChart.data.fields, function(name, key) {
                                        row[name] = [];
                                        row[name][0] = 0;

                                        //Field compare
                                        if(row[name]){
                                            row[name][1] = compare.rows && compare.rows[index] ? compare.rows[index][name][0] : 0;
                                        }
                                    });

                                    rows.push(row);
                                });

                                scope.chart.LineChart.data.rows = rows;
                            }

                            if(scope.chart[scope.options.chartType].compare){
                                delete scope.chart[scope.options.chartType].compare;
                            }
                        }
                    }else{
                        if(typeof scope.params.from_date !== 'undefined'  && typeof scope.params.to_date !== 'undefined'){
                            timeRange = scope.convertTime(scope.params.from_date, scope.params.to_date);
                        }

                        //
                        if(scope.chart[scope.options.chartType].compare){

                            var data = scope.chart[scope.options.chartType].data;

                            if(scope.chart[scope.options.chartType].compare.rows.length){
                                angular.forEach(scope.chart[scope.options.chartType].compare.rows, function(row, index) {
                                    row['compare'] = row['title'];

                                    if(!data.rows.length){
                                        row['title'] = typeof timeRange[index] !== 'undefined' ? timeRange[index] : index;
                                    }else{
                                        row['title'] = data.rows && data.rows[index] ? data.rows[index]['title'] : index;
                                    }

                                    angular.forEach(scope.chart.LineChart.compare.fields, function(name, key) {
                                        if(row[name]){
                                            row[name][1] = row[name][0];
                                            row[name][0] = data.rows && data.rows[index] ? data.rows[index][name][0] : 0;
                                        }
                                    });
                                });

                                scope.chart[scope.options.chartType].data.rows = scope.chart[scope.options.chartType].compare.rows;
                            }else{
                                var timeDate = [];
                                if(typeof scope.params.from_range !== 'undefined'  && typeof scope.params.to_range !== 'undefined'){
                                    timeDate = scope.convertTime(scope.params.from_range, scope.params.to_range);
                                }

                                var rows = [];
                                angular.forEach(timeDate, function(time, index) {
                                    var row = {
                                        'compare': time
                                    };

                                    if(!data.rows.length){
                                        row['title'] = typeof timeRange[index] !== 'undefined' ? timeRange[index] : index;
                                    }else{
                                        row['title'] = data.rows && data.rows[index] ? data.rows[index]['title'] : index;
                                    }

                                    angular.forEach(scope.chart.LineChart.data.fields, function(name, key) {
                                        row[name] = [];

                                        //Field
                                        if(row[name]){
                                            row[name][0] = data.rows && data.rows[index] ? data.rows[index][name][0] : 0;
                                        }

                                        row[name][1] = 0;
                                    });

                                    rows.push(row);
                                });

                                scope.chart.LineChart.data.rows = rows;
                            }
                        }
                    }

                    //show/hide no activity
                    if(activity){
                        //show chart
                        angular.element(chartjs.querySelector('.no-activity')).fadeOut();
                        angular.element(chartjs.querySelector('.chart-container')).show();
                    }else {
                        //show template no data range
                        angular.element(chartjs.querySelector('.chart-container')).hide();
                        angular.element(chartjs.querySelector('.no-activity')).show();
                    }

                    //render chart
                    if (scope.options.chartType == "LineChart") {
                        scope.chartLine();
                    }

                    angular.element(chartjs.querySelector('.loading')).fadeOut();
                };

                scope.render = function(params){

                    scope.params = angular.extend(scope.params, params);

                    //get params from url
                    scope.getParamFromUrl();

                    if(scope.settings.filter){
                        var filter = angular.copy(scope.settings.filter);

                        if(scope.params.filter){
                            angular.forEach(scope.params.filter, function (filter_info) {
                                filter.push(filter_info);
                            });

                            scope.params.filter = filter;
                        }else{
                            scope.params.filter = filter;
                        }
                    }

                    if(typeof scope.params.datepicker == 'undefined' ||  typeof scope.params.filter_top == 'undefined'){
                        return;
                    }else{
                        var metric_code = [];
                        var metric_name = [];
                        if (scope.params.metric_show) {
                            angular.forEach(scope.params.metric_show, function (row, key) {
                                if (typeof row.metric_code != 'undefined' && jQuery.inArray(row.metric_code.toLowerCase(), metric_code) == -1) {
                                    metric_code.push(row.metric_code.toLowerCase());
                                    metric_name.push(row.metric_name);
                                }
                            });
                        }

                        scope.params.metric_code = metric_code;
                        scope.params.metric_name = metric_name;
                    }

                    var chartjs = element[0];

                    //loading
                    angular.element(chartjs.querySelector('.no-activity')).hide();
                    angular.element(chartjs.querySelector('.chart-container')).fadeIn(100);
                    angular.element(chartjs.querySelector('.loading')).fadeIn();

                    if(typeof scope.params.from_range != 'undefined' && typeof scope.params.to_range != 'undefined' &&
                        scope.params.from_range != '' && scope.params.to_range != ''){
                        scope.options.compare = true;
                    }else {
                        scope.options.compare = false;
                    }

                    var param = {
                        format: 'chart',
                        segments: scope.params.time,
                        sort: '',
                        az: '',
                        fields: scope.params.metric_code ? scope.params.metric_code.join() : 'click, impression',
                        from_date: scope.params.from_date,
                        to_date: scope.params.to_date,
                        time: scope.params.time,
                        filter: scope.params.filter ? JSON.stringify(scope.params.filter) : JSON.stringify(scope.options.filter)
                    };

                    if(scope.params.list_account_filter){
                        param.list_account_filter = scope.params.list_account_filter;
                    }

                    //compare date time, call 2 request
                    if (scope.options.compare){
                        var compare = {
                            format: 'chart',
                            segments: scope.params.time,
                            sort: '',
                            az: '',
                            fields: scope.params.metric_code ? scope.params.metric_code.join() : 'click, impression',
                            from_date: scope.params.from_range,
                            to_date: scope.params.to_range,
                            time: scope.params.time,
                            filter: scope.params.filter ? JSON.stringify(scope.params.filter) : JSON.stringify(scope.options.filter)
                        };

                        if(scope.params.list_account_filter){
                            compare.list_account_filter = scope.params.list_account_filter;
                        }

                        var first_finished = false,
                            compare_finished = false,
                            activity = false;

                        //request first
                        scope.options.model.getList(param, function (resp) {
                            first_finished = true;

                            scope.chart[scope.options.chartType].data = resp.data ? resp.data : [];

                            if(typeof resp.data.rows !== 'undefined' && resp.data.rows.length){
                                activity = true;
                            }

                            //
                            if(compare_finished){
                                scope.compareChart(param, activity);
                            }
                        });

                        //request compare
                        scope.options.model.getList(compare, function (resp) {
                            compare_finished = true;

                            scope.chart[scope.options.chartType].compare = resp.data ? resp.data : [];

                            if(typeof resp.data.rows !== 'undefined' && resp.data.rows.length){
                                activity = true;
                            }

                            //
                            if(first_finished){
                                scope.compareChart(compare, activity);
                            }
                        });

                    }else{
                        scope.options.model.getList(param, function (resp) {
                            //loading
                            angular.element(chartjs.querySelector('.loading')).fadeOut();

                            if(typeof resp.data.rows !== 'undefined' && resp.data.rows.length){
                                //show chart
                                angular.element(chartjs.querySelector('.no-activity')).fadeOut();
                                angular.element(chartjs.querySelector('.chart-container')).show();

                                scope.chart[scope.options.chartType].data = resp.data ? resp.data : [];
                                if (scope.options.chartType == "LineChart") {
                                    scope.chartLine();
                                }
                            }else{
                                //show template no data range
                                angular.element(chartjs.querySelector('.chart-container')).hide();
                                angular.element(chartjs.querySelector('.no-activity')).fadeIn();
                            }
                        });
                    }
                };

                scope.getParamFromUrl = function () {
                    if ($location.search().filter != undefined) {
                        scope.params.filter = JSON.parse($location.search().filter);
                    }

                    if ($location.search().from_date != undefined) {
                        scope.params.from_date = $location.search().from_date;
                    }

                    if ($location.search().to_date != undefined) {
                        scope.params.to_date = $location.search().to_date;
                    }
                }

            },
            controller: function ($scope, $element, $attrs) {
                this.renderChart = function(params){
                    $scope.render(params);
                };

                $scope.$on(AUTH_EVENTS.changeSupportUser, function () {
                    $scope.render();
                });

                $scope.$on(APP_EVENTS.reloadChart, function (params, args) {
                    if(args.list_account_filter != undefined){
                        $scope.render({'list_account_filter': args.list_account_filter});
                    }
                });
            },
            templateUrl: '/js/shared/templates/chart/chart.html?v=' + ST_VERSION
        };
    });
});
