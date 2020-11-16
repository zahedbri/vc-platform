//Call this to register our module to main application
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