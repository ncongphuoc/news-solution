/**
 * Created by nhanva on 8/9/2016.
 */
define([], function () {
    return {
        'accounts': {
            url: '/:user_id/accounts',
            params: {
                user_id: null
            },
            data : {
                pageTitle: 'Accounts'
            },
            views: {
                'leftnav@': {
                    controller: 'systemLeftController',
                    templateUrl: '/js/shared/templates/app/leftnav.html?v=' + ST_VERSION,
                    resolve: {
                        loadDeps: ["$q", function ($q) {
                            var deferred = $q.defer();
                            require([
                                "modules/system/controllers/headerController",
                                "shared/directive/operations",
                                "shared/directive/grid",
                                "modules/operation/services/lineitem",
                                "modules/operation/services/campaign"
                            ], function () {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }]
                    }
                },
                'content@': {
                    templateUrl: '/js/modules/account/templates/account/index.html?v=' + ST_VERSION,
                    controller: "accountsAccountIndexController",
                    resolve: {
                        loadDeps: ["$q", function ($q) {
                            var deferred = $q.defer();
                            require(["modules/account/controllers/account/indexController"], function () {
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
        }
    }
});