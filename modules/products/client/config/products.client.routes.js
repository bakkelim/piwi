'use strict';

// Setting up route
angular.module('products').config(['$stateProvider',
  function ($stateProvider) {
    // Products state routing
    $stateProvider
      .state('products', {
        abstract: true,
        url: '/products',
        template: '<ui-view/>'
      })
      .state('products.list', {
        url: '',
        templateUrl: 'modules/products/client/views/list-products.client.view.html',
         data: {
          roles: ['admin', 'user']
        }
      })
      .state('products.create', {
        url: '/create',
        templateUrl: 'modules/products/client/views/create-product.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('products.view', {
        url: '/:productId',
        templateUrl: 'modules/products/client/views/view-product.client.view.html',
         data: {
          roles: ['admin', 'user']
        }
      })
      .state('products.edit', {
        url: '/:productId/edit',
        templateUrl: 'modules/products/client/views/edit-product.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
