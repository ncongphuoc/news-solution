/**
 * Created by truchq on 4/25/2016.
 */
define(['app'], function (app) {
    app.factory('Campaign', function ($resource, appConfig) {
        return $resource(appConfig.API + '/campaign/performance/:id', {}, {
            get: {method: 'GET'},
            getList: {method: 'GET'},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'}
        });
    });

    app.factory('CampaignInfo', function ($resource, appConfig) {
        return $resource(appConfig.API + '/campaign/info/:id', {}, {
            get: {method: 'GET'},
            getList: {method: 'GET', cancellable: true},
            create: {method: 'POST'},
            update: {method: 'PUT',params: {id: '@id'}},
            delete: {method: 'DELETE'}
        });
    });
});
