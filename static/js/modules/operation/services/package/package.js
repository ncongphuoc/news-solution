/**
 * @auhor: Code nay la cua Thephuc ^^
 * @since: 21/11/2016
 */
define(['app'], function (app) {

    app.factory('ActionPackage', function ($resource, appConfig) {
        return $resource(appConfig.API + '/deal/index', {}, {
            create: {method: 'POST', cancellable: true}
        });
    });

});