/**
 * Created by nhanva on 4/29/2016.
 */
define(['app', 'libs/icheck/icheck'], function (app) {

    app.directive('icheck', function ($timeout, $parse) {
        return {
            restrict: 'EAC',
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue){
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_square-blue',
                        radioClass: 'iradio_square-blue',
                        increaseArea: '5%'
                    }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    });
    app.directive('adxInputDate', function ($timeout, $parse) {
        return {
            //priority: 1,
            //terminal: true,
            scope:false,
            restrict: 'EAC',
            //transclude: true,
            require: 'ngModel',
            replace: true,
            template: '<input type="text" class="form-control" datepicker-popup is-open="opened" ng-focus="opened = true" uib-datepicker-popup="yyyy-MM-dd" ng-model="ngModel"  datepicker-options="dateOptions" ng-required="true" close-text="Close" alt-input-formats="altInputFormats" />',
            link: function(scope, element, $attrs, ngModel) {
                /*scope.opened = false;
                scope.format = 'dd-MMMM-yyyy';
                scope.altInputFormats = ['M!/d!/yyyy'];
                scope.dateOptions = {
                    //dateDisabled: disabled,
                    minDate: new Date(),
                    maxDate: null
                }*/
            },
            controller: function($scope){
                $scope.format = 'dd-MMMM-yyyy';
                $scope.altInputFormats = ['M!/d!/yyyy'];
                $scope.dateOptions = {
                    //dateDisabled: disabled,
                    minDate: new Date(),
                    maxDate: null
                }
            }
        };
    });

    /**
     * Common drop down for adx
     * Using:
     *      <adx-dropdown ng-model="network_type" datasource="availableNetwork"></adx-dropdown>
     *   or
     *      <adx-dropdown ng-model="budget" text="Select a budget" datasource="[{name:'Daily Budget', value:1}, {name:'Lifetime Budget', value:2}]"></adx-dropdown>
     */
    app.directive('adxDropdown', function ($timeout, $parse, $filter) {
        return {
            //priority: 1,
            //terminal: true,
            scope: {
                dataSource:'=datasource',
                modelValue: '=ngModel',
                text:'@text',
                defaultText:'@',
                disabled: '=?disabled',
                onChange: '&?ngChange',
                cssClass: '@?',
                cssClassButton:'@?cssClassButton'
            },
            restrict: 'EAC',
            //transclude: true,
            require: 'ngModel',
            replace: true,
            template: '<div class="dropdown" uib-dropdown>' +
                '<button ng-disabled="disabled" type="button" class="btn btn-default {{cssClassButton !=undefined ? cssClassButton : \'\'}}" uib-dropdown-toggle>{{getText()}}<span class="caret"></span></button>' +
                '<ul class="dropdown-menu dropdown-web-list" role="menu" aria-labelledby="single-button">' +
                    '<li ng-repeat="item in dataSource | orderBy:\'value\'"><a ng-click="change(item)" href=""><i class="{{cssClass !=undefined ? cssClass + item.value : \'\'}}"></i>{{item.name}}</a></li>' +
                '</ul>' +
            '</div>',
            controller: function($scope){
                var init = function () {
                    if(($scope.text == undefined || !$scope.text) && $scope.modelValue != undefined){
                        // Using filter to filter key of object
                        var total = $scope.dataSource.length
                        for(var index =0; index < total; index++){
                            if($scope.dataSource[index].value == $scope.modelValue){
                                $scope.text = $scope.dataSource[index].name;
                                break;
                            }
                        }
                    }
                }

                init();
                

                $scope.change = function(item){
                    $scope.modelValue = item.value
                    $scope.text = item.name

                    // Check have listen event onChange
                    if($scope.onChange != undefined){
                        $scope.onChange({type: item})
                    }
                }
                
                $scope.$watch('dataSource', function (newVal, oldVal) {
                    $scope.text = null;
                    init();
                }, true)

                // Watch model change to update text
                $scope.$watch('modelValue', function (newVal, oldVal) {
                    $scope.text = null;
                    init();
                })

                $scope.getText = function(){
                    return $scope.text ? $scope.text : $scope.defaultText
                }
            }

        };
    });
});