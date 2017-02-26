/**
 * Created by truchq on 4/25/2016.
 */
define(['app'], function (app) {
    app.factory('Target', function ($resource, appConfig) {
        return $resource(appConfig.API_BUYER + '/targeting/info', {}, {
            get: {method: 'GET', cancellable: true}
        });
    });

    app.factory('TargetSummary', function ($resource, appConfig) {
        return $resource(appConfig.API + '/targeting/summary', {}, {
            get: {method: 'GET'},
            getList: {method: 'GET', cancellable: true},
        });
    });
});
