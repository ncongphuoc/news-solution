/**
 * Created by GiangBeo on 5/25/16.
 */
define(['app'], function (app) {
    app.directive('reviewad', function (debounce, AUTH_EVENTS, $rootScope,$http,appConfig) {
        return {
            restrict: 'E',
            //replace: true,
            scope: {
                creativeid: '=creativeid',
                width: '=width',
                height: '=height',
                imgsrc:'=imgsrc',
                creativeformat:'=creativeformat'
            },
            link: function (scope, element, attrs) {
                if($.inArray(+scope.creativeformat,appConfig.FORMAT_WIDGET)!=-1){
                    scope.setheight = 136;
                }
                else{
                    scope.setheight = scope.height;
                }
                if($.inArray(+scope.creativeformat,appConfig.FORMAT_WIDGET)!=-1){
                    scope.widthReview = 326;
                }
                else{
                    scope.widthReview = scope.width;
                }
                scope.showReview = true;
                scope.resizeHeight = scope.setheight/2;
                scope.urlImage = ST_URL_UPLOAD+'/'+scope.imgsrc;

                scope.showReview = true;
                scope.showImage = false;
                if(scope.creativeid!=='undefined' && $.inArray(+scope.creativeformat,appConfig.FORMAT_WIDGET)!=-1){
                    var prefix_widget = 'widget/';
                    var scale_div = 0.5;
                }
                else{
                    var prefix_widget = '';
                    var scale_div = 0.3;
                }
                if(+scope.creativeformat == appConfig.CREATIVE_FORMAT_DYNAMIC){
                    scope.setheight = +scope.setheight+27;
                    scope.widthReview = +scope.widthReview+26;
                }
                scope.maxheight = scope.setheight * scale_div;
                scope.maxwidth = scope.widthReview * scale_div;
                scope.scale_div = scale_div;
                scope.urlReview = ST_REVIEW_CREATIVE_LINK + '/delivery/preview/' + prefix_widget + scope.creativeid + '.html';
                scope.static_url = appConfig.ST_HOST;

            },
            templateUrl: '/js/shared/templates/review-ad/review-ad.html'
        };
    });
});

//
