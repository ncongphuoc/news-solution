/**
 * @auhor: Code nay la cua Thephuc ^^
 * @since: 21/11/2016
 */
define(['app'], function (app) {
    app.controller('campaignLeftNavController',
        [
            '$scope', '$state', 'appConfig', '$state', '$rootScope', 'Modal',
            function ($scope, $state, appConfig, $state, $rootScope, Modal) {

                var activeStep = function(step, status = true) {
                    switch(step) {
                        case 1:
                            $scope.is_active_step_1 = status;
                            $scope.is_active_step_2 = !status;
                            $scope.is_active_step_3 = !status;
                            break;
                        case 2:
                            $scope.is_active_step_1 = !status;
                            $scope.is_active_step_2 = status;
                            $scope.is_active_step_3 = !status;
                            break;
                        case 3:
                            $scope.is_active_step_1 = !status;
                            $scope.is_active_step_2 = !status;
                            $scope.is_active_step_3 = status;
                            break;
                        default:
                            break;
                    }
                };
                activeStep(1);

                $scope.showStepOne = function() {
                    $rootScope.$broadcast('left_nav_call_show_step', {step:1, is_show:true});
                };

                $scope.showStepTwo = function() {
                    $rootScope.$broadcast('left_nav_call_show_step', {step:2, is_show:true});
                };

                $scope.showStepThree = function() {
                    $rootScope.$broadcast('left_nav_call_show_step', {step:3, is_show:true});
                };

                $rootScope.$on('call_back_left_nav_active_step', function(events, args) {
                    if(args.is_show)
                        activeStep(args.step, args.is_show);
                })

                /*Listen directive `formStepOne`*/
                $rootScope.$on('directive_call_show_step', function(events, args) {
                    if(args.is_show)
                        activeStep(args.step, args.is_show);
                })

                // Static url
                $scope.static_url = appConfig.ST_HOST;
                // Get state name to active menu
                switch ($state.current.name) {
                    case 'campaigns.lineitem.create':
                        $scope.currentPage = 'lineitem';
                        break;
                    case 'campaigns.campaign.create':
                        $scope.currentPage = 'campaign';
                        break;
                    case  'campaigns.creative.create':
                        $scope.currentPage = 'creative';
                        break;
                    default :
                        $scope.currentPage = '';
                        break;
                }

            } // END function
        ]
    );
});