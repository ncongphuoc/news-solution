/**
 * Created by GiangBeo on 5/25/16.
 */
define(['app'], function (app) {
    app.directive('popupreview', function (debounce, AUTH_EVENTS, $rootScope,$http,appConfig) {
        return {
            restrict: 'E',
            //replace: true,
            scope: {
                creativeid: '=creativeid',
                imgsrc:'=imgsrc',
                creativeformat:'=creativeformat',
                heightcreative:'=heightcreative',
                creativename:'=creativename',
                widthcreative:'=widthcreative',
                data:'=data'
            },
            link: function (scope, element, attrs) {
                scope.showReview = true;
                scope.urlReview = ST_REVIEW_CREATIVE_LINK+'/delivery/preview/'+scope.creativeid+'.html';
                scope.urlImage = ST_URL_UPLOAD+'/'+scope.imgsrc;
                scope.idmodallreview = scope.creativeid;
                scope.showReview = true;
                scope.showImage = false;
                if(scope.creativeid!=='undefined' && $.inArray(+scope.creativeformat,appConfig.FORMAT_WIDGET)!=-1){
                    var prefix_widget = 'widget/';
                }
                else{
                    var prefix_widget = '';
                }
                if($.inArray(+scope.creativeformat,appConfig.FORMAT_WIDGET)!=-1){
                    scope.heightcreative = 127;
                }
                if($.inArray(+scope.creativeformat,appConfig.FORMAT_WIDGET)!=-1){
                    scope.widthcreative = 326;
                }
                if(+scope.creativeformat == appConfig.CREATIVE_FORMAT_DYNAMIC){
                    scope.heightcreative = +scope.heightcreative+27;
                    scope.widthcreative = +scope.widthcreative + 26;
                }
                scope.style_scale = '';
                if(scope.heightcreative == '600'){
                    scope.style_scale='full-screen';
                }
                scope.urlReview = ST_REVIEW_CREATIVE_LINK+'/delivery/preview/'+prefix_widget+scope.creativeid+'.html';

                scope.ct_object_id = scope.data['ct_object_id'];
                scope.show_name = true;
                scope.show_width_height = true;
                scope.show_adaptive_size = false;
                if(scope.ct_object_id==55){
                    scope.show_name = false;
                    scope.show_width_height = false;
                }
                if(scope.ct_object_id==53 || scope.ct_object_id==54){
                    scope.show_name = true;
                    scope.show_width_height = false;
                    scope.show_adaptive_size = true;
                }
            },
            templateUrl: '/js/shared/templates/review-ad/popup.html'
        };
    });
});

//
