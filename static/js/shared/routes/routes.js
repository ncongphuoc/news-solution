/**
 * Created by nhanva on 4/18/2016.
 */
define(['angular', 'shared/routes/operation', 'shared/routes/account'],
    function (angular, operation, report, account) {
        var defaultRoute = {
            'login': {
                url: '/login',
                views: {
                    'content@': {
                        templateUrl: '/js/modules/system/templates/login/login.html?v=' + ST_VERSION,
                        controller: "systemLoginController",
                        resolve: {
                            loadDeps: ["$q", function ($q) {
                                var deferred = $q.defer();
                                require(["modules/system/controllers/loginController"], function () {
                                    deferred.resolve();
                                });
                                return deferred.promise;
                            }]
                        }
                    },
                    'header@': {
                        templateUrl: '/js/modules/system/templates/login/header.html?v=' + ST_VERSION,
                        controller: "systemHeaderController",
                        resolve: {
                            loadDeps: ["$q", function ($q) {
                                var deferred = $q.defer();
                                require(["modules/system/controllers/headerController"], function () {
                                    deferred.resolve();
                                });
                                return deferred.promise;
                            }]
                        }
                    }
                }
            },
            'unauthorize': {
                url: '/:user_id/unauthorize/:code',
                params: {
                    code: null,
                    user_id: null
                },
                views: {
                    'content@': {
                        templateUrl: '/js/modules/system/templates/login/unauthorize.html?v=' + ST_VERSION,
                        controller: "systemUnAuthorizeController",
                        resolve: {
                            loadDeps: ["$q", function ($q) {
                                var deferred = $q.defer();
                                require(["modules/system/controllers/headerController"], function () {
                                    deferred.resolve();
                                });
                                return deferred.promise;
                            }]
                        }
                    },
                    'header@': {
                        templateUrl: '/js/modules/system/templates/root/header.html?v=' + ST_VERSION,
                        controller: "systemHeaderController",
                        resolve: {
                            loadDeps: ["$q", function ($q) {
                                var deferred = $q.defer();
                                require(["modules/system/controllers/headerController"], function () {
                                    deferred.resolve();
                                });
                                return deferred.promise;
                            }]
                        }
                    }
                }
            },
            'admin': {
                url: '/:user_id',
                params: {
                    user_id: null
                },
                views: {
                    'content@': {
                        controller: 'adminIndexListController',
                        templateUrl: '/js/modules/admin/templates/index/list.html?v=' + ST_VERSION,
                        resolve: {
                            loadDeps: ["$q", function ($q) {
                                var deferred = $q.defer();
                                require([
                                    "modules/admin/controllers/indexListController"
                                ], function () {
                                    deferred.resolve();
                                });
                                return deferred.promise;
                            }]
                        }
                    },
                    'footer@': {
                        templateUrl: '/js/shared/templates/app/footer.html?v=' + ST_VERSION
                    },
                    'header@': {
                        templateUrl: '/js/modules/system/templates/root/header.html?v=' + ST_VERSION,
                        controller: "systemHeaderController",
                        resolve: {
                            loadDeps: ["$q", function ($q) {
                                var deferred = $q.defer();
                                require(["modules/system/controllers/headerController"], function () {
                                    deferred.resolve();
                                });
                                return deferred.promise;
                            }]
                        }
                    }
                }
            }
        };
        return {
            defaultRoutePath: '/',
            routes: angular.extend({}, defaultRoute, operation, report, account)
        };
    });