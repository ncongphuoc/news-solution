/**
 * Created by truchq on 4/25/2016.
 */
define(['app'], function (app) {
    app.factory('CheckModule', function ($resource, appConfig) {
        return $resource(appConfig.API + '/check-module/index/:id', {}, {
            get: {method: 'GET', cancellable: true},
            getList: {method: 'GET'},
            create: {method: 'POST'},
            update: {method: 'PUT', params: {id: '@id'}},
            delete: {method: 'DELETE'}
        });
    })
});
