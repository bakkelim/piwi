'use strict';

// Configuring the products module
angular.module('products').run(['Menus',
  function (Menus) {
    // Add the products dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Products',
      state: 'products',
      type: 'dropdown',
      roles: ['admin','user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'List Products',
      state: 'products.list',
      roles: ['admin','user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create Products',
      state: 'products.create',
      roles: ['admin']
    });
  }
]);
