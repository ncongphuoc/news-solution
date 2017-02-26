/**
 * @auhor: Code nay la cua Thephuc ^^
 * @since: 21/11/2016
 */
define(['app'], function (app) {

    app.factory('Placement', function ($resource, appConfig) {
        return $resource(appConfig.API + '/placement/index/:id', {}, {
            getList: {method: 'GET', cancellable: true}
        });
    });

});