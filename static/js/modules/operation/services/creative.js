/**
 * Created by nhanva on 4/27/2016.
 */
define(['app'], function(app)
{
    app.factory('Creative', function($resource, appConfig){
        return $resource(appConfig.API + '/creative/performance/:id', {}, {
            get: {method:'GET'},
            getList: {method:'GET'},
            create: {method: 'POST'},
            update: {method: 'PUT', params: {id: '@id'}},
            delete: {method: 'DELETE'}
        });
    });

    app.factory('CreativeInfo', function($resource, appConfig){
        return $resource(appConfig.API + '/creative/info/:id', {}, {
            get: {method:'GET', cancellable: true},
            getList: {method:'GET', cancellable: true},
            create: {method: 'POST'},
            update: {method: 'PUT', params: {id: '@id'}},
            delete: {method: 'DELETE'}
        });
    });

    app.factory('CreativeTemplate', function($resource, appConfig){
        return $resource(appConfig.API + '/template/index/:id', {}, {
            get: {method:'GET'},
            getList: {method:'GET'}
        });
    });

    app.factory('InfoMerchant', function($resource, appConfig){
        return $resource(appConfig.API + '/merchant/index/', {}, {
            getList: {method:'GET'}
        });
    });
    
});
/*

 // Get detail
 Creative.get({id:1}, function(response){
    console.log(response)
 });

 // List creative
 var opt = {
     limit:10,
     network_id:10507,
     page:1,
     user_id:1210044026
 };
 // Get list creative
 Creative.getList(opt).$promise.then(function (response) {
    console.log(response)
 });

 Creative.getList(opt, function(response){
    console.log(response)
 });

 // Create
 Creative.create({'key': 'value', 'key2': 'value2'}, function(response){
    console.log(response)
 });

 // Update
 Creative.update({id: 10000, 'key': 'value', 'key2': 'value2'}, function(response){
    console.log(response)
 });

 // Delete
 Creative.delete({id: 10000}, function(response){
    console.log(response)
 });

*/