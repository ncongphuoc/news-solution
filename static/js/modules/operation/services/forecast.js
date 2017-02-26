/**
 * Created by tuandv on 7/8/16.
 */
define(['app'], function(app) {
    app.factory('Forecast', function ($resource, appConfig) {
        return $resource(appConfig.API_BUYER + '/forecast/performance/:id', {}, {
            get: {method: 'GET'},
            getList: {method: 'GET'},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'}
        });
    });
});