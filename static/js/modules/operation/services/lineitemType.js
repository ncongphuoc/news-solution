/**
 * Created by Giang Beo on 27-Apr-16.
 */
define(['app'], function (app) {
    app.factory('LineItemType', function ($resource, appConfig) {
        return $resource(appConfig.API + '/lineItem/type/:id', {}, {
            get: {method: 'GET', cancellable: true},
            getList: {method: 'GET', cancellable: true},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'}
        });
    });

});
