var app = angular.module('routerApp.usertranscationctrlr', ['toaster']);
app.controller('usertransctrlr', function ($scope, $stateParams, Service, $state, $rootScope, $http, toaster, $modal) {
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


    $scope.recentTransactions = [];
    $scope.sendTransactions = [];
    $scope.receivedTransactions = [];

    $scope.gettransactionhistory = function () {
        var data = {
            "sessionId": sessionid
        }
        var senttranscation = [];
        var receivetranscation = [];
        var overalltranscation = [];
        var userdashboardtransaction = [];
        $scope.myValue = false;
        Service.gettransactionhistory(data).then(function (response) {
            if (response.data != null) {
                $scope.message = response.data;

                if (response.data.status == "Success") {
					$scope.myValue = true;
                    $scope.transcation = response.data.transactionHistory;
                    $scope.recentTransactions = response.data.transactionHistory;
                    $scope.callpagination();
                    overalltranscation = response.data.transactionHistory;

                }
                else {
                    if (response.data.message == "Session Expired") {
						$scope.myValue = true;
                        $state.go('login');
                    }
                    toaster.error(response.data.message);
                }
                for (var i = 0; i < overalltranscation.length; i++) {
                    if (overalltranscation[i].fromAddress == $scope.walletaddress) {
                        senttranscation.push(overalltranscation[i]);
                        $scope.sendTransactions = senttranscation;

                    }
                    else {

                        var Toaddress = overalltranscation[i].toAddress;
                        var wallet = $scope.walletaddress;
                        if (wallet == Toaddress) {
                            receivetranscation.push(overalltranscation[i]);
                            $scope.receivedTransactions = receivetranscation;

                        }
                    }
                }
                for (var i = 0; i < 2; i++) {
                    if (overalltranscation[i]) {
                        userdashboardtransaction.push(receivetranscation[i]);
                        $scope.usertranscationhistory = userdashboardtransaction;
                    }

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

    $scope.gettransactionhistory();


    $scope.all = true;
    $scope.send = false;
    $scope.receive = false;

    $scope.allList = function () {
        $scope.all = true;
        $scope.send = false;
        $scope.receive = false;
        $scope.callpagination();
    }

    $scope.sendList = function () {
        $scope.all = false;
        $scope.send = true;
        $scope.receive = false;
        $scope.callpagination();
    }

    $scope.receiveList = function () {
        $scope.all = false;
        $scope.send = false;
        $scope.receive = true;
        $scope.callpagination();
    }


    $scope.callpagination = function () {
        if (($scope.all && $scope.recentTransactions.length > 0) || ($scope.send && $scope.sendTransactions.length > 0) || ($scope.receive && $scope.receivedTransactions.length > 0)) {
            var transactionlList = [];
            if ($scope.all) {
                $scope.datalists = $scope.recentTransactions;
                transactionlList = $scope.recentTransactions;
            } else if ($scope.send) {
                $scope.datalists = $scope.sendTransactions;
                transactionlList = $scope.sendTransactions;
            } else if ($scope.receive) {
                $scope.datalists = $scope.receivedTransactions;
                transactionlList = $scope.receivedTransactions;
            }
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