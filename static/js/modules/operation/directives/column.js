/**
 * Created by Giang Beo on 10-May-16.
 */
define(['app'], function (app) {
    app.directive('modifycolumn', function (debounce, Metric, Column, appConfig, AUTH_EVENTS, $rootScope, Modal) {
        return {
            restrict: 'E',
            //replace: true,
            scope: {
                idmodal: '=idmodal',
                typecolumn: '=typecolumn',
                objcolumn: '=objcolumn'
            },
            link: function (scope, element, attrs) {
                scope.showAddCustom = false;
                scope.currentMetric = 0;
                scope.modifyCol = [];
                var metric_first_id = 0;
                angular.element("#sortable").sortable({
                    start: function (event, ui) {
                        ui.item.data('start', ui.item.index());
                    },
                    stop: function (event, ui) {

                    }
                });
                var modifyColLength = scope.modifyCol.length;

                if (modifyColLength == 0) {
                    scope.enbaleModal = false;
                }
                else {
                    scope.enbaleModal = true;
                }
                scope.$on(AUTH_EVENTS.reloadModifyColumn, function () {
                    scope.functionReloadLoadDataModal(scope.modifyCol, 1);
                });

                scope.functionLoadDataModal = function (colModify, reloadCase, is_save_custom) {
                    Metric.getList({type: scope.typecolumn, obj: scope.objcolumn}, function (resp) {
                        if (resp && resp.code != 200) {
                            Modal.showModal({
                                closeText: 'Close',
                                headerText: 'Message',
                                bodyText: 'Metric for filter empty !',
                                type: 'error'
                            });
                            return;
                        }
                        scope.metricparent = resp.data.parent_metric;
                        scope.metricChildren = resp.data.children_metric;
                        scope.metric_children = resp.data.metric_children;
                        scope.metricLeft = [];
                        scope.lasted_col = resp.data.lasted_col;
                        var arrColMod = []
                        //get Lastest selected mod col
                        angular.forEach(scope.lasted_col, function (value, key) {
                            if (value != null) {
                                arrColMod[value.metric_id] = value.metric_id;
                            }

                        });
                        var arrColModS = [];
                        angular.forEach(scope.modifyCol, function (value, key) {
                            arrColModS[value.metric_id] = value.metric_id;
                        });
                        //Push lastest to mod col
                        if (reloadCase == 1) {
                            angular.forEach(scope.lasted_col, function (value, key) {
                                scope.modifyCol.push(value);

                            });
                        }
                        //scope.modifyCol = scope.lasted_col;
                        scope.fixCol = resp.data.fix_col;
                        //Fill data fix col to modify col
                        var fixColArr = [];
                        angular.forEach(scope.fixCol, function (value, key) {
                            fixColArr[key] = value.metric_id;
                        });
                        scope.fixColArr = fixColArr;
                        //Check fix col exist or not, if exist, delete
                        //Check first item of metric, and add class disabled if selected on left

                        angular.forEach(scope.metricparent, function (valueParent, keyParent) {
                            if (keyParent == 0) {
                                var classItem = 'active';
                                scope.metricparent[keyParent].classItem = classItem;
                                var metric_first_id = scope.metricparent[keyParent].metric_id;
                                var colChildrenFirst = scope.metricChildren[scope.metricparent[keyParent].metric_id];
                                scope.currentMetric = metric_first_id;
                                // console.log(metric_first_id);
                                scope.metric_parent_current = metric_first_id;
                                angular.forEach(colChildrenFirst, function (valueChil, keyChil) {
                                    var classItem = '';
                                    var charcButton = '»';
                                    if (typeof(arrColMod[valueChil.metric_id]) != 'undefined') {
                                        classItem = 'disabled';
                                        charcButton = '«';
                                    }
                                    valueChil.classItem = classItem;
                                    valueChil.charcButton = charcButton;
                                    scope.metricLeft.push(valueChil);
                                });
                                scope.functionCheckShowRemoveAll();
                                return;
                            }
                        });
                        if (is_save_custom == 1) {
                            scope.addLeft(scope.currentMetric, 1);
                        }
                        scope.modifyLength = angular.extend(scope.modifyCol, scope.fixCol).length;
                    });
                };
                scope.functionCheckShowRemoveAll = function () {
                    //Check show remove all
                    var count_metric_left = [];
                    //
                    angular.forEach(scope.metricLeft, function (valueParent, keyParent) {
                        //console.log(valueParent);
                        angular.forEach(scope.modifyCol, function (valueMod, indexMod) {
                            if (valueParent.metric_id == valueMod.metric_id) {
                                count_metric_left.push(valueParent.metric_id);
                            }
                        });
                    });
                    if (count_metric_left.length == scope.metricLeft.length) {
                        angular.element('#add_all').hide();
                        angular.element('#remove_all').show();
                        scope.metric_add_all[scope.metric_parent_current] = scope.metric_parent_current;
                    }
                    else {
                        angular.element('#add_all').show();
                        angular.element('#remove_all').hide();
                    }
                };
                scope.functionReloadLoadDataModal = function (colModify, reloadCase, is_save_custom) {
                    Metric.getList({type: scope.typecolumn, obj: scope.objcolumn}, function (resp) {
                        scope.metricparent = resp.data.parent_metric;
                        scope.metricChildren = resp.data.children_metric;
                        scope.metricLeft = [];
                        scope.lasted_col = resp.data.lasted_col;
                        var arrColMod = []
                        //get Lastest selected mod col
                        angular.forEach(scope.lasted_col, function (value, key) {
                            if (value != null) {
                                arrColMod[value.metric_id] = value.metric_id;
                            }

                        });
                        var arrColModS = [];
                        angular.forEach(scope.modifyCol, function (value, key) {
                            arrColModS[value.metric_id] = value.metric_id;
                        });
                        //Push lastest to mod col
                        scope.modifyCol = scope.lasted_col;
                        //scope.modifyCol = scope.lasted_col;
                        scope.fixCol = resp.data.fix_col;
                        //Fill data fix col to modify col
                        var fixColArr = [];
                        angular.forEach(scope.fixCol, function (value, key) {
                            fixColArr[key] = value.metric_id;
                        });
                        scope.fixColArr = fixColArr;
                        //Check fix col exist or not, if exist, delete
                        //Check first item of metric, and add class disabled if selected on left
                        angular.forEach(scope.metricparent, function (valueParent, keyParent) {
                            if (keyParent == 0) {
                                var classItem = 'active';
                                scope.metricparent[keyParent].classItem = classItem;
                                var metric_first_id = scope.metricparent[keyParent].metric_id;
                                scope.currentMetric = metric_first_id;
                                scope.metric_parent_current = metric_first_id;
                                var colChildrenFirst = scope.metricChildren[scope.metricparent[keyParent].metric_id];
                                angular.forEach(colChildrenFirst, function (valueChil, keyChil) {
                                    var classItem = '';
                                    var charcButton = '»';
                                    if (typeof (arrColMod[valueChil.metric_id] != 'undefined')) {
                                        classItem = 'disabled';
                                        charcButton = '«';
                                    }
                                    valueChil.classItem = classItem;
                                    valueChil.charcButton = charcButton;
                                    scope.metricLeft.push(valueChil);
                                });

                                //Check show remove all
                                scope.functionCheckShowRemoveAll();
                                return;
                            }
                        });
                        if (is_save_custom == 1) {
                            scope.addLeft(scope.currentMetric, 1);
                        }
                        scope.modifyLength = angular.extend(scope.modifyCol, scope.fixCol).length;
                    });
                };
                scope.functionLoadDataModal(scope.modifyCol, 1);
                scope.show_remove_all = false;
                scope.metric_add_all = [];
                scope.metric_parent_current = '';
                scope.addLeft = function (id_metric, type) {
                    scope.buttonAdd = true;
                    scope.buttonEdit = false;
                    switch (type) {
                        //Case get children of metric parent
                        case 1: {
                            scope.currentMetric = id_metric;
                            scope.metric_parent_current = id_metric;

                            angular.forEach(scope.metricparent, function (valueParent, keyParent) {
                                var classItem = '';
                                if (valueParent.metric_id == id_metric) {
                                    classItem = 'active';
                                }
                                scope.metricparent[keyParent].classItem = classItem;
                            });
                            //Compare if id is metric custom, enable button Add Custom Metric
                            if ($.inArray(id_metric, appConfig.CUSTOM_METRIC_COLUMN_ID) != -1) {
                                scope.showAddCustom = true;
                            }
                            else {
                                scope.showAddCustom = false;
                            }
                            angular.element('.metric').show();
                            angular.element('.custom_metric').hide();
                            var itemExits = false;
                            scope.metricLeft = [];

                            var arrayModExist = [];
                            angular.forEach(scope.modifyCol, function (valueMod, keyMod) {
                                arrayModExist[valueMod.metric_id] = valueMod.metric_id;
                                if (valueMod.metric_id == id_metric) {
                                    itemExits = true;
                                }
                            });
                            angular.forEach(scope.metricChildren, function (value, key) {
                                angular.forEach(value, function (valueSubs, key) {
                                    var classItem = '';
                                    var charcButton = '»';
                                    if (valueSubs.parent_id == id_metric) {
                                        if (typeof(arrayModExist[valueSubs.metric_id]) != 'undefined') {
                                            classItem = 'disabled';
                                            charcButton = '«';
                                        }
                                        valueSubs.classItem = classItem;
                                        valueSubs.charcButton = charcButton;
                                        scope.metricLeft.push(valueSubs);
                                    }
                                });
                            });
                            scope.functionCheckShowRemoveAll();
                            break;
                        }
                        //Case delete
                        case 3: {
                            var modifyCol = [];
                            angular.forEach(scope.modifyCol, function (value, key) {
                                if (value.metric_id == id_metric) {
                                    delete scope.modifyCol[key];
                                }
                                else {
                                    modifyCol.push(value);
                                }
                            });
                            var itemMatchSub = [];
                            angular.forEach(scope.modifyCol, function (valueModify, keyModify) {
                                itemMatchSub[valueModify.metric_id] = valueModify.metric_id;
                            });
                            angular.forEach(scope.metricLeft, function (value, key) {
                                classItem = '';
                                charcButton = '»';
                                if (itemMatchSub[value.metric_id]) {
                                    classItem = 'disabled';
                                    charcButton = '«';
                                }
                                scope.metricLeft[key].classItem = classItem;
                                scope.metricLeft[key].charcButton = charcButton;
                            });
                            scope.modifyCol = modifyCol;
                            scope.functionCheckShowRemoveAll();
                            break;
                        }
                        //Case add all
                        case 4: {
                            //Push to array check metric had put Add all column
                            scope.metric_add_all[id_metric] = id_metric;
                            //
                            var itemMatch = [];
                            //Get all column had been added
                            angular.forEach(scope.modifyCol, function (valueModify, keyModify) {
                                itemMatch[valueModify.metric_id] = valueModify.metric_id;
                            });
                            var classItem = '';
                            var charcButton = '»';
                            angular.forEach(scope.metricLeft, function (value, key) {
                                //Check column added or not
                                if (!itemMatch[value.metric_id]) {
                                    classItem = 'disabled';
                                    charcButton = '«';
                                    scope.metricLeft[key].classItem = classItem;
                                    scope.metricLeft[key].charcButton = charcButton;
                                    scope.modifyCol.push(value);
                                }
                            });
                            angular.element('#add_all').hide();
                            angular.element('#remove_all').show();
                            break;
                        }
                        //Delete all from metric
                        case 5: {
                            if (scope.metric_add_all[id_metric]) {
                                angular.element('#add_all').show();
                                angular.element('#remove_all').hide();
                                scope.show_remove_all = false;
                                delete scope.metric_add_all[id_metric];
                            }
                            else {
                                angular.element('#add_all').hide();
                                angular.element('#remove_all').show();

                            }
                            var itemMatch = [];
                            //Get all column had been added
                            angular.forEach(scope.modifyCol, function (valueModify, keyModify) {
                                itemMatch[valueModify.metric_id] = valueModify.metric_id;
                            });
                            var classItem = '';
                            var charcButton = '»';
                            angular.forEach(scope.metricLeft, function (value, key) {
                                angular.forEach(scope.modifyCol, function (valueModify, keyModify) {
                                    //Check column added or not
                                    if (value.metric_id == valueModify.metric_id) {
                                        classItem = '';
                                        charcButton = '»';
                                        scope.metricLeft[key].classItem = classItem;
                                        scope.metricLeft[key].charcButton = charcButton;
                                        scope.modifyCol.splice(keyModify, 1);
                                    }
                                });
                            });
                            break;
                        }
                        //Case Add Modify column
                        case 2: {
                            var itemMatch = false;
                            var arrayExist = [];
                            //Check item had been added or not
                            angular.forEach(scope.modifyCol, function (valueModify, keyModify) {
                                arrayExist[valueModify.metric_id] = valueModify.metric_id;
                            });
                            if ($.inArray(id_metric, arrayExist) != -1) {
                                itemMatch = true;
                                return;
                            }
                            //
                            if (!itemMatch) {
                                var classItem = '';
                                var charcButton = '»';
                                angular.forEach(scope.metricChildren, function (value, key) {
                                    angular.forEach(value, function (valueSubs, keySub) {
                                        if (!arrayExist[valueSubs.metric_id] && valueSubs.metric_id == id_metric) {
                                            classItem = 'disabled';
                                            charcButton = '«';
                                            scope.metricChildren[key][keySub].classItem = classItem;
                                            scope.metricChildren[key][keySub].charcButton = charcButton;
                                            scope.modifyCol.push(valueSubs);

                                        }
                                    });

                                });
                                var count_metric_left = [];
                                angular.forEach(scope.metricLeft, function (valueParent, keyParent) {
                                    //console.log(valueParent);
                                    angular.forEach(scope.modifyCol, function (valueMod, indexMod) {
                                        if (valueParent.metric_id == valueMod.metric_id) {
                                            count_metric_left.push(valueParent.metric_id);
                                        }
                                    });
                                });
                                if (count_metric_left.length == scope.metricLeft.length) {
                                    scope.show_remove_all = true;
                                    scope.metric_add_all[scope.metric_parent_current] = scope.metric_parent_current;
                                }
                                else {
                                    scope.show_remove_all = false;
                                }
                            }
                            break;
                        }
                    }
                    scope.id_metric = id_metric;
                    scope.modifyLength = scope.modifyCol.length;
                };
                scope.isCheck = false;
                scope.popup = {modify_name: ''};
                scope.modifyLength = angular.extend(scope.modifyCol, scope.fixCol).length;
                scope.isError = false;
                scope.applyModal = function () {
                    scope.isError = false;
                    if(scope.isCheck){
                        if(scope.popup.modify_name!=''){
                            scope.isError = true;
                            return false;
                        }
                    };
                    var scopeCol = [];

                    angular.extend(scopeCol,scope.fixCol);

                    angular.element(angular.element('#sortable').children()).each(function (index, value) {
                        if(!$(value).hasClass('hide')){
                            scopeCol.push(JSON.parse($(value).attr('data-json')));
                        }
                    });

                    if (scope.modifyCol.length > 0) {
                        scope.modcolid = 1;
                        if (scope.isCheck && scope.popup.modify_name != '') {
                            Column.create({
                                name: scope.popup.modify_name,
                                dataModify: scopeCol,
                                actionType: 1,
                                type: scope.typecolumn
                            }, function (resp) {
                                if (resp.data.exist == 1) {
                                    var r = confirm("A saved column set with the name already exists ! Overwrite ?");
                                    if (r == true) {
                                        scope.functionUpdate(resp.data.columnid);
                                        scope.modcolid = resp.data.columnid
                                        angular.element('#' + scope.idmodal).modal('hide');
                                        scope.isCheck = false;
                                        scope.popup.modify_name = '';
                                        scope.boardCastGrid(scope.modcolid);
                                    }
                                }
                                else {
                                    angular.element('#' + scope.idmodal).modal('hide');
                                    scope.isCheck = false;
                                    scope.popup.modify_name = '';
                                    scope.boardCastGrid(scope.modcolid);

                                }

                            });

                        }
                        else {
                            Column.create({
                                name: 'Custom',
                                dataModify:scopeCol,
                                type: scope.typecolumn,
                                actionType: 2,
                                modify_name: "Custom"
                            }, function (resp) {
                                angular.element('#' + scope.idmodal).modal('hide');
                                scope.modcolid = resp.data.columnid;
                                scope.boardCastGrid(scope.modcolid);
                                scope.isCheck = false;
                                scope.popup.modify_name = '';
                            });
                        }

                    }

                };
                scope.boardCastGrid = function (colId) {
                    var paramPush = '';
                    var arrayDef = [];
                    angular.forEach(scope.modifyCol, function (value, key) {
                        if (value.data_type == null) {
                            value.data_type = appConfig.GRID_TEXT;
                        }
                        if (value.is_sort == null) {
                            value.is_sort = true;
                        }
                        else {
                            if (value.is_sort == 1) {
                                value.is_sort = true;
                            }
                            else {
                                value.is_sort = false;
                            }

                        }
                        arrayDef.push({
                            header: value.metric_name,
                            name: value.metric_code,
                            enableSorting: value.is_sort,
                            type: value.data_type
                        });
                        paramPush = paramPush + ',' + value.metric_code;
                    });
                    //
                    var lCount = 0;
                    while (lCount < paramPush.length && paramPush[lCount] == ' ') {
                        lCount++;
                    }
                    paramPush = paramPush.substring(lCount, paramPush.length);
                    $rootScope.$broadcast(AUTH_EVENTS.autoloadColumn, {
                        fields: paramPush,
                        type: scope.typecolumn,
                        arrDef: arrayDef,
                        colId: colId + "_" + Math.floor((Math.random() * 100) + 1)
                    });

                }
                scope.ltrim = function (stringToTrim) {
                    var l = 0;
                    while (l < stringToTrim.length && stringToTrim[l] == ' ') {
                        l++;
                    }
                    return stringToTrim.substring(l, stringToTrim.length);

                }
                scope.functionUpdate = function (idModify) {
                    Column.update({
                        id: idModify,
                        name: scope.popup.modify_name,
                        dataModify: scope.modifyCol,
                        type: scope.typecolumn,
                        mod_type: 0
                    }, function (resp) {
                        angular.element('#' + scope.idmodal).modal('hide');
                    });
                };
                scope.functionCancel = function () {
                    angular.element('#' + scope.idmodal).modal('hide');
                    scope.isError = false;
                    scope.functionReloadLoadDataModal(scope.modifyCol, 1);
                };
                scope.addCustomMetric = function () {
                    scope.contentFormula = [];
                    scope.formula = '';
                    scope.form_metric = {custom_metric_name: '', custom_metric_description: '', metric_id: ''};
                    angular.element('.metric').hide();
                    angular.element('.custom_metric').show();
                    Metric.getList({
                        type: scope.typecolumn,
                        obj: appConfig.OBJ_COLUMN,
                        columns: 'METRIC_ID,METRIC_NAME,METRIC_LEVEL,OPERATOR,PARENT_ID,METRIC_CODE'
                    }, function (resp) {
                        scope.metric_parent = resp.data.data_metric_custom;
                    });
                };
                scope.functionCancelCustom = function () {
                    angular.element('.metric').show();
                    angular.element('.custom_metric').hide();
                };
                //Remove custom metric
                scope.removeCustomMetric = function (metric_id) {
                    Metric.delete({id: metric_id, type: 'custom'}, function (resp) {
                        scope.functionCancelCustom();
                        scope.functionLoadDataModal(scope.modifyCol, 0, 1);
                    })
                };
                scope.showErrorNameCustomMetric = false;
                scope.errorMesssage = '';
                //Save custom metric
                scope.saveCustomMetric = function () {
                    Metric.create({
                        formula: scope.contentFormula,
                        custom_metric_name: scope.form_metric.custom_metric_name,
                        custom_metric_description: scope.form_metric.custom_metric_description,
                        type: scope.typecolumn,
                        parentMetric: scope.currentMetric,
                        custom_formula: scope.formula,
                        data_type: scope.currentForumlaId
                    }, function (resp) {
                        if (resp.data.isExist == 1) {
                            scope.showErrorNameCustomMetric = true;
                            scope.errorMessage = 'Metric with this name already existed';
                            return;
                        }
                        scope.functionCancelCustom();
                        scope.functionLoadDataModal(scope.modifyCol, 0, 1);
                        scope.addLeft(scope.currentMetric, 1);
                    });
                };
                scope.buttonAdd = true;
                scope.buttonEdit = false;
                //Load Update Custom Metric
                scope.editCustomMetric = function (metric_id) {
                    scope.buttonAdd = false;
                    scope.buttonEdit = true;
                    Metric.get({id: metric_id, type: 'custom'}, function (resp) {
                        scope.form_metric = {
                            custom_metric_name: resp.data[0].metric_name,
                            custom_metric_description: resp.data[0].description,
                            metric_id: metric_id,
                        };
                        scope.currentForumlaId = resp.data[0].data_type;
                        angular.forEach(scope.dataFormulaType, function (value, key) {
                            if (value.type == resp.data[0].data_type) {
                                scope.currentForumla = value.text;
                            }
                        });
                        scope.contentFormula = resp.data[0].metric_properties;
                        scope.formula = resp.data[0].formula;
                        //scope.addCustomMetric();
                        angular.element('.metric').hide();
                        angular.element('.custom_metric').show();
                        Metric.getList({
                            type: scope.typecolumn,
                            obj: appConfig.OBJ_COLUMN,
                            columns: 'METRIC_ID,METRIC_NAME,METRIC_LEVEL,OPERATOR,PARENT_ID,METRIC_CODE'
                        }, function (resp) {
                            scope.metric_parent = resp.data.data_metric_custom;

                        });
                    });
                };
                //Update custom metric
                scope.updateCustomMetric = function () {
                    Metric.update({
                        id: scope.form_metric.metric_id,
                        formula: scope.formula, custom_metric_name: scope.form_metric.custom_metric_name,
                        custom_metric_description: scope.form_metric.custom_metric_description, type: scope.typecolumn,
                        metric_properties: scope.contentFormula,
                        metric_type: 'custom',
                        data_type: scope.currentForumlaId
                    }, function (resp) {
                        scope.showAddCustom = false;
                        scope.contentFormula = [];
                        scope.formula = '';
                        scope.form_metric = {custom_metric_name: '', custom_metric_description: '', metric_id: ''};
                        scope.functionCancelCustom();
                        scope.functionLoadDataModal(scope.modifyCol, 0, 1);
                    });

                };
                //
                scope.form_metric = {custom_metric_name: '', custom_metric_description: '', metric_id: ''};
                //Custom Metric
                scope.contentFormula = [];
                //Update operator of custom metric
                scope.dataFormulaType = [
                    {type: 1, text: 'Text'},
                    {type: 2, text: 'Number'},
                    {type: 3, text: 'Percent (%)'},
                    {type: 4, text: 'Money'}
                ];
                scope.updateCustomMetricItem = function (itemName, itemType, itemCode, indexItem) {
                    scope.contentFormula[indexItem].itemName = itemName;
                    scope.contentFormula[indexItem].itemType = itemType;
                    scope.contentFormula[indexItem].itemCode = itemCode;
                };
                scope.currentForumla = 'Text';
                scope.currentForumlaId = 1;

                scope.changeForumlaType = function (text, type) {
                    scope.currentForumla = text;
                    scope.currentForumlaId = type;
                };
                scope.formula = '';
                scope.addCustomMetricItem = function (itemName, itemType, itemCode, keyItem) {
                    switch (itemType) {
                        //Item label
                        case 1: {
                            var content = {itemName: itemName, itemType: itemType, itemCode: itemCode, isOperator: 1};
                            scope.contentFormula.push(content);
                            break;
                        }
                        //Item selectbox
                        case 2: {
                            var content = {itemName: itemName, itemType: itemType, itemCode: itemCode, isOperator: 0};
                            scope.contentFormula.push(content);
                            break;
                        }
                    }
                    scope.formula = scope.formula + itemCode;
                };
                scope.$on(AUTH_EVENTS.changeSupportUser, function () {
                    scope.modifyCol = [];
                    scope.functionLoadDataModal(scope.modifyCol, 1);
                });
                scope.txtSearch = '';
                scope.searchMod = function () {
                    var arrSearch = [];
                    var arrColModS = [];
                    angular.forEach(scope.modifyCol, function (value, key) {
                        arrColModS[value.metric_id] = value.metric_id;
                    });
                    angular.forEach(scope.metric_children, function (value, index) {
                        if (value.metric_name && value.metric_name.toUpperCase().indexOf(scope.txtSearch.toUpperCase()) !== -1) {
                            var classItem = '';
                            var charcButton = '»';
                            if (arrColModS[value.metric_id]) {
                                classItem = 'disabled';
                                charcButton = '«';
                            }
                            value.classItem = classItem;
                            value.charcButton = charcButton;
                            arrSearch.push(value);
                        }
                    })
                    scope.metricLeft = arrSearch;
                };
                scope.keyEvent = function (e) {
                    if (e.keyCode == 13) {
                        scope.searchMod();
                    }
                }

            },
            templateUrl: '/js/modules/operation/templates/modifycol/modifycol.html?v=' + ST_VERSION
        };
    });
});