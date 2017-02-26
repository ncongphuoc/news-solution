define(['app'], function(app) {
    app.factory('Segment', function($resource, appConfig){
        return $resource(appConfig.API + '/segment/index/:id', {}, {
            get: {method:'GET'},
            getList: {method:'GET'},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'}
        });
})});
