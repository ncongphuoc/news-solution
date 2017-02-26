define([], function () {
    return {
        'operations': {
            url: '/:user_id/operations',
            params: {
                user_id: null
            },
            data: {
                pageTitle: 'Operations'
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
                                "shared/directive/operations"
                            ], function () {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }]
                    }
                },
                'content@': {
                    controller: function ($state, Auth) {
                        var user_id = Auth.supportUser() ? Auth.supportUser().user_id : null;
                        // When user choose new tab, will get user_id from url
                        if ($state.params.user_id) {
                            user_id = $state.params.user_id;
                        }
                        $state.go('operations.private-deal', {user_id: user_id})
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
        'operations.private-deal': {
            url: '/private-deal',
            views: {
                'content@': {
                    controller: 'operationPackageListController',
                    templateUrl: '/js/modules/operation/templates/package/list.html?v=' + ST_VERSION,
                    resolve: {
                        loadDeps: ["$q", function ($q) {
                            var deferred = $q.defer();
                            require([
                                "modules/operation/controllers/package/listController",
                                "modules/operation/directives/filterTop",
                                "modules/operation/directives/filterBottom",
                                "libs/highcharts/highcharts",
                                "shared/directive/chart",
                                "shared/directive/grid",
                                "modules/operation/services/metric",
                                "modules/operation/services/filter",
                                "shared/directive/filter",
                                "shared/directive/datepicker",
                                "modules/operation/services/campaign",
                                "shared/services/search"
                            ], function () {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }]
                    }
                }
            }
        },
        'operations.private-deal.detail': {
            abstract: true
        },
        'operations.private-deal.detail.lineitem': {
            url: '/:private_deal_id/lineitem',
            views: {
                'content@': {
                    controller: 'operationPackageListDetailController',
                    templateUrl: '/js/modules/operation/templates/package/list-detail.html?v=' + ST_VERSION,
                    resolve: {
                        loadDeps: ["$q", function ($q) {
                            var deferred = $q.defer();
                            require([
                                "modules/operation/controllers/package/listDetailController"
                            ], function () {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }]
                    }
                }
            }
        },
        'operations.private-deal.create': {
            url: '/create',
            views: {
                'leftnav@': {
                    controller: 'campaignLeftNavController',
                    templateUrl: '/js/modules/operation/templates/package/leftnav.html?v=' + ST_VERSION,
                    resolve: {
                        loadDeps: ["$q", function ($q) {
                            var deferred = $q.defer();
                            require([
                                "modules/operation/controllers/leftNavController",
                                "shared/directive/common"
                            ], function () {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }]
                    }
                },
                'content@': {
                    controller: 'operationPackageAddController',
                    templateUrl: '/js/modules/operation/templates/package/add.html?v=' + ST_VERSION,
                    resolve: {
                        loadDeps: ["$q", function ($q) {
                            var deferred = $q.defer();
                            require([
                                "modules/operation/controllers/package/addController",
                                'modules/operation/directives/package/formStepOne',
                                'modules/operation/directives/package/formStepTwo',
                                'modules/operation/directives/package/formStepThree',
                                'shared/directive/common',
                                'shared/directive/datepicker'
                            ], function () {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }]
                    }
                }
            }
        },
        'operations.private-deal.edit': {
            url: '/edit/:private_deal_id',
            views: {
                'content@': {
                    controller: 'operationPackageEditController',
                    templateUrl: '/js/modules/operation/templates/package/edit.html?v=' + ST_VERSION,
                    resolve: {
                        loadDeps: ["$q", function ($q) {
                            var deferred = $q.defer();
                            require([
                                "modules/operation/controllers/package/editController"
                            ], function () {
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