/**
 * Created by tuandv on 6/3/16.
 */

define(['app'], function(app)
{
    app.factory('Search', function($resource, appConfig){
        return $resource(appConfig.API + '/search/index/:id', {}, {
            get: {method:'GET', cancellable: true},
            getList: {method:'GET', cancellable: true},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'}
        });
    });

});
