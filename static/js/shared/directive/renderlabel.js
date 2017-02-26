/**
 * Created by GiangBeo on 5/25/16.
 */
define(['app','color-convert'], function (app) {
    app.directive('renderlabel', function (debounce, AUTH_EVENTS, $rootScope,$http,appConfig) {
        return {
            restrict: 'E',
            //replace: true,
            scope: {
                datalabel: '=datalabel',
                gridtype:'=gridtype',
                classlabel:'=classlabel'
            },
            link: function (scope, element, attrs) {

                scope.data_label = [];
                scope.count = 0;
                scope.data_label_pop = [];
                if(typeof(scope.datalabel.label)!=undefined){
                    angular.forEach(scope.datalabel.label,function(value,index){
                        var class_color_label = '';
                        if(value.label_color){
                            var newColor = color2color(value.label_color,'hsl');
                            var expColor =  newColor.split(',');
                            var lastHsl = expColor[2];
                            var finalHsl  = lastHsl.slice(0,lastHsl.length-1);
                            finalHsl = finalHsl.slice(0,finalHsl.length-1);
                            if(finalHsl > 80)
                            {
                                class_color_label = 'text-black';
                            }
                        }
                        scope.data_label_pop.push({label_name:value.label_name,color:value.label_color,class_color_label:class_color_label});
                       // console.log(finalHsl);
                        if(scope.count<=2){
                            scope.count++;
                            scope.data_label.push({label_name:value.label_name,color:value.label_color,class_color_label:class_color_label});
                        }
                    });
                }
                switch (scope.gridtype){
                    case appConfig.TYPE_CAMPAIGN:{
                        scope.type = 'Campaign';
                        scope.name = scope.datalabel.campaign_name;
                        scope.id_div = scope.datalabel.campaign_id;
                        break;
                    }
                    case appConfig.TYPE_CREATIVE:{
                        scope.type = 'Creative';
                        scope.name = scope.datalabel.creative_name;
                        scope.id_div = scope.datalabel.creative_id;
                        break;
                    }
                    case appConfig.TYPE_LINE_ITEM:{
                        scope.type = 'Line Item';
                        scope.name = scope.datalabel.lineitem_name;
                        scope.id_div = scope.datalabel.lineitem_id;
                        break;
                    }
                    case appConfig.TYPE_METRIC_REMARKETING:{
                        scope.type = 'Remarketing';
                        scope.name = scope.datalabel.remarketing_name;
                        scope.id_div = scope.datalabel.remarketing_id;
                        break;
                    }
                }
                scope.openLabel = function(id_div){
                    angular.element('.show-all-lable').each(function(){
                        angular.element(this).hide();
                    });
                    angular.element('#label_'+id_div).show();
                };
                scope.closeLabel = function(id_div){
                    angular.element('#label_'+id_div).hide();
                };
            },
            templateUrl: '/js/shared/templates/label/label-div.html'
        };
    });
});

//
