/**
 * Created by truchq on 10/14/2016.
 */
define(['app'], function (app) {
    app.factory('Remarketing', function ($resource, appConfig) {
        return $resource(appConfig.API_BUYER + '/remarketing/performance/:id', {}, {
            get: {method: 'GET'},
            getList: {method: 'GET'},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'}
        });
    });

    app.factory('RemarketingInfo', function ($resource, appConfig) {
        return $resource(appConfig.API_BUYER + '/remarketing/info/:id', {}, {
            get: {method: 'GET', cancellable: true},
            getList: {method: 'GET', cancellable: true},
            create: {method: 'POST'},
            update: {method: 'PUT',params: {id: '@id'}},
            delete: {method: 'DELETE'}
        });
    });
});
