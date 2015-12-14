'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ProductsNew', 'PurchasesExpired', 'PurchasesExpires',
  function ($scope, Authentication, ProductsNew, PurchasesExpired, PurchasesExpires) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    
    // Find a list of products
    $scope.findProducts = function () {
      $scope.newProducts = ProductsNew.query();
    };
    
    $scope.expiredPurchases = function () {
      $scope.expired = PurchasesExpired.query();
    };
    
    $scope.expiresPurchases = function () {
      $scope.expires = PurchasesExpires.query();
    };
  }
]);
