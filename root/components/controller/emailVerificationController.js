var app = angular.module('routerApp.emailVerificationController', ['toaster']);

app.controller('emailVerificationCtrl', function ($scope, $stateParams, $location, Service, $state, $rootScope, $window, toaster) {


    var urlData = window.location.href.toString().split('?')[1].split('&')

    var data = [];

    var obj = {}

    $scope.sucess=false;

    angular.forEach(urlData, function (element) {
        var splitData = element.split('=')
        $scope.split = splitData[1];
        $scope.key = splitData[0];
        obj[splitData[0]] = splitData[1];

    }, this);


    if ($scope.key == "emailId") {
        $scope.textshow="Welcome To Wellness Email Verifications"
        $scope.myValue = false;
        Service.emailVerification(obj).then(function (response) {
            $scope.message = response.data;
            console.log( response.data);
              if (response.status == 200) {
                $scope.sucess=true;
                $scope.message = response.data;
                toaster.success(response.data.message);
                $scope.myValue = true;
                setTimeout(function(){
                    $state.go('login');
                    },2000)
               

            }
            if (response.status == 206) {
                $scope.sucess=true;
                $scope.message = response.data;
                toaster.error(response.data.message);
                $scope.myValue = true;
                setTimeout(function(){
                    $state.go('login');
                    },2000)

            }

        }, function (error) {
            if (error.status == 409) {
                $scope.message = error.data.message;
                toaster.error(error.data.message);


            }
            else {
                $scope.message = error.data.message;
                toaster.error(error.data.message);

            }
        });
    } else {
        $scope.textshow="Wellness Coin Token Transfer Approval" 
        $scope.myValue = false;
        Service.cointransferadmin(obj).then(function (response) {
			console.log("responsedata",response.data);
            $scope.message = response.data;
            if (response.status == 200) {
                $scope.sucess=true;
                $scope.message = response.data;
                toaster.success(response.data.message);
                $scope.myValue = true;
                setTimeout(function(){
                    $state.go('login');
                    },3000)

            }
            if (response.status == 206) {
                $scope.message = response.data;
                toaster.error(response.data.message);
                $scope.myValue = true;
                setTimeout(function(){
                    $state.go('login');
                    },3000)

            }

        }, function (error) {
            if (error.status == 409) {
                $scope.message = error.data.message;
                toaster.error(error.data.message);


            }
            else {
                $scope.message = error.data.message;
                toaster.error(error.data.message);

            }
        });
    }

   


})