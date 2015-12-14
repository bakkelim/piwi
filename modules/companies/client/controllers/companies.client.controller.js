'use strict';

// Companies controller
angular.module('companies').controller('CompaniesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Companies', 'CompanyPurchases',
  function ($scope, $stateParams, $location, Authentication, Companies, CompanyPurchases) {
    $scope.authentication = Authentication;

    // Create new company
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'companyForm');

        return false;
      }

      // Create new company object
      var company = new Companies({
        name: this.name,
        description: this.description
      });

      // Redirect after save
      company.$save(function (response) {
        $location.path('companies/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.description = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing company
    $scope.remove = function (company) {
      if (company) {
        company.$remove();

        for (var i in $scope.companies) {
          if ($scope.companies[i] === company) {
            $scope.companies.splice(i, 1);
          }
        }
      } else {
        $scope.company.$remove(function () {
          $location.path('companies');
        });
      }
    };

    // Update existing company
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'companyForm');

        return false;
      }

      var company = $scope.company;

      company.$update(function () {
        $location.path('companies/' + company._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of companies
    $scope.find = function () {
      $scope.companies = Companies.query();
    };

    // Find existing company
    $scope.findOne = function () {
      $scope.company = Companies.get({
        companyId: $stateParams.companyId
      });
    };
        
    $scope.findPurchases = function () {
      $scope.purchases = CompanyPurchases.query({compurId: $stateParams.companyId});
    };
  }
]);
