'use strict';

//Purchases service used for communicating with the purchases REST endpoints
angular.module('products').factory('ProductPurchases', ['$resource',
  function ($resource) {
    return $resource('api/product-purchases/:propurId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
