'use strict';

//Purchases service used for communicating with the purchases REST endpoints
angular.module('purchases').factory('Purchases', ['$resource',
  function ($resource) {
    return $resource('api/purchases/:purchaseId', {
      purchaseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
