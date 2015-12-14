'use strict';

// Setting up route
angular.module('companies').config(['$stateProvider',
  function ($stateProvider) {
    // Companies state routing
    $stateProvider
      .state('companies', {
        abstract: true,
        url: '/companies',
        template: '<ui-view/>'
      })
      .state('companies.list', {
        url: '',
        templateUrl: 'modules/companies/client/views/list-companies.client.view.html'
      })
      .state('companies.create', {
        url: '/create',
        templateUrl: 'modules/companies/client/views/create-company.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('companies.view', {
        url: '/:companyId',
        templateUrl: 'modules/companies/client/views/view-company.client.view.html'
      })
      .state('companies.edit', {
        url: '/:companyId/edit',
        templateUrl: 'modules/companies/client/views/edit-company.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
