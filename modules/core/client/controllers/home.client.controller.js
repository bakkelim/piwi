'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ProductsNew', 'PurchasesExpired', 'PurchasesExpires',
  function ($scope, Authentication, ProductsNew, PurchasesExpired, PurchasesExpires) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    console.log($scope.authentication);
    // Find a list of products
    $scope.findProducts = function () {
      if($scope.authentication.user)
        $scope.newProducts = ProductsNew.query();
    };
    
    $scope.expiredPurchases = function () {
      if($scope.authentication.user)
        $scope.expired = PurchasesExpired.query();
    };
    
    $scope.expiresPurchases = function () {
      if($scope.authentication.user)
        $scope.expires = PurchasesExpires.query();
    };
  }
]);
