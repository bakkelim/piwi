'use strict';

// Purchases controller
angular.module('purchases').controller('PurchasesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Purchases', 'Products', 'Companies',
  function ($scope, $stateParams, $location, Authentication, Purchases, Products, Companies) {
    $scope.authentication = Authentication;

    $scope.today = function() {
      return new Date();
    };

    $scope.onSelected = function (selectedItem) {
      $scope.price = selectedItem.price;
      $scope.annualFee =  selectedItem.price * 0.2;  
    };
    
    //Datepicker for create page
    $scope.openedCreate = false;
    $scope.openCreate = function ($event) {
        $scope.openedCreate = true;
    };
    
    //Add AnnualFee
    $scope.addAnnualFee = function() {      
      var newAnnualFee = {
          fee: $scope.selectedProduct.price * 0.2,
          purchased: new Date()
      };

      $scope.purchase.annualFees.push(newAnnualFee);
    };
    
    //Remove AnnualFee
    $scope.removeAnnualFee = function(annualFee) {
      var idx = $scope.purchase.annualFees.indexOf(annualFee);
      
      if(idx > -1) {
        $scope.purchase.annualFees.splice(idx, 1);
      }      
    };
    
    // Create new Purchase
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'purchaseForm');

        return false;
      }
      
      var expireDate = new Date(this.purchased);
        expireDate.setFullYear(expireDate.getFullYear() + 1);

      // Create new Purchase object
      var purchase = new Purchases({
        product: this.selectedProduct._id,
        company: this.selectedCompany._id,
        price: this.price,
        annualFees: [{ fee: this.annualFee, purchased: this.purchased, expires: expireDate }],
        description: this.description
      });

      // Redirect after save
      purchase.$save(function (response) {
        $location.path('purchases/' + response._id);

        // Clear form fields
        $scope.product = {};
        $scope.company = {};
        $scope.price = 0;
        $scope.annualFees = [];
        $scope.description = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Purchase
    $scope.remove = function (purchase) {
      if (purchase) {
        purchase.$remove();

        for (var i in $scope.purchases) {
          if ($scope.purchases[i] === purchase) {
            $scope.purchases.splice(i, 1);
          }
        }
      } else {
        $scope.purchase.$remove(function () {
          $location.path('purchases');
        });
      }
    };

    // Update existing Purchase
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'purchaseForm');

        return false;
      }

      var purchase = $scope.purchase;

      purchase.annualFees.forEach(function(element) {
        var expireDate = new Date(element.purchased);
        expireDate.setFullYear(expireDate.getFullYear() + 1);
        element.expires = expireDate;
      }, this);

      purchase.$update(function () {
        $location.path('purchases/' + purchase._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Purchases
    $scope.find = function () {
      $scope.purchases = Purchases.query();
    };

    // Find existing Purchase
    $scope.findOne = function () {
      $scope.purchase = Purchases.get({
        purchaseId: $stateParams.purchaseId
      });
    };
    
    // Find all of products
    $scope.findProducts = function () {
      $scope.products = Products.query(function () {
         $scope.selectedProduct = $scope.products[0]; 
         $scope.price =  $scope.selectedProduct.price;    
         $scope.annualFee =  $scope.selectedProduct.price * 0.2;           
      });     
    }; 
    
    // Find all of companies
    $scope.findCompanies = function () {
      $scope.companies = Companies.query(function () {
         $scope.selectedCompany = $scope.companies[0];                 
      });     
    }; 
  }
]);
