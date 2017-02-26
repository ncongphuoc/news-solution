/**
 * Created by nhanva on 4/19/2016.
 */
(function(define, angular) {
    define(['angular'], function(angular) {
        return angular.module('app.interceptor', ['app.session', 'app.auth'])
            .factory('AuthInterceptor', ['$rootScope', '$q', 'Session', 'AUTH_EVENTS','APP_EVENTS', 'appConfig', '$injector', '$stateParams',
                function ($rootScope, $q, Session, AUTH_EVENTS,APP_EVENTS, appConfig, $injector, $stateParams) {
                    return {
                        responseError: function (response) {
                            //
                            if(response.status!=302 && response.status!=-1){
                                $rootScope.$broadcast(APP_EVENTS.httpError, {
                                    response: response
                                });
                            }
                            // TODO: Change 302 to 401
                            // When send request with header X-Requested-With = XMLHttpRequest, server will be remove WWW-Authenticate:Basic realm="Restricted"
                            // But my server always return. Temporary return to 302
                            if(response.status === 302) {
                                // Check page already at page login
                                if($rootScope._redirect == true){
                                    return $q.reject({data: {code:302, message:'Session expired'}});
                                }

                                // Clear all user info
                                Session.destroy();

                                // Flag page already redirect to page login
                                $rootScope._redirect = true;

                                // Go login page
                                $injector.get('$state').transitionTo('login');
                                return $q.reject(response);
                            }else if(response.status === 403) {
                                // Go to page restrict page
                                $injector.get('$state').transitionTo('unauthorize', {user_id: Session.user? Session.user.user_id : null,code: appConfig.UN_AUTHORIZE.SUPPORT});
                                return $q.reject(response);
                            }else if(response.status === 500) {
                                // Resolve with status code 500 when server error
                                return $q.resolve({data: {code:500, message:'Internal Server Error'}});
                            }if(response.status === 0) {
                                // Resolve with status code 500 when server error
                                return $q.resolve({data: {code:500, message:'Check Network Connection'}});
                            }
                            else {
                                return $q.reject(response);
                            }
                            /*
                            $rootScope.$broadcast({
                                //404 : AUTH_EVENTS.notAuthorized,
                                401: AUTH_EVENTS.notAuthenticated,
                                403: AUTH_EVENTS.notAuthorized,
                                419: AUTH_EVENTS.sessionTimeout,
                                440: AUTH_EVENTS.sessionTimeout
                            }[response.status], response);
                            return $q.reject(response);
                            */
                        }
                        , 'request': function (config) {
                            // Check request api
                            if(config.url.indexOf(API_HOST) !== -1 || config.url.indexOf(API_BUYER_HOST) !== -1){
                                config.params = config.params || {};
                                // Attach token to each request
                                // console.log('Session.user',Session.user);
                                if(Session.user != undefined && Session.user.token != undefined){
                                    config.params._token = Session.user.token;
                                    if(Session.supportUser != undefined && Session.supportUser.user_id != undefined){
                                        var userId = Session.supportUser.user_id;
                                        if($stateParams.user_id != undefined && $stateParams.user_id != userId){
                                            userId = $stateParams.user_id;
                                        }
                                        config.params._user_id = userId;
                                    }else{
                                        var userId = Session.user.user_id;
                                        // To prevent post login user_id when past url from browser, force get user_id from url
                                        if($stateParams.user_id != undefined && $stateParams.user_id != userId){
                                            userId = $stateParams.user_id;
                                        }
                                        config.params._user_id = userId;
                                    }

                                }
                                //config.headers['X-Requested-With'] = 'XMLHttpRequest';
                            }
                            else if (config.url.indexOf('/js/') === 0) {
                                config.url = ST_HOST + config.url;
                            }
                            return config;
                        },
                        'response': function (response) {
                            return response;
                        }

                    };
                }]);
    })}
(define, angular));
