(function () {
    'use strict';

    angular.module('purchases')
        .directive('setSssStatus', setSssStatus);

    function setSssStatus() {
        return {
            restrict: 'A',
            scope: {
                expires: "="
            },
            link: function(scope, element, attrs, controller) {                      
                var today = new Date().getTime();              
                
                var expireDate = new Date(scope.expires).getTime();
                 
                var tmpWarningDate = new Date(scope.expires);      
                tmpWarningDate.setMonth(tmpWarningDate.getMonth() - 3);
                
                var warningDate = new Date(tmpWarningDate.toString()).getTime(); 
           
                var dangerClass = 'list-group-item-danger';
                var warningClass = 'list-group-item-warning';
                var successClass = 'list-group-item-success';
                
                if(attrs.setSssStatus === 'table'){
                    dangerClass = 'danger';
                    warningClass = 'warning';
                    successClass = 'success';
                }
           
                if (expireDate < today) {
                    element.addClass(dangerClass);                        
                } else if(warningDate < today){
                    element.addClass(warningClass);   
                } else {
                    element.addClass(successClass);
                }                  
            }
        };
    }
}());