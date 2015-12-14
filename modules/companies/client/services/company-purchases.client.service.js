'use strict';

//Purchases service used for communicating with the purchases REST endpoints
angular.module('companies').factory('CompanyPurchases', ['$resource',
  function ($resource) {
    return $resource('api/company-purchases/:compurId', {
      companyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
