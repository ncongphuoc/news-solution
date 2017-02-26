/**
 * Created by truchq on 4/25/2016.
 */
define(['app', 'modules/operation/services/filter'], function (app) {
    app.directive('gridSelectDateRange', ['Filter', 'appConfig', '$filter', 'APP_EVENTS', '$rootScope', 'Storage', 'ReportInfo',
        'Modal',
        function (Filter, appConfig, $filter, APP_EVENTS, $rootScope, Storage, ReportInfo, Modal) {
            return {
                restrict: 'E',
                scope: {
                    type: '=',
                    data: '=',
                    column_name: '=columnName',
                    metric_id: '=metricId',
                    index: '='
                },
                link: function (scope, element, attrs, ctrl) {
                    scope.list_date_range = [];
                    var get_date_range = function () {
                        var list_date_range = Storage.read('list_date_range');
                        if (list_date_range == undefined || list_date_range == '') {
                            Filter.getList({
                                type: appConfig.TYPE_METRIC_REPORT_FILTER_LISTING,
                                metric_id: scope.metric_id
                            }, function (resp) {
                                scope.list_date_range = resp.data;
                                //
                                Storage.write('list_date_range', resp.data);
                                getSelected();
                            })
                        } else {
                            scope.list_date_range = list_date_range;
                        }
                        getSelected();
                    };

                    var getSelected = function () {
                        var find_data = $filter('filter')(scope.list_date_range, {object_id: scope.data.date_range_type});
                        if (find_data.length) {
                            find_data[0].selected = true;
                        }
                        scope.selected = find_data[0];
                    }
                    scope.showEdit = function () {
                        element.find('.edit-item-date-range').css('display', 'none');
                        element.find('.dropdown-grid-select').css('display', 'block');
                        get_date_range();
                        $rootScope.$broadcast(APP_EVENTS.broadcastGrid, {
                            event: 'data_range',
                            data: {
                                index: scope.index
                            }
                        });
                    };
                    scope.$on(APP_EVENTS.broadcastGrid, function (args, params) {
                        if (params.event == 'data_range' && params.data.index != scope.index) {
                            element.find('.dropdown-grid-select').css('display', 'none');
                            element.find('.edit-item-date-range').css('display', 'block');
                        }

                    });
                    scope.selectDate = function (object) {
                        //update
                        Modal.process(ReportInfo.update({
                            id: scope.data.report_id,
                            date_range: object.object_id,
                            type: 'update_date_range'
                        }), {
                            onAction: function (res) {
                                if (res.code == 200 && res.data.data == 1) {
                                    Modal.showModal({
                                        headerText: 'Success',
                                        closeText: 'Close',
                                        bodyText: 'Your changes have been made',
                                        type: 'success',
                                        onCancel: function () {
                                            //case reload grid
                                            switch (scope.type) {
                                                case appConfig.TYPE_METRIC_REPORT_FILTER_LISTING:
                                                    $rootScope.$broadcast(APP_EVENTS.reloadGrid, {});
                                                    break;
                                            }
                                        }
                                    });
                                } else {
                                    showModal(res.message);
                                }
                            },
                            onError: function (error) {
                                showModal();
                            }
                        })
                        //
                        scope.data.date_range_type = object.object_id;
                        scope.data.date_range = object.object_name;
                        //
                        element.find('.dropdown-grid-select').css('display', 'none');
                        element.find('.edit-item-date-range').css('display', 'block');
                    }
                },
                controller: function ($scope, $element, $attrs) {
                },
                templateUrl: '/js/shared/templates/grid/plugin/gridSelectDateRange.html?v=' + ST_VERSION
            };
        }]);
});