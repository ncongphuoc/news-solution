/**
 * Created by truchq on 4/25/2016.
 */
define(['app'], function (app) {
    app.factory('Filter', function ($resource, appConfig) {
        return $resource(appConfig.API + '/filter/index/:id', {}, {
            get: {method: 'GET', cancellable: true},
            getList: {method: 'GET', cancellable: true},
            create: {method: 'POST'},
            update: {method: 'PUT', params: {id: '@id'}},
            delete: {method: 'DELETE'}
        });
    })
});
