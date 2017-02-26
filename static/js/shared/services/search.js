/**
 * Created by tuandv on 6/13/16.
 */
(function (define, angular) {
    define(['angular'], function (angular) {
        return angular.module('app.search', [])
            .factory('Search', function ($resource, appConfig) {
                return $resource(appConfig.API_BUYER + '/search/index/:id', {}, {
                    get: {method: 'GET', cancellable: true},
                    getList: {method: 'GET', cancellable: true},
                    create: {method: 'POST'},
                    update: {method: 'PUT'},
                    delete: {method: 'DELETE'},
                    getSupported: {method: 'GET', url: appConfig.API_BUYER + '/search/index'},
                    detailLineItem: {method: 'GET', url: appConfig.API_BUYER + '/lineItem/info/:id'},
                    detailCampaign: {method: 'GET', url: appConfig.API_BUYER + '/campaign/info/:id'}
                });
            }).factory('Find', function ($resource, appConfig) {
                return $resource(appConfig.API_BUYER + '/find/index/:id', {}, {
                    get: {method: 'GET', cancellable: true},
                    getList: {method: 'GET', cancellable: true}
                });
            }).factory('Package', function ($resource, appConfig) {
                return $resource(appConfig.API + '/deal/index/:id', {}, {
                    getList: {method: 'GET', cancellable: true}
                });
            });
    })
}(define, angular));