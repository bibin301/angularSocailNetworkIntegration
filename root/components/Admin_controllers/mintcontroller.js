var app = angular.module('routerApp.mintcontroller', ['toaster']);
app.controller('mintctrlr', function ($scope, $rootScope, $state, $modalInstance, toaster) {
    $scope.mint = function (mint) {
        var data = {
            toaddress: mint.toaddress,
            amount: mint.amount,
            sessionid: mint.sessionid
        }
        $modalInstance.close(data);
    }

    $scope.close = function () {
        $modalInstance.close();
    }

    $scope.burn = function (amount) {
        $modalInstance.close(amount);

    }

    
    

})