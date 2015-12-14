'use strict';

//companies service used for communicating with the companies REST endpoints
angular.module('companies').factory('Companies', ['$resource',
  function ($resource) {
    return $resource('api/companies/:companyId', {
      companyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
