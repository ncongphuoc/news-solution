/**
 * Created by Giang Beo on 04-May-16.
 */
define(['app'], function (app) {
    app.factory('Label', function ($resource, appConfig) {
        return $resource(appConfig.API + '/label/index/:id', {}, {
            get: {method: 'GET', cancellable: true},
            getList: {method: 'GET', cancellable: true},
            create: {method: 'POST'},
            update: {method: 'PUT', params: {id: '@id'}},
            delete: {method: 'DELETE'}
        });
    })
});

