/**
 * Created by nhanva on 4/19/2016.
 */
define(['app', 'libs/jquery-ui/jquery-ui.min'], function (app, Filter) {
    app.controller('adminIndexListController',
        [
            '$rootScope',
            '$scope',
            '$state',
            'Auth',
            function ($rootScope, $scope, $state, Auth) {
                // #A3-778: [Permission] Một số case khi thế vai  User_id = null 
                if(!$state.params.user_id && Auth.supportUser() && Auth.supportUser().user_id){
                    $state.go('admin', {user_id: Auth.supportUser().user_id})
                }
            }
        ]);
});