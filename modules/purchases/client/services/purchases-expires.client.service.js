'use strict';

//Purchases service used for communicating with the purchases REST endpoints
angular.module('purchases').factory('PurchasesExpires', ['$resource',
  function ($resource) {
    return $resource('api/purchases-expires/', {
      purchaseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
