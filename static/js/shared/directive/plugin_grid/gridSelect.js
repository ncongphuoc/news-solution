/**
 * Created by truchq on 4/25/2016.
 */
define(['app', 'modules/operation/services/filter', 'modules/operation/services/remarketing'], function (app) {
    app.directive('gridSelect', ['appConfig', '$filter', 'Modal', 'RemarketingInfo', '$rootScope', 'APP_EVENTS',
        function (appConfig, $filter, Modal, RemarketingInfo, $rootScope, APP_EVENTS) {
            return {
                restrict: 'E',
                scope: {
                    type: '=',
                    data: '=',
                    column_name: '=columnName',
                    index: '='
                },
                link: function (scope, element, attrs, ctrl) {
                    scope.objects = [];
                    var getSelected = function () {
                        var find_data = $filter('filter')(scope.objects, {object_id: scope.data[scope.configs.private_action]});
                        if (find_data.length) {
                            find_data[0].selected = true;
                        }
                        scope.selected = find_data[0];
                    };
                    switch (scope.type) {
                        case appConfig.TYPE_METRIC_REMARKETING:
                            scope.objects = [
                                {
                                    object_id: 1,
                                    object_name: 'Open'
                                },
                                {
                                    object_id: 2,
                                    object_name: 'Closed'
                                }
                            ];
                            scope.configs = {
                                private_id: 'remarketing_id',
                                private_name: 'remarketing_name',
                                private_action: 'status'
                            };
                            getSelected();
                            scope.template = 'drop_down_select.html';
                            break;
                        case appConfig.TYPE_LINE_ITEM:
                            scope.lineitem_status_v3_eligible_daily = appConfig.LINEITEM_STATUS_V3_ELIGIBLE_DAILY;
                            scope.lineitem_status_v3_eligible_lifetime = appConfig.LINEITEM_STATUS_V3_ELIGIBLE_LIFETIME;
                            scope.arr_status_eligible = [scope.lineitem_status_v3_eligible_daily, scope.lineitem_status_v3_eligible_lifetime];
                            scope.template = 'status_line_item.html';
                            break;
                        default:
                            scope.template = 'text.html';
                    }
                    // Show error message when update error
                    var showModal = function (msg) {
                        msg = msg || 'Error has occured when update target';
                        Modal.showModal({
                            bodyText: msg,
                            closeText: 'Close',
                            type: 'error'
                        })
                    };
                    scope.selectObject = function (object) {
                        //update
                        Modal.process(RemarketingInfo.update({
                            id: scope.data[scope.configs.private_id],
                            type: 'member-status',
                            status: object.object_id
                        }), {
                            onAction: function (res) {
                                if (res.code == 200 && res.data != undefined && res.data.error == 200) {
                                    Modal.showModal({
                                        headerText: 'Success',
                                        closeText: 'Close',
                                        bodyText: 'Your changes have been made',
                                        type: 'success',
                                        onCancel: function () {
                                            //case reload grid
                                            switch (scope.type) {
                                                case appConfig.TYPE_METRIC_REMARKETING:
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
                    }

                },
                controller: function ($scope, $element, $attrs) {
                },
                templateUrl: '/js/shared/templates/grid/plugin/gridSelect.html?v=' + ST_VERSION
            };
        }]);
});