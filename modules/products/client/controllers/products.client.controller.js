'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', 'Users', 'ProductPurchases',
  function ($scope, $stateParams, $location, Authentication, Products, Users, ProductPurchases) {
    $scope.authentication = Authentication;
    
    $scope.today = function() {
      return new Date();
    };
    
    //Datepicker for create page
    $scope.openedCreate = false;
    $scope.openCreate = function ($event) {
        $scope.openedCreate = true;
    };

    //Add version
    $scope.addVersion= function() {      
      var newVersion = {
          label: '',
          released: new Date()
      };
     
      $scope.product.versions.push(newVersion);
    };
    
    //Remove version
    $scope.removeVersion = function(version) {
      var idx = $scope.product.versions.indexOf(version);
      
      if(idx > -1) {
        $scope.product.versions.splice(idx, 1);
      }      
    };
 
    // Create new product
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'productForm');

        return false;
      }

      // Create new product object
      var product = new Products({
        title: this.title,
        code: this.code,
        price: this.price,
        annualFee: this.annualFee,
        owner: this.selectedUser._id,
        versions: [{ label: this.version, released: this.released }],
        description: this.description
      });

      // Redirect after save
      product.$save(function (response) {
        $location.path('products/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.code = '';
        $scope.price = 0;
        $scope.annualFee = 0;
        $scope.owner = {};
        $scope.versions = [];
        $scope.description = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing product
    $scope.remove = function (product) {
      if (product) {
        product.$remove();

        for (var i in $scope.products) {
          if ($scope.products[i] === product) {
            $scope.products.splice(i, 1);
          }
        }
      } else {
        $scope.product.$remove(function () {
          $location.path('products');
        });
      }
    };

    // Update existing product
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'productForm');

        return false;
      }

      var product = $scope.product;
      product.$update(function () {
        $location.path('products/' + product._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of products
    $scope.find = function () {
      $scope.products = Products.query();
    };

    // Find existing product
    $scope.findOne = function () {
      $scope.product = Products.get({
        productId: $stateParams.productId        
      });
    };  
    
    // Find a list of products
    $scope.findUsers = function () {
      $scope.users = Users.query(function () {
         $scope.selectedUser = $scope.users[0];        
      });     
    };     
            
    $scope.findPurchases = function () {
      $scope.purchases = ProductPurchases.query({propurId: $stateParams.productId});
    };
  }
]);
