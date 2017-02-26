/**
 * Created by nhanva on 5/23/2016.
 */

(function (define, angular) {
    define(['angular'], function (angular) {
        return angular.module('app.user', [])
            .factory('User', function ($resource, appConfig) {
                return $resource(appConfig.API + '/account/index/:id', {}, {
                    get: {method: 'GET'},
                    getList: {method: 'GET'},
                    create: {method: 'POST'},
                    update: {method: 'PUT'},
                    delete: {method: 'DELETE'},
                    getSupported: {method: 'GET', url: appConfig.API + '/account/index'}
                });
            });
    })
}
(define, angular));