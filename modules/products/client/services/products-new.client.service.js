'use strict';

//products service used for communicating with the products REST endpoints
angular.module('products').factory('ProductsNew', ['$resource',
  function ($resource) {
    return $resource('api/products-new/', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
