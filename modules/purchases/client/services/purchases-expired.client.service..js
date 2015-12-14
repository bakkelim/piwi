'use strict';

//Purchases service used for communicating with the purchases REST endpoints
angular.module('purchases').factory('PurchasesExpired', ['$resource',
  function ($resource) {
    return $resource('api/purchases-expired/', {
      purchaseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
