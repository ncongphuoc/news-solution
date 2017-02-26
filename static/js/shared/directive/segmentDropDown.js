/**
 * Created by truchq on 4/25/2016.
 */
define(['app','modules/operation/services/segment'], function (app) {
    app.directive('segmentDropDown', function (debounce, Segment, Storage, $location, Modal, appConfig) {
        return {
            restrict: 'E',
            scope: {
                config:'='
            },
            require: ["segmentDropDown", "^operations"],
            link: function (scope, element, attrs, ctrl) {
                scope.segment = {};
                Segment.getList({type: scope.config.type}, function (response) {
                    scope.segment = JSON.parse(response.data).segment;
                    scope.list_segment_info = JSON.parse(response.data).segment_list;
                });
                // Change segment
                scope.changeSegment = function (value) {
                    if (value !== "") {
                        if (typeof scope.list_segment_info[value].code !== undefined) {
                            var segment_current = scope.list_segment_info[value].code;
                            //if (localStorage.getItem("dataPicker") && JSON.parse(localStorage.getItem("dataPicker")) != "") {
                            var arrRange = Storage.read('calendar');
                            if (arrRange) {
                                var //arrRange = JSON.parse(localStorage.getItem("dataPicker")),
                                    from_date = moment(arrRange.from_date, appConfig.MOMENT_DATE_FORMAT),
                                    to_date = moment(arrRange.to_date, appConfig.MOMENT_DATE_FORMAT),
                                    duration = moment.duration(to_date.diff(from_date)).asDays(),
                                    error_segment = false;
                                switch (segment_current) {
                                    case "DAY":
                                        if (duration > 17) {
                                            error_segment = true;
                                        }
                                        break;
                                    case "WEEK":
                                        //1 week
                                        if (duration < 6) {
                                            error_segment = true;
                                        }
                                        break;
                                    case "MONTH":
                                        //1 month
                                        if (duration < 29) {
                                            error_segment = true;
                                        }
                                        break;

                                    case "QUARTER":
                                        //3 month
                                        if (duration < 90) {
                                            error_segment = true;
                                        }
                                        break;
                                    case "YEAR":
                                        //3 year
                                        if (duration < 360) {
                                            error_segment = true;
                                        }
                                        break;
                                    case "DAY_OF_WEEK":
                                        break;
                                    case "HOUR_OF_DAY":
                                        //Hourly validate
                                        var today = moment().format(appConfig.MOMENT_DATE_FORMAT);
                                        today = moment(today, appConfig.MOMENT_DATE_FORMAT);
                                        var hourly_duration = moment.duration(today.diff(from_date)).asDays();
                                        if(hourly_duration >= 8){
                                            error_segment = true;
                                        }
                                        break;
                                }
                                if (error_segment) {
                                    Modal.showModal({
                                        closeText: 'Close',
                                        headerText: 'Message',
                                        bodyText: 'This segment cannot be shown for your selected date range.'
                                    });
                                } else {
                                    ctrl[1].renderGrid({segment: segment_current, fc: 'segment'});
                                    // Update param url
                                    updateUrl({s: scope.list_segment_info[value].code ? scope.list_segment_info[value].code : null})
                                }

                            } else {
                                Modal.showModal({
                                    closeText: 'Close',
                                    headerText: 'Message',
                                    bodyText: 'Select date,please'
                                })
                            }

                        } else {
                            ctrl[1].renderGrid({segment: '', fc: 'segment'});
                            updateUrl({s: null})
                        }
                    } else {
                        ctrl[1].renderGrid({segment: '', fc: 'segment'});
                        updateUrl({s: null})
                    }

                };
                // Update param on url
                var updateUrl = debounce(function (param) {

                    // Make default param
                    // c: Column, m: Metric, mvs: Metric compare, q: Search, s: Segment, t: Time
                    var urlParam = angular.extend({
                        c: null,
                        m: null,
                        mvs: null,
                        q: null,
                        s: null,
                        t: null
                    }, $location.search(), param)
                    $location.search(urlParam)
                }, 500, false);
            },
            controller: function ($scope, $element, $attrs) {

            },
            templateUrl: '/js/shared/templates/dropdown/segment.html?v=' + ST_VERSION
        };
    });
});