'use strict';

// Reports controller
angular.module('reports').controller('ReportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Purchases',
  function ($scope, $stateParams, $location, Authentication, Purchases) {
    $scope.authentication = Authentication;
    
    $scope.reportByCompany = false;
    
    //Calc flag:
    // 1: Initial price only
    // 2: Annual fees only
    // 3: Initial price and annual fees
    $scope.getUberTotal = function(reports, calcFlag){
      var total = 0;
      
      reports.forEach(function(report) {
        report.content.forEach(function(item) {
          if(calcFlag === 1 || calcFlag === 3) {
            total += item.price;
          }
      
          if(calcFlag === 2 || calcFlag === 3){
            item.annualFees.forEach(function(annual) {
              total += annual.fee;
            }, this);
          }        
        }, this);
        
      }, this);   
         
      return total;
    };
    
    //Calc flag:
    // 1: Initial price only
    // 2: Annual fees only
    // 3: Initial price and annual fees
    $scope.getTotal = function(report, calcFlag){
      var total = 0;
           
      report.content.forEach(function(item) {
        if(calcFlag === 1 || calcFlag === 3) {
          total += item.price;
        }
    
        if(calcFlag === 2 || calcFlag === 3){
          item.annualFees.forEach(function(annual) {
            total += annual.fee;
          }, this);
        }
        
      }, this);
      
      return total;
    };
    
    //Calc flag:
    // 1: Initial price only
    // 2: Annual fees only
    // 3: Initial price and annual fees
    $scope.getSubTotal = function(item, calcFlag){
      var total = 0;
           
      if(calcFlag === 1 || calcFlag === 3) {
        total += item.price;
      }
  
      if(calcFlag === 2 || calcFlag === 3){
        item.annualFees.forEach(function(annual) {
          total += annual.fee;
        }, this);
      }
      
      return total;
    };
    
    $scope.changeReport = function () {
      $scope.reportByCompany = !$scope.reportByCompany;
      
      if($scope.reportByCompany)  {          
        $scope.reports = _.chain($scope.purchases)
        .sortBy(function (purchase) {
            return purchase.company.name;
        })
        .groupBy(function (purchase) {
            return purchase.company.name;
        })
        .pairs()
        .map(function (purchase) {
            return { 
              header: purchase[0], 
              content: purchase[1]
              };
        })
        .value();
      } 
      else {
        $scope.reports = _.chain($scope.purchases)
        .sortBy(function (purchase) {
            return purchase.product.title;
        })
        .groupBy(function (purchase) {
            return purchase.product.title;
        })
        .pairs()
        .map(function (purchase) {
            return { 
              header: purchase[0], 
              content: purchase[1]
              };
        })
        .value();          
      }              
        
    
    };
    
    // Find a list of Reports
    $scope.find = function () {
      $scope.purchases = Purchases.query(function () {                       
        $scope.reports = _.chain($scope.purchases)
        .sortBy(function (purchase) {
            return purchase.product.title;
        })
        .groupBy(function (purchase) {
            return purchase.product.title;
        })
        .pairs()
        .map(function (purchase) {
            return { 
              header: purchase[0], 
              content: purchase[1]
              };
        })
        .value();
      });
    };

    // Find existing Purchase
    $scope.findOne = function () {
      $scope.purchase = Purchases.get({
        purchaseId: $stateParams.purchaseId
      });
    };
  }
]);
