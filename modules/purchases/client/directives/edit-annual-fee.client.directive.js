(function () {
    'use strict';

    angular.module('purchases')
        .directive('editAnnualFee', editAnnualFee);

    function editAnnualFee() {
        return {
            restrict: 'E',
            scope: {
                annualFee: "=",
                notifyParent: '&removemethod',
                index: "="
            },
            bindToController: true,
            templateUrl: 'modules/purchases/client/views/edit-annual-fee.client.view.html',
            controllerAs: 'vm',
            controller: function () {               
                var vm = this;
                vm.annualFee.purchased = new Date(vm.annualFee.purchased);
                                
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