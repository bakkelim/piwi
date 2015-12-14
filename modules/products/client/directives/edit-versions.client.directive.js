(function () {
    'use strict';

    angular.module('products')
        .directive('editVersions', editVersions);

    function editVersions() {
        return {
            restrict: 'E',
            scope: {
                version: "=",
                notifyParent: '&removemethod',
                index: "="
            },
            bindToController: true,
            templateUrl: 'modules/products/client/views/edit-product-version.client.view.html',
            controllerAs: 'vm',
            controller: function () {               
                var vm = this;
                vm.version.released = new Date(vm.version.released);
                vm.remove = remove;
                            
                vm.opened = false;
                vm.open = openDatePicker;

                //////////////////////////////////////
                
                function remove() {
                    vm.notifyParent();
                }
                
                function openDatePicker($event) {
                     vm.opened = true;
                }
            }
        };
    }
}());