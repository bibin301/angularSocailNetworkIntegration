var app = angular.module('routerApp.registeruserlist', ['toaster']);
app.controller('userlistctrlr', function ($scope,Service, $rootScope, $modal,$state,  toaster) {
    $scope.myValue = true;
    var sessionData = JSON.parse(sessionStorage.getItem("names"));
    if (sessionData == null) {
        //toaster.error("session expired");
        $state.go('login');
        return;
    }

    var sessionid = sessionData.loginInfo.sessionId;
    $scope.walletaddress = sessionData.loginInfo.walletAddress;
    $scope.sessionuser = sessionData.loginInfo.firstName + sessionData.loginInfo.lastName;
    
    $scope.registerUser = [];

    $scope.getuserlist = function () {
     
        var data = {
            "sessionId": sessionid
        }
        $scope.myValue = false;
        Service.getuserregisterlist(data).then(function (response) {
          console.log("response",response.data);
          
           if (response.data != null) {
               $scope.message = response.data;
                if (response.data.status == "Success") {
                    $scope.myValue = true;
                    $scope.transcation = response.data.userList;
                    $scope.registerUser = response.data.userList;
                    $scope.callpagination();
                   
                }
                else {
                    if (response.data.message == "Session Expired") {
                        $scope.myValue = true;
                        $state.go('login');
                    }
                    toaster.error(response.data.message);
                }
              

            }
            else {
                $scope.myValue = true;
                toaster.error("server problem");
            }
        }, function (error) {
            $scope.myValue = true;
            toaster.error(response.data.message);
        });

    }

    $scope.getuserlist();

    

    $scope.callpagination = function () {
        if ($scope.registerUser.length > 0){
          var transactionlList = [];
                $scope.datalists = $scope.registerUser;
                transactionlList = $scope.registerUser;
           
            $scope.itemsPerPage = 10;
            $scope.currentPage = 0;
            $scope.range = function () {
                var rangeSize = transactionlList.length >= 30 ? 4 : 1;
                if (transactionlList.length > 30)
                    rangeSize = 4;
                else if (transactionlList.length <= 10)
                    rangeSize = 1;
                else
                    rangeSize = Math.ceil(transactionlList.length / 10);

                var ps = [];
                var start;

                start = $scope.currentPage;
                if (start > $scope.pageCount() - rangeSize) {
                    start = $scope.pageCount() - rangeSize + 1;
                }

                for (var i = start; i < start + rangeSize; i++) {
                    ps.push(i);
                }
                return ps;
            };

            $scope.prevPage = function () {
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                }
            };

            $scope.DisablePrevPage = function () {
                return $scope.currentPage === 0 ? "disabled" : "";
            };

            $scope.pageCount = function () {

                return Math.ceil($scope.datalists.length / $scope.itemsPerPage) - 1;
            };

            $scope.nextPage = function () {
                if ($scope.currentPage < $scope.pageCount()) {
                    $scope.currentPage++;
                }
            };

            $scope.DisableNextPage = function () {
                return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
            };

            $scope.setPage = function (n) {
                $scope.currentPage = n;
            };


        }
    }

    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'root/views/user/ResetPassword.html',
            controller: 'popupctrlr'

        });

        modalInstance.result.then(function (secureKey) {
            if (secureKey) {
                var Oldpassword = secureKey.password;
                var NewPassword = secureKey.oldpassword;
                var data = {
                    "sessionId": sessionid,
                    "newPassword": NewPassword,
                    "oldPassword": Oldpassword,
                    "confirmPassword": secureKey.confirmpassword
                }

                Service.resetpassword(data).then(function (response) {
                  $scope.message = response.data;
                    if (response.data.message == "Password Updated Successfully") {
                        toaster.success(response.data.message);
                        $state.go('login');

                    }
                    else {
                        toaster.error(response.data.message);
                    }


                }, function (error) {
                    toaster.error(response.data.message);
                });
            }

        });

    }

    $scope.logout = function () {
        var modalInstance = $modal.open({
            templateUrl: 'root/views/user/logout.html',
            controller: 'logoutctrlr'

        });

        modalInstance.result.then(function (secureKey) {
            if (secureKey) {
                if (secureKey == "Ok") {
                    $state.go('login');
                }
            }

        });

    }







})
angular.module('routerApp').filter('pagination', function () {
    return function (input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});