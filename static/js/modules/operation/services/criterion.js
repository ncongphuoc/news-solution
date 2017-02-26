/**
 * Created by nhanva on 5/16/2016.
 */

define(['app'], function(app)
{
    // Get Language, Location, OS, Carrier, Browser
    app.factory('Criterion', function($resource, appConfig){
        return $resource(appConfig.API_BUYER + '/criterion/info', {}, {
            get: {method:'GET'}
        });
    });
});
