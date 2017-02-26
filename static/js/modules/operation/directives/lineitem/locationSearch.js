/**
 * Created by nhanva on 5/10/2016.
 */
define(['app', 'modules/operation/services/criterion'], function (app) {
    app.directive('locationSearch', function (debounce, $http) {
        //
        return {
            restrict: 'E',
            replace: true,
            scope: {
                modelValue: '=ngModel',
                locationList: '=?',
                lineItemType: '=?'
            },
            controller: ['$scope', '$rootScope', 'APP_EVENTS', 'Criterion', '$filter', 'appConfig',
                function ($scope, $rootScope, APP_EVENTS, Criterion, $filter, appConfig) {
                    // Show location error
                    $scope.showLocationError = false;
                    var arrLocId = [], _limit = 1, _offset = 0;
                    $scope.arrLocation = [];
                    $scope.arrSelLocation = [];
                    $scope.loadMore = false;
                    $scope.LINE_ITEM_TYPE = appConfig.LINE_ITEM_TYPE
                    $scope.limitLoc = 10;

                    // List location when choose VN
                    var vnLocation = '1,2,5,7,9,10,12,13,19,20,28,29,33,39,51,53,58,59,61,3,4,6,14,18,22,23,24,26,27,30,31,35,37,38,40,42,44,49,52,54,55,60,62,63,8,11,15,16,17,21,25,34,36,41,43,45,46,47,48,50,56,57,32';
                    $scope.changeLocation = function () {
                        switch ($scope.locationType) {
                            case 'vn':
                                $scope.modelValue = vnLocation;
                                $scope.arrLoc = [];
                                $scope.arrExcludeLoc = [];
                                $scope.locationList = {location: [{
                                    location_id: 1000,
                                    location_name: 'VietNam',
                                    child: [vnLocation.split(',')]
                                }], type: 'vn'}

                                break;
                            case 'custom':
                                $scope.modelValue = '';
                                $scope.locationList = {location: [], type: 'custom'};
                                $scope.arrLoc = [];
                                arrLocId = []
                                break;
                            default:
                                $scope.arrLoc = [];
                                $scope.arrExcludeLoc = [];
                                $scope.modelValue = '';
                                $scope.locationList = {location: [], type: 'all'}
                                break;
                        }
                    }
                    // Init location type
                    var init = function () {
                        if ($scope.modelValue == undefined) {
                            $scope.modelValue = '';

                        }

                        // All location
                        if (!$scope.modelValue || $scope.locationList && $scope.locationList.type == 'all') {
                            $scope.locationType = 'all';
                            $scope.changeLocation();
                        } else {
                            arrLocId = $scope.modelValue.split(',');
                            // is Vietnam
                            if (vnLocation == $scope.modelValue || $scope.locationList && $scope.locationList.type == 'vn') {
                                $scope.locationType = 'vn';
                                $scope.changeLocation();
                            } else {
                                $scope.locationType = 'custom';
                                // Reset loc and exclude loc
                                $scope.arrLoc = [];
                                $scope.arrExcludeLoc = [];
                                if($scope.locationList && $scope.locationList.location && $scope.locationList.location.length){
                                    var arrCountry = []
                                    angular.forEach($scope.locationList.location, function(country){
                                        $scope.arrSelLocation.push({
                                            location_id: country.location_id,
                                            location_name: country.location_name,
                                            child: [vnLocation.split(',')],
                                            child_id: country.child
                                        });
                                        arrCountry.push(country.location_id)
                                    })

                                    // Get location info from location id
                                    getLocationById(arrCountry);
                                }


                            }
                        }
                    }
                    // Get location by id
                    var getLocationById = function (arrCountry) {
                        Criterion.get({target_name: 'LOCATION', location_id: arrCountry.join(','), limit: 1000}, function (response) {
                            for(var loc_id in response.data.location){
                                var loc = response.data.location[loc_id];
                                // Update status of location in list available
                                var arrTmp = $scope.arrLocation.filter(function(item){return item.location_id == loc_id});
                                if(arrTmp.length){
                                    arrTmp[0].load = true;
                                    arrTmp[0].selected = true;
                                    arrTmp[0].child = loc;
                                }
                                // Append child of list selected
                                arrTmp = $scope.arrSelLocation.filter(function(item){return item.location_id == loc_id});
                                if(arrTmp.length){
                                    var arrChild = []
                                    angular.forEach(arrTmp[0].child_id, function(child){
                                        var tmp = loc.filter(function(item){return item.location_id == child})
                                        if(tmp.length){
                                            arrChild.push({
                                                location_id: tmp[0].location_id,
                                                location_name: tmp[0].location_name
                                            })
                                        }
                                    })
                                    arrTmp[0].child = arrChild;
                                }
                            }
                        });
                    };

                    // Update model
                    var updateModel = function () {
                        //$scope.modelValue = arrLocId.join(',');
                        var arrLocId = []
                        var arrTree = []
                        angular.forEach($scope.arrSelLocation, function(location){
                            var arrChild = location.child.map(function(item){return item.location_id});
                            arrLocId = arrLocId.concat(arrChild);
                            arrTree.push({
                                location_id: location.location_id,
                                location_name: location.location_name,
                                child: arrChild
                            })
                        })
                        $scope.modelValue = arrLocId.join(',');
                        $scope.locationList = {location: arrTree, type: $scope.locationType};
                        // console.log('$scope.locationList$scope.locationList', $scope.locationList)
                    }

                    // Init data for directive
                    init();

                    var getLocation = function(){
                        $scope.loadMore = true;
                        Criterion.get({target_name: 'LOCATION', page: _offset}, function (response) {
                            if (response.code == 200 && response.data != undefined && response.data.location != undefined) {
                                if(_offset == 0){
                                    $scope.arrLocation = response.data.location
                                }else{
                                    angular.forEach(response.data.location, function(loc){
                                        $scope.arrLocation.push(loc)
                                    })
                                }
                            }
                            $scope.loadMore = false;
                        });
                    }

                    getLocation();

                    // Actual add country
                    var _addCountry = function (countries) {
                        if($scope.locationType != 'custom'){
                            $scope.locationType = 'custom';
                            $scope.locationList.type =  'custom';
                        }
                        angular.forEach(countries, function (country) {
                            var arrProvince = [];
                            angular.forEach(country.child, function (province) {
                                if (!province.selected) {
                                    province.selected = true;
                                    arrProvince.push({
                                        location_id: province.location_id,
                                        location_name: province.location_name
                                    });
                                    // Store list selected location
                                    arrLocId.push(province.location_id)
                                }

                            })

                            // If country has no province, add country to location
                            if(!country.child || country.child && country.child.length == 0){
                                arrLocId.push(country.location_id)
                            }
                            // Update status to selected
                            country.selected = true;

                            // Add list selected location
                            var arrFound = $scope.arrSelLocation.filter(function(item){return item.location_id == country.location_id});
                            if(arrFound.length){
                                // Country has in select
                                arrProvince.forEach(function(province){
                                    arrFound[0].child.push(province);
                                })
                            }else{
                                // Add new country
                                $scope.arrSelLocation.push({
                                    location_id: country.location_id,
                                    location_name: country.location_name,
                                    child: arrProvince
                                });
                            }
                        })
                        // Update model
                        updateModel();
                    };

                    // Actual remove country
                    var _removeContry = function (countries) {
                        var total = countries.length;
                        while(total > 0){
                            var removeCountry = countries[0]
                                ,arrTmp = $scope.arrLocation.filter(function(item){return removeCountry && item.location_id == removeCountry.location_id})
                            if (arrTmp && arrTmp.length) {
                                var country = arrTmp[0];
                                if(country.child && country.child.length){
                                    // Remove province
                                    angular.forEach(country.child, function (province) {
                                        province.selected = false;
                                        // Store list selected location
                                        var index = arrLocId.indexOf(province.location_id);
                                        arrLocId.splice(index, 1)
                                    })
                                }else{
                                    // Remove country
                                    var index = arrLocId.indexOf(country.location_id);
                                    arrLocId.splice(index, 1)
                                }

                                // Update status to unselected
                                country.selected = false;

                            }
                            var totalChild = $scope.arrSelLocation.length
                            for(var sub = 0; sub < totalChild; sub++) {
                                var obj = $scope.arrSelLocation[sub];
                                if(removeCountry.location_id == obj.location_id) {
                                    $scope.arrSelLocation.splice(sub, 1);
                                    break;
                                }
                            }
                            total--;
                        };


                        // Update model
                        updateModel();

                    }

                    // Action add country
                    $scope.addAllCountry = function () {
                        _addCountry($scope.arrLocation)
                    }
                    // Action add country
                    $scope.addCountry = function (country) {
                        if(country.loaded){
                            _addCountry([country])
                        }else{
                            $scope.getProvince(country, function(result){
                                _addCountry([country])
                            })
                        }

                    }

                    // Add location
                    $scope.addLocation = function (country, province) {
                        province.selected = true;
                        var arrLocation = $filter('filter')($scope.arrSelLocation, {location_id: country.location_id});
                        // Country contain province has been added
                        if (arrLocation && arrLocation.length) {
                            if(arrLocation[0].child.filter(item => item.location_id==province.location_id).length==0){
                                arrLocation[0].child.push({
                                    location_id: province.location_id,
                                    location_name: province.location_name
                                })
                            }

                        } else {
                            // Add new
                            $scope.arrSelLocation.push({
                                location_id: country.location_id,
                                location_name: country.location_name,
                                child: [{
                                    location_id: province.location_id,
                                    location_name: province.location_name
                                }]
                            })
                        }
                        if(arrLocId.indexOf(province.location_id) == -1){
                            arrLocId.push(province.location_id)
                        }

                        // Update model
                        updateModel();
                    }
                    // Action remove country
                    $scope.removeAllCountries = function () {
                        _removeContry($scope.arrSelLocation);
                    }

                    // Action remove country
                    $scope.removeCountry = function (country) {
                        _removeContry([country])
                    }

                    // Remove one location
                    $scope.removeLocation = function (country, province) {
                        // Update status from list available
                        var arrTmp = $filter('filter')($scope.arrLocation, {location_id: country.location_id});
                        if (arrTmp && arrTmp.length) {
                            var arrChild = $filter('filter')(arrTmp[0].child, {location_id: province.location_id});
                            if (arrChild && arrChild.length) {
                                arrChild[0].selected = false;
                            }
                        }
                        var index = country.child.indexOf(province);
                        // Remove from list selected
                        country.child.splice(index, 1);

                        // Remove location_id from list
                        var index = arrLocId.indexOf(province.location_id);
                        arrLocId.splice(index, 1);
                        // Update model
                        updateModel();

                        // Remove country if no province selected
                        if (country.child.length == 0) {
                            var index = $scope.arrSelLocation.indexOf(country);
                            $scope.arrSelLocation.splice(index, 1)
                        }
                    }

                    // Select 'Let me choose...' when focus on input Search
                    $scope.customFocus = function () {
                        if ($scope.locationType != 'custom') {
                            $scope.locationType = 'custom';
                        }
                    }

                    // Get province of the country
                    $scope.getProvince = function(country, callback){
                        country.isCollapsed = !country.isCollapsed
                        if(country.loaded == true){
                            return;
                        }
                        if($scope.locationType != 'custom'){
                            $scope.locationType = 'custom';
                            $scope.locationList.type =  'custom';
                        }
                        country.loaded = true;
                        Criterion.get({target_name: 'LOCATION', location_id: country.location_id, limit: 1000}, function (response) {
                            if (response.code == 200 && response.data != undefined && response.data.location != undefined) {
                                if(response.data.location[country.location_id]){
                                    country.child = response.data.location[country.location_id]
                                }else{
                                    country.child = [];
                                }

                            }
                            if(typeof callback == 'function'){
                                callback(response.data.location)
                            }
                        });
                    }

                    var debounceSearch = debounce(function (val) {
                        Criterion.get({target_name: 'LOCATION', search: val, page: _offset}, function (response) {
                            console.log(response)
                            if(_offset == 0){
                                //$scope.arrSelLocation = []
                                $scope.arrLocation = []
                            }
                            angular.forEach(response.data.location, function(country){
                                country.loaded = true;
                                $scope.arrLocation.push(country);
                            })
                            $scope.loadMore = false;
                        });
                    }, 500, false);

                    // Search location
                    $scope.doSearchLocation = function(){
                        _offset = 0; // Reset
                        debounceSearch($scope.location)
                    }

                    $scope.lazyloadLocation = function(){
                        _offset += _limit;
                        //_offset = 25;
                        $scope.loadMore = true;
                        if($scope.location){
                            debounceSearch($scope.location)
                        }else{
                            getLocation();
                        }

                    }

                    // Listen event to update location from broadcast
                    $rootScope.$on(APP_EVENTS.loadExisLineItem, function (event, arg) {
                        // Reset form with info from news lineitem
                        //$scope.locationList
                        if(arg.object.properties._locations_list){
                            $scope.modelValue = arg.object.properties.location_target
                            $scope.locationList = arg.object.properties._locations_list;
                            if($scope.locationList.type){
                                $scope.locationType = $scope.locationList.type;
                            }

                        }else{
                            $scope.locationList = {location: [], type: 'all'}
                        }
                        $scope.arrSelLocation = []
                        angular.forEach($scope.arrLocation, function(contry){
                            contry.selected = false;
                        })
                        if(arg.object.lineitem_type_id != appConfig.LINE_ITEM_TYPE.PRIVATE_DEAL){
                            init();
                        }else{
                            // View only
                            var total = Object.keys($scope.locationList.location).length;
                            $scope.limitLoc = total > 10 ? 10 : total;
                            $scope.totalLoc = total;

                        }

                    })

                    // Listen event on submit to show error
                    $rootScope.$on(APP_EVENTS.lineItem.saveLineItem, function (event, arg) {
                        if ($scope.$parent.lineItemForm && $scope.$parent.lineItemForm.location.$error.required) {
                            $scope.showLocationError = true;
                        } else {
                            $scope.showLocationError = false;
                        }
                    })
                }],
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || '/js/modules/operation/templates/campaign/locationSearch.html?v=' + ST_VERSION;
            }
        }
    })
});