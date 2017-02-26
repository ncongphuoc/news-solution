define(['routes', 'modules/system/controllers/rootController'], function (config, resolver) {
    var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'app.interceptor', 'app.root', 'dir-pagination', 'ngSanitize', 'ngResource', 'pascalprecht.translate', 'ngMessages', 'colorpicker.module', 'ngAnimate', 'ui.select', 'ngScrollbars', 'jQueryScrollbar']);
    app.constant("appConfig", {
            "ST_HOST": ST_HOST,
            "AUTH_ADX_DOMAIN": AUTH_ADX_DOMAIN,
            "API": API_HOST,
            "API_BUYER": API_BUYER_HOST,
            "APP_ID": API_ID,
            "DATE_FORMAT": 'dd/mm/yy',
            "MOMENT_DATE_FORMAT": 'DD/MM/YYYY',
            "TYPE_LINE_ITEM": 1,
            "TYPE_CAMPAIGN": 2,
            "TYPE_CREATIVE": 3,
            "TYPE_TARGET_AUDIENCE": 4,
            "TYPE_TARGET_TOPIC": 5,
            "TYPE_TARGET_SECTION": 6,
            "TYPE_TARGET_GENDER": 7,
            "TYPE_TARGET_AGE": 8,
            "TYPE_SUMMARY_REMARKETING": 1,
            "TYPE_SUMMARY_TOPIC": 2,
            "TYPE_SUMMARY_SECTION": 3,
            "TYPE_SUMMARY_DEMOGRAPHIC": 4,
            "TYPE_SETTING": 9,
            "TYPE_HOME": 10,
            "TYPE_SUPPORT_LINEITEM": 10,
            "TYPE_METRIC_REPORT_COLUMN": 11,
            "TYPE_METRIC_REPORT_FILTER": 12,
            "TYPE_METRIC_REPORT_CONDITION_COLUMN": 13,
            "TYPE_METRIC_REPORT_FILTER_LISTING": 14,
            "TYPE_METRIC_REMARKETING": 15,
            "RESOURCE_CAMPAIGN_TYPE_ADVANCED": 1071,
            "RESOURCE_CAMPAIGN_TYPE_PACKAGE": 1064,
            "OBJ_COLUMN": 10,
            "OBJ_FILTER": 11,
            "OBJ_CHART": 12,
            "OBJ_REPORT_FILTER": 11,
            "AGE_UNKNOW_ID": 29,
            "GENDER_UNKNOW_ID": 3,
            "GENDER_MALE": 1,
            "GENDER_FEMALE": 2,
            "CREATIVE_FORMAT_DYNAMIC": 17,
            "CUSTOM_METRIC_COLUMN_ID": ['METR_00001507', 'METR_00002007', 'METR_00001007'],
            "COLOR_CHART": [
                '#bdd631',
                '#f99f1b',
                '#c27373',
                '#61cad3',
                '#f44336',
                '#388e3c',
                '#f5a816',
                '#f50057',
                '#9575cd',
                '#ff8a65',
                '#00967c',
                '#fbc02d',
                '#f06292',
                '#0097a7',
                '#ff1744',
                '#1de9b6',
                '#e91e63',
                '#689f38',
                '#f57c00',
                '#0086a7'
            ],
            "COLOR_CHART_GENDER": [
                "#9db53b",
                "#bed733"
            ],
            "COLOR_BAR_CHART": [
                "#52a9b3",
                "#62c9d5",
                "#b5f0f6",
                "#f9ca86",
                "#f9931b",
                "#db7500"
            ],
            "COLOR_PIE_CHART_OTHER": [
                "#999999",
                "#bbbbbb"
            ],
            "ARR_TARGET_TYPE": [
                {
                    5: 'Topics',
                    1: 'Sections',
                    13: 'Demographics',
                    6: 'Affinity audiences',
                    10: 'In-market audiences',
                    4: 'Remarketing lists',
                    11: 'Ages',
                    12: 'Genders'
                }
            ],
            "COLUMN_CREATIVE": 3,
            "COLUMN_OBJ_CREATIVE": 10,
            "MODIFY_COLUMN": 1000,
            "STATE_LABEL": [9009, 9010],
            "MODIFY_COLUMN_DEFAULT": [1000, 1001, 1002, 1024],
            "NOT_SHOW_PREDEFINE": [9],
            "SHOW_LABEL_DROPDOWN": [1, 2, 3, 15],
            "FORMAT_WIDGET": [1, 2, 3, 4, 5],
            "AVAIL_NETWORK": [{name: 'Display Network Only', id: 80, value: 80}/*, {name: 'Video', id: 81, value: 81}*/],
            "LINE_ITEM_TYPE": {
                DISPLAY_NET_WORK: 80,
                VIDEO: 81,
                PRIVATE_DEAL: 82
            },
            "GRID_TEXT": 1,
            "GRID_NUMBER": 2,
            "GRID_PERCENT": 3,
            "GRID_CURRENCY": 4,
            "IS_LASTED_MOD_COLUMN": 1,
            "IS_MOD_COLUMN": 1,
            "IS_CUSTOM_MOD_COLUMN": 1,
            "LINE_ITEM_MARKETING_OBJECTIVE": {
                "DEFAULT": 1, // Default object when created
                "CHOOSE_ONE": [3] // Item of marketing object can choose only one child
            },
            "LINE_ITEM_GROUP_TYPE": {"BUILD_AWARENESS": 1, "BUILD_TRAFFIC": 2, "DRIVE_ACTION": 3},
            "LINE_ITEM_RESOURCE_TYPE": {
                "SEE_YOUR_AD": 1086,
                "VISIT_YOUR_WEBSITE": 1087,
                "BUY_ON_YOUR_WEBSITE": 1088,
                "TAKE_AN_ACTION_ON_YOUR_WEBSITE": 1089,
                "CALL_YOUR_BUSINESS": 1090,
                "VISIT_YOUR_BUSINESS": 1091
            },
            "TARGET_INTEREST": 6,
            "TARGET_INMARKET": 10,
            "TARGET_TOPIC": 5,
            "TARGET_REMARKETING": 4,
            "TARGET_WEBSITE": 1,
            "TARGET_AGE": 11,
            "TARGET_GENDER": 12,
            "TARGET_DEMO_GRAPHICS": 13,
            "TARGET_INTEREST_AND_REMARKETING": 18,
            "CREATIVE_FORMART": {
                WIDGET: {
                    PRICE: 1,
                    WITHOUT_PRICE: 2,
                    TEXT: 3
                },
                FILE: {
                    IMAGE: 18,
                    TAG: 12,
                    HTML5: 24
                },
                BUILDER: {
                    TEMPLATE: 20,
                    BRAND: 16,
                    DYNAMIC_TEMPLATE: 17
                }
            },
            MAX_UPLOAD: {
                FILE: 3145728 // 3MB: 3*1024*1204
            },
            MIN_BUDGET: {
                DAILY: 85000,
                LIFE_TIME: 165000
            },
            "USER_ROLES": {
                BUYER: 1,
                SUPPORT: 2
            },
            "REVENUE_TYPE": {
                LIFE_TIME: 1,
                DAILY: 2
            },
            CAMPAIGN_PAYMENT_CPC: 1,
            CAMPAIGN_PAYMENT_CPMv: 2,
            CAMPAIGN_PAYMENT_CPI: 3,
            CAMPAIGN_PAYMENT_CPD: 4,
            CAMPAIGN_PAYMENT_CPM: 5,
            STATUS_TARGET: {
                ENABLE: 1,
                PAUSE: 2,
                REMOVE: 0
            },
            OBJ_LINK_TARGET_INTEREST: 1, //audience interest
            OBJ_LINK_TARGET_INMARKET: 2,  //audience inmarket
            OBJ_LINK_TARGET_REMARKETING: 3, //audience remarketing,
            DELAY_LOADING: 2000,
            DOWNLOAD_HEADER: {
                csv: 'text/csv'
            },
            UN_AUTHORIZE: {
                SUPPORT: 1,
                BUYER_NOT_FOUND: 2
            },
            ACCOUNT_STATUS: {
                SUSPENDED: 3
            },
            NAMESPACE_DELIVERY: NAMESPACE_DELIVERY,
            STATIC_DELIVERY_DOMAIN: STATIC_DELIVERY_DOMAIN,
            LINEITEM_STATUS_V3_ELIGIBLE_DAILY: 71,//Reached daily budget
            LINEITEM_STATUS_V3_ELIGIBLE_LIFETIME: 73 //Reached total budget
        })
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            verify2Step: 'auth-verify-2-step',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized',
            changeSupportUser: 'change-support-user',
            selectSupportUser: 'select-support-user',
            autoloadColumn: 'auto-load-column',
            autoloadGrid: 'auto-load-grid',
            changeLabel: 'change-label',
            reloadModifyColumn: "reload-modify-column",
            autoloadLabelObject: "auto-load-label-object",
            changeParentUser: 'change-parent-user',
            autoloadColor: 'auto-load-color',
            showApplyLabel: 'show-apply-label',
            reloadGridLabel: 'reload-grid-label',
            createCampaignSuccess: 'create-campaign-success'
        }).constant('APP_EVENTS', {
            httpError: 'http-error',
            sumaryLoadEvent: 'summary-load-event',
            loadExisLineItem: 'line-item-load-exist',
            editAction: 'edit-action',
            updateHeightLeft: 'update-height-left-menu',
            updateMasonry: 'masonry-update-layout',
            responeDataChart: 'summary-respone-data-chart',
            lineItem: {
                changeMkObject: 'line-item-change-markting-object',
                changeBudgetType: 'line-item-change-budget-type',
                saveLineItem: 'line-item-on-submit',
                updateSubMenu: 'line-item-update-sub-menu',
                loadPackage: 'line-item-load-package-info'
            },
            creative: {
                onSave: 'creative-on-submit',
                onChangeType: 'creative-on-change-type',
                onPreview: 'creative-on-preview'
            },
            breadcumb: {
                showBreadcumb: 'show-break-cumb'
            },
            reloadGrid: 'reload-grid',
            reloadChart: 'reload-chart',
            editNameObjectGrid: 'edit-name-object-grid',
            resizeStickyHeader: 'resize-sticky-header',
            selectUser: 'select-user',
            reportCreateFilterMetricToggle: 'report-create-filter-metric-toggle',
            reportCreateFilterMetricApply: 'report-create-filter-metric-apply',
            reportCreateFilterMetricSendData: 'report-create-filter-metric-send-data',
            reportCreateFilterMetricRemove: 'report-create-filter-metric-remove',
            changeCalendar: 'change-calendar',
            broadcastGrid: 'broadcast-grid',
            displayError: 'on-display-error',
            shareLibraryRemarketingDropdownFilterLabel: 'share-library-remarketing-dropdown-filter-label',
            shareLibraryRemarketingSubmitForm: 'share-library-remarketing-submit-form'
        })
        .config(
            [
                '$urlRouterProvider',
                '$locationProvider',
                '$controllerProvider',
                '$compileProvider',
                '$filterProvider',
                '$provide',
                '$stateProvider',
                'ScrollBarsProvider',
                function ($urlRouterProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider, ScrollBarsProvider) {
                    app.controller = $controllerProvider.register;
                    app.directive = $compileProvider.directive;
                    app.filter = $filterProvider.register;
                    app.factory = $provide.factory;
                    app.service = $provide.service;

                    //$locationProvider.html5Mode(true);

                    if (config.routes !== undefined) {
                        angular.forEach(config.routes, function (route, name) {
                            // Register state defined in shared/routes/routes.js
                            $stateProvider.state(name, route);
                        });
                    }
                    // Set defaul routes
                    if (typeof config.defaultRoutePath != 'undefined') {
                        $urlRouterProvider.otherwise(config.defaultRoutePath);
                    } else {
                        $urlRouterProvider.otherwise('/buyer/dashboard');
                    }
                    // scrollbar defaults
                    ScrollBarsProvider.defaults = {
                        autoHideScrollbar: false,
                        scrollInertia: 0,
                        axis: 'yx',
                        advanced: {
                            updateOnContentResize: true
                        },
                        scrollButtons: {
                            scrollAmount: 'auto', // scroll amount when button pressed
                            enable: true // enable scrolling buttons by default
                        },
                        theme: 'dark',
                        setWidth: '100%'
                    };
                }
            ])
        .config(function ($sceDelegateProvider) {
            // Allow load appConfig.ST_HOST + '/js/modules/default/user/templates/user/login.html' in defaultSystemRootCtrl
            $sceDelegateProvider.resourceUrlWhitelist(['**']);
        })
    /* Adding the auth interceptor here, to check every $http request*/
    app.config(function ($httpProvider) {
            $httpProvider.interceptors.push([
                '$injector',
                function ($injector) {
                    return $injector.get('AuthInterceptor');
                }
            ]);
        })
        /* module definition and configuration stuff... */
        .config(function ($translateProvider) {
            //$translateProvider.useCookieStorage();
            $translateProvider.useStaticFilesLoader({
                prefix: '/js/shared/locales/',
                suffix: '.json?v=' + (ST_VERSION || 1)
            });
            $translateProvider.preferredLanguage('en');
            $translateProvider.useSanitizeValueStrategy('escape');

        })
    app.factory('debounce', ['$timeout', function ($timeout) {
        /**
         * will cal fn once after timeout even if more than one call wdo debounced fn was made
         * @param {Function} fn to call debounced
         * @param {Number} timeout
         * @param {boolean} apply will be passed to $timeout as last param, if the debounce is triggering infinite digests, set this to false
         * @returns {Function} which you can call instead fn as if you were calling fn
         */
        function debounce(fn, timeout, apply) {
            timeout = angular.isUndefined(timeout) ? 0 : timeout;
            apply = angular.isUndefined(apply) ? true : apply; // !!default is true! most suitable to my experience
            var nthCall = 0;
            return function () { // intercepting fn
                var that = this;
                var argz = arguments;
                nthCall++;
                var later = (function (version) {
                    return function () {
                        if (version === nthCall) {
                            return fn.apply(that, argz);
                        }
                    };
                })(nthCall);
                return $timeout(later, timeout, apply);
            };
        }

        return debounce;
    }]);
    app.config(['$compileProvider', function ($compileProvider) {
        // disable this in production for a significant performance boost
        $compileProvider.debugInfoEnabled(false);

        // If you wish to debug an application with this information then you should open up a debug console in the browser then call this method directly in this console:
        // angular.reloadWithDebugInfo();
    }]).config(['$cookiesProvider', function ($cookiesProvider) {
        // Set $cookies defaults
        $cookiesProvider.defaults.path = PRODUCT_VERSION != undefined ? PRODUCT_VERSION : '/';
        $cookiesProvider.defaults.domain = document.domain;
    }]);
    app.config(function ($provide) {
        $provide.decorator("$exceptionHandler", function ($delegate, $injector) {
            return function (exception, cause) {

                var $rootScope = $injector.get("$rootScope");
                var Session = $injector.get('Session');
                var $location = $injector.get('$location');
                var current_url = $location.absUrl();
                //console.log(Session);
                //console.log(exception); // This represents a custom method that exists within $rootScope
                var $http = $injector.get('$http');
                //var scope = $injector.get('scope');
                var formatted = '';
                var properties = '';
                formatted += 'URL: ' + current_url + '"\n';
                formatted += 'Exception: "' + exception.toString() + '"\n';
                formatted += 'Caused by: ' + cause + '\n';
                properties += (exception.message) ? 'Message: ' + exception.message + '\n' : ''
                properties += (exception.fileName) ? 'File Name: ' + exception.fileName + '\n' : ''
                properties += (exception.lineNumber) ? 'Line Number: ' + exception.lineNumber + '\n' : ''
                properties += (exception.stack) ? 'Stack Trace: ' + exception.stack + '\n' : ''
                properties += 'User Agent :' + navigator.userAgent;
                //console.log(exception.lineNumber);
                if (properties) {
                    formatted += properties;
                }
                var token, user_id;
                if (Session.user != undefined) {
                    token = Session.user.token;
                    if (Session.supportUser != undefined) {
                        user_id = Session.supportUser.user_id;
                    } else {
                        user_id = Session.user.user_id;
                    }
                    /*$http.post("/v3/api/monitor/index?_token=" + token + '&_user_id=' + user_id + '&type=issue', {
                        exception: formatted,
                        cause: cause
                    });*/
                }
                $delegate(exception, cause);
            };
        })
    });
    app.run(function ($rootScope, $state, Auth, AUTH_EVENTS, Session, appConfig, $location) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            // Show loading
            $rootScope.showLoading = true;
            if (!Auth.isAuthenticated()) {
                // user is not logged in
                //$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

                if (toState.name != 'login' && toState.name != 'unauthorize') {

                    $rootScope.link_redirect = $location.absUrl();
                    event.preventDefault();

                    // Store stage name to go back after login
                    $rootScope.returnToState = toState.name;
                    $rootScope.showLoading = false;
                    // Go to login page
                    return $state.go('login')
                }
            } else {
                // Check on support user
                var supportUser = Session.supportUser;
                if (supportUser && supportUser.role == appConfig.USER_ROLES.SUPPORT) {
                    // Can not view or creatve report
                    if (['report', 'report.create', 'report.detail'].indexOf(toState.name) != -1) {
                        event.preventDefault();
                        $rootScope.showLoading = false;
                        return $state.go('unauthorize', {
                            user_id: supportUser.user_id,
                            code: appConfig.UN_AUTHORIZE.SUPPORT
                        })
                    }
                }
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
            // Hide icon loading
            $rootScope.showLoading = false;
            if (Auth.supportUser() && toParams.user_id && Auth.supportUser().user_id != toParams.user_id) {
                $rootScope.changeSupportUser(toParams.user_id, true)
            }

            // Do checking object existing
            $rootScope.checkingObject();
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            // Hide icon loading
            //$rootScope.showLoading = false;
            console.log('$stateChangeError')
            console.log(error)
        });

        $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
            // Access to all the view config properties.
            // and one special property 'targetView'
            // viewConfig.targetView
            //console.log('Load view');
            //console.log(viewConfig)
        });
        $rootScope.$on('$viewContentLoaded', function (event) {
            //console.log('Fi load view')
            //console.log(event)
        });

    });

    app.directive('pageTitle', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            return {
                link: function (scope, element) {

                    var listener = function (event, toState) {

                        var title = '';
                        if (toState.data && toState.data.pageTitle) {
                            title = toState.data.pageTitle + " | ";
                        }

                        $timeout(function () {
                            element.text(title + "Powered by Ants Advertising Platform");
                        }, 50, false);
                    };

                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            };
        }
    ]);

    return app;
});