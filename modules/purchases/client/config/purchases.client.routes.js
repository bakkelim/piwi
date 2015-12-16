'use strict';

// Setting up route
angular.module('purchases').config(['$stateProvider',
  function ($stateProvider) {
    // Purchases state routing
    $stateProvider
      .state('purchases', {
        abstract: true,
        url: '/purchases',
        template: '<ui-view/>'
      })
      .state('purchases.list', {
        url: '',
        templateUrl: 'modules/purchases/client/views/list-purchases.client.view.html',
         data: {
          roles: ['admin', 'user']
        }
      })
      .state('purchases.create', {
        url: '/create',
        templateUrl: 'modules/purchases/client/views/create-purchase.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('purchases.view', {
        url: '/:purchaseId',
        templateUrl: 'modules/purchases/client/views/view-purchase.client.view.html',
         data: {
          roles: ['admin', 'user']
        }
      })
      .state('purchases.edit', {
        url: '/:purchaseId/edit',
        templateUrl: 'modules/purchases/client/views/edit-purchase.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
