/**
 * Created by nhanva on 5/11/2016.
 */
define(['app', 'shared/directive/common','modules/operation/services/criterion'], function (app) {
    app.directive('deviceTarget', function (debounce, Criterion) {
        //
        return {
            restrict: 'E',
            replace: true,

            scope: {
                modelValue: '=ngModel',
                loadCriterion: '=isOpen',
                editMode: '=',
                lineItemType: '='
            },
            controller: ['$scope', '$filter', '$rootScope', 'APP_EVENTS', 'appConfig',function ($scope, $filter, $rootScope, APP_EVENTS, appConfig) {
                $scope.showError = false;
                $scope.isEditTarget = $scope.editMode || false;
                $scope.arrDisplay = {pc: true, mobile: true, tablet: true}
                $scope.arrDisplayText = [] // Store text content (ex: Computer and tablet inventory)
                if(!$scope.modelValue){
                    $scope.modelValue = {}
                }
                $scope.LINE_ITEM_TYPE = appConfig.LINE_ITEM_TYPE
                var showSelectedTarget = function(){
                    if ($scope.arrBrowserId.length) {
                        angular.forEach($scope.arrBrowser, function (browserInf) {
                            if ($scope.arrBrowserId.indexOf(browserInf.browser_id) != -1) {
                                browserInf.selected = true;
                                $scope.arrSelectedBrowser.push({
                                    browser_id: browserInf.browser_id,
                                    browser_name: browserInf.browser_name
                                })
                            }
                        });
                    }

                    //$scope.arrSelectedOs = angular.copy($scope.modelValue.os_target);
                    if($scope.arrOsId.length){
                        var  total = $scope.arrOs.length;
                        var objSelTmp = {}
                        angular.forEach($scope.arrOsId, function(verionId){
                            for(var index = 0; index < total; index++){
                                var subTotal = $scope.arrOs[index].child.length, found = false;
                                for(var subIndex = 0; subIndex < subTotal; subIndex++){
                                    if($scope.arrOs[index].child[subIndex].version_id == verionId){
                                        $scope.arrOs[index].selected = true;
                                        var objTmp
                                        if(objSelTmp[$scope.arrOs[index].os_id]){
                                            objTmp = objSelTmp[$scope.arrOs[index].os_id]
                                        }else{
                                            objTmp = {
                                                os_id: $scope.arrOs[index].os_id,
                                                os_name: $scope.arrOs[index].os_name,
                                                child: [],
                                                add_all: false
                                            }
                                            objSelTmp[$scope.arrOs[index].os_id] = objTmp
                                        }
                                        objTmp.child.push(verionId);
                                        if($scope.arrOs[index].child[subIndex].length == objTmp.child.length){
                                            objTmp.add_all = true;
                                        }
                                        found = true;
                                        break;
                                    }
                                }
                                if(found==true){
                                    break;
                                }
                            }
                        });
                        // Restore selected mobile target
                        if($scope.modelValue.os_target){
                            $scope.arrSelectedOs = angular.copy($scope.modelValue.os_target);
                        }
                        else{
                            for(var key in objSelTmp){
                                $scope.arrSelectedOs.push(objSelTmp[key])

                            }
                        }

                    }

                    if($scope.arrOsDesktopId.length){
                        var  total = $scope.arrOsDesktop.length;
                        var objSelTmp = {}
                        angular.forEach($scope.arrOsDesktopId, function(verionId){
                            for(var index = 0; index < total; index++){
                                var subTotal = $scope.arrOsDesktop[index].child.length, found = false;
                                for(var subIndex = 0; subIndex < subTotal; subIndex++){
                                    if($scope.arrOsDesktop[index].child[subIndex].version_id == verionId){
                                        var objTmp
                                        if(objSelTmp[$scope.arrOsDesktop[index].os_id]){
                                            objTmp = objSelTmp[$scope.arrOsDesktop[index].os_id]
                                        }else{
                                            objTmp = {
                                                os_id: $scope.arrOsDesktop[index].os_id,
                                                os_name: $scope.arrOsDesktop[index].os_name,
                                                child: [],
                                                add_all: false
                                            }
                                            objSelTmp[$scope.arrOsDesktop[index].os_id] = objTmp
                                        }
                                        objTmp.child.push(verionId);
                                        if($scope.arrOsDesktop[index].child[subIndex].length == objTmp.child.length){
                                            objTmp.childadd_all = true;
                                        }
                                        found = true;
                                        break;
                                    }
                                }
                                if(found==true){
                                    break;
                                }
                            }
                        });

                        for(var key in objSelTmp){
                            $scope.arrSelectedOsDesktop.push(objSelTmp[key])
                        }
                    }

                    if ($scope.arrDeviceId.length) {
                        angular.forEach($scope.arrDevice, function (deviceInf) {
                            if ($scope.arrDeviceId.indexOf(deviceInf.device_id) != -1) {
                                deviceInf.selected = true;
                                $scope.arrSelectedDevice.push({
                                    device_id: deviceInf.device_id,
                                    device_name: deviceInf.device_name
                                })
                            }
                        })
                    }

                    if ($scope.arrCarrierId.length && $scope.arrCarrier.length) {
                        angular.forEach($scope.arrCarrier[0].carrier, function (carrierInf) {
                            // Find selected carrier
                            if ($scope.arrCarrierId.indexOf(carrierInf.carrier_id) != -1) {
                                carrierInf.selected = true;
                                $scope.arrSelectedCarrier.push({
                                    carrier_id: carrierInf.carrier_id,
                                    carrier_name: carrierInf.carrier_name
                                })
                            }
                        });
                    }
                }
                // Load target info when user click on 'Device: target selected mobile devices and tablets'
                $scope.$watch(
                    "loadCriterion",
                    function valueChange(new_value, old_value) {
                        if (new_value == true && (old_value == false || ($scope.editMode == true && old_value == true))) {
                            Criterion.get({target_name: 'LANGUAGE,OS,DEVICE,CARRIER,BROWSER', limit: 1000}, function (response) {
                                if (response.code == 200) {
                                    // Assign target to datasource
                                    if (response.data.browser != undefined) {
                                        $scope.arrBrowser = response.data.browser;

                                    }
                                    if (response.data.os != undefined) {
                                        if(response.data.os.mobile){
                                            $scope.arrOs = response.data.os.mobile;
                                            angular.forEach($scope.arrOs ,function(os){
                                                var versionMin = os.child[0].os_version_id;
                                                // Min version = -1 will be ignore on front end, replace it with next version id if it has
                                                if(versionMin == -1 && os.child.length > 1){
                                                    versionMin = os.child[1].os_version_id;
                                                }
                                                os.version_min = versionMin;
                                                os.version_max = os.child[(os.child.length - 1)].os_version_id;
                                            });
                                        }
                                        if(response.data.os.desktop){
                                            $scope.arrOsDesktop = response.data.os.desktop;
                                            angular.forEach($scope.arrOsDesktop ,function(os){
                                                os.version_min = os.child[0].os_version_id;
                                                os.version_max = os.child[(os.child.length - 1)].os_version_id;
                                            });
                                        }
                                    }
                                    // Data chua giong spec, request?
                                    if (response.data.device != undefined) {
                                        $scope.arrDevice = response.data.device;
                                    }
                                    if (response.data.carrier != undefined) {
                                        $scope.arrCarrier = [{name: 'Viet Nam', carrier: response.data.carrier}];
                                        // Has selected carrier

                                    }

                                    // Show selected target name
                                    showSelectedTarget();
                                }
                            });
                        }

                    }
                );

                // init device target
                function init(isReset) {
                    if(isReset){
                        $scope.arrOs = [];
                        $scope.arrOsDesktop = [];
                        $scope.arrDevice = [];
                        $scope.arrCarrier = [];
                        $scope.arrBrowser = [];
                        if($scope.modelValue && !$scope.modelValue.os_target){
                            $scope.modelValue.os_target = [];
                        }
                    }else{
                        $scope.arrOs.forEach(function(item){
                            item.selected = false;
                        })
                        $scope.arrDevice.forEach(function(item){
                            item.selected = false;
                        })
                        $scope.arrCarrier.forEach(function(item){
                            item.selected = false;
                        })
                        $scope.arrBrowser.forEach(function(item){
                            item.selected = false;
                        })
                    }
                    // Os
                    $scope.arrSelectedOs = []
                    $scope.arrOsId = [];

                    // Mobile os target
                    if (!$scope.modelValue || $scope.modelValue._mobile_osv_target == undefined || $scope.modelValue._mobile_osv_target == '') {
                        $scope.osType = 'all';
                        $scope.arrOsId = []
                    } else {
                        $scope.osType = 'custom';
                        if($scope.modelValue._mobile_osv_target != '' && $scope.modelValue._mobile_osv_target.length){
                            $scope.arrOsId = $scope.modelValue._mobile_osv_target.split(',')
                        }else{
                            $scope.arrOsId = []
                        }

                    }
                    // Os
                    $scope.arrSelectedOsDesktop = []
                    $scope.arrOsDesktopId = [];
                    if (!$scope.modelValue || $scope.modelValue._desktop_osv_target == undefined || $scope.modelValue._desktop_osv_target == '') {
                        $scope.osTypeDesktop = 'all';
                        $scope.arrOsDesktopId = []
                    } else {
                        $scope.osTypeDesktop = 'custom';
                        if($scope.modelValue._desktop_osv_target != '' && $scope.modelValue._desktop_osv_target.length){
                            $scope.arrOsDesktopId = $scope.modelValue._desktop_osv_target.split(',')
                        }else{
                            $scope.arrOsDesktopId = []
                        }

                    }

                    // Device
                    $scope.arrSelectedDevice = []
                    $scope.arrDeviceId = [];

                    if ($scope.modelValue.mfr_target == undefined || $scope.modelValue.mfr_target == '') {
                        $scope.deviceType = 'all';
                    } else {
                        $scope.deviceType = 'custom';
                        $scope.arrDeviceId = $scope.modelValue.mfr_target.split(',')
                    }

                    // Carrier
                    $scope.arrSelectedCarrier = [];
                    $scope.arrCarrierId = [];
                    if ($scope.modelValue.carrier_target == undefined || $scope.modelValue.carrier_target == '') {
                        $scope.carrierType = 'all';
                    } else {
                        $scope.carrierType = 'custom';
                        $scope.arrCarrierId = $scope.modelValue.carrier_target.split(',')
                    }

                    // Browser
                    $scope.arrSelectedBrowser = [];
                    $scope.arrBrowserId = [];

                    if ($scope.modelValue.browser_target == undefined || $scope.modelValue.browser_target == '') {
                        $scope.browserType = 'all';
                    } else {
                        $scope.browserType = 'custom';
                        $scope.arrBrowserId = $scope.modelValue.browser_target.split(',');
                    }

                    // Device display
                    if($scope.modelValue.device_display == undefined || $scope.modelValue.device_display == ''){
                        // Choose all
                        $scope.arrDisplay = {pc: true, mobile: true, tablet: true}
                    }else{
                        // Have three device display: 1->pc, 2: mobile, 3: tablet
                        var objTmp = {pc: false, mobile: false, tablet: false}
                        if($scope.modelValue.device_display.indexOf('1') != -1){
                            objTmp.pc = true;
                        }
                        if($scope.modelValue.device_display.indexOf('2') != -1){
                            objTmp.mobile = true;
                        }
                        if($scope.modelValue.device_display.indexOf('3') != -1){
                            objTmp.tablet = true;
                        }
                        $scope.arrDisplay = objTmp;
                    }

                    if(!isReset){
                        // Show selected target name
                        showSelectedTarget();
                    }

                    if($scope.lineItemType == appConfig.LINE_ITEM_TYPE.PRIVATE_DEAL){
                        var arrTmp = [];
                        if ($scope.arrDisplay.pc) {
                            arrTmp.push('computer')
                        }
                        if ($scope.arrDisplay.tablet) {
                            arrTmp.push('tablet')
                        }
                        if ($scope.arrDisplay.mobile) {
                            arrTmp.push('mobile')
                        }
                        if (arrTmp.length) {
                            var tmpStr = arrTmp.join(', '), lastCommaIndex = tmpStr.lastIndexOf(',')
                            if (arrTmp.length > 1) {
                                tmpStr = tmpStr.substr(0, lastCommaIndex) + ' and' + tmpStr.substr(lastCommaIndex + 1)
                            } else {
                                tmpStr = tmpStr;
                            }
                            tmpStr += ' inventory'

                            $scope.arrDisplayText = [(tmpStr.charAt(0).toUpperCase() + tmpStr.substr(1))]
                        }
                    }
                }

                // Init UI
                init(true);

                // FUNCTION
                // OS Version
                $scope.showVersion = function (os) {
                    os.show_version = !os.show_version;
                }

                // Action add all version
                $scope.addOsAllVersion = function (os) {
                    if (os.selected) {
                        return;
                    }
                    os.selected = true;
                    os.allow_add_all = true;
                    var selectedOs = {
                        os_id: os.os_id,
                        os_name: os.os_name,
                        child:os.child.map(function(version){return version.version_id}),
                        add_all: true
                    }
                    $scope.arrSelectedOs.push(selectedOs);

                    // Store this properties for load line item
                    $scope.modelValue.os_target.push(selectedOs)
                    angular.forEach(os.child, function(version){
                        if(version.version_id && version.version_id.length){
                            $scope.arrOsId.push(version.version_id)
                        }
                    })

                }

                // Action add all version
                $scope.addOsAllDesktopVersion = function (os) {
                    if (os.selected) {
                        return;
                    }
                    os.selected = true;
                    os.allow_add_all = true;
                    var selectedOs = {
                        os_id: os.os_id,
                        os_name: os.os_name,
                        child:os.child.map(function(version){return version.version_id}),
                        add_all: true
                    }
                    $scope.arrSelectedOsDesktop.push(selectedOs);

                    // Store this properties for load line item
                    angular.forEach(os.child, function(version){
                        if(version.version_id && version.version_id.length){
                            $scope.arrOsDesktopId.push(version.version_id)
                        }
                    })

                }

                // Action add range versio
                $scope.addOsVersion = function (os) {
                    os.selected = true;

                    var total = os.child.length, arrChild = [], arrChildVersion = [];
                    for(var index =0; index < total; index++){
                        console.log(os)
                        if(parseInt(os.version_min) <= parseInt(os.child[index]['os_version_id']) && parseInt(os.version_max) >= parseInt(os.child[index]['os_version_id'])){
                            arrChild.push( os.child[index]['version_id']);
                            arrChildVersion.push(os.child[index]['os_version_id']);

                            // Update selected version
                            $scope.arrOsId.push(os.child[index]['version_id'])
                        }
                    }
                    var selectedOs = {
                        os_id: os.os_id,
                        os_name: os.os_name,
                        child: arrChild,
                        child_version: arrChildVersion,
                        add_all: false
                    }
                    // Add selected
                    $scope.arrSelectedOs.push(selectedOs);

                    // Store this properties for load line item
                    $scope.modelValue.os_target.push(selectedOs)
                }

                // Action remove version
                $scope.removeOs = function (os) {
                    // Select all version

                    // Update status of os version
                    var arrTemp = $filter('filter')()
                    var index = $scope.arrSelectedOs.indexOf(os);
                    $scope.arrSelectedOs.splice(index, 1)

                    // Update status
                    var total = $scope.arrOs.length;
                    for(var index =0; index < total; index++){
                        if($scope.arrOs[index].os_id == os.os_id){
                            $scope.arrOs[index].selected = false;
                        }
                    }

                    angular.forEach(os.child, function(version_id){
                        // Remove from list id
                        index = $scope.arrOsId.indexOf(version_id);
                        if (index != -1) {
                            $scope.arrOsId.splice(index, 1);
                        }
                    })

                    // Store this properties for load line item
                    index = $scope.modelValue.os_target.indexOf(os);
                    $scope.modelValue.os_target.splice(index, 1);
                    //$scope.modelValue.os_target
                }
                // End OS Version

                // Action remove version
                $scope.removeOsDesktop = function (os) {
                    // Select all version

                    // Update status of os version
                    var index = $scope.arrSelectedOsDesktop.indexOf(os);
                    $scope.arrSelectedOsDesktop.splice(index, 1)

                    // Update status
                    var total = $scope.arrOsDesktop.length;
                    for(var index =0; index < total; index++){
                        if($scope.arrOsDesktop[index].os_id == os.os_id){
                            $scope.arrOsDesktop[index].selected = false;
                        }
                    }

                    angular.forEach(os.child, function(version_id){
                        // Remove from list id
                        index = $scope.arrOsDesktopId.indexOf(version_id);
                        if (index != -1) {
                            $scope.arrOsDesktopId.splice(index, 1);
                        }
                    })
                }

                // ======================== Device
                // Open child node
                $scope.openChild = function ($event) {
                    angular.element($event.target).closest('li').toggleClass('open');
                }

                // Add all device
                $scope.addDevice = function (device) {
                    if (device.selected) {
                        return;
                    }
                    device.selected = true;
                    $scope.arrSelectedDevice.push({
                        device_id: device.device_id,
                        device_name: device.device_name
                    })
                    $scope.arrDeviceId.push(device.device_id);
                }

                // Remove a device
                $scope.removeDevice = function (device) {
                    var index = $scope.arrSelectedDevice.indexOf(device);
                    $scope.arrSelectedDevice.splice(index, 1)

                    // Change status of device
                    var tmpDevice = $filter('filter')($scope.arrDevice, {device_id: device.device_id});
                    if (tmpDevice.length) {
                        tmpDevice[0].selected = false;
                    }

                    index = $scope.arrDeviceId.indexOf(device.device_id);
                    $scope.arrDeviceId.splice(index, 1)
                }
                // ======================== End Device

                // ======================== Carrier
                $scope.addAllCarrier = function (location) {
                    location.forEach(function (carrier) {
                        if (!carrier.selected) {
                            carrier.selected = true;
                            $scope.arrSelectedCarrier.push(carrier)
                        }

                    })
                }
                $scope.addCarrier = function (carrier) {
                    carrier.selected = true;
                    // console.log(carrier)
                    $scope.arrSelectedCarrier.push(carrier)

                    // Add carrier to list
                    $scope.arrCarrierId.push(carrier.carrier_id);
                }
                $scope.removeCarrier = function (carrier) {
                    carrier.selected = false;
                    var index = $scope.arrSelectedCarrier.indexOf(carrier);
                    $scope.arrSelectedCarrier.splice(index, 1)

                    // Remove id from list
                    index = $scope.arrCarrierId.indexOf(carrier.carrier_id);
                    $scope.arrCarrierId.splice(index, 1);
                }
                // ======================== End Carrier

                // ======================== Browser
                // Add browser
                $scope.addBrowser = function (browser) {
                    console.log('Add browser')
                    browser.selected = true;
                    $scope.arrSelectedBrowser.push({
                        browser_name: browser.browser_name,
                        browser_id: browser.browser_id
                    });

                    // Add id to list browser
                    $scope.arrBrowserId.push(browser.browser_id);
                }
                // Remove selected browser
                $scope.removeBrowser = function (browser) {
                    // Find browser in list SelectedBrowser
                    var index = $scope.arrSelectedBrowser.indexOf(browser);
                    // Remove found object
                    $scope.arrSelectedBrowser.splice(index, 1)

                    // Using filter to filter key of object
                    var tmpBrowser = $filter('filter')($scope.arrBrowser, {browser_id: browser.browser_id});
                    if (tmpBrowser.length) {
                        tmpBrowser[0].selected = false;
                    }

                    // Remove id from list id
                    index = $scope.arrBrowserId.indexOf(browser.browser_id);
                    if (index != -1) {
                        $scope.arrBrowserId.splice(index, 1)
                    }
                }

                $scope.filterOsVersion = function(){
                    return function(osV) {
                        if ( osV.os_version_id > -1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
                // ======================== End Browser

                // Watch user change os target
                $scope.$watch("arrOsId", function (newVal, oldVal) {
                    if(newVal && newVal.length){
                        $scope.modelValue._mobile_osv_target = newVal.join(',')
                    }else{
                        $scope.modelValue._mobile_osv_target = '';
                    }

                }, true);
                $scope.$watch("arrOsDesktopId", function (newVal, oldVal) {
                    if(newVal && newVal.length){
                        $scope.modelValue._desktop_osv_target = newVal.join(',')
                    }else{
                        $scope.modelValue._desktop_osv_target = '';
                    }

                }, true);

                // Watch user change browser target
                $scope.$watch("arrBrowserId", function (newVal, oldVal) {
                    $scope.modelValue.browser_target = newVal.join(',')
                }, true);

                // Watch user change carrier target
                $scope.$watch("arrCarrierId", function (newVal, oldVal) {
                    $scope.modelValue.carrier_target = newVal.join(',')
                }, true);

                // Watch user change device display
                $scope.$watch("arrDeviceId", function (newVal, oldVal) {
                    $scope.modelValue.mfr_target = newVal.join(',')
                }, true);

                $scope.$watch('osType', function(newVal, oldVal){
                    if(newVal == 'all'){
                        $scope.arrOsId = []
                    }else{
                        if($scope.modelValue._mobile_osv_target && $scope.modelValue._mobile_osv_target.length){
                            $scope.arrOsId = $scope.modelValue._mobile_osv_target.split(',')
                        }else{
                            $scope.arrOsId = []
                        }
                    }
                })

                // Desktop change
                $scope.$watch('osTypeDesktop', function(newVal, oldVal){
                    if(newVal == 'all'){
                        $scope.modelValue._desktop_osv_target = ''
                    }else{
                        $scope.modelValue._desktop_osv_target = $scope.arrOsDesktopId.length ? $scope.arrOsDesktopId.join(',') : ''
                    }
                });

                $scope.$watch('deviceType', function(newVal, oldVal){
                    if(newVal == 'all'){
                        $scope.arrDeviceId = []
                    }else{
                        if($scope.modelValue.mfr_target && $scope.modelValue.mfr_target.length){
                            $scope.arrDeviceId = $scope.modelValue.mfr_target.split(',')
                        }else{
                            $scope.arrDeviceId = []
                        }

                    }
                })
                $scope.$watch('carrierType', function(newVal, oldVal){
                    if(newVal == 'all'){
                        $scope.arrCarrierId = []
                    }else{
                        if($scope.modelValue.carrier_target && $scope.modelValue.carrier_target.length){
                            $scope.arrCarrierId = $scope.modelValue.carrier_target.split(',')
                        }else{
                            $scope.arrCarrierId = []
                        }

                    }
                })
                $scope.$watch('browserType', function(newVal, oldVal){
                    if(newVal == 'all'){
                        $scope.arrBrowserId = []
                    }else{
                        if($scope.modelValue.browser_target && $scope.modelValue.browser_target.length){
                            $scope.arrBrowserId = $scope.modelValue.browser_target.split(',')
                        }else{
                            $scope.arrBrowserId = []
                        }

                    }
                });
                $scope.$watch('arrDisplay', function(newVal, oldVal){
                    var tmpDisplay = [], hasModile = false;
                    if(newVal.pc){
                        tmpDisplay.push(1);
                        $scope.modelValue._desktop_osv_target = $scope.arrOsDesktopId.length ? $scope.arrOsDesktopId.join(',') : ''
                    }else{
                        $scope.modelValue._desktop_osv_target = null;
                    }
                    if(newVal.mobile){
                        tmpDisplay.push(2);
                        hasModile = true;
                    }
                    if(newVal.tablet){
                        tmpDisplay.push(3)
                        hasModile = true;
                    }
                    // No mobile target used
                    if(!hasModile){
                        $scope.modelValue._mobile_osv_target = null;
                    }else{
                        $scope.modelValue._mobile_osv_target = $scope.arrOsId.length ? $scope.arrOsId.join(',') : '';
                    }

                    $scope.modelValue.device_display = tmpDisplay.join(',');
                }, true);

                // Listen event to update frequency from broadcast
                $scope.$on(APP_EVENTS.loadExisLineItem, function (event, arg) {
                    // Reset form with info from news lineitem
                    $scope.loadCriterion = false
                    init(false);
                });

                // Listen event on submit to show error
                $rootScope.$on(APP_EVENTS.lineItem.saveLineItem, function (event, arg) {
                    $scope.showError = true;
                })

                $scope.enableAdd = function(os){
                    return parseInt(os.version_min) > parseInt(os.version_max);
                }
            }],
            templateUrl: '/js/modules/operation/templates/campaign/deviceTarget.html?v=' + ST_VERSION
        }
    })
    app.directive('adxExistLineitem', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lineItem: '=',
                displayText: '@',
                confirm: '@'
            },
            link: function(scope, element){
                scope.onToggle = function(open){
                    if(open){
                        angular.element('input[name="exist_name"]', element).focus()
                    }
                }
            },
            controller: ['$scope', '$filter', '$http', 'appConfig', 'debounce', '$rootScope', 'APP_EVENTS', 'LineItemInfo', 'Modal', 'Search',
                function ($scope, $filter, $http, appConfig, debounce, $rootScope, APP_EVENTS, LineItemInfo, Modal, Search) {
                    $scope.selectLineItem = '';
                    $scope.displayText = $scope.displayText || 'Existing Line Item'
                    var _lineItemName = ''
                    if($scope.confirm  == undefined){
                        $scope.confirm = true;
                    }
                    $scope.isOpen = false;
                    $scope.noLineItem = true;

                    // Delay search function
                    var debounceSearch = debounce(function (val) {
                        return $http.get(appConfig.API + '/search/index', {
                            params: {
                                search: val,
                                object: 'lineitems'
                            }
                        }).then(function (response) {
                            if (response.status == 200) {
                                return response.data.data
                            } else {
                                return [];
                            }
                        });
                    }, 200, false);

                    Search.getList({object:'lineitems', search: ''}, function(response){
                        if (response.code == 200) {
                            $scope.noLineItem = false;
                        }
                    })

                    var broadCastLoadLineItem = debounce(function () {
                        var tmpLi = angular.copy($scope.lineItem)
                        tmpLi.lineitem_name = _lineItemName
                        $rootScope.$broadcast(APP_EVENTS.loadExisLineItem, {object: tmpLi});
                    }, 100);

                    // Search text input
                    $scope.getLineItem = function (val) {
                        return debounceSearch(val);

                    };



                    // Select lineitem on search box
                    $scope.onSelect = function ($item, $model, $label, $event) {
                        $scope.selectLineItem = '';
                        // Show confirm when load item
                        if($scope.confirm == true){
                            Modal.showModal({
                                actionText: 'OK',
                                closeText: 'Cancel',
                                headerText: 'Warning',
                                bodyText: "Changes you've already made to this page will be lost if you load settings. Continue?",
                                onAction: function(){
                                    getInfoLineItem($model.lineitem_id)
                                }, onCancel: function(){

                                }})
                        }else{
                            getInfoLineItem($model.lineitem_id);
                        }


                        /*
                         tmp.camp_properties = JSON.parse(tmp.camp_properties)
                         $scope.lineItem = tmp;
                         console.log(tmp)

                         // Broadcast event load exist line item
                         broadCastLoadLineItem();
                         */
                    }
                    var getInfoLineItem = function(lineitem_id){
                        Modal.process(LineItemInfo.get({id: lineitem_id}), {
                            onAction: function (lineItemInfo) {
                                var tmp = lineItemInfo.data;

                                if (tmp.properties == undefined) {
                                    tmp.properties = {}
                                } else if (typeof tmp.properties != 'object') {
                                    tmp.properties = JSON.parse(tmp.properties)
                                }
                                // Keept name of line item
                                _lineItemName = tmp.lineitem_name;
                                // Set name is empty
                                tmp.lineitem_name = $scope.lineItem ? $scope.lineItem.lineitem_name : tmp.lineitem_name;
                                var time = /(\d{4})-(\d{2})-(\d{2})/;
                                var match = time.exec(tmp.from_date)
                                if(match && match.length ==4){
                                    tmp.from_date = match[3] + '/' + match[2] + '/' + match[1]
                                }
                                match = time.exec(tmp.to_date)
                                if(match && match.length ==4){
                                    tmp.to_date =  match[3] + '/' + match[2] + '/' + match[1]
                                }
                                console.log(tmp)
                                delete tmp.lineitem_id;

                                $scope.isOpen = false;
                                $scope.lineItem = tmp;

                                // Broadcast event load exist line item
                                broadCastLoadLineItem();
                            },
                            onCancel: function (err) {
                                console.log('errorrrrrrrr')
                                console.log(err)
                            }
                        });
                    }

                }],
            templateUrl: '/js/modules/operation/templates/lineitem/directives/existLineitem.html'
        };
    });

    app.directive('adxLineitemUrl', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                modelValue: '=ngModel'
            },
            controller: ['$scope', 'APP_EVENTS', function ($scope, APP_EVENTS) {
                $scope.modelValue = $scope.modelValue || []

                $scope.addUrl = function () {
                    $scope.modelValue.push({find: '', replace: '', id: 0})
                }

                $scope.removeUrl = function (url) {
                    var index = $scope.modelValue.indexOf(url);
                    $scope.modelValue.splice(index, 1)
                }

                var initUrl = function(){
                    if ($scope.modelValue.length == 0) {
                        for (var index = 0; index < 3; index++) {
                            $scope.addUrl();
                        }
                    }
                }
                initUrl();


                $scope.$on(APP_EVENTS.lineItem.loadPackage, function(event, args){
                    if(args.object && args.object.properties && !$scope.modelValue){
                        $scope.modelValue = []
                        initUrl();
                    }
                });

            }],
            templateUrl: 'lineitemUrl.html'
        };
    });

    app.directive('adxBidStrategy', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                modelValue: '=ngModel',
                objective: '=objective',
                readOnly: '='
            },
            controller: ['$scope', '$rootScope', '$filter', 'APP_EVENTS', 'LineItemResource',
                function ($scope, $rootScope, $filter, APP_EVENTS, LineItemResource) {
                    $scope.paymentModelId = [];
                    $scope.paymentModel = [];
                    $scope.dataSource = [];
                    // Default show text
                    $scope.isShowCustom = false;

                    function buildStrategyText() {

                        $scope.dataSource = []
                        // Update default text
                        var arrFilter = $filter('filter')($scope.paymentModel, {payment_model: $scope.modelValue})
                        if (arrFilter.length) {
                            $scope.strategyText = arrFilter[0].payment_model_name;
                        }


                        angular.forEach($scope.paymentModelId, function (modelId) {
                            modelId = parseInt(modelId)
                            var arrFilter = $filter('filter')($scope.paymentModel, {payment_model: modelId})
                            if (arrFilter.length) {
                                $scope.dataSource.push({
                                    name: arrFilter[0].payment_model_name,
                                    value: arrFilter[0].payment_model
                                })
                            }
                        })

                    }

                    // Get list marketing object
                    LineItemResource.getList({type: 'list-payment-model'}, function (response) {
                        if (response.data != undefined) {
                            $scope.paymentModel = response.data;
                            buildStrategyText();
                        }
                    });

                    // Function show dropbox choice payment model
                    $scope.showEditStrategy = function () {
                        $scope.isShowCustom = true;
                    }

                    buildStrategyText();

                    $rootScope.$on(APP_EVENTS.lineItem.changeMkObject, function (name, arg) {
                        $scope.paymentModelId = arg.paymentModel || [1]
                        $scope.modelValue = arg.defaultModal || 1;
                        buildStrategyText();
                    })

                    // Listen event when load package
                    $scope.$on(APP_EVENTS.lineItem.loadPackage, function(event, args){
                        buildStrategyText();
                    });


                }],
            template: '<div>' +
            '   <div class="form-control-static" ng-hide="isShowCustom">' +
            '       <strong class="mr-10">{{strategyText}}</strong>' +
            '       <a ng-if="!readOnly" href="" ng-click="showEditStrategy()">Edit</a>' +
            '   </div>' +
            '   <div class="pl-15">' +
            '       <adx-dropdown ng-show="isShowCustom" ng-model="modelValue" datasource="dataSource"></adx-dropdown>' +
            '   </div>' +
            '</div>'
        };
    })

    /**
     * Directive frequency capping
     */
    app.directive('adxFrequencyCap', ['debounce', function (debounce) {
        return {
            restrict: 'E',
            replace: true,
            require: 'ngModel',
            scope: {
                modelValue: '=ngModel'
            },
            link: function (scope, element, attrs, ngModel) {

            },
            controller: function ($scope, $rootScope, APP_EVENTS) {
                var init = function () {
                    // Frequency type: 1 -> creative, 2 -> campaign, 3 -> line item
                    $scope.freqType = $scope.modelValue.freq_type ? parseInt($scope.modelValue.freq_type) : '3';
                    $scope.showError = false;

                    // Check 'No cap on viewable impressions' if value of freq_hourly, freq_daily, freq_lifetime diff empty
                    if ($scope.modelValue.freq_hourly != '' || $scope.modelValue.freq_daily != '' || $scope.modelValue.freq_lifetime != ''
                        || ($scope.modelValue.freq_weekly != undefined && $scope.modelValue.freq_weekly != '')
                        || ($scope.modelValue.freq_monthly != undefined && $scope.modelValue.freq_monthly != '')
                    ) {
                        $scope.opt = 1;
                        if ($scope.modelValue.freq_hourly != '') {
                            $scope.freqOpt = 1;
                            $scope.frequency = $scope.modelValue.freq_hourly;
                        } else if ($scope.modelValue.freq_daily != '') {
                            $scope.freqOpt = 2;
                            $scope.frequency = $scope.modelValue.freq_daily;
                        }
                        else if ($scope.modelValue.freq_lifetime != '') {
                            //$scope.freqOpt = 4;
                            $scope.frequency = $scope.modelValue.freq_lifetime;
                            // A3-805: Replace  life time with monthly
                            $scope.freqOpt = 5;
                        } else if ($scope.modelValue.freq_weekly != '') {
                            $scope.freqOpt = 3;
                            $scope.frequency = $scope.modelValue.freq_weekly;
                        }else if ($scope.modelValue.freq_monthly != '') {
                            $scope.freqOpt = 5;
                            $scope.frequency = $scope.modelValue.freq_monthly;
                        }
                    } else {
                        $scope.opt = 0;
                        $scope.freqOpt = 5;
                        $scope.freq = 0
                    }
                }

                // Init data
                init();

                $scope.arrOpt = [
                    {name: 'per hour', value: 1},
                    {name: 'per day', value: 2},
                    {name: 'per week', value: 3},
                    {name: 'per month', value: 5}
                    //,{name: 'life time', value: 4}
                ]
                $scope.arrType = [
                    {name: 'for this Line Item', value: 3},
                    {name: 'per Campaign', value: 2},
                    {name: 'per Creatives', value: 1}
                ]

                // Update model when user change frequency value, frequency option
                var updateFreq = debounce(function () {
                    $scope.modelValue.freq_hourly = '';
                    $scope.modelValue.freq_daily = '';
                    $scope.modelValue.freq_lifetime = '';
                    $scope.modelValue.freq_weekly = '';
                    $scope.modelValue.freq_monthly = '';

                    if ($scope.opt == 1) {
                        $scope.modelValue.freq_type = $scope.freqType;
                        switch ($scope.freqOpt) {
                            case 1:
                                // Hourly
                                $scope.modelValue.freq_hourly = $scope.frequency;
                                break;
                            case 2:
                                // Daily
                                $scope.modelValue.freq_daily = $scope.frequency;
                                break;
                            case 4:
                                // Life time
                                // A3-805: Replace  life time with monthly
                                //$scope.modelValue.freq_lifetime = $scope.frequency;
                                $scope.modelValue.freq_monthly = $scope.frequency;
                                break;
                            case 3:
                                // Weekly
                                $scope.modelValue.freq_weekly = $scope.frequency;
                                break;
                            case 5:
                                // Monthly
                                $scope.modelValue.freq_monthly = $scope.frequency;
                                break;
                        }
                    }else{
                        // Reset freq_type
                        $scope.modelValue.freq_type = '';
                    }

                }, 200);

                var validationForm=function() {
                    if (!$scope.showError) {
                        return;
                    }
                }

                // Watch frequency change to update model
                $scope.$watch('frequency', function (newVal, oldVal) {
                    updateFreq();
                });
                // Watch freqOpt change to update model
                $scope.$watch('freqOpt', function (newVal, oldVal) {
                    updateFreq();
                });
                // Watch freqType change to update model
                $scope.$watch('freqType', function (newVal, oldVal) {
                    $scope.modelValue.freq_type = newVal;
                });

                // Watch radio button change
                $scope.$watch('opt', function (newVal, oldVal) {
                    if (newVal == 0) {
                        $scope.modelValue.freq_hourly = '';
                        $scope.modelValue.freq_daily = '';
                        $scope.modelValue.freq_lifetime = '';
                        $scope.modelValue.freq_weekly = '';
                        $scope.modelValue.freq_monthly = '';
                        $scope.modelValue.freq_type = '';
                    } else {
                        updateFreq();
                    }
                });

                // Listen event to update frequency from broadcast
                $scope.$on(APP_EVENTS.loadExisLineItem, function (event, arg) {
                    // Reset form with info from news lineitem
                    init();
                })

                // Listen event on submit to show error
                $rootScope.$on(APP_EVENTS.lineItem.saveLineItem, function (event, arg) {
                    $scope.showError = true;
                    validationForm();
                })
            },

            template: '<div class="form-group">' +
            '<label class="label-field"><span class="text-dot">Frequency capping</span></label>' +
            '<div class="container-field pl-15">' +
            '   <div class="radio mb-20"><input type="radio" ng-model="opt" value="0" class="icheck">No cap on viewable impressions</div>' +
            '   <div class="radio form-inline">' +
            '       <input type="radio" ng-model="opt" value="1" class="icheck">' +
            '       <input type="text" name="frequency" adx-format-number ng-model="frequency" class="form-control" ng-required="opt==1" min="1" maxlength="3" pattern="^[1-9]+([0-9]+)*$" ng-disabled="opt == 0">viewable impressions' +
            '       <adx-dropdown datasource="arrOpt" ng-model="freqOpt" disabled="opt == 0"></adx-dropdown>' +
            '       <adx-dropdown datasource="arrType" ng-model="freqType" disabled="opt == 0"></adx-dropdown>' +
            '       <span class="error" etype="pattern" ng-if="showError && $parent.lineItemForm.frequency.$error.required">Invalid Frequency capping</span>' +
            '       <span class="error" ng-if="showError && $parent.lineItemForm.frequency.$error.min">Frequency capping too small</span>' +
            '       <span class="error" ng-if="showError && $parent.lineItemForm.frequency.$error.maxlength">Frequency capping too large</span>' +
            '       <span class="error" etype="pattern" ng-if="showError && $parent.lineItemForm.frequency.$error.pattern">Invalid Frequency capping</span>' +
            '   </div>' +
            '</div>' +
            '</div>'
        };

    }]);

    app.directive('adxBudget', function () {
        return {
            restrict: 'E',
            replace: true,
            require: 'ngModel',
            scope: {
                modelValue: '=ngModel'
            },
            controller: ['$scope', 'debounce', 'APP_EVENTS', '$rootScope', 'appConfig',
                function ($scope, debounce, APP_EVENTS, $rootScope, appConfig) {

                    $scope.minBudget = appConfig.MIN_BUDGET.LIFE_TIME;
                    $scope.showError = false;
                    function updateBudget() {
                        // Daily budget
                        if ($scope.budgetType == 1) {
                            $scope.modelValue.daily_budget = $scope.budget;
                            $scope.modelValue.total_budget = 0;
                            $scope.minBudget = appConfig.MIN_BUDGET.DAILY
                            $scope.modelValue.revenue_type = appConfig.REVENUE_TYPE.DAILY; // Daily
                        } else {
                            $scope.modelValue.total_budget = $scope.budget;
                            $scope.modelValue.daily_budget = 0;
                            $scope.minBudget = appConfig.MIN_BUDGET.LIFE_TIME
                            $scope.modelValue.revenue_type = appConfig.REVENUE_TYPE.LIFE_TIME; // Life time
                        }
                        validationForm();
                    }

                    var init = function () {
                        var dailyBud = ($scope.modelValue.daily_budget != undefined ? parseFloat($scope.modelValue.daily_budget) : null);
                        if (!angular.isNumber(dailyBud)) {
                            dailyBud = null;
                        }

                        if ($scope.modelValue.revenue_type == appConfig.REVENUE_TYPE.DAILY) {
                            $scope.budgetType = 1;
                            $scope.budget = dailyBud;
                        } else {
                            $scope.budgetType = 2;
                            $scope.budget = parseFloat($scope.modelValue.total_budget) || 0;
                        }
                    }

                    // Init value
                    init();


                    // Watch user change
                    $scope.$watch('budgetType', function (newVal, oldVal) {
                        updateBudget();
                        $rootScope.$broadcast(APP_EVENTS.lineItem.changeBudgetType, {budgetType: newVal})
                    });
                    // Watch user change
                    $scope.$watch('budget', function (newVal, oldVal) {
                        updateBudget();
                    });

                    // Listen event to update budget from broadcast
                    $scope.$on(APP_EVENTS.loadExisLineItem, function (event, arg) {
                        // Reset form with info from news lineitem
                        console.log('Load exist line iem')
                        console.log(arg)
                        if(arg && arg.object){
                            $scope.revenue_type = arg.object.revenue_type;
                        }
                        init();
                    })

                    var validationForm=function(){

                        if($scope.budgetType == 1){
                            if(appConfig.MIN_BUDGET.DAILY > $scope.budget || !$scope.budget){
                                //$scope.showError = true;
                                $scope.errorBudget = $scope.budgetType
                            }else{
                                $scope.errorBudget = 0; // No error
                            }
                        }else if($scope.budgetType == 2){
                            if(appConfig.MIN_BUDGET.LIFE_TIME > $scope.budget || !$scope.budget){
                                //$scope.showError = true;
                                $scope.errorBudget = $scope.budgetType
                            }else{
                                $scope.errorBudget = 0; // No error
                            }
                        }

                    }

                    // Listen event on submit to show error
                    $rootScope.$on(APP_EVENTS.lineItem.saveLineItem, function (event, arg) {
                        $scope.showError = true;
                        validationForm();
                    })
                }],
            templateUrl: '/js/modules/operation/templates/lineitem/directives/budget.html?v=' + ST_VERSION
        }
    });

    app.directive('adxLineitemObjective', [function () {
        return {
            restrict: 'E',
            //replace: true,
            require: 'ngModel',
            scope: {
                modelValue: '=ngModel'
            },
            controller: ['$scope', '$rootScope', 'debounce', 'APP_EVENTS', 'appConfig', 'LineItemResource', '$filter',
                function ($scope, $rootScope, debounce, APP_EVENTS, appConfig, LineItemResource, $filter) {

                    // Default objective
                    $scope.arrObjective = [];
                    $scope.active = appConfig.LINE_ITEM_MARKETING_OBJECTIVE.DEFAULT;
                    // Change objective when user click 'Build awareness' or 'Drive action'
                    $scope.changeObjective = function (objective) {
                        // Update active tab
                        $scope.active = objective.mk_object_id;

                        // Find checked object type
                        var childObjActive = $filter('filter')(objective.child, {checked: true});
                        if (childObjActive.length) {
                            $scope.modelValue = childObjActive[0].mk_object_id;
                            $scope.updateDriveAction(childObjActive[0])
                        } else {
                            // Reset if no object has checked
                            $scope.modelValue = null;
                        }

                    }
                    // User can choose one checkbox
                    $scope.updateDriveAction = function (objective) {
                        var arrObj = $filter('filter')($scope.arrObjective, {mk_object_id: $scope.active})
                            , arrModel = []
                            ;
                        $scope.modelValue = objective.mk_object_id;
                        if (objective.checked) {
                            $rootScope.$broadcast(APP_EVENTS.lineItem.changeMkObject, {
                                marketingObjectId: objective.mk_object_id,
                                paymentModel: objective.payment_model, // Array payment model id
                                defaultModal: objective.default_payment_model // Model id will be check as default
                            })
                        }


                    }
                    // Function active tab marketing object
                    var activeTab = function () {
                        // If has marketing objective
                        if ($scope.arrObjective.length) {
                            var activeIndex = 0;
                            // In case of load existing line item, find marketing object choose to active parent
                            if ($scope.modelValue != undefined && $scope.modelValue) {
                                var totalObj = $scope.arrObjective.length;
                                for (var index = 0; index < totalObj; index++) {
                                    $scope.arrObjective[index].checked = false;
                                }
                                for (var index = 0; index < totalObj; index++) {

                                    var foundChild = $filter('filter')($scope.arrObjective[index].child, {mk_object_id: parseInt($scope.modelValue) });
                                    if (foundChild.length) {
                                        // Found index  to active tab
                                        activeIndex = index;
                                        // Selected choose checkbox
                                        foundChild[0].checked = true;
                                        $scope.arrObjective[index].checked = true;
                                        break;
                                    }
                                }
                            }
                            // Active tab marketing object
                            $scope.changeObjective($scope.arrObjective[activeIndex]);
                        }
                    }

                    // Init func
                    var init = function () {
                        // Active tab
                        activeTab();
                    }

                    // Get list marketing object
                    LineItemResource.getList({type: 'list-marketing-object'}, function (response) {
                        if (response.data != undefined) {
                            $scope.arrObjective = response.data;
                            /*
                             angular.forEach($scope.arrObjective, function (obj) {
                             obj.check = false;
                             })
                             */
                            $scope.arrObjective[0].checked = true;
                            activeTab();
                        }
                    });


                    // Init value
                    init();


                    // Listen event to update budget from broadcast
                    $scope.$on(APP_EVENTS.loadExisLineItem, function (event, arg) {
                        // Reset form with info from news lineitem
                        init();
                    })

                }],
            templateUrl: 'line-item-objective.html'
        }
    }]);

    app.directive('adxAdvanceTimeSetting', [function () {
        return {
            restrict: 'E',
            //replace: true,
            require: 'ngModel',
            scope: {
                fromDate: '=fromDate',
                toDate: '=toDate',
                endDate: '=?endDate',
                timeFrame: '=timeFrames',
                onSave: '&onSave',
                onBeforeShow: '&onBeforeShow',
                skip: '=?', // Reset date to current or not
                readOnly: '=?',
                maxDate: '='
            },
            controller: ['$scope', 'appConfig', 'Modal', 'APP_EVENTS',
                function ($scope, appConfig, Modal, APP_EVENTS) {
                    $scope.isShowAdvance = false;
                    $scope.budgetType = 2;
                    $scope.scheduleType = 1;
                    $scope.endDayOption = $scope.toDate ? 'end' : 'none';
                    $scope.static_url = appConfig.ST_HOST;
                    var _fromDate = $scope.fromDate, _toDate = $scope.toDate;
                    $scope.timeFrame = "25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,24,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,48,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,72,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,96,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,120,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,144,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0";
                    $scope.showAdvance = function () {
                        // Call function before show
                        $scope.onBeforeShow();
                        Modal.showModal({
                                actionText: 'OK',
                                closeText: 'Close',
                                onAction: function () {
                                    alert('Close')
                                }, onCancel: function () {
                                    alert('Cancel')
                                }
                            },
                            {
                                'templateUrl': 'advance-time-setting-popup.html',
                                controller: ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {
                                    scope.isCheckAll = false;
                                    scope.arrHour = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
                                    //scope.arrDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                                    scope.arrDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                                    scope.readOnly = $scope.readOnly;
                                    var _arrDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                    // Store toggle status when click on day
                                    scope.arrToggleDay = [{day: 1, checked: true},
                                        {day: 2, checked: true}, {day: 3, checked: true}, {day: 4, checked: true},
                                        {day: 5, checked: true}, {day: 6, checked: true}, {day: 0, checked: true}]
                                    scope.arrToggleTime = [{time: 1, checked: true},
                                        {time: 2, checked: true}, {time: 3, checked: true}, {time: 4, checked: true},
                                        {time: 5, checked: true}, {time: 6, checked: true}, {time: 7, checked: true},
                                        {time: 8, checked: true}, {time: 9, checked: true}, {time: 10, checked: true}
                                        , {time: 11, checked: true}, {time: 12, checked: true},
                                        {time: 13, checked: true}, {time: 14, checked: true}, {time: 15, checked: true},
                                        {time: 16, checked: true}, {time: 17, checked: true}, {time: 18, checked: true},
                                        {time: 19, checked: true}, {time: 20, checked: true}, {time: 21, checked: true},
                                        {time: 22, checked: true}, {time: 23, checked: true}, {time: 0, checked: true}
                                    ];
                                    scope.arrParent = [1,2,3,4,5,6,0];
                                    var arrChild = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0]
                                    var init = function () {
                                        scope.arrValue = {};
                                        var isCheckAll = true;
                                        var arrSelTime = ($scope.timeFrame != undefined && $scope.timeFrame.split != undefined) ? $scope.timeFrame.split(',') : [];

                                        for (var key in scope.arrParent) {
                                            var index = scope.arrParent[key];
                                            scope.arrValue[index] = [];
                                            var range = (index * 24)
                                            for (var subKey in arrChild) {
                                                var subIndex = arrChild[subKey];
                                                var value = range + subIndex, checked;
                                                if (arrSelTime.length && arrSelTime.indexOf(value + '') != -1) {
                                                    checked = true;
                                                } else {
                                                    checked = arrSelTime.length == 0 ? true : false
                                                    isCheckAll = isCheckAll && checked;
                                                }

                                                scope.arrValue[index][subIndex] = {checked: checked, value: value};
                                                scope.arrValue[index]['checked'] = true;
                                            }
                                        }
                                        scope.isCheckAll = isCheckAll;
                                    }

                                    init();

                                    // Check all
                                    scope.checkAll = function () {
                                        if(scope.readOnly){
                                            return;
                                        }
                                        for (var key in scope.arrParent) {
                                            var index = scope.arrParent[key]
                                            for (var subKey in arrChild) {
                                                var subIndex = arrChild[subKey]
                                                scope.arrValue[index][subIndex]['checked'] = scope.isCheckAll;
                                            }
                                        }

                                    }

                                    scope.save = function () {
                                        // Get all checked value then pass them to timeFrame
                                        var arrTimes = [];
                                        for (var key in scope.arrParent) {
                                            var index = scope.arrParent[key];
                                            for (var subKey in arrChild) {
                                                var subIndex = arrChild[subKey]
                                                if (scope.arrValue[index][subIndex]['checked'] == true) {
                                                    arrTimes.push(scope.arrValue[index][subIndex]['value'])
                                                }
                                            }
                                        }
                                        $scope.timeFrame = arrTimes.join(',')
                                        $scope.onSave({params: $scope.timeFrame});
                                        $uibModalInstance.close(true);
                                    };

                                    // Action cancel
                                    scope.close = function (result) {
                                        $uibModalInstance.dismiss('cancel');
                                    };

                                    // Check/ Uncheck checkbox check all
                                    var detectCheckAll = function(){
                                        var allCheck = true;
                                        for (var key in scope.arrParent) {
                                            var index = scope.arrParent[key]
                                            for (var subKey in arrChild) {
                                                var subIndex = arrChild[subKey]
                                                if (scope.arrValue[index][subIndex]['checked'] == false) {
                                                    allCheck = false;
                                                    break;
                                                }
                                            }
                                            if(allCheck==false){
                                                break;
                                            }
                                        }
                                        if(allCheck){
                                            scope.isCheckAll = true;
                                        }else{
                                            scope.isCheckAll = false;
                                        }
                                    }

                                    // Action when click on hour
                                    scope.toggleAllHour = function (hour, checked) {
                                        if(scope.readOnly){
                                            return;
                                        }
                                        var checked = !scope.arrToggleTime[hour].checked;
                                        scope.arrToggleTime[hour].checked = checked;
                                        for (var key in scope.arrParent) {
                                            var index = scope.arrParent[key]
                                            scope.arrValue[index][hour]['checked'] = checked;
                                        }
                                        detectCheckAll();
                                    }

                                    // Action when click on day
                                    scope.toggleAllDay = function (day) {
                                        if(scope.readOnly){
                                            return;
                                        }
                                        var checked = !scope.arrToggleDay[day].checked, parentIndex = scope.arrParent[day];
                                        scope.arrToggleDay[day].checked = checked

                                        for (var key in arrChild) {
                                            var index = arrChild[key]
                                            scope.arrValue[parentIndex][index]['checked'] = checked;
                                        }
                                        detectCheckAll();
                                    }

                                    // Action when click on check box
                                    scope.toggleHour = function (indexHour, indexDay) {
                                        if(scope.readOnly){
                                            return;
                                        }
                                        scope.arrValue[indexHour][indexDay]['checked'] = !scope.arrValue[indexHour][indexDay]['checked'];
                                        // Un check checkbox check all
                                        if (scope.isCheckAll) {
                                            scope.isCheckAll = false;
                                        }else{
                                            detectCheckAll();
                                        }
                                    }

                                }]
                            }
                        );
                    }

                    $scope.changeSchedule = function () {
                        if ($scope.scheduleType == 1) {
                            $scope.endDayOption = 'end';
                            if($scope.budgetType == 1){
                                if($scope.toDate){
                                    _toDate = $scope.toDate;
                                }
                            }else{
                                $scope.toDate = _toDate;
                            }

                        } else {
                            if(!_toDate){
                                _toDate = moment().format(appConfig.MOMENT_DATE_FORMAT);
                            }
                            $scope.toDate = _toDate; // Lay lai thoi gian ket thuc
                        }
                    }

                    $scope.resetEndDay = function(reset){
                        if(reset == 1){
                            if($scope.toDate){
                                _toDate = $scope.toDate;
                            }
                            if($scope.scheduleType == 1){
                                $scope.toDate = null
                            }
                        }else if(reset == 2){
                            _toDate = $scope.toDate;
                            $scope.endDate = null;
                        }else{
                            if(!_toDate){
                                _toDate = moment().format(appConfig.MOMENT_DATE_FORMAT);
                            }
                            $scope.toDate = _toDate; // Lay lai thoi gian ket thuc
                            $scope.endDate = $scope.toDate;
                        }

                    }

                    var externalChangeBudget = function(budgetType){
                        $scope.budgetType = budgetType;
                        //$scope.changeSchedule();
                        if(budgetType == 2){
                            $scope.changeSchedule();
                            $scope.resetEndDay(0)
                        }else{
                            if($scope.scheduleType == 2){
                                $scope.resetEndDay(1);
                            }
                        }
                    }
                    // Listen action budget type change
                    $scope.$on(APP_EVENTS.lineItem.changeBudgetType, function (event, arg) {
                        if(arg.budgetType){
                            externalChangeBudget(arg.budgetType);
                        }

                    })
                    // Listen event to update frequency from broadcast
                    $scope.$on(APP_EVENTS.loadExisLineItem, function (event, arg) {
                        var skip = arg.skip || $scope.skip;
                        if(arg && arg.object){
                            var current =  moment()
                                , fromDate =  moment(arg.object.from_date, appConfig.MOMENT_DATE_FORMAT);
                            // If from date in passed, get current date
                            if(current.isAfter(fromDate) && !skip){
                                arg.object.from_date = current.format(appConfig.MOMENT_DATE_FORMAT);
                            }
                            $scope.fromDate = arg.object.from_date

                            if(arg.object.to_date){
                                // If to date in passed, get current date
                                var  toDate = moment(arg.object.to_date, appConfig.MOMENT_DATE_FORMAT);
                                if(current.isAfter(toDate) && !skip){
                                    arg.object.to_date = current.format(appConfig.MOMENT_DATE_FORMAT);
                                }
                                $scope.to_date = arg.object.to_date;
                                _toDate= arg.object.to_date;
                            }
                            if(arg.object.revenue_type == appConfig.REVENUE_TYPE.DAILY){
                                if(!arg.object.to_date){
                                    $scope.scheduleType = 1;
                                    $scope.to_date = null;
                                    _toDate = null;
                                    $scope.endDayOption = 'none';
                                }else if(arg.object.to_date && arg.object.from_date){
                                    $scope.scheduleType = 2;
                                    $scope.endDayOption = 'end';
                                }
                            }
                            externalChangeBudget(arg.object.revenue_type == 2? 1: 2)
                        }
                    })

                    // Calander not update to date if only select from date, must be manual set to date
                    $scope.$watch('fromDate', function(newVal, oldVal){
                        if(newVal && $scope.toDate){
                            var fromDate = moment(newVal, appConfig.MOMENT_DATE_FORMAT)
                                , toDate = moment($scope.toDate, appConfig.MOMENT_DATE_FORMAT)
                                ;
                            if(fromDate.isAfter(toDate)){
                                $scope.toDate = newVal;
                            }
                        }
                    })

                    $scope.$watch('toDate', function(newVal, oldVal){
                        // console.log('Watch todate', newVal)
                        if($scope.endDayOption == 'none'){
                            $scope.endDate = null;
                        }else{
                            $scope.endDate = newVal;
                        }
                        _toDate = newVal;

                    })
                }],
            templateUrl: function(element, attrs){
                return attrs.templateUrl || 'advance-time-setting.html';
            }
        }
    }]);

    app.directive('adxLineitemDeliveryMethod', function(){
        return {
            restrict: 'E',
            //replace: true,
            require: 'ngModel',
            scope: {
                modelValue: '=ngModel',
                readOnly: '='
            },
            controller: ['$scope', '$rootScope', 'APP_EVENTS', 'appConfig',
                function ($scope, $rootScope, APP_EVENTS, appConfig) {

                }
            ],
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'delivery-method.html';
            }
        }
    });

    app.directive('adxLineitemPrivateDeal', [function () {
        return {
            restrict: 'E',
            //replace: true,
            require: 'ngModel',
            scope: {
                modelValue: '=ngModel'
            },
            controller: ['$scope', '$rootScope', 'debounce', 'APP_EVENTS', 'appConfig', 'Package', '$timeout',
                function ($scope, $rootScope, debounce, APP_EVENTS, appConfig, Package, $timeout) {
                    var _promise // Keep last search promise
                        , _promiseGetDetail // Keep last get detail promise
                        , _selectFirst = true // Selected first package
                        , elRight // Element loading
                        , _page = 0

                    ;
                    $scope.arrPackages = [];
                    $scope.isSearching = false;

                    var getDetailPackage = function(packageId){
                        if(!elRight){
                            elRight = angular.element('div.line-item-right-block')
                        }
                        if(!elRight.hasClass('load-show')){
                            elRight.addClass('load-show');
                        }
                        // Cancel request if it was not finished
                        if(_promiseGetDetail ){
                            _promiseGetDetail.$cancelRequest();
                        }

                        // Get detail package
                        _promiseGetDetail =  Package.get({id: packageId});

                        _promiseGetDetail.$promise.then(function(result){
                            var packageInfo = result.data, current = moment();
                            packageInfo.properties = angular.fromJson(packageInfo.properties)

                            packageInfo.objective = null; // DungHTML confirm null value for lineitem create from package
                            packageInfo.lineitem_type_id = appConfig.LINE_ITEM_TYPE.PRIVATE_DEAL;

                            var time = /(\d{4})-(\d{2})-(\d{2})/;
                            var match = time.exec(packageInfo.from_date)
                            if(match && match.length ==4){
                                packageInfo.from_date = match[3] + '/' + match[2] + '/' + match[1]
                                if(current.isAfter(moment(packageInfo.from_date, appConfig.MOMENT_DATE_FORMAT)) ){
                                    packageInfo.from_date = current.format(appConfig.MOMENT_DATE_FORMAT)
                                }
                            }
                            match = time.exec(packageInfo.to_date)
                            if(match && match.length ==4){
                                packageInfo.to_date =  match[3] + '/' + match[2] + '/' + match[1]
                                if(current.isAfter(moment(packageInfo.to_date, appConfig.MOMENT_DATE_FORMAT)) ){
                                    packageInfo.to_date = current.format(appConfig.MOMENT_DATE_FORMAT)
                                }
                            }


                            $scope.modelValue = angular.extend($scope.modelValue, {
                                payment_model: packageInfo.payment_model,
                                properties: packageInfo.properties,
                                //budget: packageInfo.budget,
                                budget: 0,
                                objective: null,
                                revenue_type: 2,
                                from_date: packageInfo.from_date,
                                to_date: packageInfo.to_date,
                                //total_budget: packageInfo.total_budget,
                                total_budget: 0,
                                max_date: packageInfo.to_date,
                                package_id: packageId
                            });

                            console.log('$scope.modelValue', $scope.modelValue)
                            $timeout(function(){
                                $rootScope.$broadcast(APP_EVENTS.loadExisLineItem, {object: packageInfo});
                                $rootScope.$broadcast(APP_EVENTS.lineItem.loadPackage, {object: packageInfo});
                                elRight.removeClass('load-show');
                            }, 50);


                            _promiseGetDetail = null;

                        })
                    }

                    // Search or load package
                    var searchPackage = function(){
                        // Check promise not resolved yet, cancel it
                        if(_promise ){
                            _promise.$cancelRequest();
                        }

                        // Param to search
                        var searchParams = {page: _page}
                        if($scope.package_name){
                            searchParams.package_name = $scope.package_name;
                        }

                        if(!$scope.isSearching){
                            $scope.isSearching = true;
                        }

                        // Search
                        _promise = Package.getList(searchParams);

                        _promise.$promise.then(function(result){
                            if(result && result.code == 200 && result.data && result.data.length){
                                // Select first item
                                if(_selectFirst){
                                    $scope.selectedPackage = result.data[0].package_id;
                                    _selectFirst = false; // Select at the page load
                                    getDetailPackage($scope.selectedPackage);
                                }

                                if(_page == 1){
                                    $scope.arrPackages = result.data;
                                }else{
                                    var tmp = angular.copy($scope.arrPackages);
                                    angular.forEach(result.data, function(item){
                                        tmp.push(item)
                                    });
                                    $scope.arrPackages = tmp;
                                }

                            }
                            $scope.isSearching = false;
                        })
                    }

                    $timeout(function(){
                        _page = 1;
                        searchPackage();
                    }, 100);

                    $scope.changePackage = function(arrPackage){
                        getDetailPackage(arrPackage.package_id);
                    }


                    $scope.scrollbarOptions = {
                        onScroll: function(y, x){
                            if(y.scroll > 0 && y.scroll == y.maxScroll){
                                if($scope.arrPackages[0] && $scope.arrPackages.length == $scope.arrPackages[0].row_count){
                                    return;
                                }
                                _page +=1;
                                searchPackage();
                            }
                        }
                    }

                    $scope.$watch('package_name', function(newVal, oldVal){
                        _page = 1;
                        searchPackage();
                    });
                }],
            templateUrl: 'private-deal.html'
        }
    }]);
});