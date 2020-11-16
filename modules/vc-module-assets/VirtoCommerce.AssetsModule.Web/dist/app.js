/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Scripts/assets.js":
/*!***************************!*\
  !*** ./Scripts/assets.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

﻿//Call this to register our module to main application
var moduleTemplateName = "virtoCommerce.assets";

if (AppDependencies !== undefined) {
    AppDependencies.push(moduleTemplateName);
}

angular.module(moduleTemplateName, [])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('workspace.assets', {
            url: '/assets',
            templateUrl: '$(Platform)/Scripts/common/templates/home.tpl.html',
            controller: ['$scope', 'platformWebApp.bladeNavigationService', function ($scope, bladeNavigationService) {
                var blade = {
                    id: 'assetList',
                    controller: 'platformWebApp.assets.assetListController',
                    template: 'Modules/$(virtoCommerce.Assets)/Scripts/blades/asset-list.tpl.html',
                    isClosingDisabled: true
                };
                bladeNavigationService.showBlade(blade);
            }]
        });
}])
.run(
  ['platformWebApp.mainMenuService', '$state', function (mainMenuService, $state) {
      var menuItem = {
          path: 'browse/assets',
          icon: 'fa fa-folder-o',
          title: 'platform.menu.assets',
          priority: 130,
          action: function () { $state.go('workspace.assets'); },
          permission: 'platform:asset:access'
      };
      mainMenuService.addMenuItem(menuItem);
  }]);

/***/ }),

/***/ "./Scripts/blades/asset-list.js":
/*!**************************************!*\
  !*** ./Scripts/blades/asset-list.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

angular.module('platformWebApp')
    .controller('platformWebApp.assets.assetListController', ['$scope', '$translate', 'platformWebApp.assets.api', 'platformWebApp.bladeNavigationService', 'platformWebApp.dialogService', '$sessionStorage', 'platformWebApp.bladeUtils', 'platformWebApp.uiGridHelper',
        function ($scope, $translate, assets, bladeNavigationService, dialogService, $storage, bladeUtils, uiGridHelper) {
            var blade = $scope.blade;
            blade.title = 'platform.blades.asset-list.title';
            if (!blade.currentEntity) {
                blade.currentEntity = {};
            }

            blade.refresh = function () {
                blade.isLoading = true;
                assets.search(
                    {
                        keyword: blade.searchKeyword,
                        folderUrl: blade.currentEntity.url
                    },
                    function (data) {
                        $scope.pageSettings.totalItems = data.totalCount;
                        _.each(data.results, function (x) {
                            x.isImage = x.contentType && x.contentType.startsWith('image/');
                            if (x.isImage) {
                                x.noCacheUrl = x.url + '?t=' + x.modifiedDate;
                            }
                        });
                        $scope.listEntries = data.results;
                        blade.isLoading = false;

                        //Set navigation breadcrumbs
                        setBreadcrumbs();
                    }, function (error) {
                        bladeNavigationService.setError('Error ' + error.status, blade);
                    });
            };

            //Breadcrumbs
            function setBreadcrumbs() {
                if (blade.breadcrumbs) {
                    //Clone array (angular.copy leaves the same reference)
                    var breadcrumbs = blade.breadcrumbs.slice(0);

                    //prevent duplicate items
                    if (blade.currentEntity.url && _.all(breadcrumbs, function (x) { return x.id !== blade.currentEntity.url; })) {
                        var breadCrumb = generateBreadcrumb(blade.currentEntity.url, blade.currentEntity.name);
                        breadcrumbs.push(breadCrumb);
                    }
                    blade.breadcrumbs = breadcrumbs;
                } else {
                    blade.breadcrumbs = [generateBreadcrumb(blade.currentEntity.url, 'all')];
                }
            }

            function generateBreadcrumb(id, name) {
                return {
                    id: id,
                    name: name,
                    blade: blade,
                    navigate: function (breadcrumb) {
                        bladeNavigationService.closeBlade(blade,
                            function () {
                                blade.disableOpenAnimation = true;
                                bladeNavigationService.showBlade(blade, blade.parentBlade);
                            });
                    }
                }
            }

            function newFolder() {
                var tooltip = $translate.instant('platform.dialogs.create-folder.title');

                var result = prompt(tooltip + "\n\nEnter folder name:");

                if (result != null) {
                    assets.createFolder({ name: result, parentUrl: blade.currentEntity.url }, blade.refresh);
                }
            }

            $scope.copyUrl = function (data) {
                window.prompt("Copy to clipboard: Ctrl+C, Enter", data.url);
            };

            $scope.downloadUrl = function (data) {
                window.open(data.url, '_blank');
            };

            //$scope.rename = function (listItem) {
            //    rename(listItem);
            //};

            //function rename(listItem) {
            //    var result = prompt("Enter new name", listItem.name);
            //    if (result) {
            //        listItem.name = result;
            //    }
            //}

            function isItemsChecked() {
                return $scope.gridApi && _.any($scope.gridApi.selection.getSelectedRows());
            }

            $scope.delete = function (data) {
                deleteList([data]);
            };

            function deleteList(selection) {
                bladeNavigationService.closeChildrenBlades(blade, function () {
                    var dialog = {
                        id: "confirmDeleteItem",
                        title: "platform.dialogs.folders-delete.title",
                        message: "platform.dialogs.folders-delete.message",
                        callback: function (remove) {
                            if (remove) {
                                var listEntryIds = _.pluck(selection, 'url');
                                assets.remove({ urls: listEntryIds },
                                    blade.refresh,
                                    function (error) { bladeNavigationService.setError('Error ' + error.status, blade); });
                            }
                        }
                    }
                    dialogService.showConfirmationDialog(dialog);
                });
            }

            $scope.selectNode = function (listItem) {
                if (listItem.type === 'folder') {
                    var newBlade = {
                        id: blade.id,
                        breadcrumbs: blade.breadcrumbs,
                        currentEntity: listItem,
                        disableOpenAnimation: true,
                        controller: blade.controller,
                        template: blade.template,
                        isClosingDisabled: blade.isClosingDisabled
                    };

                    bladeNavigationService.showBlade(newBlade, blade.parentBlade);
                }
            };

            blade.headIcon = 'fa-folder-o';

            blade.toolbarCommands = [
                {
                    name: "platform.commands.refresh", icon: 'fa fa-refresh',
                    executeMethod: blade.refresh,
                    canExecuteMethod: function () {
                        return true;
                    }
                },
                {
                    name: "platform.commands.new-folder", icon: 'fa fa-folder-o',
                    executeMethod: function () { newFolder(); },
                    canExecuteMethod: function () {
                        return true;
                    },
                    permission: 'platform:asset:create'
                },
                {
                    name: "platform.commands.upload", icon: 'fa fa-upload',
                    executeMethod: function () {
                        var newBlade = {
                            id: "assetUpload",
                            currentEntityId: blade.currentEntity.url,
                            title: 'platform.blades.asset-upload.title',
                            controller: 'platformWebApp.assets.assetUploadController',
                            template: '$(Platform)/Scripts/app/assets/blades/asset-upload.tpl.html'
                        };
                        bladeNavigationService.showBlade(newBlade, blade);
                    },
                    canExecuteMethod: function () {
                        return true;
                    },
                    permission: 'platform:asset:create'
                },
                //{
                //    name: "Rename", icon: 'fa fa-font',
                //    executeMethod: function () {
                //        rename(getFirstChecked())
                //    },
                //    canExecuteMethod: isSingleChecked,
                //    permission: 'platform:asset:update'
                //},
                {
                    name: "platform.commands.delete", icon: 'fa fa-trash-o',
                    executeMethod: function () { deleteList($scope.gridApi.selection.getSelectedRows()); },
                    canExecuteMethod: isItemsChecked,
                    permission: 'platform:asset:delete'
                }
                //{
                //    name: "Cut",
                //    icon: 'fa fa-cut',
                //    executeMethod: function () {
                //    },
                //    canExecuteMethod: isItemsChecked,
                //    permission: 'asset:delete'
                //},
                //{
                //    name: "Paste",
                //    icon: 'fa fa-clipboard',
                //    executeMethod: function () {
                //        blade.isLoading = true;
                //        assets.move({
                //            folder: blade.currentEntity.url,
                //            listEntries: $storage.catalogClipboardContent
                //        }, function () {
                //            delete $storage.catalogClipboardContent;
                //            blade.refresh();
                //        }, function (error) {
                //            bladeNavigationService.setError('Error ' + error.status, blade);
                //        });
                //    },
                //    canExecuteMethod: function () {
                //        return $storage.catalogClipboardContent;
                //    },
                //    permission: 'asset:delete'
                //}
            ];

            // ui-grid
            $scope.setGridOptions = function (gridOptions) {
                uiGridHelper.initialize($scope, gridOptions,
                    function (gridApi) {
                        $scope.$watch('pageSettings.currentPage', gridApi.pagination.seek);
                    });
            };
            bladeUtils.initializePagination($scope, true);

            blade.refresh();
        }]);


/***/ }),

/***/ "./Scripts/blades/asset-select.js":
/*!****************************************!*\
  !*** ./Scripts/blades/asset-select.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

angular.module('platformWebApp')
    .controller('platformWebApp.assets.assetSelectController', ['$scope', 'platformWebApp.assets.api', 'platformWebApp.bladeNavigationService', 'platformWebApp.bladeUtils', 'platformWebApp.uiGridHelper',
        function ($scope, assetsApi, bladeNavigationService, bladeUtils, uiGridHelper) {
            var blade = $scope.blade;
            blade.template = '$(Platform)/Scripts/app/assets/blades/asset-select.tpl.html';

            blade.headIcon = 'fa-folder-o';

            if (!blade.currentEntity) {
                blade.currentEntity = {};
            }
            if (blade.folder) {
                blade.currentEntity.url = '/' + blade.folder;
            }

            blade.refresh = function () {
                blade.isLoading = true;
                assetsApi.search(
                    {
                        keyword: blade.searchKeyword,
                        folderUrl: blade.currentEntity.url
                    },
                    function (data) {
                        $scope.pageSettings.totalItems = data.totalCount;
                        _.each(data.results, function (x) { x.isImage = x.contentType && x.contentType.startsWith('image/'); });
                        $scope.listEntries = data.results;
                        blade.isLoading = false;

                        //Set navigation breadcrumbs
                        setBreadcrumbs();
                    }, function (error) {
                        bladeNavigationService.setError('Error ' + error.status, blade);
                    });
            };

            //Breadcrumbs
            function setBreadcrumbs() {
                if (blade.breadcrumbs) {
                    //Clone array (angular.copy leaves the same reference)
                    var breadcrumbs = blade.breadcrumbs.slice(0);

                    //prevent duplicate items
                    if (blade.currentEntity.url && _.all(breadcrumbs, function (x) { return x.id !== blade.currentEntity.url; })) {
                        var breadCrumb = generateBreadcrumb(blade.currentEntity.url, blade.currentEntity.name);
                        breadcrumbs.push(breadCrumb);
                    }
                    blade.breadcrumbs = breadcrumbs;
                } else {
                    var name = "all";
                    if (blade.folder)
                        name = blade.folder;

                    blade.breadcrumbs = [generateBreadcrumb(blade.currentEntity.url, name)];
                }
            }

            function generateBreadcrumb(id, name) {
                return {
                    id: id,
                    name: name,
                    blade: blade,
                    navigate: function (breadcrumb) {
                        bladeNavigationService.closeBlade(blade,
                            function () {
                                blade.disableOpenAnimation = true;
                                bladeNavigationService.showBlade(blade, blade.parentBlade);
                            });
                    }
                }
            }

            function isItemsChecked() {
                return $scope.gridApi && _.any($scope.gridApi.selection.getSelectedRows());
            }

            function getSelectedAssets() {
                return $scope.gridApi.selection.getSelectedRows();
            }

            $scope.selectNode = function (listItem) {
                if (listItem.type === 'folder') {
                    var newBlade = {
                        id: blade.id,
                        title: blade.title,
                        breadcrumbs: blade.breadcrumbs,
                        currentEntity: listItem,
                        disableOpenAnimation: true,
                        controller: blade.controller,
                        template: blade.template,
                        isClosingDisabled: blade.isClosingDisabled,
                        onSelect: blade.onSelect
                    };

                    bladeNavigationService.showBlade(newBlade, blade.parentBlade);
                }
            };

            blade.toolbarCommands = [
                {
                    name: 'platform.commands.confirm',
                    icon: 'fa fa-check',
                    executeMethod: function () { $scope.saveChanges(); },
                    canExecuteMethod: function () {
                        return isItemsChecked();
                    }
                }
            ];

            $scope.saveChanges = function () {
                if (blade.onSelect)
                    blade.onSelect(getSelectedAssets());

                $scope.bladeClose();
            };

            // ui-grid
            $scope.setGridOptions = function (gridOptions) {
                uiGridHelper.initialize($scope, gridOptions,
                    function (gridApi) {
                        $scope.$watch('pageSettings.currentPage', gridApi.pagination.seek);
                    });
            };
            bladeUtils.initializePagination($scope, true);

            blade.refresh();
        }]);


/***/ }),

/***/ "./Scripts/blades/asset-upload.js":
/*!****************************************!*\
  !*** ./Scripts/blades/asset-upload.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

angular.module('platformWebApp')
    .controller('platformWebApp.assets.assetUploadController', ['$scope', 'platformWebApp.assets.api', 'platformWebApp.bladeNavigationService', 'FileUploader', 'platformWebApp.dialogService', function ($scope, assets, bladeNavigationService, FileUploader, dialogService) {
        var blade = $scope.blade;
        var currentEntities;
        if (!blade.fileUploadOptions) {
            blade.fileUploadOptions = {};
        }
        var folderUrl = blade.currentEntityId || "";

        function initialize() {
            if (!$scope.uploader) {
                // Create the uploader
                var uploader = $scope.uploader = new FileUploader({
                    scope: $scope,
                    url: 'api/platform/assets?folderUrl=' + folderUrl,
                    method: 'POST',
                    //autoUpload: true,
                    removeAfterUpload: true
                });

                if (blade.fileUploadOptions.filterCallback && angular.isFunction(blade.fileUploadOptions.filterCallback)) {
                    uploader.filters.push({
                        name: 'customFileFilter',
                        fn: blade.fileUploadOptions.filterCallback
                    });
                } else if (blade.fileUploadOptions.accept && blade.fileUploadOptions.accept.contains('image')) {
                    uploader.filters.push({
                        name: 'imageFilter',
                        fn: function (item) {
                            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                            return '|jpg|png|jpeg|bmp|gif|svg+xml|'.indexOf(type) !== -1;
                        }
                    });
                }

                uploader.onAfterAddingAll = function (addedItems) {
                    if (folderUrl) {
                        blade.isLoading = true;
                        blade.uploadCompleted = false;
                        bladeNavigationService.setError(null, blade);

                        // check for asset duplicates
                        assets.search({ folderUrl: folderUrl },
                            function (data) {
                                blade.isLoading = false;
                                currentEntities = data.results;

                                _.each(addedItems, promptUserDecision);
                                uploader.uploadAll();
                            }, function (error) {
                                bladeNavigationService.setError('Error ' + error.status, blade);
                            });
                        
                    } else {
                        dialogService.showNotificationDialog({
                            id: "error",
                            title: "platform.dialogs.asset-upload-error.title",
                            message: "platform.dialogs.asset-upload-error.message"
                        });
                    }
                };

                uploader.onErrorItem = function (item, response, status, headers) {
                    bladeNavigationService.setError(item._file.name + ' failed: ' + (response.message ? response.message : status), blade);
                };

                uploader.onCompleteAll = function () {
                    refreshParentBlade();
                    blade.uploadCompleted = true;
                };

                uploader.onSuccessItem = function (fileItem, images) {
                    if (blade.onUploadComplete) {
                        blade.onUploadComplete(images);
                    }
                };
            }
        }

        function refreshParentBlade() {
            if (blade.parentBlade.refresh && !blade.fileUploadOptions.suppressParentRefresh) {
                blade.parentBlade.refresh();
            }
        }

        function promptUserDecision(item) {
            if (_.any(currentEntities, function (x) { return x.type === 'blob' && x.name.toLowerCase() === item.file.name.toLowerCase() })) {
                var result = prompt("File \"" + item.file.name + "\" already exists!\n- Change name / press [OK] to overwrite.\n- Press [Cancel] to skip this file.\nFile name:", item.file.name);
                if (result == null) {
                    item.remove();
                } else if (!result) {
                    promptUserDecision(item);
                } else if (result !== item.file.name) {
                    item.file.name = result;
                    promptUserDecision(item);
                } else {
                    item.url += "&forceFileOverwrite=true";
                }
            }
        }

        $scope.addImageFromUrl = function () {
            if (blade.newExternalImageUrl) {
                blade.uploadCompleted = false;
                if (folderUrl) {                    
                    assets.uploadFromUrl({ folderUrl: folderUrl, url: blade.newExternalImageUrl }, function (data) {
                        refreshParentBlade();
                        if (blade.onUploadComplete) {
                            blade.onUploadComplete(data);
                        }
                        blade.newExternalImageUrl = undefined;
                        blade.uploadCompleted = true;
                    });
                } else {
                    dialogService.showNotificationDialog({
                        id: "error",
                        title: "platform.dialogs.asset-upload-error.title",
                        message: "platform.dialogs.asset-upload-error.message"
                    });
                }
            }
        };

        blade.headIcon = 'fa-file-o';

        initialize();
        blade.isLoading = false;
    }]);


/***/ }),

/***/ "./Scripts/resources/assetApi.js":
/*!***************************************!*\
  !*** ./Scripts/resources/assetApi.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

angular.module('platformWebApp')
.factory('platformWebApp.assets.api', ['$resource', function ($resource) {
    return $resource('api/platform/assets', {}, {
        search: { method: 'GET', url: 'api/platform/assets', isArray: false },
        createFolder: { method: 'POST', url: 'api/platform/assets/folder' },
        move: { method: 'POST', url: 'api/platform/assets/move' },
        uploadFromUrl: { method: 'POST', params: { url: '@url', folderUrl: '@folderUrl', name: '@name' }, isArray: true }
    });
}]);



/***/ }),

/***/ 0:
/*!******************************************************************************************************************************************************************!*\
  !*** multi ./Scripts/assets.js ./Scripts/blades/asset-list.js ./Scripts/blades/asset-select.js ./Scripts/blades/asset-upload.js ./Scripts/resources/assetApi.js ***!
  \******************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./Scripts/assets.js */"./Scripts/assets.js");
__webpack_require__(/*! ./Scripts/blades/asset-list.js */"./Scripts/blades/asset-list.js");
__webpack_require__(/*! ./Scripts/blades/asset-select.js */"./Scripts/blades/asset-select.js");
__webpack_require__(/*! ./Scripts/blades/asset-upload.js */"./Scripts/blades/asset-upload.js");
module.exports = __webpack_require__(/*! ./Scripts/resources/assetApi.js */"./Scripts/resources/assetApi.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLkFzc2V0cy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLkFzc2V0cy8uL1NjcmlwdHMvYXNzZXRzLmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuQXNzZXRzLy4vU2NyaXB0cy9ibGFkZXMvYXNzZXQtbGlzdC5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLkFzc2V0cy8uL1NjcmlwdHMvYmxhZGVzL2Fzc2V0LXNlbGVjdC5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLkFzc2V0cy8uL1NjcmlwdHMvYmxhZGVzL2Fzc2V0LXVwbG9hZC5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLkFzc2V0cy8uL1NjcmlwdHMvcmVzb3VyY2VzL2Fzc2V0QXBpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7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Q0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxREFBcUQsb0ZBQW9GO0FBQ3pJO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdDO0FBQ0EsMENBQTBDLHVEQUF1RDtBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7Ozs7Ozs7Ozs7O0FDL0hMO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsaUJBQWlCLDREQUE0RDtBQUM3RSx1QkFBdUIsb0RBQW9EO0FBQzNFLGVBQWUsa0RBQWtEO0FBQ2pFLHdCQUF3QiwwQkFBMEIsc0RBQXNEO0FBQ3hHLEtBQUs7QUFDTCxDQUFDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIu+7vy8vQ2FsbCB0aGlzIHRvIHJlZ2lzdGVyIG91ciBtb2R1bGUgdG8gbWFpbiBhcHBsaWNhdGlvblxyXG52YXIgbW9kdWxlVGVtcGxhdGVOYW1lID0gXCJ2aXJ0b0NvbW1lcmNlLmFzc2V0c1wiO1xyXG5cclxuaWYgKEFwcERlcGVuZGVuY2llcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBBcHBEZXBlbmRlbmNpZXMucHVzaChtb2R1bGVUZW1wbGF0ZU5hbWUpO1xyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZShtb2R1bGVUZW1wbGF0ZU5hbWUsIFtdKVxyXG4uY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCd3b3Jrc3BhY2UuYXNzZXRzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvYXNzZXRzJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICckKFBsYXRmb3JtKS9TY3JpcHRzL2NvbW1vbi90ZW1wbGF0ZXMvaG9tZS50cGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBibGFkZU5hdmlnYXRpb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmxhZGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdhc3NldExpc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwbGF0Zm9ybVdlYkFwcC5hc3NldHMuYXNzZXRMaXN0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdNb2R1bGVzLyQodmlydG9Db21tZXJjZS5Bc3NldHMpL1NjcmlwdHMvYmxhZGVzL2Fzc2V0LWxpc3QudHBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzQ2xvc2luZ0Rpc2FibGVkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5zaG93QmxhZGUoYmxhZGUpO1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0pO1xyXG59XSlcclxuLnJ1bihcclxuICBbJ3BsYXRmb3JtV2ViQXBwLm1haW5NZW51U2VydmljZScsICckc3RhdGUnLCBmdW5jdGlvbiAobWFpbk1lbnVTZXJ2aWNlLCAkc3RhdGUpIHtcclxuICAgICAgdmFyIG1lbnVJdGVtID0ge1xyXG4gICAgICAgICAgcGF0aDogJ2Jyb3dzZS9hc3NldHMnLFxyXG4gICAgICAgICAgaWNvbjogJ2ZhIGZhLWZvbGRlci1vJyxcclxuICAgICAgICAgIHRpdGxlOiAncGxhdGZvcm0ubWVudS5hc3NldHMnLFxyXG4gICAgICAgICAgcHJpb3JpdHk6IDEzMCxcclxuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24gKCkgeyAkc3RhdGUuZ28oJ3dvcmtzcGFjZS5hc3NldHMnKTsgfSxcclxuICAgICAgICAgIHBlcm1pc3Npb246ICdwbGF0Zm9ybTphc3NldDphY2Nlc3MnXHJcbiAgICAgIH07XHJcbiAgICAgIG1haW5NZW51U2VydmljZS5hZGRNZW51SXRlbShtZW51SXRlbSk7XHJcbiAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdwbGF0Zm9ybVdlYkFwcCcpXHJcbiAgICAuY29udHJvbGxlcigncGxhdGZvcm1XZWJBcHAuYXNzZXRzLmFzc2V0TGlzdENvbnRyb2xsZXInLCBbJyRzY29wZScsICckdHJhbnNsYXRlJywgJ3BsYXRmb3JtV2ViQXBwLmFzc2V0cy5hcGknLCAncGxhdGZvcm1XZWJBcHAuYmxhZGVOYXZpZ2F0aW9uU2VydmljZScsICdwbGF0Zm9ybVdlYkFwcC5kaWFsb2dTZXJ2aWNlJywgJyRzZXNzaW9uU3RvcmFnZScsICdwbGF0Zm9ybVdlYkFwcC5ibGFkZVV0aWxzJywgJ3BsYXRmb3JtV2ViQXBwLnVpR3JpZEhlbHBlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJHRyYW5zbGF0ZSwgYXNzZXRzLCBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLCBkaWFsb2dTZXJ2aWNlLCAkc3RvcmFnZSwgYmxhZGVVdGlscywgdWlHcmlkSGVscGVyKSB7XHJcbiAgICAgICAgICAgIHZhciBibGFkZSA9ICRzY29wZS5ibGFkZTtcclxuICAgICAgICAgICAgYmxhZGUudGl0bGUgPSAncGxhdGZvcm0uYmxhZGVzLmFzc2V0LWxpc3QudGl0bGUnO1xyXG4gICAgICAgICAgICBpZiAoIWJsYWRlLmN1cnJlbnRFbnRpdHkpIHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLmN1cnJlbnRFbnRpdHkgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBhc3NldHMuc2VhcmNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5d29yZDogYmxhZGUuc2VhcmNoS2V5d29yZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyVXJsOiBibGFkZS5jdXJyZW50RW50aXR5LnVybFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBhZ2VTZXR0aW5ncy50b3RhbEl0ZW1zID0gZGF0YS50b3RhbENvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goZGF0YS5yZXN1bHRzLCBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5pc0ltYWdlID0geC5jb250ZW50VHlwZSAmJiB4LmNvbnRlbnRUeXBlLnN0YXJ0c1dpdGgoJ2ltYWdlLycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHguaXNJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgubm9DYWNoZVVybCA9IHgudXJsICsgJz90PScgKyB4Lm1vZGlmaWVkRGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5saXN0RW50cmllcyA9IGRhdGEucmVzdWx0cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1NldCBuYXZpZ2F0aW9uIGJyZWFkY3J1bWJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEJyZWFkY3J1bWJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2V0RXJyb3IoJ0Vycm9yICcgKyBlcnJvci5zdGF0dXMsIGJsYWRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vQnJlYWRjcnVtYnNcclxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0QnJlYWRjcnVtYnMoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxhZGUuYnJlYWRjcnVtYnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0Nsb25lIGFycmF5IChhbmd1bGFyLmNvcHkgbGVhdmVzIHRoZSBzYW1lIHJlZmVyZW5jZSlcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYnJlYWRjcnVtYnMgPSBibGFkZS5icmVhZGNydW1icy5zbGljZSgwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9wcmV2ZW50IGR1cGxpY2F0ZSBpdGVtc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibGFkZS5jdXJyZW50RW50aXR5LnVybCAmJiBfLmFsbChicmVhZGNydW1icywgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguaWQgIT09IGJsYWRlLmN1cnJlbnRFbnRpdHkudXJsOyB9KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYnJlYWRDcnVtYiA9IGdlbmVyYXRlQnJlYWRjcnVtYihibGFkZS5jdXJyZW50RW50aXR5LnVybCwgYmxhZGUuY3VycmVudEVudGl0eS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWRjcnVtYnMucHVzaChicmVhZENydW1iKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUuYnJlYWRjcnVtYnMgPSBicmVhZGNydW1icztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUuYnJlYWRjcnVtYnMgPSBbZ2VuZXJhdGVCcmVhZGNydW1iKGJsYWRlLmN1cnJlbnRFbnRpdHkudXJsLCAnYWxsJyldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUJyZWFkY3J1bWIoaWQsIG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGU6IGJsYWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRlOiBmdW5jdGlvbiAoYnJlYWRjcnVtYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLmNsb3NlQmxhZGUoYmxhZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUuZGlzYWJsZU9wZW5BbmltYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2hvd0JsYWRlKGJsYWRlLCBibGFkZS5wYXJlbnRCbGFkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG5ld0ZvbGRlcigpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b29sdGlwID0gJHRyYW5zbGF0ZS5pbnN0YW50KCdwbGF0Zm9ybS5kaWFsb2dzLmNyZWF0ZS1mb2xkZXIudGl0bGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcHJvbXB0KHRvb2x0aXAgKyBcIlxcblxcbkVudGVyIGZvbGRlciBuYW1lOlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NldHMuY3JlYXRlRm9sZGVyKHsgbmFtZTogcmVzdWx0LCBwYXJlbnRVcmw6IGJsYWRlLmN1cnJlbnRFbnRpdHkudXJsIH0sIGJsYWRlLnJlZnJlc2gpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY29weVVybCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucHJvbXB0KFwiQ29weSB0byBjbGlwYm9hcmQ6IEN0cmwrQywgRW50ZXJcIiwgZGF0YS51cmwpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmRvd25sb2FkVXJsID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKGRhdGEudXJsLCAnX2JsYW5rJyk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyRzY29wZS5yZW5hbWUgPSBmdW5jdGlvbiAobGlzdEl0ZW0pIHtcclxuICAgICAgICAgICAgLy8gICAgcmVuYW1lKGxpc3RJdGVtKTtcclxuICAgICAgICAgICAgLy99O1xyXG5cclxuICAgICAgICAgICAgLy9mdW5jdGlvbiByZW5hbWUobGlzdEl0ZW0pIHtcclxuICAgICAgICAgICAgLy8gICAgdmFyIHJlc3VsdCA9IHByb21wdChcIkVudGVyIG5ldyBuYW1lXCIsIGxpc3RJdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICAvLyAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICBsaXN0SXRlbS5uYW1lID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaXNJdGVtc0NoZWNrZWQoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLmdyaWRBcGkgJiYgXy5hbnkoJHNjb3BlLmdyaWRBcGkuc2VsZWN0aW9uLmdldFNlbGVjdGVkUm93cygpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGVMaXN0KFtkYXRhXSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBkZWxldGVMaXN0KHNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5jbG9zZUNoaWxkcmVuQmxhZGVzKGJsYWRlLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpYWxvZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiY29uZmlybURlbGV0ZUl0ZW1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwicGxhdGZvcm0uZGlhbG9ncy5mb2xkZXJzLWRlbGV0ZS50aXRsZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcInBsYXRmb3JtLmRpYWxvZ3MuZm9sZGVycy1kZWxldGUubWVzc2FnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKHJlbW92ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbW92ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0RW50cnlJZHMgPSBfLnBsdWNrKHNlbGVjdGlvbiwgJ3VybCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0cy5yZW1vdmUoeyB1cmxzOiBsaXN0RW50cnlJZHMgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUucmVmcmVzaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7IGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2V0RXJyb3IoJ0Vycm9yICcgKyBlcnJvci5zdGF0dXMsIGJsYWRlKTsgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZGlhbG9nU2VydmljZS5zaG93Q29uZmlybWF0aW9uRGlhbG9nKGRpYWxvZyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdE5vZGUgPSBmdW5jdGlvbiAobGlzdEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0SXRlbS50eXBlID09PSAnZm9sZGVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdCbGFkZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGJsYWRlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhZGNydW1iczogYmxhZGUuYnJlYWRjcnVtYnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbnRpdHk6IGxpc3RJdGVtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlT3BlbkFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogYmxhZGUuY29udHJvbGxlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IGJsYWRlLnRlbXBsYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NpbmdEaXNhYmxlZDogYmxhZGUuaXNDbG9zaW5nRGlzYWJsZWRcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNob3dCbGFkZShuZXdCbGFkZSwgYmxhZGUucGFyZW50QmxhZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgYmxhZGUuaGVhZEljb24gPSAnZmEtZm9sZGVyLW8nO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUudG9vbGJhckNvbW1hbmRzID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMucmVmcmVzaFwiLCBpY29uOiAnZmEgZmEtcmVmcmVzaCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogYmxhZGUucmVmcmVzaCxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5uZXctZm9sZGVyXCIsIGljb246ICdmYSBmYS1mb2xkZXItbycsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogZnVuY3Rpb24gKCkgeyBuZXdGb2xkZXIoKTsgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbjogJ3BsYXRmb3JtOmFzc2V0OmNyZWF0ZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy51cGxvYWRcIiwgaWNvbjogJ2ZhIGZhLXVwbG9hZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3QmxhZGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogXCJhc3NldFVwbG9hZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEVudGl0eUlkOiBibGFkZS5jdXJyZW50RW50aXR5LnVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAncGxhdGZvcm0uYmxhZGVzLmFzc2V0LXVwbG9hZC50aXRsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncGxhdGZvcm1XZWJBcHAuYXNzZXRzLmFzc2V0VXBsb2FkQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJyQoUGxhdGZvcm0pL1NjcmlwdHMvYXBwL2Fzc2V0cy9ibGFkZXMvYXNzZXQtdXBsb2FkLnRwbC5odG1sJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNob3dCbGFkZShuZXdCbGFkZSwgYmxhZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb246ICdwbGF0Zm9ybTphc3NldDpjcmVhdGUnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgICAgICAvLyAgICBuYW1lOiBcIlJlbmFtZVwiLCBpY29uOiAnZmEgZmEtZm9udCcsXHJcbiAgICAgICAgICAgICAgICAvLyAgICBleGVjdXRlTWV0aG9kOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgcmVuYW1lKGdldEZpcnN0Q2hlY2tlZCgpKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgfSxcclxuICAgICAgICAgICAgICAgIC8vICAgIGNhbkV4ZWN1dGVNZXRob2Q6IGlzU2luZ2xlQ2hlY2tlZCxcclxuICAgICAgICAgICAgICAgIC8vICAgIHBlcm1pc3Npb246ICdwbGF0Zm9ybTphc3NldDp1cGRhdGUnXHJcbiAgICAgICAgICAgICAgICAvL30sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5kZWxldGVcIiwgaWNvbjogJ2ZhIGZhLXRyYXNoLW8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6IGZ1bmN0aW9uICgpIHsgZGVsZXRlTGlzdCgkc2NvcGUuZ3JpZEFwaS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRSb3dzKCkpOyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6IGlzSXRlbXNDaGVja2VkLFxyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb246ICdwbGF0Zm9ybTphc3NldDpkZWxldGUnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgICAgIC8vICAgIG5hbWU6IFwiQ3V0XCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICBpY29uOiAnZmEgZmEtY3V0JyxcclxuICAgICAgICAgICAgICAgIC8vICAgIGV4ZWN1dGVNZXRob2Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyAgICBjYW5FeGVjdXRlTWV0aG9kOiBpc0l0ZW1zQ2hlY2tlZCxcclxuICAgICAgICAgICAgICAgIC8vICAgIHBlcm1pc3Npb246ICdhc3NldDpkZWxldGUnXHJcbiAgICAgICAgICAgICAgICAvL30sXHJcbiAgICAgICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgICAgIC8vICAgIG5hbWU6IFwiUGFzdGVcIixcclxuICAgICAgICAgICAgICAgIC8vICAgIGljb246ICdmYSBmYS1jbGlwYm9hcmQnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgZXhlY3V0ZU1ldGhvZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIGJsYWRlLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgYXNzZXRzLm1vdmUoe1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICBmb2xkZXI6IGJsYWRlLmN1cnJlbnRFbnRpdHkudXJsLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICBsaXN0RW50cmllczogJHN0b3JhZ2UuY2F0YWxvZ0NsaXBib2FyZENvbnRlbnRcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgIGRlbGV0ZSAkc3RvcmFnZS5jYXRhbG9nQ2xpcGJvYXJkQ29udGVudDtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgYmxhZGUucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNldEVycm9yKCdFcnJvciAnICsgZXJyb3Iuc3RhdHVzLCBibGFkZSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gICAgY2FuRXhlY3V0ZU1ldGhvZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIHJldHVybiAkc3RvcmFnZS5jYXRhbG9nQ2xpcGJvYXJkQ29udGVudDtcclxuICAgICAgICAgICAgICAgIC8vICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyAgICBwZXJtaXNzaW9uOiAnYXNzZXQ6ZGVsZXRlJ1xyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAvLyB1aS1ncmlkXHJcbiAgICAgICAgICAgICRzY29wZS5zZXRHcmlkT3B0aW9ucyA9IGZ1bmN0aW9uIChncmlkT3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdWlHcmlkSGVscGVyLmluaXRpYWxpemUoJHNjb3BlLCBncmlkT3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZ3JpZEFwaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdwYWdlU2V0dGluZ3MuY3VycmVudFBhZ2UnLCBncmlkQXBpLnBhZ2luYXRpb24uc2Vlayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGJsYWRlVXRpbHMuaW5pdGlhbGl6ZVBhZ2luYXRpb24oJHNjb3BlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdwbGF0Zm9ybVdlYkFwcCcpXHJcbiAgICAuY29udHJvbGxlcigncGxhdGZvcm1XZWJBcHAuYXNzZXRzLmFzc2V0U2VsZWN0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ3BsYXRmb3JtV2ViQXBwLmFzc2V0cy5hcGknLCAncGxhdGZvcm1XZWJBcHAuYmxhZGVOYXZpZ2F0aW9uU2VydmljZScsICdwbGF0Zm9ybVdlYkFwcC5ibGFkZVV0aWxzJywgJ3BsYXRmb3JtV2ViQXBwLnVpR3JpZEhlbHBlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgYXNzZXRzQXBpLCBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLCBibGFkZVV0aWxzLCB1aUdyaWRIZWxwZXIpIHtcclxuICAgICAgICAgICAgdmFyIGJsYWRlID0gJHNjb3BlLmJsYWRlO1xyXG4gICAgICAgICAgICBibGFkZS50ZW1wbGF0ZSA9ICckKFBsYXRmb3JtKS9TY3JpcHRzL2FwcC9hc3NldHMvYmxhZGVzL2Fzc2V0LXNlbGVjdC50cGwuaHRtbCc7XHJcblxyXG4gICAgICAgICAgICBibGFkZS5oZWFkSWNvbiA9ICdmYS1mb2xkZXItbyc7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWJsYWRlLmN1cnJlbnRFbnRpdHkpIHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLmN1cnJlbnRFbnRpdHkgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYmxhZGUuZm9sZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBibGFkZS5jdXJyZW50RW50aXR5LnVybCA9ICcvJyArIGJsYWRlLmZvbGRlcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBhc3NldHNBcGkuc2VhcmNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5d29yZDogYmxhZGUuc2VhcmNoS2V5d29yZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyVXJsOiBibGFkZS5jdXJyZW50RW50aXR5LnVybFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBhZ2VTZXR0aW5ncy50b3RhbEl0ZW1zID0gZGF0YS50b3RhbENvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goZGF0YS5yZXN1bHRzLCBmdW5jdGlvbiAoeCkgeyB4LmlzSW1hZ2UgPSB4LmNvbnRlbnRUeXBlICYmIHguY29udGVudFR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJyk7IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubGlzdEVudHJpZXMgPSBkYXRhLnJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLmlzTG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9TZXQgbmF2aWdhdGlvbiBicmVhZGNydW1ic1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRCcmVhZGNydW1icygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNldEVycm9yKCdFcnJvciAnICsgZXJyb3Iuc3RhdHVzLCBibGFkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvL0JyZWFkY3J1bWJzXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldEJyZWFkY3J1bWJzKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJsYWRlLmJyZWFkY3J1bWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9DbG9uZSBhcnJheSAoYW5ndWxhci5jb3B5IGxlYXZlcyB0aGUgc2FtZSByZWZlcmVuY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJyZWFkY3J1bWJzID0gYmxhZGUuYnJlYWRjcnVtYnMuc2xpY2UoMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vcHJldmVudCBkdXBsaWNhdGUgaXRlbXNcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxhZGUuY3VycmVudEVudGl0eS51cmwgJiYgXy5hbGwoYnJlYWRjcnVtYnMsIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmlkICE9PSBibGFkZS5jdXJyZW50RW50aXR5LnVybDsgfSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJyZWFkQ3J1bWIgPSBnZW5lcmF0ZUJyZWFkY3J1bWIoYmxhZGUuY3VycmVudEVudGl0eS51cmwsIGJsYWRlLmN1cnJlbnRFbnRpdHkubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFkY3J1bWJzLnB1c2goYnJlYWRDcnVtYik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLmJyZWFkY3J1bWJzID0gYnJlYWRjcnVtYnM7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gXCJhbGxcIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxhZGUuZm9sZGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0gYmxhZGUuZm9sZGVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBibGFkZS5icmVhZGNydW1icyA9IFtnZW5lcmF0ZUJyZWFkY3J1bWIoYmxhZGUuY3VycmVudEVudGl0eS51cmwsIG5hbWUpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVCcmVhZGNydW1iKGlkLCBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlOiBibGFkZSxcclxuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0ZTogZnVuY3Rpb24gKGJyZWFkY3J1bWIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5jbG9zZUJsYWRlKGJsYWRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLmRpc2FibGVPcGVuQW5pbWF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNob3dCbGFkZShibGFkZSwgYmxhZGUucGFyZW50QmxhZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBpc0l0ZW1zQ2hlY2tlZCgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkc2NvcGUuZ3JpZEFwaSAmJiBfLmFueSgkc2NvcGUuZ3JpZEFwaS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRSb3dzKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRTZWxlY3RlZEFzc2V0cygpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkc2NvcGUuZ3JpZEFwaS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRSb3dzKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3ROb2RlID0gZnVuY3Rpb24gKGxpc3RJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdEl0ZW0udHlwZSA9PT0gJ2ZvbGRlcicpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3QmxhZGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBibGFkZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGJsYWRlLnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhZGNydW1iczogYmxhZGUuYnJlYWRjcnVtYnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbnRpdHk6IGxpc3RJdGVtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlT3BlbkFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogYmxhZGUuY29udHJvbGxlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IGJsYWRlLnRlbXBsYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NpbmdEaXNhYmxlZDogYmxhZGUuaXNDbG9zaW5nRGlzYWJsZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBibGFkZS5vblNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2hvd0JsYWRlKG5ld0JsYWRlLCBibGFkZS5wYXJlbnRCbGFkZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBibGFkZS50b29sYmFyQ29tbWFuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3BsYXRmb3JtLmNvbW1hbmRzLmNvbmZpcm0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdmYSBmYS1jaGVjaycsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogZnVuY3Rpb24gKCkgeyAkc2NvcGUuc2F2ZUNoYW5nZXMoKTsgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpc0l0ZW1zQ2hlY2tlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zYXZlQ2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChibGFkZS5vblNlbGVjdClcclxuICAgICAgICAgICAgICAgICAgICBibGFkZS5vblNlbGVjdChnZXRTZWxlY3RlZEFzc2V0cygpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYmxhZGVDbG9zZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gdWktZ3JpZFxyXG4gICAgICAgICAgICAkc2NvcGUuc2V0R3JpZE9wdGlvbnMgPSBmdW5jdGlvbiAoZ3JpZE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHVpR3JpZEhlbHBlci5pbml0aWFsaXplKCRzY29wZSwgZ3JpZE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGdyaWRBcGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgncGFnZVNldHRpbmdzLmN1cnJlbnRQYWdlJywgZ3JpZEFwaS5wYWdpbmF0aW9uLnNlZWspO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBibGFkZVV0aWxzLmluaXRpYWxpemVQYWdpbmF0aW9uKCRzY29wZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBibGFkZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncGxhdGZvcm1XZWJBcHAnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ3BsYXRmb3JtV2ViQXBwLmFzc2V0cy5hc3NldFVwbG9hZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdwbGF0Zm9ybVdlYkFwcC5hc3NldHMuYXBpJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLCAnRmlsZVVwbG9hZGVyJywgJ3BsYXRmb3JtV2ViQXBwLmRpYWxvZ1NlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBhc3NldHMsIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UsIEZpbGVVcGxvYWRlciwgZGlhbG9nU2VydmljZSkge1xyXG4gICAgICAgIHZhciBibGFkZSA9ICRzY29wZS5ibGFkZTtcclxuICAgICAgICB2YXIgY3VycmVudEVudGl0aWVzO1xyXG4gICAgICAgIGlmICghYmxhZGUuZmlsZVVwbG9hZE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgYmxhZGUuZmlsZVVwbG9hZE9wdGlvbnMgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGZvbGRlclVybCA9IGJsYWRlLmN1cnJlbnRFbnRpdHlJZCB8fCBcIlwiO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgICAgICBpZiAoISRzY29wZS51cGxvYWRlcikge1xyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSB1cGxvYWRlclxyXG4gICAgICAgICAgICAgICAgdmFyIHVwbG9hZGVyID0gJHNjb3BlLnVwbG9hZGVyID0gbmV3IEZpbGVVcGxvYWRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdhcGkvcGxhdGZvcm0vYXNzZXRzP2ZvbGRlclVybD0nICsgZm9sZGVyVXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vYXV0b1VwbG9hZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVBZnRlclVwbG9hZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJsYWRlLmZpbGVVcGxvYWRPcHRpb25zLmZpbHRlckNhbGxiYWNrICYmIGFuZ3VsYXIuaXNGdW5jdGlvbihibGFkZS5maWxlVXBsb2FkT3B0aW9ucy5maWx0ZXJDYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRlci5maWx0ZXJzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY3VzdG9tRmlsZUZpbHRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuOiBibGFkZS5maWxlVXBsb2FkT3B0aW9ucy5maWx0ZXJDYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChibGFkZS5maWxlVXBsb2FkT3B0aW9ucy5hY2NlcHQgJiYgYmxhZGUuZmlsZVVwbG9hZE9wdGlvbnMuYWNjZXB0LmNvbnRhaW5zKCdpbWFnZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkZXIuZmlsdGVycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2ltYWdlRmlsdGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9ICd8JyArIGl0ZW0udHlwZS5zbGljZShpdGVtLnR5cGUubGFzdEluZGV4T2YoJy8nKSArIDEpICsgJ3wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd8anBnfHBuZ3xqcGVnfGJtcHxnaWZ8c3ZnK3htbHwnLmluZGV4T2YodHlwZSkgIT09IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXBsb2FkZXIub25BZnRlckFkZGluZ0FsbCA9IGZ1bmN0aW9uIChhZGRlZEl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvbGRlclVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibGFkZS5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibGFkZS51cGxvYWRDb21wbGV0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5zZXRFcnJvcihudWxsLCBibGFkZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgYXNzZXQgZHVwbGljYXRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NldHMuc2VhcmNoKHsgZm9sZGVyVXJsOiBmb2xkZXJVcmwgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEVudGl0aWVzID0gZGF0YS5yZXN1bHRzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goYWRkZWRJdGVtcywgcHJvbXB0VXNlckRlY2lzaW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRlci51cGxvYWRBbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2V0RXJyb3IoJ0Vycm9yICcgKyBlcnJvci5zdGF0dXMsIGJsYWRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dTZXJ2aWNlLnNob3dOb3RpZmljYXRpb25EaWFsb2coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiZXJyb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInBsYXRmb3JtLmRpYWxvZ3MuYXNzZXQtdXBsb2FkLWVycm9yLnRpdGxlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcInBsYXRmb3JtLmRpYWxvZ3MuYXNzZXQtdXBsb2FkLWVycm9yLm1lc3NhZ2VcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHVwbG9hZGVyLm9uRXJyb3JJdGVtID0gZnVuY3Rpb24gKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNldEVycm9yKGl0ZW0uX2ZpbGUubmFtZSArICcgZmFpbGVkOiAnICsgKHJlc3BvbnNlLm1lc3NhZ2UgPyByZXNwb25zZS5tZXNzYWdlIDogc3RhdHVzKSwgYmxhZGUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB1cGxvYWRlci5vbkNvbXBsZXRlQWxsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hQYXJlbnRCbGFkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLnVwbG9hZENvbXBsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHVwbG9hZGVyLm9uU3VjY2Vzc0l0ZW0gPSBmdW5jdGlvbiAoZmlsZUl0ZW0sIGltYWdlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibGFkZS5vblVwbG9hZENvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLm9uVXBsb2FkQ29tcGxldGUoaW1hZ2VzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZWZyZXNoUGFyZW50QmxhZGUoKSB7XHJcbiAgICAgICAgICAgIGlmIChibGFkZS5wYXJlbnRCbGFkZS5yZWZyZXNoICYmICFibGFkZS5maWxlVXBsb2FkT3B0aW9ucy5zdXBwcmVzc1BhcmVudFJlZnJlc2gpIHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLnBhcmVudEJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJvbXB0VXNlckRlY2lzaW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKF8uYW55KGN1cnJlbnRFbnRpdGllcywgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHgudHlwZSA9PT0gJ2Jsb2InICYmIHgubmFtZS50b0xvd2VyQ2FzZSgpID09PSBpdGVtLmZpbGUubmFtZS50b0xvd2VyQ2FzZSgpIH0pKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcHJvbXB0KFwiRmlsZSBcXFwiXCIgKyBpdGVtLmZpbGUubmFtZSArIFwiXFxcIiBhbHJlYWR5IGV4aXN0cyFcXG4tIENoYW5nZSBuYW1lIC8gcHJlc3MgW09LXSB0byBvdmVyd3JpdGUuXFxuLSBQcmVzcyBbQ2FuY2VsXSB0byBza2lwIHRoaXMgZmlsZS5cXG5GaWxlIG5hbWU6XCIsIGl0ZW0uZmlsZS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9tcHRVc2VyRGVjaXNpb24oaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCAhPT0gaXRlbS5maWxlLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmZpbGUubmFtZSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICBwcm9tcHRVc2VyRGVjaXNpb24oaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udXJsICs9IFwiJmZvcmNlRmlsZU92ZXJ3cml0ZT10cnVlXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5hZGRJbWFnZUZyb21VcmwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChibGFkZS5uZXdFeHRlcm5hbEltYWdlVXJsKSB7XHJcbiAgICAgICAgICAgICAgICBibGFkZS51cGxvYWRDb21wbGV0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmIChmb2xkZXJVcmwpIHsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0cy51cGxvYWRGcm9tVXJsKHsgZm9sZGVyVXJsOiBmb2xkZXJVcmwsIHVybDogYmxhZGUubmV3RXh0ZXJuYWxJbWFnZVVybCB9LCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoUGFyZW50QmxhZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsYWRlLm9uVXBsb2FkQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLm9uVXBsb2FkQ29tcGxldGUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUubmV3RXh0ZXJuYWxJbWFnZVVybCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUudXBsb2FkQ29tcGxldGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlhbG9nU2VydmljZS5zaG93Tm90aWZpY2F0aW9uRGlhbG9nKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiZXJyb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwicGxhdGZvcm0uZGlhbG9ncy5hc3NldC11cGxvYWQtZXJyb3IudGl0bGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJwbGF0Zm9ybS5kaWFsb2dzLmFzc2V0LXVwbG9hZC1lcnJvci5tZXNzYWdlXCJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGJsYWRlLmhlYWRJY29uID0gJ2ZhLWZpbGUtbyc7XHJcblxyXG4gICAgICAgIGluaXRpYWxpemUoKTtcclxuICAgICAgICBibGFkZS5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3BsYXRmb3JtV2ViQXBwJylcclxuLmZhY3RvcnkoJ3BsYXRmb3JtV2ViQXBwLmFzc2V0cy5hcGknLCBbJyRyZXNvdXJjZScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiAkcmVzb3VyY2UoJ2FwaS9wbGF0Zm9ybS9hc3NldHMnLCB7fSwge1xyXG4gICAgICAgIHNlYXJjaDogeyBtZXRob2Q6ICdHRVQnLCB1cmw6ICdhcGkvcGxhdGZvcm0vYXNzZXRzJywgaXNBcnJheTogZmFsc2UgfSxcclxuICAgICAgICBjcmVhdGVGb2xkZXI6IHsgbWV0aG9kOiAnUE9TVCcsIHVybDogJ2FwaS9wbGF0Zm9ybS9hc3NldHMvZm9sZGVyJyB9LFxyXG4gICAgICAgIG1vdmU6IHsgbWV0aG9kOiAnUE9TVCcsIHVybDogJ2FwaS9wbGF0Zm9ybS9hc3NldHMvbW92ZScgfSxcclxuICAgICAgICB1cGxvYWRGcm9tVXJsOiB7IG1ldGhvZDogJ1BPU1QnLCBwYXJhbXM6IHsgdXJsOiAnQHVybCcsIGZvbGRlclVybDogJ0Bmb2xkZXJVcmwnLCBuYW1lOiAnQG5hbWUnIH0sIGlzQXJyYXk6IHRydWUgfVxyXG4gICAgfSk7XHJcbn1dKTtcclxuXHJcbiJdLCJzb3VyY2VSb290IjoiIn0=