/**
 * Created by nhanva on 4/28/2016.
 */
define(['app', 'libs/jquery-ui/jquery-ui.min', 'libs/moment/moment'], function (app) {

    app.directive('adxDatePicker', function (debounce, Storage, appConfig, $state, APP_EVENTS) {
        return {
            restrict: 'E',
            scope: {
                from_date: '=?from_date',
                to_date: '=?to_date',
                datepicker: '&datepicker',
                params: '=params'
            },
            require: "^operations",
            link: function (scope, element, attrs, ctrl) {
                // Config datepicker
                scope.opened = false;
                scope.arrRange = {
                    from_date: '',
                    to_date: '',
                    from_range: '',
                    to_range: '',
                    show: ''
                };

                angular.extend(scope.params || {}, scope.arrRange);

                // Store selected range and compare range
                scope.rangeSelected = '';
                scope.customCompare = 'previous_period';
                scope.dateShow = '';
                scope.dateCompareShow = '';
                scope.rangeShow = '';
                scope.selectShow = '';

                // Show or hide compare option
                scope.isShowCompare = false;

                scope.visibleCompare = true;
                if(typeof scope.params.visibleCompare != 'undefined' && !scope.params.visibleCompare){
                    scope.visibleCompare = false;
                }

                // Default range
                scope.ranges = [
                    {value: 'Today', key: 'today'},
                    {value: 'Yesterday', key: 'yesterday'},
                    {value: 'This week (Sun - Today)', key: 'sun_today'},
                    {value: 'This week (Mon - Today)', key: 'mon_today'},
                    {value: 'Last 7 days', key: 'last_7_day'},
                    {value: 'Last week (Sun - Sat)', key: 'last_week_sun_sat'},
                    {value: 'Last week (Mon - Sun)', key: 'last_week_mon_sun'},
                    {value: 'Last business week (Mon - Fri)', key: 'last_business_week'},
                    {value: 'Last 14 days', key: 'last_14_day'},
                    {value: 'This month', key: 'this_month'},
                    {value: 'Last 30 days', key: 'last_30_day'},
                    {value: 'Last month', key: 'last_month'}
                    /*{value: 'All time', key: 'all_time'}*/
                ];

                scope.compare = [
                    {value: 'Previous period', key: 'previous_period'},
                    {value: 'Same period last year', key: 'same_period_last_year'}
                ];

                //
                var arrRange = Storage.read('calendar');

                if (arrRange) {
                    angular.extend(scope.arrRange, arrRange);
                    scope.rangeSelected = scope.arrRange.selected ? scope.arrRange.selected : 'last_7_day';

                    //Tinh toan lai thoi gian khi chon range ngoai custom
                    if(typeof scope.arrRange.selected !== 'undefined' && scope.arrRange.selected != 'custom'){
                        switch (scope.arrRange.selected){
                            case 'today':
                                scope.arrRange.from_date = moment().format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);

                                break;
                            case 'yesterday':
                                scope.arrRange.from_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().subtract(2, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(2, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);
                                break;
                            case 'sun_today':
                                scope.arrRange.from_date = moment().day("Sunday").format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().day("Sunday").subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().day("Sunday").subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);
                                break;
                            case 'mon_today':
                                scope.arrRange.from_date = moment().isoWeekday(1).format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().day("Monday").subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().day("Monday").subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);
                                break;
                            case 'last_7_day':
                                scope.arrRange.from_date = moment().subtract(7, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().subtract(14, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(8, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().subtract(7, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);
                                break;
                            case 'last_week_sun_sat':
                                scope.arrRange.from_date = moment().day(-7).format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().day(-1).format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().day(-7).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().day(-1).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().day(-7).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().day(-1).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);

                                break;
                            case 'last_week_mon_sun':
                                scope.arrRange.from_date = moment().day(-6).format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().day(0).format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().day(-6).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().day(0).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().day(-6).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().day(0).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);

                                break;
                            case 'last_business_week':
                                scope.arrRange.from_date = moment().day(-6).format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().day(-2).format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().day(-6).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().day(-2).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().day(-6).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().day(-2).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);

                                break;
                            case 'last_14_day':
                                scope.arrRange.from_date = moment().subtract(14, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().subtract(28, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(15, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().subtract(14, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);

                                break;
                            case 'this_month':
                                scope.arrRange.from_date = moment().date(1).format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().subtract(1, 'months').startOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'months').endOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().date(1).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);

                                break;
                            case 'last_30_day':
                                scope.arrRange.from_date = moment().subtract(30, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().subtract(60, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(31, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().subtract(30, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);

                                break;
                            case 'last_month':
                                scope.arrRange.from_date = moment().subtract(1, 'months').startOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                scope.arrRange.to_date = moment().subtract(1, 'months').endOf('month').format(appConfig.MOMENT_DATE_FORMAT);

                                if(scope.arrRange.compare && scope.arrRange.customCompare){
                                    switch (scope.arrRange.customCompare){
                                        case 'previous_period':
                                            scope.arrRange.from_range = moment().subtract(2, 'months').startOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(2, 'months').endOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                        case 'same_period_last_year':
                                            scope.arrRange.from_range = moment().subtract(1, 'months').startOf('month').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            scope.arrRange.to_range = moment().subtract(1, 'months').endOf('month').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                            break;
                                    }
                                }

                                //Update storage
                                Storage.write('calendar', scope.arrRange);

                                break;
                        }
                    }

                    //set custom compare
                    scope.customCompare = scope.arrRange.customCompare ? scope.arrRange.customCompare : scope.customCompare;
                    scope.isShowCompare = scope.arrRange.compare ? scope.arrRange.compare : scope.isShowCompare;
                } else {
                    var arrRange = {
                        from_date: moment().subtract(7, 'days').format(appConfig.MOMENT_DATE_FORMAT),
                        to_date: moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT),
                        from_range: '',
                        to_range: '',
                        show: 'Last 7 days',
                        selected: 'last_7_day',
                        compare: scope.isShowCompare,
                        customCompare: scope.customCompare
                    };

                    scope.arrRange.from_date = arrRange.from_date;
                    scope.arrRange.to_date = arrRange.to_date;
                    scope.arrRange.show = arrRange.show;

                    scope.dateShow = moment(scope.arrRange.from_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY') + ' - ' + moment(scope.arrRange.to_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');

                    if(scope.isShowCompare){
                        scope.dateCompareShow = moment(scope.arrRange.from_range, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY') + ' - ' + moment(scope.arrRange.to_range, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');
                    }

                    scope.rangeShow = arrRange.show;

                    Storage.write('calendar', arrRange);
                }

                //set init params
                scope.params.from_date = scope.arrRange.from_date;
                scope.params.to_date = scope.arrRange.to_date;
                scope.params.from_range = scope.arrRange.from_range ? scope.arrRange.from_range : '';
                scope.params.to_range = scope.arrRange.to_range ? scope.arrRange.to_range : '';

                //set custom date
                scope.from_date = scope.arrRange.from_date;
                scope.to_date = scope.arrRange.to_date;
                scope.from_range = scope.arrRange.from_range ? scope.arrRange.from_range : '';
                scope.to_range = scope.arrRange.to_range ? scope.arrRange.to_range : '';

                //
                scope.selectShow = scope.rangeSelected = arrRange.selected;
                switch (scope.selectShow){
                    case 'today':
                    case 'yesterday':
                        scope.dateShow = moment(scope.arrRange.from_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');
                        break;
                }

                //call grid and chart
                if($state.current && $state.current.name){
                    switch ($state.current.name){
                        case 'report':
                        case 'report.create':
                        case 'report.detail':
                        case 'report.detail.predefined':
                        case 'campaigns.target.summary':
                            //do nothing
                            break;
                        default:
                            ctrl.renderChart(angular.extend(scope.params, {datepicker: true}));
                            ctrl.renderGrid(angular.extend(scope.params, {fc: 'datepicker'}));
                            break;
                    }
                }

                scope.datepicker();

                // Toggle compare
                scope.toggleCompare = function () {
                    scope.isShowCompare = !scope.isShowCompare;

                    //change show date
                    scope.changeDateShow();
                };

                // Change range
                scope.changeDate = function (key, value) {
                    scope.rangeSelected = key;

                    if (key != 'custom') {
                        scope.rangeShow = value;
                    }

                    //change show date
                    scope.changeDateShow();

                    //
                    setTimeout(function () {
                        scope.setPosition();
                    }, 10);

                };

                // Change compare
                scope.changeCompare = function (key) {
                    scope.customCompare = key;

                    //change show date
                    scope.changeDateShow();
                };

                //Change date event
                scope.changeDateShow = function () {
                    switch (scope.rangeSelected) {
                        case 'today':
                            scope.dateShow = moment().format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().subtract(1, 'days').format('MMMM D, YYYY');

                                        scope.from_range = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.from_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'yesterday':
                            scope.dateShow = moment().subtract(1, 'days').format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().subtract(2, 'days').format('MMMM D, YYYY');

                                        scope.from_range = moment().subtract(2, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(2, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().subtract(1, 'days').subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.from_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'sun_today':
                            scope.dateShow = moment().day("Sunday").format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().day("Sunday").subtract(1, 'weeks').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'weeks').format('MMMM D, YYYY');

                                        scope.from_range = moment().day("Sunday").subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().day("Sunday").subtract(1, 'years').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.from_range = moment().day("Sunday").subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().day("Sunday").format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'mon_today':
                            scope.dateShow = moment().isoWeekday(1).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().day("Monday").subtract(1, 'weeks').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'weeks').format('MMMM D, YYYY');

                                        scope.from_range = moment().day("Monday").subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().day("Monday").subtract(1, 'years').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.from_range = moment().day("Monday").subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().day("Monday").format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'last_7_day':
                            scope.dateShow = moment().subtract(7, 'days').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'days').format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().subtract(14, 'days').format('MMMM D, YYYY') + ' - ' + moment().subtract(8, 'days').format('MMMM D, YYYY');

                                        scope.from_range = moment().subtract(14, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(8, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().subtract(7, 'days').subtract(1, 'years').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'days').subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.from_range = moment().subtract(7, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().subtract(7, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'last_week_sun_sat':
                            scope.dateShow = moment().day(-7).format('MMMM D, YYYY') + ' - ' + moment().day(-1).format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().day(-7).subtract(1, 'weeks').format('MMMM D, YYYY') + ' - ' + moment().day(-1).subtract(1, 'weeks').format('MMMM D, YYYY');

                                        scope.from_range = moment().day(-7).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().day(-1).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().day(-7).subtract(1, 'years').format('MMMM D, YYYY') + ' - ' + moment().day(-1).subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.from_range = moment().day(-7).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().day(-1).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().day(-7).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().day(-1).format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'last_week_mon_sun':
                            scope.dateShow = moment().day(-6).format('MMMM D, YYYY') + ' - ' + moment().day(0).format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().day(-6).subtract(1, 'weeks').format('MMMM D, YYYY') + ' - ' + moment().day(0).subtract(1, 'weeks').format('MMMM D, YYYY');

                                        scope.from_range = moment().day(-6).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().day(0).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().day(-6).subtract(1, 'years').format('MMMM D, YYYY') + ' - ' + moment().day(0).subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.from_range = moment().day(-6).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().day(0).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().day(-6).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().day(0).format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'last_business_week':
                            scope.dateShow = moment().day(-6).format('MMMM D, YYYY') + ' - ' + moment().day(-2).format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().day(-6).subtract(1, 'weeks').format('MMMM D, YYYY') + ' - ' + moment().day(-2).subtract(1, 'weeks').format('MMMM D, YYYY');

                                        scope.from_range = moment().day(-6).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().day(-2).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().day(-6).subtract(1, 'years').format('MMMM D, YYYY') + ' - ' + moment().day(-2).subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.from_range = moment().day(-6).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().day(-2).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().day(-6).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().day(-2).format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'last_14_day':
                            scope.dateShow = moment().subtract(14, 'days').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'days').format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().subtract(28, 'days').format('MMMM D, YYYY') + ' - ' + moment().subtract(15, 'days').format('MMMM D, YYYY');

                                        scope.from_range = moment().subtract(28, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(15, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().subtract(14, 'days').subtract(1, 'years').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'days').subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.from_range = moment().subtract(14, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().subtract(14, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'this_month':
                            scope.dateShow = moment().date(1).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().subtract(1, 'months').startOf('month').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'months').endOf('month').format('MMMM D, YYYY');

                                        scope.from_range = moment().subtract(1, 'months').startOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'months').endOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().date(1).subtract(1, 'years').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.from_range = moment().date(1).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().date(1).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'last_30_day':
                            scope.dateShow = moment().subtract(30, 'days').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'days').format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().subtract(60, 'days').format('MMMM D, YYYY') + ' - ' + moment().subtract(31, 'days').format('MMMM D, YYYY');

                                        scope.arrRange.from_range = moment().subtract(60, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(31, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().subtract(30, 'days').subtract(1, 'years').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'days').subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.arrRange.from_range = moment().subtract(30, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().subtract(30, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'last_month':
                            scope.dateShow = moment().subtract(1, 'months').startOf('month').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'months').endOf('month').format('MMMM D, YYYY');

                            //Change show compare
                            if(scope.isShowCompare){
                                switch (scope.customCompare){
                                    case 'previous_period':
                                        scope.dateCompareShow = moment().subtract(2, 'months').startOf('month').format('MMMM D, YYYY') + ' - ' + moment().subtract(2, 'months').endOf('month').format('MMMM D, YYYY');

                                        scope.arrRange.from_range = moment().subtract(2, 'months').startOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(2, 'months').endOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                    case 'same_period_last_year':
                                        scope.dateCompareShow = moment().subtract(1, 'months').startOf('month').subtract(1, 'years').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'months').endOf('month').subtract(1, 'years').format('MMMM D, YYYY');

                                        scope.arrRange.from_range = moment().subtract(1, 'months').startOf('month').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'months').endOf('month').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            }

                            //Update input date time
                            scope.from_date = moment().subtract(1, 'months').startOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.to_date = moment().subtract(1, 'months').endOf('month').format(appConfig.MOMENT_DATE_FORMAT);

                            break;
                        case 'all_time':
                            //scope.date = moment().add({days:-1});
                            break;
                    }
                };

                scope.$watch(
                    "opened",
                    function handleToggleChange() {
                        if (!scope.opened) {
                            scope.rangeSelected = scope.selectShow ? scope.selectShow : scope.rangeSelected;

                            switch (scope.rangeSelected){
                                case 'today':
                                case 'yesterday':
                                    scope.dateShow = moment(scope.arrRange.from_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');

                                    //show compare
                                    if(scope.isShowCompare && scope.arrRange.from_range && scope.arrRange.to_range){
                                        scope.dateCompareShow = moment(scope.arrRange.from_range, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');
                                    }
                                    break;
                                default:
                                    scope.dateShow = moment(scope.arrRange.from_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY') + ' - ' +
                                        moment(scope.arrRange.to_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');

                                    //show compare
                                    if(scope.isShowCompare && scope.arrRange.from_range && scope.arrRange.to_range){
                                        scope.dateCompareShow = moment(scope.arrRange.from_range, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY') + ' - ' +
                                            moment(scope.arrRange.to_range, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');
                                    }
                                    break;
                            }

                            scope.rangeShow = scope.arrRange.show;
                            scope.isShowCompare = scope.arrRange.compare;

                            scope.setPosition();
                        }
                    }, true
                );

                // Apply event
                scope.apply = function () {
                    scope.opened = false;
                    scope.arrRange.compare = scope.isShowCompare;
                    scope.arrRange.customCompare = scope.customCompare;

                    switch (scope.rangeSelected) {
                        case 'custom':
                            //show
                            if (typeof scope.from_date != 'undefined' && scope.to_date != 'undefined') {
                                //truong hop from date > to date
                                var from_date = moment(scope.from_date, appConfig.MOMENT_DATE_FORMAT);
                                var to_date = moment(scope.to_date, appConfig.MOMENT_DATE_FORMAT);

                                var date_diff = to_date.diff(from_date, 'days');
                                if (date_diff < 0) {
                                    //set to_date = from_date
                                    scope.to_date = scope.from_date;
                                }

                                scope.dateShow = moment(scope.from_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY') + ' - ' + moment(scope.to_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');
                            } else {
                                scope.dateShow = moment().subtract(7, 'days').format('MMMM D, YYYY') + ' - ' + moment().subtract(1, 'days').format('MMMM D, YYYY');
                            }

                            scope.arrRange.from_date = scope.from_date;
                            scope.arrRange.to_date = scope.to_date;
                            scope.rangeShow = 'Custom';
                            scope.arrRange.show = 'Custom';

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        var from_date = moment(scope.params.from_date, appConfig.MOMENT_DATE_FORMAT);
                                        var to_date = moment(scope.params.to_date, appConfig.MOMENT_DATE_FORMAT);

                                        var date_diff = to_date.diff(from_date, 'days');

                                        scope.arrRange.from_range = moment(scope.from_date, appConfig.MOMENT_DATE_FORMAT).subtract(date_diff + 1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.from_date, appConfig.MOMENT_DATE_FORMAT).subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment(scope.from_date, appConfig.MOMENT_DATE_FORMAT).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_date, appConfig.MOMENT_DATE_FORMAT).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'today':
                            scope.arrRange.from_date = moment().format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'yesterday':
                            scope.arrRange.from_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().subtract(2, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(2, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'sun_today':
                            scope.arrRange.from_date = moment().day("Sunday").format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().day("Sunday").subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().day("Sunday").subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'mon_today':
                            scope.arrRange.from_date = moment().isoWeekday(1).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().day("Monday").subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().day("Monday").subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'last_7_day':
                            scope.arrRange.from_date = moment().subtract(7, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().subtract(14, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(8, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().subtract(7, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'last_week_sun_sat':
                            scope.arrRange.from_date = moment().day(-7).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().day(-1).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().day(-7).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().day(-1).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().day(-7).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().day(-1).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'last_week_mon_sun':
                            scope.arrRange.from_date = moment().day(-6).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().day(0).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().day(-6).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().day(0).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().day(-6).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().day(0).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'last_business_week':
                            scope.arrRange.from_date = moment().day(-6).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().day(-2).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().day(-6).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().day(-2).subtract(1, 'weeks').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().day(-6).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().day(-2).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'last_14_day':
                            scope.arrRange.from_date = moment().subtract(14, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().subtract(28, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(15, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().subtract(14, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'this_month':
                            scope.arrRange.from_date = moment().date(1).format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().subtract(1, 'months').startOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'months').endOf('month').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().date(1).subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'last_30_day':
                            scope.arrRange.from_date = moment().subtract(30, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().subtract(1, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().subtract(60, 'days').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(31, 'days').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().subtract(30, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'days').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'last_month':
                            scope.arrRange.from_date = moment().subtract(1, 'months').startOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.to_date = moment().subtract(1, 'months').endOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                            scope.arrRange.show = scope.rangeShow;

                            //Compare
                            if (scope.isShowCompare) {
                                switch (scope.customCompare) {
                                    case 'previous_period':
                                        scope.arrRange.from_range = moment().subtract(2, 'months').startOf('month').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(2, 'months').endOf('month').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'same_period_last_year':
                                        scope.arrRange.from_range = moment().subtract(1, 'months').startOf('month').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment().subtract(1, 'months').endOf('month').subtract(1, 'years').format(appConfig.MOMENT_DATE_FORMAT);

                                        break;
                                    case 'custom':
                                        scope.arrRange.from_range = moment(scope.from_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        scope.arrRange.to_range = moment(scope.to_range, appConfig.MOMENT_DATE_FORMAT).format(appConfig.MOMENT_DATE_FORMAT);
                                        break;
                                }
                            } else{
                                scope.arrRange.from_range = '';
                                scope.arrRange.to_range = '';
                            }

                            break;
                        case 'all_time':
                            //scope.date = moment().add({days:-1});
                            break;
                    }

                    //Save localStorage
                    Storage.write('calendar', angular.extend(scope.arrRange, {selected: scope.rangeSelected}));

                    scope.selectShow = scope.rangeSelected;
                    scope.params.from_date = scope.arrRange.from_date;
                    scope.params.to_date = scope.arrRange.to_date;

                    if (scope.isShowCompare) {
                        scope.params.from_range = scope.arrRange.from_range ? scope.arrRange.from_range : '';
                        scope.params.to_range = scope.arrRange.to_range ? scope.arrRange.to_range : '';
                    } else {
                        scope.params.from_range = '';
                        scope.params.to_range = '';
                        scope.arrRange.from_range = '';
                        scope.arrRange.to_range = '';

                    }

                    //call grid and chart
                    if($state.current && $state.current.name){
                        switch ($state.current.name){
                            case 'report':
                            case 'report.create':
                            case 'report.detail':
                            case 'report.detail.predefined':
                                ctrl.renderReport(angular.extend(scope.params, {date_range: scope.rangeSelected}));

                                break;
                            case 'campaigns.target.summary':
                                ctrl.renderSummary(scope.params);
                                break;
                            default:
                                ctrl.renderChart(scope.params);
                                ctrl.renderGrid(angular.extend(scope.params, {fc: 'datepicker'}));

                                //reload time in filter top
                                ctrl.reloadTime(scope.params);
                                break;
                        }
                    }

                    scope.datepicker();
                };

                scope.setPosition = function () {
                    var btn_dropdown = element.find('.dropdown-button').width();
                    var dropdown_menu = element.find('.dropdown-menu').width();

                    if (dropdown_menu > btn_dropdown) {
                        //set dropdown righ position
                        element.find('.dropdown-menu').css({
                            'left': 'inherit',
                            'right': '0'
                        })
                    } else {
                        element.find('.dropdown-menu').css({
                            'left': '0',
                            'right': 'inherit'
                        })
                    }
                };

                scope.getRange = function (key) {
                    var result = false;
                    if(scope.ranges){
                        angular.forEach(scope.ranges, function(range, k){
                            if(range.key == key){
                                result = range;
                            }
                        });
                    }

                    return result;
                };

                //Bắt sự kiện change data calendar
                scope.$on(APP_EVENTS.changeCalendar, function (params, args) {
                    if(args.from_date && args.to_date){
                        scope.from_date = scope.params.from_date = scope.arrRange.from_date = args.from_date;
                        scope.to_date = scope.params.to_date = scope.arrRange.to_date = args.to_date;

                        //Change date range
                        scope.rangeSelected = args.date_range ? args.date_range : 'custom';

                        //Change date show
                        switch (scope.rangeSelected){
                            case 'custom':
                                scope.dateShow = moment(scope.arrRange.from_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY') + ' - ' +
                                    moment(scope.arrRange.to_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');

                                //show compare
                                if(scope.isShowCompare){
                                    scope.dateCompareShow = moment(scope.arrRange.from_range, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY') + ' - ' +
                                        moment(scope.arrRange.to_range, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');
                                }
                                break;
                            case 'today':
                            case 'yesterday':
                                scope.dateShow = moment(scope.arrRange.from_date, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');

                                //show compare
                                if(scope.isShowCompare){
                                    scope.dateCompareShow = moment(scope.arrRange.from_range, appConfig.MOMENT_DATE_FORMAT).format('MMMM D, YYYY');
                                }
                                break;
                            default:
                                scope.changeDateShow();
                                break;
                        }

                        //Change range show
                        var range = scope.getRange(scope.rangeSelected);

                        if(range){
                            scope.rangeShow = range.value ? range.value : '';
                        }else {
                            scope.rangeShow = 'Custom';
                        }
                    }
                });

            },
            controller: function ($scope, $element, $attrs) {
                var me = this;
                $(document).mouseup(function (e){
                    var container = $(".date-ranger-picker");
                    var ui_datepicker = $('.ui-datepicker');
                    if (!container.is(e.target) // if the target of the click isn't the container...
                        && container.has(e.target).length === 0
                        && !ui_datepicker.is(e.target) && ui_datepicker.has(e.target).length === 0)  // ... nor a descendant of the container
                    {
                        //Hide datepicker
                        $scope.opened = false;
                        $scope.$apply();
                    }
                });
            },
            templateUrl: '/js/shared/templates/directive/datepicker.html?v=' + ST_VERSION
        }
    });

    /**
     * Directive datepicker
     * Usage:
     *  - Simple date
     *      <input type="text" jqdatepicker  ng-model="fromDate">
     *  - Allow chose date in future
     *      <input type="text" jqdatepicker allow-max-date="1" ng-model="fromDate">
     *  - Chose date after another date picker
     *      <input type="text" jqdatepicker allow-max-date="1" set-min-date="[name='toDate']" ng-model="fromDate">
     *      <input type="text" jqdatepicker allow-max-date="1" min-date="{{fromDate}}" name="toDate" ng-model="toDate">
     *  - Chose date after another date with from date not selected before ref-min-date="[name='fromDate']"
     *      <input type="text" jqdatepicker class="from_date" set-min-date="[name='toDate']" ng-model="from_date" name="fromDate"  placeholder="from">
     *      <input type="text" min-date="{{from_date}}" ref-min-date="[name='fromDate']" jqdatepicker class="to_date" name="toDate" ng-model="to_date" placeholder="to">
     */
    app.directive('jqdatepicker', ['appConfig', function (appConfig) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                modelValue: '=ngModel'
            },
            link: function (scope, element, attrs, ngModelCtrl) {
                scope.selected = '';

                function offset(el) {
                    var rect = el.getBoundingClientRect(),
                        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
                }

                function ofsetTop(el) {
                    if (el[0].nodeName == "BODY") {
                        return 0;
                    }
                    else {
                        return el.offset().top + ofsetTop(el.parent());
                    }
                }

                var getRealSize = function (ele, dim, props) {
                    /*
                     ele: jquery type
                     dim: width | height
                     props: [margin | border | padding]
                     */
                    var total = 0;
                    switch (dim) {
                        case 'width':
                            total += ele.width();
                            props.forEach(function (p) {
                                var left, right;
                                if (p == 'padding') {
                                    left = ele.css(p + '-left');
                                    if (left == undefined) {
                                        left = 0;
                                    }
                                    else {
                                        left = parseInt(left);
                                    }
                                    right = ele.css(p + '-right');
                                    if (right == undefined) {
                                        right = 0;
                                    }
                                    else {
                                        right = parseInt(right);
                                    }
                                }

                                if (p == 'border') {
                                    left = ele.css(p + '-left-width');
                                    if (left == undefined) {
                                        left = 0;
                                    }
                                    else {
                                        left = parseInt(left);
                                    }
                                    right = ele.css(p + '-right-width');
                                    if (right == undefined) {
                                        right = 0;
                                    }
                                    else {
                                        right = parseInt(right);
                                    }
                                }
                                total += left + right;
                            });
                            break;
                        case 'height':
                            total += ele.height();
                            props.forEach(function (p) {
                                var top, bottom;
                                if (p == 'padding') {
                                    top = ele.css(p + '-top');
                                    if (top == undefined) {
                                        top = 0;
                                    }
                                    else {
                                        top = parseInt(top);
                                    }
                                    bottom = ele.css(p + '-bottom');
                                    if (bottom == undefined) {
                                        bottom = 0;
                                    }
                                    else {
                                        bottom = parseInt(top);
                                    }
                                }
                                if (p == 'border') {
                                    top = ele.css(p + '-top-width');
                                    if (top == undefined) {
                                        top = 0;
                                    }
                                    else {
                                        top = parseInt(top);
                                    }
                                    bottom = ele.css(p + '-bottom-width');
                                    if (bottom == undefined) {
                                        bottom = 0;
                                    }
                                    else {
                                        bottom = parseInt(bottom);
                                    }
                                }
                                total += top + bottom;
                            });
                            break;
                    }
                    return total;
                };

                element.click(function () {
                    var wrap = angular.element('#ui-datepicker-div');
                    wrap.css({
                        top: offset(element[0]).top + (getRealSize(element, 'height', ['border', 'padding']))
                        , 'z-index': 99
                        //,left: offset(element[0]).left - (getRealSize(wrap, 'width', ['border', 'padding']) - getRealSize(element, 'width', ['border', 'padding']))
                    });

                    //Update date time
                    var chooseDate = '';
                    if ($(this).hasClass('from_date')) {
                        scope.selected = 'from_date';
                        if (typeof scope.from_date != 'undefined') {
                            chooseDate = new Date(moment(scope.from_date).format(appConfig.DATE_FORMAT));
                        } else {
                            //set default date
                            chooseDate = new Date(moment().subtract(7, 'days').format(appConfig.DATE_FORMAT));
                        }
                    }

                    if ($(this).hasClass('to_date')) {
                        scope.selected = 'to_date';
                        if (typeof scope.to_date != 'undefined') {
                            chooseDate = new Date(moment(scope.to_date).format(appConfig.DATE_FORMAT));
                        } else {
                            chooseDate = new Date(moment().subtract(1, 'days').format(appConfig.DATE_FORMAT));
                        }
                    }

                    if ($(this).hasClass('from_range')) {
                        scope.selected = 'from_range';
                        if (typeof scope.from_range != 'undefined') {
                            chooseDate = new Date(moment(scope.from_range).format(appConfig.DATE_FORMAT));
                        } else {
                            chooseDate = new Date(moment().subtract(14, 'days').format(appConfig.DATE_FORMAT));
                        }
                    }

                    if ($(this).hasClass('to_range')) {
                        scope.selected = 'to_range';
                        if (typeof scope.to_range != 'undefined') {
                            chooseDate = new Date(moment(scope.to_range).format(appConfig.DATE_FORMAT));
                        } else {
                            chooseDate = new Date(moment().subtract(7, 'days').format(appConfig.DATE_FORMAT));
                        }
                    }

                    var opt = {
                        dateFormat: appConfig.DATE_FORMAT,
                        setDate: chooseDate
                    };
                    element.datepicker(opt);
                });

                var opt = {
                    dateFormat: appConfig.DATE_FORMAT,
                    onSelect: function (date) {
                        switch (scope.selected) {
                            case 'from_date':
                                scope.from_date = date;
                                break;
                            case 'to_date':
                                scope.to_date = date;
                                break;
                            case 'from_range':
                                scope.from_range = date;
                                break;
                            case 'to_range':
                                scope.to_range = date;
                                break;
                        }
                        scope.date = date;
                        scope.modelValue = date;
                        scope.$apply();
                    }
                };

                if (attrs.allowMaxDate != '1') {
                    opt.maxDate = '0';
                }


                if (attrs.setMinDate != undefined) {
                    var refDate = angular.element(attrs.setMinDate);
                    // Set minDate when choose date
                    opt.onSelect = function (selectDate) {
                        refDate.removeAttr('disabled');
                        refDate.datepicker("option", "minDate", new Date(moment(selectDate, appConfig.MOMENT_DATE_FORMAT)));

                        switch (scope.selected) {
                            case 'from_date':
                                scope.from_date = selectDate;
                                break;
                            case 'to_date':
                                scope.to_date = selectDate;
                                break;
                            case 'from_range':
                                scope.from_range = selectDate;
                                break;
                            case 'to_range':
                                scope.to_range = selectDate;
                                break;
                        }
                        scope.date = selectDate;
                        scope.modelValue = selectDate;
                        scope.$apply();
                    }
                }

                // Trong truong hop luon max date luon lon hon min date, du min date chua duoc chon
                if (attrs.refMinDate != undefined || attrs.maxDate != undefined) {

                    opt.beforeShow = function (e) {
                        var option = {}
                        if(attrs.refMinDate){
                            var refDate = angular.element(attrs.refMinDate);
                            option.minDate = new Date(moment(refDate.val(), appConfig.MOMENT_DATE_FORMAT))
                        }
                        if (attrs.maxDate != undefined && attrs.maxDate != null && attrs.maxDate.length) {
                            console.log('attrs.maxDateattrs.maxDate', attrs.maxDate)
                            if (attrs.maxDate == '0') {
                                //option.maxDate = '0'
                            } else {
                                option.maxDate = new Date(moment(attrs.maxDate, appConfig.MOMENT_DATE_FORMAT));
                            }
                        }
                        if (attrs.minDate != undefined && attrs.minDate != null && attrs.minDate.length) {
                            console.log('attrs.minDate.minDate', attrs.minDate)
                            if (attrs.minDate == '0') {
                                //option.maxDate = '0'
                            } else {
                                option.minDate = new Date(moment(attrs.minDate, appConfig.MOMENT_DATE_FORMAT));
                            }
                        }
                        return option
                    }
                }
                // Set minDate at page load
                if (attrs.minDate != undefined && attrs.minDate != null && attrs.minDate.length) {
                    if (attrs.minDate == '0') {
                        opt.minDate = '0'
                    } else {
                        opt.minDate = new Date(moment(attrs.minDate, appConfig.MOMENT_DATE_FORMAT));
                    }
                }

                element.datepicker(opt);
            }
        };
    }]);
});