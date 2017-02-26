/**
 * Created by Giang Beo on 06-May-16.
 */
define(['app'], function (app) {
    app.factory('Column', function ($resource, appConfig) {
        return $resource(appConfig.API + '/column/index/:id', {}, {
            get: {method: 'GET'},
            getList: {method: 'GET'},
            create: {method: 'POST'},
            update: {method: 'PUT', params: {id: '@id'}},
            delete: {method: 'DELETE'}
        });
    })
});
