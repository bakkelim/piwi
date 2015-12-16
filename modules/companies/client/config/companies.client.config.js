'use strict';

// Configuring the companies module
angular.module('companies').run(['Menus',
  function (Menus) {
    // Add the companies dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Companies',
      state: 'companies',
      type: 'dropdown',
      roles: ['admin','user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'companies', {
      title: 'List Companies',
      state: 'companies.list',
      roles: ['admin','user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'companies', {
      title: 'Create Companies',
      state: 'companies.create',
      roles: ['admin']
    });
  }
]);
