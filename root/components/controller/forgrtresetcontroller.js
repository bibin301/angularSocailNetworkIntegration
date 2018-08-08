
var app = angular.module('routerApp.forgrtresetcontroller', ['toaster']);
app.controller('forgotresetctrl', function ($scope, $stateParams, $modal, Service, $window, $state, $http, $rootScope, toaster) {

    $scope.myValue = true;
    $scope.emailId = "";
    $scope.validateEmail = function () {
        $scope.value = "true";

    };

    var url = window.location.href.toString().split('?')[1];

    if (url) {
        var urlData = window.location.href.toString().split('?')[1].split('&')

        var data = [];

        var obj = {}

        $scope.sucess = false;

        angular.forEach(urlData, function (element) {
            var splitData = element.split('=')
            $scope.split = splitData[1];
            $scope.key = splitData[0];
            obj[splitData[0]] = splitData[1];


        }, this);
        $scope.emailId = obj.emailId;


    }
    $scope.reset = function () {

        if ($scope.newpassword == "" || $scope.confirmpassword == "" || $scope.newpassword == undefined || $scope.confirmpassword == undefined) {
           // toaster.error("please fill all the fields");
            return;

        }
        else {

            var data = {
                "newPassword": $scope.newpassword,
                "confirmPassword": $scope.confirmpassword,
                "emailId": $scope.emailId
            }
            if (data.newPassword == data.confirmPassword) {
                $scope.myValue = false;
                Service.forgretresetpassword(data).then(function (response) {
                    $scope.message = response.data;

                    if (response.data.status == "Success") {
                        $scope.myValue = true;
                        toaster.success(response.data.message);
                        $state.go('login');

                    }
                    else {
                        $scope.myValue = true;
                        toaster.error(response.data.message);
                    }


                }, function (error) {
                    $scope.myValue = true;
                    toaster.error(response.data.message);
                });

            }
            else {
                toaster.error("New and Confirm Password should  be same");
            }

        }
    }

})




//      $scope.open = function () {
//         var modalInstance = $modal.open({
//              templateUrl: 'root/views/user/ResetPopupPassword.html',
//              controller: 'resetctrlr'

//         });

//         modalInstance.result.then(function (secureKey) { 
//             if (secureKey) {
//                 var Oldpassword = secureKey.password;
//                 var NewPassword = secureKey.oldpassword;
//                 var data = {
//                     "newPassword": NewPassword,
//                     "confirmPassword": secureKey.confirmpassword,
//                     "emailId":$scope.emailId
//                 }
//                 console.log("before send",data);
//                 $scope.myValue = false;
//                 Service.forgretresetpassword(data).then(function (response) {
//                     $scope.message = response.data;
//                     if (response.data.message == "Password Updated Successfully") {
//                         $scope.myValue = true;
//                         toaster.success(response.data.message);
//                         $state.go('login');

//                     }
//                     else {
//                         $scope.myValue = true;
//                         toaster.error(response.data.message);
//                     }


//                 }, function (error) {
//                     toaster.error(response.data.message);
//                 });
//             }


//         });


//     }

// })

// app.controller('resetctrlr', function ($scope, $rootScope, $state, $modalInstance, toaster) {
//     $scope.change = function (password, valid) {

//         var data = {
//             oldpassword: password.Npassword,
//             confirmpassword: password.Cpassword
//         }

//         if (data.oldpassword == data.confirmpassword) {

//               $modalInstance.close(data);
//             }

//          else {
//             toaster.error("New and Confirm Password should  be same");
//         }


//     }
//     $scope.close = function () {
//         $modalInstance.close();
//     }




// })