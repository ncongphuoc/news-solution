/**
 * Created by Giang Beo on 27-Apr-16.
 */
define(['app'], function(app)
{
    app.factory('LineItem', function($resource, appConfig){
        return $resource(appConfig.API + '/lineItem/performance/:id', {}, {
            get: {method:'GET'},
            getList: {method:'GET'},
            create: {method: 'POST'},
            update: {method: 'PUT'},
            delete: {method: 'DELETE'}
        });
    });

    app.factory('LineItemInfo', function($resource, appConfig){
        return $resource(appConfig.API + '/lineItem/info/:id', {}, {
            get: {method:'GET'},
            getList: {method:'GET'},
            create: {method: 'POST'},
            update: {method: 'PUT', params: {id: '@id'}},
            delete: {method: 'DELETE'}
        });
    });

    /**
     * Get lineitem objective (with type =list-marketing-object) and line item payment model (type=list-payment-model)
     * Usage:
     *  - Get all objective and payment model
     *    LineItemType.getList({}, function(err, result){})
     * - Get objective
     *    LineItemType.getList({type='list-marketing-object'}, function(err, result){})
     */
    app.factory('LineItemResource', function($resource, appConfig, Storage){
        var resource = $resource(appConfig.API + '/marketing/index/:id', {}, {
            getList: {method:'GET'}
        });

        var getList = function (param, callback) {
            if(param.type == undefined){
                throw new Error('Can not get LineItemResource without type');
            }
            var key = param.type;
            var data = Storage.read(key);
            if(data){
                return callback(data);
            }else{
                resource.getList(param, function (response) {
                    if(response.code != 200){
                        response = [];
                    }else{
                        // Write to locale for using later
                        Storage.write(key, response)
                    }

                    // Call back to caller
                    callback(response);
                });
            }
        }
        return {
            getList: getList
        }
    });
});
