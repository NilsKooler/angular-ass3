(function() {
  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePathURL', 'https://davids-restaurant.herokuapp.com/menu_items.json')
    .directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
    ctrl.searchTerm = '';
    ctrl.searchMenu = function (searchTerm) {
      if (searchTerm === '') {
        ctrl.menuItems = [];
        return;
      }
      MenuSearchService.getMatchedMenuItems(searchTerm)
        .then(function (foundItems) {
          ctrl.menuItems = foundItems;
        });
    };
    ctrl.dontWantThisOne = function (index) {
      ctrl.menuItems.splice(index, 1);
    };
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePathURL' ];
  function MenuSearchService($http, ApiBasePathURL) {
    var srvc = this;
    srvc.getMatchedMenuItems = function (searchTerm) {
      return $http({url: ApiBasePathURL })
        .then(function (result) {
          var dishes = result.data.menu_items;
          return dishes.filter(function (dish) { return dish.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1; });
        });
    };
  }

  function FoundItemsDirective() {
    var ddo = {
      restrict: 'E',
      scope: {
        foundItems: '<',
        onRemove: '&'
      },
      templateUrl: 'templates/found-items-template.html',
      controller: FoundItemsDirectiveController,
      bindToController: true,
      controllerAs: 'dishesFound'
    };
    return ddo;
  }

  function FoundItemsDirectiveController() {
    var dishesFound = this;
    dishesFound.dontWantThisOne = function (index) { dishesFound.onRemove({index: index});};
    dishesFound.noDishes = function () { return dishesFound.foundItems && dishesFound.foundItems.length === 0;
    };
  }
})();