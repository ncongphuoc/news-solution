require.config({
    baseUrl: ST_HOST + '/js',
    urlArgs: "v=" + (ST_VERSION || 1),
    paths: {
        'jquery': 'libs/jquery/jquery',
        'angular': 'libs/angular/angular',
        'angular-route': 'libs/angular-route/angular-route',
        'angular-cookies': 'libs/angular-cookies/angular-cookies',
        'angular-resource': 'libs/angular-resource/angular-resource',
        'angular-messages': 'libs/angular-messages/angular-messages',
        'angular-translate': 'libs/angular-translate/angular-translate',
        'angular-translate-loader-static-files': 'libs/angular-translate-loader-static-files/angular-translate-loader-static-files',
        'bootstrap': 'libs/bootstrap/bootstrap.min',
        'ui-boostrap': 'libs/ui-boostrap/ui-bootstrap-tpls-1.3.1.min',
        'routes': 'shared/routes/routes',
        'angular-ui-router': 'libs/angular-ui-router/angular-ui-router',
        'interceptor': 'shared/services/interceptor',
        'session': 'shared/services/session',
        'auth': 'shared/services/auth',
        'plugins': 'shared/assets/plugins',
        'main': 'shared/assets/main',
        'highcharts': 'libs/highcharts/highcharts',
        'ngSanitize': 'shared/services/ngSanitize',
        'dir-pagination': 'libs/pagination/dir-pagination',
        'angular-bootstrap-colorpicker': 'libs/angular-bootstrap-colorpicker/bootstrap-colorpicker-module',
        'dmuploader': 'libs/dmuploader/dmuploader',
        'color-selector': 'libs/color-selector/bootstrap-colorselector',
        'color-convert': 'libs/convert-color/color2color',
        'angular-animate': 'libs/angular-animate/angular-animate.min',
        'color-thief': "libs/color-thief/color-thief",
        'mustache': "libs/color-thief/mustache",
        'jpg':'libs/color-thief/jpg',
        'angular-ui-select': 'libs/angular-ui-select/select.min',
        'masonry':'libs/masonry/masonry',
        'mansory-js':'libs/mansory-js/masonry.pkgd.min',
        'jquery-bridget':'libs/jquery-bridget/jquery-bridget',
        'jquery-scrollbar':'libs/jquery-scrollbar/perfect-scrollbar.min',
        'jquery-scrollbar-mousewheel':'libs/jquery-scrollbar/perfect-scrollbar.with-mousewheel.min',
        'custom-scrollbar':'libs/ng-scrollbars/jquery.mCustomScrollbar',
        'scrollbars':'libs/ng-scrollbars/scrollbars.min',
        'scrollbar':'libs/scrollbar/jquery.scrollbar.min'
    },
    waitSeconds: 0,
    shim: {
        angular: {
            exports: "angular",
            deps: ['jquery']
        },
        'app': {
            deps: ['angular', 'angular-ui-router', 'ui-boostrap', 'angular-cookies', 'auth', 'interceptor', 'ngSanitize', 'angular-resource', 'dir-pagination', 'angular-translate-loader-static-files', 'angular-bootstrap-colorpicker', 'angular-messages', 'angular-animate', 'angular-ui-select','scrollbars', 'custom-scrollbar', 'scrollbar']
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-cookies': {
            deps: ['angular']
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'session': {
            deps: ['angular']
        },
        'auth': {
            deps: ['angular', 'session']
        },
        'interceptor': {
            deps: ['session', 'auth']
        },
        'ui-boostrap': {
            deps: ['angular']
        },
        'plugins': {
            deps: ['jquery']
        },
        'main': {
            deps: ['jquery']
        },
        'highcharts': {
            deps: ['jquery']
        },
        'ngSanitize': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular']
        },
        'dir-pagination': {
            deps: ['angular']
        },
        'angular-translate': {
            deps: ['angular', 'angular-cookies']
        },
        'angular-translate-loader-static-files': {
            deps: ['angular', 'angular-cookies', 'angular-translate']
        },
        'angular-bootstrap-colorpicker': {
            deps: ['angular']
        },
        'dmuploader': {
            deps: ['jquery']
        },
        'color-selector': {
            deps: ['jquery']
        },
        'angular-messages': {
            deps: ['angular']
        }
        , 'angular-animate': {
            deps: ['angular']
        },
        'color-thief':{
            deps:['mustache']
        },
        'angular-ui-select':{
            deps: ['angular']
        },
        'mansory-js':{
            deps:['jquery']
        },
        'masonry': {
            deps: ['jquery','jquery-bridget','mansory-js']
        },
        'jquery-scrollbar-mousewheel': {
            deps:['jquery']
        },
        'jquery-scrollbar': {
            deps:['jquery', 'jquery-scrollbar-mousewheel']
        },
        'custom-scrollbar':{
            deps:['jquery']
        },
        'scrollbars':{
            deps:['angular']
        },
        'scrollbar': {
            deps:['angular']
        }
    }
});

require(['app'],
    function (app) {
        angular.element().ready(function () {
            angular.bootstrap(document, ['app']);
        });
    }
);