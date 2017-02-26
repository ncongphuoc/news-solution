/**
 * Created by tuandv on 5/26/16.
 */
define(['app'], function (app) {
    app.directive('alllineitems', function (LineItemInfo, $state, $timeout, APP_EVENTS) {
        return {
            restrict: 'C',
            scope: {
                settings: '='
            },
            link: function (scope, element, attrs, ctrl) {

                var nav_wrap_height = 0
                    , allLiHeight = 0
                    , sidebarHeader = angular.element('.sidebar header')
                    , searchBlock = angular.element('.sidebar .search-block')
                    , parentUl
                    ;

                var getRealHeight = function(ele) {
                    return ele.height() + parseInt(ele.css('padding-top')) + parseInt(ele.css('padding-bottom'));
                }

                $timeout(function(){
                    element.closest('ul.left-nav').find('a.toggle-lineitem-list').triggerHandler('click');
                }, 200);

                scope.updateHeight = function(){
                    $timeout(function(){
                        nav_wrap_height =  window.innerHeight - getRealHeight(sidebarHeader) - getRealHeight(searchBlock) - 30;

                        if(parentUl != undefined){
                            parentUl.height(nav_wrap_height);
                        }
                        var ul = element.find('ul#sub-nav-1');
                        //ul.height(nav_wrap_height);
                        ul.css({
                            'max-height' : (nav_wrap_height - allLiHeight ) + 'px',
                        });
                    }, 100)
                }

                scope.$on(APP_EVENTS.updateHeightLeft, function(event, arg){
                    if(arg.toggle == true){
                        if(parentUl == undefined){
                            parentUl = angular.element(arg.target.target.closest('ul.left-nav'));
                            allLiHeight = parentUl.height();
                        }
                        // Is loading line item, will be calculate height after get data complete
                        if(scope.isLoadLineItem == false){
                            scope.updateHeight();
                            scope.isUpdateHeight = false;
                        }else{
                            // Flag to update height after ajax get
                            scope.isUpdateHeight = true;
                        }

                    }
                });
            },
            controller: function ($scope, $element, $attrs, $controller, $state) {
                ////////
                $scope.lineitems = [];
                $scope.selectedLineItemId = 0; // Keep lineitem_id to active selected line item
                $scope.selectedCampId = 0; // Keep campaign to active menu
                $scope.isUpdateHeight = true;
                $scope.isLoadLineItem = true;
                var page = 1;
                $scope.loadMoreRecords = function () {
                    $scope.isLoadLineItem = true;
                    LineItemInfo.getList({
                        fields: 'lineitem_id, lineitem_name, operational_status',
                        page: page,
                        limit: 20,
                        get_es: 1
                    }, function (resp) {
                        angular.forEach(resp.data, function (object) {
                            $scope.lineitems.push(object);
                        });
                        page++;
                        $scope.isLoadLineItem = false;
                        if($scope.isUpdateHeight == true){
                            $scope.updateHeight()
                            $scope.isUpdateHeight = false;
                        }
                    })

                };
                $scope.loadMoreRecords();

                $scope.getCampaign = function ($event, line_item) {
                    // Keep lineitem_id to active selected line item
                    $scope.selectedLineItemId =  line_item.lineitem_id;
                    $scope.selectedCampId = 0;
                    $scope.isLoadLineItem = true;
                    var index = $scope.lineitems.indexOf(line_item);
                    if ($scope.lineitems[index].list_campaign == undefined) {
                        angular.element($event.target).next('.loading').css('display','block');

                        LineItemInfo.get({
                            fields: 'campaign_id, campaign_name',
                            id: line_item.lineitem_id,
                            object: 'campaign'
                        }, function (resp) {
                            angular.element($event.target).next('.loading').css('display','none');
                            if (index != -1) {
                                if (resp.data.length) {
                                    $scope.lineitems[index].list_campaign = resp.data;
                                } else {
                                    $scope.lineitems[index].list_campaign = [];
                                    $scope.lineitems[index].no_data = 'No data';

                                }
                            }
                            $scope.isLoadLineItem = false;
                            if($scope.isUpdateHeight == true){
                                $scope.updateHeight()
                                $scope.isUpdateHeight = false;
                            }
                        });
                    }
                    $scope.lineitems[index].showed = !$scope.lineitems[index].showed;
                    $state.go('campaigns.lineitem.detail.campaign', {lineitem_id: line_item.lineitem_id});
                    activeMenu($event);
                    if($scope.lineitems[index].showed == true || $scope.lineitems[index].showed == undefined){
                        angular.element($event.target).removeClass('cus_collapsed');
                    }else{
                        angular.element($event.target).addClass('cus_collapsed');
                    }
                };
                $scope.getCreative = function ($event, campaign_id) {
                    $scope.selectedCampId = campaign_id;
                    $state.go('campaigns.campaign.detail.creative', {campaign_id: campaign_id});
                    activeMenu($event);
                };
                var activeMenu = function ($event) {
                    angular.element('#sub-nav-1 li').removeClass('active');
                    angular.element($event.target).parent('li').addClass('active');
                }
            },
            templateUrl: '/js/modules/operation/templates/allLineItems.html?v='+ ST_VERSION
        };
    });
});
