/**
 * Created by truchq on 4/25/2016.
 */
define(['app'], function(app) {
    app.factory('Metric', function($resource, appConfig){
        return $resource(appConfig.API + '/metric/index/:id', {}, {
            get: {method:'GET'},
            getList: {method:'GET'},
            create: {method: 'POST'},
            update: {method: 'PUT', params: {id:'@id'}},
            delete: {method: 'DELETE'}
        });
})});
