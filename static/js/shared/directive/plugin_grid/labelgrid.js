/**
 * Created by GiangBeo on 9/5/16.
 */
define(['app',
    'modules/operation/services/label'], function (app) {
    app.directive('labelGrid', ['appConfig', '$state', 'Label',
        '$rootScope', 'APP_EVENTS', 'AUTH_EVENTS', '$timeout','$window',
        function (appConfig, $state, Label, $rootScope, APP_EVENTS, AUTH_EVENTS, $timeout,$window) {
            return {
                restrict: 'E',
                scope: {
                    type: '=type',
                    dataSource: '=source',
                    grid_options: '=option'
                },
                link: function (scope, element, attrs, ctrl) {
                    var _promiseCheckLabel;
                    scope.$watch('dataSource', function (newVal, oldVal) {

                        if (typeof (newVal) != 'undefined' && newVal.length > 0) {
                            scope.checkChecbox(0, 0);

                        }
                    });
                    angular.element('#dropdown-label').prop('disabled', true);
                    scope.checkChecbox = function (case_reload, is_check_all) {

                        if (is_check_all == 0) {
                            var i_check = $('input[type=checkbox]:checked.custom-checkbox').length;
                            if (i_check > 0) {
                                angular.element('#dropdown-label').attr('disabled', false);
                                angular.element('#management_label_remove_button').attr('disabled', false);
                            }
                            else {
                                angular.element('#dropdown-label').attr('disabled', true);
                                angular.element('#management_label_remove_button').attr('disabled', true);
                            }
                        }
                        if (scope.grid_options.type != 0 && $.inArray(scope.grid_options.type, appConfig.SHOW_LABEL_DROPDOWN) != -1) {
                            scope.reloadLabelList(case_reload);
                        }

                    };
                    document.onkeydown = function (evt) {
                        evt = evt || window.event;
                        if (evt.keyCode == 27) {
                            angular.element('.show-all-lable').each(function (index, value) {
                                $(this).hide();
                            });
                        }
                    };
                    scope.reloadLabelList = function (case_reload) {
                        var stringObject = '';
                        $('input[type=checkbox].custom-checkbox').each(function () {
                            if (case_reload == 0) {
                                if ($(this).prop('checked')) {
                                    stringObject = stringObject + ',' + $(this).val();
                                }
                            }
                            else {
                                stringObject = stringObject + ',' + $(this).val();
                            }

                        });
                        //Check label checked
                        if(_promiseCheckLabel ){
                            _promiseCheckLabel.$cancelRequest();
                        }
                        _promiseCheckLabel =  Label.getList({
                            arr_object: stringObject,
                            type_label: scope.grid_options.type,
                            type: 0
                        });
                        _promiseCheckLabel.$promise.then(function(resp){
                            scope.list_account = [];
                            if (resp) {
                                var arr_label = angular.fromJson(resp.data.label_list);
                                $rootScope.$broadcast(AUTH_EVENTS.showApplyLabel, {
                                    arr_label: arr_label
                                });
                                angular.element('.label-check').each(function (index, value) {
                                    if ($.inArray(value.value, arr_label) != -1) {
                                        $timeout(function () {
                                            $('#input_label_check_' + value.value).iCheck('check');
                                        });
                                    }
                                    else {
                                        $timeout(function () {
                                            $('#input_label_check_' + value.value).iCheck('uncheck');
                                        });
                                    }
                                });
                            }
                            _promiseCheckLabel = null;
                        });

                        // Label.getList({
                        //     arr_object: stringObject,
                        //     type_label: scope.grid_options.type,
                        //     type: 0
                        // }, function (resp) {
                        //     var arr_label = angular.fromJson(resp.data.label_list);
                        //     $rootScope.$broadcast(AUTH_EVENTS.showApplyLabel, {
                        //         arr_label: arr_label
                        //     });
                        //     angular.element('.label-check').each(function (index, value) {
                        //         if ($.inArray(value.value, arr_label) != -1) {
                        //             $timeout(function () {
                        //                 $('#input_label_check_' + value.value).iCheck('check');
                        //             });
                        //         }
                        //         else {
                        //             $timeout(function () {
                        //                 $('#input_label_check_' + value.value).iCheck('uncheck');
                        //             });
                        //         }
                        //     });
                        //
                        // });
                    };
                    angular.element(document).on("click", ".open-modal-edit", function() {
                        var label_id = angular.element(this).attr('data-label-id');
                        var type = angular.element(this).attr('data-type');
                        angular.element('.lable-edit-text').hide();
                        scope.openModalEdit(label_id,type);
                    });
                    angular.element(document).on("click", ".save-modal-edit-label", function() {
                        var label_id = angular.element(this).attr('data-label-id');
                        var type = angular.element(this).attr('data-type');
                        scope.is_trigger = 0;
                        if(scope.is_trigger!=0){
                            return false;
                        }
                        else{
                            scope.saveModalEdit(label_id,type);
                        }
                    });
                    angular.element(document).on("click", ".close-modal-edit-label", function() {
                        var label_id = angular.element(this).attr('data-label-id');
                        var type = angular.element(this).attr('data-type');
                        scope.closeModalEdit(label_id,type);
                    });
                    angular.element(document).on("click", ".label-go-link", function() {
                        var label_id = angular.element(this).attr('data-label-id');
                        var column_name = angular.element(this).attr('data-column-name');
                        scope.labelLink(label_id,column_name);
                    });
                    scope.openModalEdit = function (id_label, type) {

                        var label_name = '';
                        var label_description = '';
                        angular.element('.page-label').hide();
                        if(type == 1){
                            angular.element('#label_name_' + id_label).show();
                            label_name = angular.element('#input_label_name_' + id_label).val();
                        }
                        else{
                            angular.element('#label_description_' + id_label).show();
                            label_description = angular.element('#input_label_description_' + id_label).val();
                        }
                        scope.label_name_tmp = label_name;
                        scope.label_desc_tmp = label_description;
                    };
                    scope.label_name_tmp = '';
                    scope.label_desc_tmp = '';
                    scope.closeModalEdit = function (id_label, type) {
                        if(type == 1){
                            angular.element('#label_name_' + id_label).hide();
                            angular.element('#input_label_name_' + id_label).val(scope.label_name_tmp);
                        }
                        else{
                            angular.element('#label_description_' + id_label).hide();
                            angular.element('#input_label_description_' + id_label).val(scope.label_desc_tmp);
                        }
                        angular.element('#label_error_'+id_label).hide();
                    };
                    scope.labelLink = function (label_id, object) {
                        switch (object) {
                            case 'lineitem_label': {
                                var url = $state.href('campaigns.lineitem', {}, {absolute: true}) + '?label=' + label_id;
                                //$state.go('campaigns.lineitem', { 'index': 123, 'anotherKey': 'This is a test' });
                                break;
                            }
                            case 'campaign_label': {
                                var url = $state.href('campaigns.campaign', {}, {absolute: true}) + '?label=' + label_id;
                                //$state.go('campaigns.campaign', { 'index': 123, 'anotherKey': 'This is a test' });
                                break;
                            }
                            case 'creative_label': {
                                var url = $state.href('campaigns.creative', {}, {absolute: true}) + '?label=' + label_id;
                                // $state.go('campaigns.creative', { 'index': 123, 'anotherKey': 'This is a test' });
                                break;
                            }
                            case 'remarketing_label': {
                                var url = $state.href('campaigns.library.audience', {}, {absolute: true}) + '?label=' + label_id;
                                // $state.go('campaigns.creative', { 'index': 123, 'anotherKey': 'This is a test' });
                                break;
                            }

                        }
                        return $window.location.href = url;
                    }
                    //
                    scope.saveModalEdit = function (id_label, type) {
                        scope.is_trigger = 1;
                        var label_name = '';
                        var label_description = '';
                        if(type == 1){
                            label_name = angular.element('#input_label_name_' + id_label).val();
                        }
                        else{
                            label_description = angular.element('#input_label_description_' + id_label).val();
                        }
                        Label.update({
                            label_name: label_name,
                            label_description: label_description,
                            id: id_label
                        }, function (resp) {
                            if (resp.data.result == 1) {
                                angular.element('#label_error_'+id_label).hide();
                                $rootScope.$broadcast(AUTH_EVENTS.reloadGridLabel, {
                                    column_id: "_" + Math.floor((Math.random() * 100) + 1)
                                });
                                angular.element('.lable-edit-text').hide();
                            }
                            else{
                                angular.element('#label_error_'+id_label).show();
                            }
                        });
                    };

                },
                controller: function ($scope, $element, $attrs) {
                }
            };
        }]);
});