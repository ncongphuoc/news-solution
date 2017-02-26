/**
 * Created by nhanva on 5/20/2016.
 */
define(['app', 'libs/nicescroll/nicescroll.min', 'jquery-scrollbar', 'libs/jquery-number/jquery.number',
    'shared/services/checkModule'], function (app) {
    app.service('Modal', ['$uibModal', function ($uibModal) {
        var defaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'modal.html',
            windowTemplateUrl: 'wrap-modal.html'
        };

        var options = {
            closeText: 'Close', // Close button
            actionText: '', // Ok button
            headerText: 'Title',
            bodyText: 'Message',
            type: 'none',
            onAction: null,
            onCancel: null
        };

        /**
         * Show modal
         * @param modalOptions
         * @param modalDefaults
         * @returns {*}
         * Using:
         *  // Include: "shared/directive/common"
         *  var modal = Modal.showModal({
         *           actionText: 'OK',
         *           closeText: 'Close',
         *           type: TYPE, // With type warning, success, error
         *           onAction: function(){
         *               alert('Close')
         *           }, onCancel: function(){
         *               alert('Cancel')
         *           }}
         );
         */
        this.showModal = function (modalOptions, modalDefaults) {
            if (!modalDefaults) modalDefaults = {};
            modalDefaults.backdrop = 'static';
            return this.show(modalOptions, modalDefaults);
        };

        this.show = function (modalOptions, modalDefaults) {
            // Default param
            var tempDefault = {};
            var tempOptions = {};

            // Set param for modal
            angular.extend(tempDefault, defaults, modalDefaults);

            // Set default option
            angular.extend(tempOptions, options, modalOptions);
            if (!tempDefault.controller) {
                tempDefault.controller = function ($scope, $uibModalInstance) {
                    $scope.options = tempOptions;

                    // Action ok
                    $scope.options.ok = function (result) {
                        $uibModalInstance.close(result);
                    };

                    // Action cancel
                    $scope.options.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };

                    // Handle callback when close uiModal
                    $uibModalInstance.result.then(function (selectedItem) {
                        if (typeof $scope.options.onAction == 'function') {
                            $scope.options.onAction(selectedItem)
                        }
                    }, function () {
                        if (typeof $scope.options.onCancel == 'function') {
                            $scope.options.onCancel()
                        }
                    });
                }
            }

            return $uibModal.open(tempDefault);
        };

        /**
         * Hiding popup when finish
         * @param promise
         * @param modalDefaults
         * @param modalOptions
         * Usage:
         *      Modal.process(LineItem.getList({}), {onAction: function(res){
         *           console.log('On finish')
         *       }, onError: function(err){
         *           console.log("On error")
         *       }});
         *       // With delay time
         *       Modal.process(LineItem.getList({}), {onAction: function(res){
         *           console.log('On finish')
         *       }, onError: function(err){
         *           console.log("On error")
         *       },
         *       delay: 1000
         *       });
         */
        this.process = function (promise, modalOptions) {
            var tempOptions = {};
            // Set default option
            angular.extend(tempOptions, options, {
                headerText: 'Processing',
                bodyText: 'Please waiting...'
            }, modalOptions);

            var modalDefaults = {
                templateUrl: 'waiting.html',
                controller: ['$scope', '$uibModalInstance', '$timeout', function ($scope, $uibModalInstance, $timeout) {
                    $scope.options = tempOptions;
                    promise.$promise.then(function (response) {
                        var doFinish = function () {
                            $uibModalInstance.close(response);
                            if (typeof tempOptions.onAction == 'function') {
                                tempOptions.onAction(response)
                            }
                        }
                        // Delay before close popup
                        if ($scope.options.delay) {
                            console.log('Delay in ' + $scope.options.delay + ' before close popup')
                            $timeout(doFinish, +$scope.options.delay)
                        } else {
                            doFinish();
                        }

                    }, function (err) {
                        $uibModalInstance.dismiss('cancel');
                        if (typeof tempOptions.onCancel == 'function') {
                            tempOptions.onCancel(err)
                        }
                    });
                }]
            };

            // Show model
            this.showModal(tempOptions, modalDefaults);
        }

    }]);


    app.directive('niceScroll', function ($rootScope) {
        return {
            restrict: 'EC',
            link: function (scope, element, attrs, controller) {

                var niceOption = scope.$eval(attrs.niceOption)

                if (!niceOption) {
                    niceOption = {};
                    niceOption.autohidemode = false;
                    niceOption.opacity = 1;
                    niceOption.cursorwidth = "8px";
                    niceOption.cursorcolor = "#aaa";
                    //niceOption.cursorborder = "1px solid #aaa";
                    niceOption.cursorborder = "0px";
                    niceOption.background = '#dedede';
                    //niceOption.railpadding = {top: 6}
                }


                var niceScroll = $(element).niceScroll(niceOption);
                niceScroll.onscrollend = function (data) {
                    if (data.end.y >= this.page.maxh) {
                        if (attrs.niceScrollEnd) scope.$evalAsync(attrs.niceScrollEnd);

                    }
                };

                scope.$on('$destroy', function () {
                    if (angular.isDefined(niceScroll) && angular.isFunction(niceScroll.remove)) {
                        niceScroll.remove()
                    }
                })
            }
        }

    });


    app.directive('perfectScroll', ['$parse', '$window', function ($parse, $window) {
        var psOptions = [
            'wheelSpeed',
            //'wheelPropagation',
            //'minScrollbarLength',
            //'maxScrollbarLength',
            //'useBothWheelAxes',
            //'useKeyboard',
            'suppressScrollX',
            //'suppressScrollY',
            //'scrollXMarginOffset',
            //'scrollYMarginOffset',
            //'includePadding',
            //'onScroll',
            // 'scrollDown'
        ];

        return {
            restrict: 'ECA',
            transclude: true,
            template: '<ul ng-transclude></ul>',
            replace: true,
            link: function ($scope, $elem, $attr) {
                var jqWindow = angular.element($window);
                var options = {};

                for (var i = 0, l = psOptions.length; i < l; i++) {
                    var opt = psOptions[i];
                    if ($attr[opt] !== undefined) {
                        options[opt] = $parse($attr[opt])();
                    }
                }

                $scope.$evalAsync(function () {
                    $elem.perfectScrollbar(options);
                    var onScrollHandler = $parse($attr.onScroll)
                    $elem.scroll(function () {
                        var scrollTop = $elem.scrollTop()
                        var scrollHeight = $elem.prop('scrollHeight') - $elem.height()
                        var scrollLeft = $elem.scrollLeft()
                        var scrollWidth = $elem.prop('scrollWidth') - $elem.width()

                        $scope.$apply(function () {
                            onScrollHandler($scope, {
                                scrollTop: scrollTop,
                                scrollHeight: scrollHeight,
                                scrollLeft: scrollLeft,
                                scrollWidth: scrollWidth
                            })
                        })
                    });
                });

                $scope.$watch(function () {
                    return $elem.prop('scrollHeight');
                }, function (newValue, oldValue) {
                    if (newValue) {
                        update('contentSizeChange');
                    }
                });

                function update(event) {
                    $scope.$evalAsync(function () {
                        if ($attr.scrollDown == 'true' && event != 'mouseenter') {
                            setTimeout(function () {
                                $($elem).scrollTop($($elem).prop("scrollHeight"));
                            }, 100);
                        }
                        $elem.perfectScrollbar('update');
                    });
                }

                // This is necessary when you don't watch anything with the scrollbar
                $elem.bind('mouseenter', update('mouseenter'));

                // Possible future improvement - check the type here and use the appropriate watch for non-arrays
                if ($attr.refreshOnChange) {
                    $scope.$watchCollection($attr.refreshOnChange, function () {
                        update();
                    });
                }

                // this is from a pull request - I am not totally sure what the original issue is but seems harmless
                if ($attr.refreshOnResize) {
                    jqWindow.on('resize', update);
                }

                $elem.bind('$destroy', function () {
                    jqWindow.off('resize', update);
                    $elem.perfectScrollbar('destroy');
                });

            }
        };
    }]);


    // Using for format number
    app.directive('adxFormatNumber', ['$filter', function ($filter) {
        return {
            restrict: 'AC',
            require: '?ngModel',
            scope: false,
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }
                angular.element(element).number(true);
                /*ctrl.$formatters.unshift(function () {
                 if(attrs.validateNumber == 'true'){
                 return ctrl.$modelValue;
                 }
                 return $filter('number')(ctrl.$modelValue);
                 });*/
                /*ctrl.$formatters.unshift(function (a) {
                 if (attrs.validateNumber == 'false') {
                 return ctrl.$modelValue;
                 }
                 return $filter('number')(ctrl.$modelValue)
                 });
                 ctrl.$parsers.unshift(function (viewValue) {
                 if (attrs.validateNumber == 'false') {
                 return viewValue;
                 }
                 var plainNumber = viewValue.replace(/[\,\.]/g, ''),
                 b = $filter('number')(plainNumber);

                 element.val(b);

                 return plainNumber;
                 });*/
                //not string
                /*
                 var keyCode = [8, 9, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 190];
                 element.bind("keydown", function (event) {
                 if (attrs.validateNumber == 'false') {
                 return;
                 }
                 if ($.inArray(event.which, keyCode) == -1) {
                 scope.$apply(function () {
                 scope.$eval(attrs.onlyNum);
                 event.preventDefault();
                 });
                 event.preventDefault();
                 }

                 });
                 */
                var checkNumberOnly = function (e) {
                    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                    // Allow: backspace, delete, tab, escape, enter and .
                    if ($.inArray(key, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                            // Allow: Ctrl+A
                        (key == 65 && e.ctrlKey === true) ||
                            // Allow: Ctrl+C
                        (key == 67 && e.ctrlKey === true) ||
                            // Allow: Ctrl+X
                        (key == 88 && e.ctrlKey === true) ||
                            // Allow: home, end, left, right
                        (key >= 35 && e.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return true;
                    }
                    // Ensure that it is a number and stop the keypress
                    if ((e.shiftKey || (key < 48 || key > 57)) && (key < 96 || key > 105)) {
                        e.preventDefault();
                        return false
                    }
                    return true;
                }
                if (/Firefox/gi.test(navigator.userAgent)) {
                    // Firefox
                    element.bind("keydown", function (e) {
                        if (!attrs.validateNumber) {
                            return true;
                        }
                        return checkNumberOnly(e)
                    })
                } else {
                    // Chrome and IE
                    element.bind("keypress", function (e) {
                        if (!attrs.validateNumber || attrs.validateNumber == 'false') {
                            return true;
                        }
                        return checkNumberOnly(e);


                    })
                }


            }
        }
    }]);

    app.directive('whenScrollEnds', function () {
        return {
            restrict: "A",
            scope: {
                whenScrollEnds: '&'
            },
            link: function (scope, element, attrs) {
            },
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                // Set timeout for build directive in filter choose list report
                $element.scroll(function () {
                    var scrollableHeight = $element.prop('scrollHeight');
                    var clientHeight = $element.prop('clientHeight');
                    if (scrollableHeight - $element.scrollTop() <= clientHeight) {
                        $scope.whenScrollEnds({el: $element.context.lastElementChild.id})
                    }
                });
            }]
        };
    });

    app.directive('stickyHeader', ['APP_EVENTS', function (APP_EVENTS) {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                scrollBody: '@',
                scrollStop: '=',
                scrollableContainer: '=?',
                contentOffset: '=?',
                fsmZIndex: '=?'
            },
            require: ["stickyHeader", "^operations"],
            link: function (scope, element, attributes, controllers) {
                controllers[1].registerStickyHeader(controllers[0]);
                var content,
                    header = $(element, this),
                    clonedHeader = null,
                    scrollableContainer = $(scope.scrollableContainer),
                    contentOffset = scope.contentOffset || 0;

                var unbindScrollBodyWatcher = scope.$watch('scrollBody', function (newValue, oldValue) {
                    content = $(scope.scrollBody);
                    init();
                    unbindScrollBodyWatcher();
                });
                if (scrollableContainer.length === 0) {
                    scrollableContainer = $(window);
                }

                function setColumnHeaderSizes() {
                    if (clonedHeader.is('tr') || clonedHeader.is('thead')) {
                        var clonedColumns = clonedHeader.find('th');
                        if (header.find('th').length > 1) {
                            header.find('th').each(function (index, column) {
                                var clonedColumn = $(clonedColumns[index]);
                                //clonedColumn.css( 'width', column.offsetWidth + 'px'); fixed thead width
                                // fluid thead / table
                                var finalWidthSet = column.offsetWidth; // $(window) can be replace with a custom wrapper / container
                                //var finalWidthSet = column.offsetWidth / ($(window).innerWidth() - 20) * 100; // $(window) can be replace with a custom wrapper / container
                                clonedColumn.css('width', finalWidthSet + 'px');
                            });
                        }

                    }
                };

                function determineVisibility() {
                    var scrollTop = scrollableContainer.scrollTop() + scope.scrollStop;
                    if(content == undefined)
                        return false;
                    var contentTop = content.offset().top + contentOffset;
                    var contentBottom = contentTop + content.outerHeight(false);

                    if ((scrollTop > contentTop) && (scrollTop < contentBottom)) {
                        if (!clonedHeader) {
                            createClone();
                            clonedHeader.css({"visibility": "visible"});
                            header.css({"visibility": "hidden"});
                        }

                        if (scrollTop < contentBottom && scrollTop > contentBottom - clonedHeader.outerHeight(false)) {
                            var top = contentBottom - scrollTop + scope.scrollStop - clonedHeader.outerHeight(false);
                            clonedHeader.css('top', top + 'px');
                        } else {
                            calculateSize();
                        }
                    } else {
                        if (clonedHeader) {
                            /*
                             * remove cloned element (switched places with original on creation)
                             */
                            header.remove();
                            header = clonedHeader;
                            clonedHeader = null;

                            header.removeClass('fsm-sticky-header');
                            header.css({
                                position: 'relative',
                                left: 0,
                                top: 0,
                                //width: 'auto',
                                'z-index': 0,
                                visibility: 'visible'
                            });
                        }
                    }
                };

                function calculateSize() {
                    clonedHeader.css({
                        top: scope.scrollStop,
                        width: header.outerWidth(),
                        left: header.offset().left - $(window).scrollLeft()
                    });

                    setColumnHeaderSizes();
                };

                function createClone() {
                    /*
                     * switch place with cloned element, to keep binding intact
                     */
                    clonedHeader = header;
                    header = clonedHeader.clone();
                    clonedHeader.after(header);
                    clonedHeader.addClass('fsm-sticky-header');
                    clonedHeader.css({
                        position: 'fixed',
                        'z-index': scope.fsmZIndex || 100,
                        visibility: 'hidden'
                    });
                    calculateSize();
                };

                function init() {
                    scrollableContainer.on('scroll.fsmStickyHeader', determineVisibility).trigger("scroll");
                    scrollableContainer.on('resize.fsmStickyHeader', determineVisibility);

                    scope.$on('$destroy', function () {
                        scrollableContainer.off('.fsmStickyHeader');
                    });
                }

                scrollableContainer.bind("scroll", function (e) {
                    determineVisibility();
                });
                scope.callSHeader = function () {
                    determineVisibility();
                };
                scope.$on(APP_EVENTS.resizeStickyHeader, function (params, args) {
                    var scroll_top_old = scrollableContainer.scrollTop();
                    scrollableContainer.scrollTop(scroll_top_old + 10);
                    scrollableContainer.scrollTop(scroll_top_old - 10);
                    determineVisibility();
                });

            },
            controller: function ($scope, $element, $attrs) {
                this.callStickyHeader = function () {
                    $scope.callSHeader();
                };
            }
        };
    }]);

    /**
     * Auto add http:// before url if it absent
     */
    app.directive('adxUrl', function ($parse) {
        return {
            restrict: 'EA',
            replace: false,
            require: 'ngModel',
            scope: {},
            link: function (scope, element, attrs, controller) {
                function ensureHttpPrefix(value) {
                    // Need to add prefix if we don't have http:// prefix already AND we don't have part of it
                    if (value && !/^(https?):\/\//i.test(value)
                        && 'http://'.indexOf(value) !== 0 && 'https://'.indexOf(value) !== 0) {
                        controller.$setViewValue('http://' + value);
                        controller.$render();
                        return 'http://' + value;
                    }
                    else
                        return value;
                }

                controller.$formatters.push(ensureHttpPrefix);
                controller.$parsers.splice(0, 0, ensureHttpPrefix);
            }
        }
    });
    app.filter('sort', function () {
        return function (items, key) {
            if (items != undefined) {
                items.sort(function (a, b) {
                    return a[key].localeCompare(b[key]);
                });
                return items;
            }

        };
    });
    app.directive("outsideClick", ['$document', '$parse', function ($document, $parse) {
        return {
            link: function ($scope, $element, $attributes) {
                var scopeExpression = $attributes.outsideClick,
                    onDocumentClick = function (event) {
                        var isChild = $element.find(event.target).length > 0;

                        if (!isChild) {
                            $scope.$apply(scopeExpression);
                        }
                    };
                $document.on("click", onDocumentClick);
                $element.on('$destroy', function () {
                    $document.off("click", onDocumentClick);
                });
            }
        }
    }]);
    //Directive maintenance system
    app.directive('innerContent', ['$location','$state', '$compile', '$interval', 'CheckModule', 'Session', 'APP_EVENTS', '$http', function ($location,$state, $compile, $interval, CheckModule, Session, APP_EVENTS, $http) {
        return {
            restrict: 'CE',
            scope: true,
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {
                transclude(scope.$parent, function (clone, scope) {
                    element.find('.clone-inner-content').html(clone);
                });
            },
            controller: function ($rootScope, $scope, $element, $attrs, $compile) {
                $rootScope.maintenance = false;
                $scope.$on('$stateChangeStart', function (event, toState, toParams) {
                    getCheckModuleInfo({state_module: toState.name});
                });
                var getCheckModuleInfo = function (params) {
                    CheckModule.get({
                        id: params.state_module
                    }, function (resp) {
                        $scope.maintenance_info = resp.data.module;
                        if (resp.data.module != undefined && resp.data.module.status == false) {
                            $rootScope.maintenance = true;
                        } else {
                            $rootScope.maintenance = false;
                        }
                    });

                };
                getCheckModuleInfo({state_module: $state.current.name});
                var token, user_id;

                if (Session.user != undefined) {
                    token = Session.user.token;
                    if (Session.supportUser != undefined) {
                        user_id = Session.supportUser.user_id;
                    } else {
                        user_id = Session.user.user_id;
                    }
                    /*$scope.$on(APP_EVENTS.httpError, function (args, parms) {
                        var respone = parms.response;
                        var current_url = $location.absUrl();
                        $http.post("/v3/api/monitor/index?_token=" + token + '&_user_id=' + user_id + '&type=http', {
                            params: respone.config.params,
                            url: respone.config.url,
                            status: respone.status,
                            statusText: respone.statusText,
                            type: 'http',
                            method: respone.config.method,
                            url_current: current_url
                        });
                    });*/

                }
            },
            templateUrl: '/js/shared/templates/app/maintenance.html?v=' + ST_VERSION
        };
    }]);

    app.directive('errorSummary', ['$rootScope', 'APP_EVENTS', '$timeout', function ($rootScope, APP_EVENTS, $timeout) {
        return {
            restrict: 'E',
            //transclude: true,
            templateUrl: 'error-summary.html',
            link: function (scope, element, attrs, controller) {
                scope.errors = []
                scope.$on(APP_EVENTS.displayError, function (event, args) {
                    $timeout(function () {
                        var arrErrorEl = angular.element('.error')
                            , arrTmp = []
                            ;
                        angular.forEach(arrErrorEl, function (errorEl) {
                            //console.log(errorEl)
                            var el = angular.element(errorEl), msg = el.text()
                            if (el.is(':visible') && arrTmp.indexOf(msg) == -1) {
                                arrTmp.push(msg.trim());
                            }
                        })

                        scope.errors = arrTmp;
                    }, 100);

                })
            }
        }
    }]);

    /**
     * Sort object by key
     * Usage: <li ng-repeat="loc in locationList.location|orderObjectBy:'location_name'|limitTo:10">
     */
    app.filter('orderObjectBy', function () {
        return function (input, attribute) {
            // console.log('attributeattributeattribute', attribute)
            if (!angular.isObject(input)) return input;

            var array = [];
            for (var objectKey in input) {
                array.push(input[objectKey]);
            }

            array.sort(function (a, b) {
                a = a[attribute];
                b = b[attribute];
                return a.localeCompare(b);
            });
            return array;
        }
    });

    app.directive('adxSystemStatus', function () {
        return {
            restrict: 'E',
            //transclude: true,
            //replace: true,
            templateUrl: 'system-status.html',
            controller: ['$scope', '$interval', '$timeout', '$state', 'CheckModule', 'appConfig',
                function ($scope, $interval, $timeout, $state, CheckModule, appConfig) {
                    $scope.status = 0;
                    $scope.ACCOUNT_STATUS = appConfig.ACCOUNT_STATUS;
                    $scope.noLeftNav = true;
                    var checkPromise;
                    var checkStatus = function () {
                        if (checkPromise) {
                            checkPromise.$cancelRequest();
                        }
                        checkPromise = CheckModule.get({id: $state.current.name});
                        checkPromise.$promise.then(function (res) {
                            // res.data in format: {"module":{"status":"1","from_date":"2016-10-03 00:00:00","to_date":"2016-10-04 00:00:00"},"user":{"status":"1"},"notify":[]}
                            if (res.code == 200) {
                                isReportPage();
                                if (res.data.user.status != undefined) {
                                    $scope.status = res.data.user.status;
                                }
                                // TODO: broadcast event to check module is maintance
                            }
                            checkPromise = null;
                        });
                    };
                    var _interVal = $interval(function () {
                        checkStatus();
                    }, 60000, 0, false); // interval 1 minute

                    $timeout(function () {
                        checkStatus()
                    }, 500);


                    var isReportPage = function(){
                        var tmp = $state.is('report') || $state.includes('report.*');
                        if(tmp != $scope.noLeftNav){
                            $scope.noLeftNav = tmp;
                        }
                    };



                    $scope.$on('$destroy', function () {
                        $interval.cancel(_interVal);
                        if (checkPromise) {
                            checkPromise.$cancelRequest();
                        }
                    })

                }]
        }
    });

    app.directive('adxValidate', [function () {
        return {
            restrict: 'EA',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                function validate(value) {
                    //min
                    if (parseInt(value) < parseInt(+attr.min) && value != '') {
                        ctrl.$setValidity('min', false);
                    } else {
                        ctrl.$setValidity('min', true);
                    }
                    //max
                    if (value <= +attr.max) {
                        ctrl.$setValidity('max', true);
                    } else {
                        ctrl.$setValidity('max', false);
                    }
                    return value;
                }
                ctrl.$formatters.push(validate);
                ctrl.$parsers.push(validate);
            }
        }
    }]);

});