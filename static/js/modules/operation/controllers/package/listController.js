/**
 * Created by truchq on 4/29/2016.
 */
define(['app'], function (app) {
    app.controller('operationPackageListController',
        ['$scope','Campaign', 'appConfig', 'Find',
            function ($scope, Campaign, appConfig, Find) {
                //Get list Filter
                /*Find.getList({
                    limit:100,
                    object:'users',
                    search:'truchq',
                    all:'true'
                }, function (resp) {
                    console.log('xxxxxx',resp);
                });*/
                //Datepicker
                $scope.datePicker = {
                    from_date: '',
                    to_date: '',
                    from_range: '',
                    to_range: ''
                };

                $scope.datepicker = function () {
                    $scope.grid_params.from_date = $scope.datePicker.from_date;
                    $scope.grid_params.to_date = $scope.datePicker.to_date;
                    $scope.grid_params.from_range = $scope.datePicker.from_range;
                    $scope.grid_params.to_range = $scope.datePicker.to_range;
                };

                $scope.params = {};

                ///colum 1
                //Assgin id of modal
                $scope.idmodal = 'modify-column';
                //Get metric custom
                $scope.customColumn = appConfig.CUSTOM_METRIC_COLUMN_ID;
                //Function enable modal on button
                $scope.enableModal = function () {
                    var element = angular.element('#' + $scope.idmodal);
                    element.modal('show');
                };

                //Get Type and Object Metric
                $scope.type_column = appConfig.TYPE_CAMPAIGN;
                $scope.obj_column = appConfig.COLUMN_OBJ_CREATIVE;
                $scope.typeitem = appConfig.TYPE_CAMPAIGN;
                // end columns 1
                //config filter bottom
                $scope.filter_bottom_parrams = {
                    column: '',
                    params_get_segment: {
                        type: appConfig.TYPE_CAMPAIGN
                    }
                };
                $scope.idmodallabel = 'labelmodal';
                $scope.labeltype = appConfig.TYPE_CAMPAIGN;
                $scope.filterBottomChange = function () {
                    //columns
                    if ($scope.filter_bottom_parrams.column !== 'undefined' && $scope.filter_bottom_parrams.column == appConfig.MODIFY_COLUMN) {
                        angular.element('#' + $scope.idmodal).modal('show');
                        $scope.filter_bottom_parrams.column = '';
                        return;
                    }
                    if ($scope.filter_bottom_parrams.label !== 'undefined' && $.inArray(+$scope.filter_bottom_parrams.label, appConfig.STATE_LABEL) != -1) {
                        //angular.element('#'+$scope.idmodal).modal('show');
                        if ($scope.filter_bottom_parrams.label != 9009) {
                            $state.go('campaigns.label');
                        }
                        else {
                            angular.element('#' + $scope.idmodallabel).modal('show');
                        }
                        $scope.filter_bottom_parrams.label = '';
                        return;

                    }
                    //end columns
                };

                //config grid
                $scope.grid_params = {
                    format: 'grid',
                    limit: 10,
                    page: 1
                };

                $scope.grid_options = {
                    object: Campaign,
                    grid_name: 'Campaigns',
                    row_key: 'campaign_id',
                    columns_show_option: 'campaign_name',
                    loading: '.loading_grid',
                    type: appConfig.TYPE_CAMPAIGN
                };

                //Config filter
                $scope.filter_params = {};
                $scope.filter_options = {
                    params_get_metric: {
                        type: appConfig.TYPE_CAMPAIGN,
                        obj: appConfig.OBJ_FILTER,
                        columns: 'METRIC_ID,METRIC_NAME,METRIC_LEVEL,OPERATOR,PARENT_ID,METRIC_CODE'
                    },
                    params_get_filter: {
                        type: appConfig.TYPE_CAMPAIGN,
                        columns: 'FILTER_ID,FILTER_NAME,RULES'
                    }
                };


                //filter top
                $scope.filter_top_params = {
                    filter: '',
                    text_search: '',
                    metric: '',
                    metric_compare: '',
                    time: '',
                    remove_filter: '',
                    object: 'campaigns',
                    params_get_filter: {
                        type: appConfig.TYPE_CAMPAIGN,
                        columns: 'FILTER_ID,FILTER_NAME,RULES'
                    }
                };

                //Init chart
                $scope.chart = {
                    model: Campaign,
                    object_name: 'Campaign',
                    chartType: 'LineChart'
                };
            }
        ]
    );
});