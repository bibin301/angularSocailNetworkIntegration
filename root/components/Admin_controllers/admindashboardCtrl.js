var app = angular.module('routerApp.admindashboardCtrl', ['toaster']);
app.controller('admindashctrl', function ($scope, $stateParams, Service, $state, $rootScope, $http, toaster, $modal,$window) {
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.myValue = true;
    var sessionData = JSON.parse(sessionStorage.getItem("names"));

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    if (sessionData == null) {
        //toaster.error("session expired");
        $state.go('login');
        return;
    }

    var sessionid = sessionData.loginInfo.sessionId;
    console.log("sessionid",sessionid);
    $scope.walletaddress = sessionData.loginInfo.walletAddress;
    $scope.sessionuser = sessionData.loginInfo.firstName + sessionData.loginInfo.lastName;

    $scope.getadmindashboarddetails = function () {
        var data = {
            "sessionId": sessionid
        }
        $scope.myValue = false;

        Service.getuserdashboarddetails(data).then(function (response) {
            console.log("user info adminonse>>>",response);
            
            if (response.data != null) {
                $scope.message = response.data;
                if (response.data.status == "Success") {
                    $scope.myValue = true;

                    $scope.etherBalance = response.data.etherBalance;
                    $scope.tokenBalance = response.data.tokenBalance;
                    $scope.Userscount = response.data.userCount;
                    $scope.minttokenvalue = response.data.mintToken;
                    $scope.BurnUnsoldtokens = response.data.burnToken;
                    $scope.totaltokens = response.data.totalToken;
                    $scope.soldtokens = response.data.soldToken;
                    $scope.icotokens = response.data.icoTokens;
                    $scope.refarral = response.data.adminTransferedReferralToken;
                    // $scope.availabletoken = response.data.availableTokens;tokenBalance
                    $scope.availabletoken = response.data.tokenBalance;
                    $scope.ethOnUsd = response.data.ethOnUsd;
                    $scope.tokenRate = response.data.tokenRate;
                    
                }
                else {
                    $scope.myValue = true;

                    if (response.data.message == "Session Expired") {
                        $state.go('login');
                    }
                    toaster.error("dashboard", response.data.message);
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

    $scope.getadmindashboarddetails();

    $scope.gettransactionhistory = function () {
        var data = {
            "sessionId": sessionid
        }
        var senttranscation = [];
        var receivetranscation = [];
        var overalltranscation = [];
        Service.gettransactionhistory(data).then(function (response) {
            if (response.data != null) {
                $scope.message = response.data;
                if (response.data.status == "Success") {
                    $scope.transcation = response.data.transactionHistory;
                    overalltranscation = response.data.transactionHistory;
                }
                else {
                    if (response.data.message == "Session Expired") {
                        $state.go('login');
                    }
                    //toaster.error(response.data.message);
                }

            }
            else {
                toaster.error("server problem");
            }
        }, function (error) {
            toaster.error(response.data.message);
        });

    }

    $scope.gettransactionhistory();

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
                $scope.myValue = false;
                Service.resetpassword(data).then(function (response) {
                    $scope.message = response.data;

                    if (response.data.message == "Password Updated Successfully") {
                        $scope.myValue = true;
                        toaster.success(response.data.message);
                        $state.go('login');
                    }
                    else {
                        if (response.data.message == "Session Expired") {
                            $scope.myValue = true;
                            $state.go('login');
                        }
                        else {
                            $scope.myValue = true;
                            toaster.error(response.data.message);
                        }

                    }

                }, function (error) {
                    $scope.myValue = true;
                    toaster.error(response.data.message);
                });
            }

        });

    }

    $scope.transfer = function () {

        if ($scope.towalletaddress == undefined || $scope.tokenno == undefined) {
            toaster.error("Please fill all the fields");
        }
        else {
            var data = {
                "fromAddress": $scope.walletaddress,
                "toAddress": $scope.towalletaddress,
                "sessionId": sessionid,
                "amount": $scope.tokenno
            }

            $scope.myValue = false;
            Service.cointransfer(data).then(function (responsevalue) {
                if (responsevalue) {
                    if (responsevalue.status == 206) {
                        $scope.myValue = true;
                        toaster.error(responsevalue.data.message);
                        $scope.towalletaddress = "";
                        $scope.tokenno = "";
                        return;
                    }

                    if (responsevalue.data.status = "Success") {
                        $scope.myValue = true;
                        toaster.success(responsevalue.data.message);
                        $scope.towalletaddress = "";
                        $scope.tokenno = "";
                    }

                    else {
                        $scope.myValue = true;
                        toaster.error(responsevalue.data.message);
                        $scope.towalletaddress = "";
                        $scope.tokenno = "";
                    }
                }

            }, function (error) {
                $scope.myValue = true;
                toaster.error(response.data.message);
            });
        }
    }

    $scope.minttoken = function () {
        var modalInstance = $modal.open({
            templateUrl: 'root/views/admin/mint.html',
            controller: 'mintctrlr'

        });

        modalInstance.result.then(function (mint) {
            if (mint) {
                if( mint.toaddress==undefined && mint.amount==undefined  ){
                    toaster.error("Please Enter Correct Details");
                    return;
                }
                
                if( mint.toaddress==undefined  ){
                    toaster.error("Please Enter To Address");
                    return;
                }
                if( mint.amount==undefined  ){
                    toaster.error("Please Enter Token Amount");
                    return;
                }else{ 
                    var data = {
                    "toAddress": mint.toaddress,
                    "amount": mint.amount,
                    "sessionId": sessionid,

                }
                $scope.myValue = false;
                Service.minttokens(data).then(function (response) {
                    if (response) {
                        if (response.data.status = "Success") {
                            $scope.myValue = true;
                            $scope.minttokenvalue = response.data.mintToken;
                            toaster.success(response.data.message);
                          //  $window.location.reload();
                        }
                        else {
                            $scope.myValue = true;
                            toaster.error(response.data.message);
                        }
                    }

                }, function (error) {
                    $scope.myValue = true;
                    toaster.error(response.data.message);
                });

            }
        }

               
               
        
        });
    
    }

    $scope.subtokenRate = function () {
        var modalInstance = $modal.open({
            templateUrl: 'root/views/model/rateToken.html',
            controller: 'popupctrlr',
            resolve:{
                itemvalue: function(){
                    return {
                        sessionId: sessionid

                    };
                }
            }

        });

    }
    $scope.burntoken = function () {
        var modalInstance = $modal.open({
            templateUrl: 'root/views/admin/burnunsoldtoken.html',
            controller: 'mintctrlr'

        });

        modalInstance.result.then(function (burn) {
            if (burn) {
                var data = {
                    "amount": burn,
                    "sessionId": sessionid,
                }

                $scope.myValue = false;
                Service.burntoken(data).then(function (response) {
                    console.log("resp[onse>>>",response);
                    if (response) {
                        if (response.data == null) {
                            $scope.myValue = true;
                            toaster.error("server problem");
                        }
                        if (response.data.status = "Success") {
                            $scope.myValue = true;
                            toaster.success(response.data.message);
                            $window.location.reload();
                            $scope.tokenBalance = response.data.tokenBalance;
                            $scope.BurnUnsoldtokens = response.data.burnToken;
                            $scope.totaltokens = response.data.totalToken;
                        }
                        else {
                            $scope.myValue = true;
                            toaster.error(response.data.message);
                        }
                    }


                }, function (error) {
                    $scope.myValue = true;
                    toaster.error(response.data.message);
                });

            }
            else{
                toaster.error("Please Enter the Burn Value");
                return;
            }

        });
    }


})


app.controller('popupctrlr', function ($scope, $window,$rootScope, $state, $modalInstance,Service, toaster,itemvalue) {
   
   $scope.myValue=true;
    $scope.change = function (password, valid) {
        var data = {
            password: password.OPassword,
            oldpassword: password.Npassword,
            confirmpassword: password.Cpassword
        }

        if (data.oldpassword == data.confirmpassword) {

            if (data.password == data.oldpassword) {
                toaster.error("Old and New Password should not be same");
                return;

            }
            else {

                $modalInstance.close(data);
            }

        }
        else {
            toaster.error("New and Confirm Password should  be same");
        }


    }
    $scope.tokenRate = function (val) {
        console.log("val>>>",val);
        if(val != undefined){

            var data = {
                "wellnessTokenRate": val,
                "sessionId": itemvalue.sessionId,
            }
           $scope.myValue=false;
            Service.addTokenrate(data).then(function (response) {
                $scope.myValue=true;
                if(response.data.status == "Success"){
                    $modalInstance.close();
                    toaster.success(response.data.message);
                    setTimeout(function () {
                        $window.location.reload();
                    }, 3000);
                }else{
                    toaster.error(response.data.message);
                    
                }
                
                console.log("add token rateresponse",response);
                    
            });
        }else{
            toaster.error("Please Enter Token Rate");
        }

    }
    $scope.close = function () {
        $modalInstance.close();
    }


})

