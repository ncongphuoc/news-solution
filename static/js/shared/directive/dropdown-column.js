/**
 * Created by GiangBeo on 7/26/16.
 */

define(['app', "libs/bootstrap/bootstrap.min",'libs/jquery-ui/jquery-ui.min',"modules/operation/services/column","modules/operation/services/column",
    "modules/operation/directives/column"], function (app) {
    app.directive('dropdownColumn', function (debounce,Modal, Metric, Column, appConfig, AUTH_EVENTS, $rootScope) {
        return {
            restrict: 'E',
            //replace: true,
            scope: {
                typeitem: '=typeitem',
                idmodalcolumn:'=idmodalcolumn'
            },
            link: function (scope, element, attrs) {
                scope.obj_column = appConfig.COLUMN_OBJ_CREATIVE
                scope.datasource = {
                    columns: {
                        current: [
                            {value: 'Modify columns...', key: '1000'}
                        ],
                        custom: {
                            name: 'Your saved columns',
                            child: []
                        },
                        defined: {
                            name: 'Pre-defined column sets',
                            child: []
                        }
                    }
                };
                scope.show_pre_define = true;
                if($.inArray(+scope.typeitem,appConfig.NOT_SHOW_PREDEFINE)!=-1){
                    scope.show_pre_define = false;
                }
                scope.deleteColumn = function (itemId) {
                    var modal = Modal.showModal({
                        actionText: 'OK',
                        closeText: 'Cancel',
                        bodyText: 'Are you sure you want to delete ?',
                        onAction: function () {
                            Column.delete({id: itemId}, function (resp) {
                                scope.getListMod();
                            });
                        },
                        onCancel: function () {

                        }
                    })

                };
                scope.$on(AUTH_EVENTS.changeSupportUser, function () {
                    scope.getListMod();
                });
                scope.getListMod = function () {
                    var subColParent = [];
                    var predefineCol = [];
                    Column.getList({type: 'filter', current_type: scope.typeitem}, function (resp) {
                        angular.forEach(resp.data.modify_column, function (valueParent, keyParent) {
                            var is_checked = false;
                            var is_custom = false;
                            var is_show = true;
                            if (valueParent.is_lasted == appConfig.IS_LASTED_MOD_COLUMN) {
                                is_checked = true;
                                var is_custom = true;
                            }
                            if (valueParent.mod_type == appConfig.IS_CUSTOM_MOD_COLUMN) {
                                is_custom = true;
                            }
                            if ($.inArray(+valueParent.modify_col_id, appConfig.MODIFY_COLUMN_DEFAULT) != -1) {
                                var is_show = false;
                            }
                            var subCol = {
                                value: valueParent.modify_name,
                                key: valueParent.modify_col_id,
                                checked: is_checked,
                                is_custom: is_custom,
                                mods_value: valueParent.columns,
                                mod_type: valueParent.mod_type,
                                is_show: is_show

                            };
                            subColParent.push(subCol)
                        });
                        scope.datasource.columns.custom.child = subColParent;

                        angular.forEach(resp.data.predefine_column, function (valueParent, keyParent) {
                            var is_checked = false;
                            var is_custom = false;
                            if (valueParent.is_lasted == appConfig.IS_LASTED_MOD_COLUMN) {
                                is_checked = true;
                            }
                            var subCol = {
                                value: valueParent.modify_name,
                                key: valueParent.modify_col_id,
                                checked: is_checked,
                                is_custom: is_custom,
                                mods_value: valueParent.columns,
                                mod_type: valueParent.mod_type
                            };
                            predefineCol.push(subCol)
                        });
                        scope.datasource.columns.defined.child = predefineCol;
                    });

                };
                scope.changeColumn = function (value, values_mod, mod_name, mod_type, type) {
                    if(value == 1000){
                        angular.element('#' + scope.idmodalcolumn).modal('show');
                    }
                    else{
                        Column.update(
                            {
                                type: scope.typeitem,
                                id: value,
                                dataModify: JSON.parse(values_mod),
                                is_predefine: type,
                                mod_name: mod_name,
                                mod_type: mod_type
                            }, function (resp) {
                                var arrayDef = [];
                                angular.forEach(resp.data.dataCol, function (value, key) {
                                    if (value.data_type == null) {
                                        value.data_type = appConfig.GRID_TEXT;
                                    }
                                    arrayDef.push({
                                        header: value.metric_name,
                                        name: value.metric_code,
                                        enableSorting: false,
                                        type: value.data_type
                                    });
                                });
                                $rootScope.$broadcast(AUTH_EVENTS.autoloadColumn, {
                                    fields: resp.data.fields,
                                    type: scope.typeitem,
                                    arrDef: arrayDef,
                                    colId: value + "_" + Math.floor((Math.random() * 100) + 1)
                                });
                                $rootScope.$broadcast(AUTH_EVENTS.reloadModifyColumn, {
                                    autoload: 1
                                });
                            });
                    }
                }
                scope.$on(AUTH_EVENTS.autoloadColumn, function (params, args) {
                    scope.getListMod();
                });
                scope.getListMod();
            },
            templateUrl: '/js/modules/operation/templates/dropdown-column/dropdown-column.html?v=' + ST_VERSION
        }
    })
})
