var app = angular.module('routerApp.logincontroller', ['toaster']);
app.controller('loginCtrl', function ($scope, $stateParams, Service, $state, $http, $rootScope, $modal, toaster, $window) {
  //  $window.location.reload();
  $scope.myValue = true;
    $scope.validateEmail = function () {
    
        $scope.value = "true";
    };
    sessionStorage.removeItem('names');
    $rootScope.sessionId = "null";
    $rootScope.firstname = "null";
    $rootScope.lastname = "null";
    $rootScope.userid = "empty";
    $scope.Signup = function (login) {
        if (login) {
            var data = {
                "emailId": login.email,
                "password": login.Password
            }

            $rootScope.emailid = login.email;
            $rootScope.password = login.Password;
            if (login.email == undefined || login.Password == undefined) {
                toaster.error("Please enter valid email and password");
            }

            else {
                $scope.myValue = false;
                Service.login(data, function (res) {
                    if (res.data.status == "Success") {
                        $scope.myValue = true;

                        $rootScope.otpNumber = res.data.otp;
                        console.log("otp=" + $rootScope.otpNumber);

                        var modalInstance = $modal.open({
                            templateUrl: 'root/views/Login/otpmodel.html',
                            controller: 'twofaCtrl'
                        });

                        modalInstance.result.then(function (secureKey) {
                            if(secureKey){
                            $rootScope.newotp = secureKey;
                            var data = {
                                "emailId": $rootScope.emailid,
                                "password": $scope.password,
                                "otp": $rootScope.newotp
                            }
                            $scope.myValue = false;
                            Service.otplogin(data, function (res) {
                                if (res.data.status == "Success") {
                                    $scope.myValue = true;
                                    sessionStorage.setItem('names', JSON.stringify(res.data)); //set data
                                    var sessionData = JSON.parse(sessionStorage.getItem("names"));
                                    $rootScope.sessionId = sessionData.loginInfo.sessionId;

                                    if (res.data.loginInfo.roleId == 2) {
                                        $state.go('userdashboard');
                                    }
                                    if (res.data.loginInfo.roleId == 1) {
                                        $state.go('admindashboard');
                                    }

                                } else if (res.data.status == 'Failure') {
                                    $scope.myValue = true;
                                    toaster.error(res.data.message);
                                }

                            })
                        }
                        else{
                            $scope.myValue = true;
                           
                            $state.go('login');

                        }

                        });

                    } else if (res.data.status == 'Failure') {
						 $scope.myValue = true;
                        toaster.error(res.data.message);
                    }

                })
            }
        }
    }

    $scope.onGooleLogin = function () {
        gapi.auth2.authorize({
           // client_id: '73866657500-h5hv0a325mradtqnb11erto1l3osqc00.apps.googleusercontent.com',
           client_id: '1069477501481-11sp7vb2pshp6ps62tc7udu9mgr1lfka.apps.googleusercontent.com',
            immediate:false,
            scope: 'profile email',
            response_type: 'id_token permission'
        }, function (response) {
            console.log("response",response);
            if (response.error) {
                return;
            }

            // The user authorized the application for the scopes requested.
            var accessToken = response.access_token;
            var idToken = response.id_token;
            gapi.client.load('plus', 'v1', function () {
                var request = gapi.client.plus.people.get({
                    'userId': 'me'
                });

                request.execute(function (resp) {
                    console.log("res",resp);

                    var data = {
                        'isPopupStatus': false,
                        'userId': resp.emails[0].value

                    };

                    $rootScope.firstname = resp.name.givenName;
                    $rootScope.lastname = resp.name.familyName;
                    $rootScope.userid = resp.emails[0].value;
                    
                    Service.socialLogin(data).then(function (res) {
                       if (res.data.status == 'Success' && res.data.isPopupStatus) {
                            var modalInstance = $modal.open({
                                templateUrl: 'root/views/model/registerpop.html',
                                controller: registerpop,
                                resolve: {
                                    socialdata: function () {
                                        return {
                                            userId: resp.emails[0].value,
                                            emailId: resp.emails[0].value
                                        };
                                    }

                                }

                            });

                        } else if (res.data.Status == 'Failure') {
                            toaster.pop("error", res.data.message);
                            //$state.go('login');
                        }
                        else if (!res.data.isPopupStatus) {
                            sessionStorage.setItem('names', JSON.stringify(res.data));
                            // toaster.pop("success", res.data.message);
                            $state.go('userdashboard');

                        }

                    });
                });
            });
        })
    }

    $window.fbAsyncInit = function () {
        FB.init({
            appId: '204215647047046',
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.4'
        });
    };
    $scope.facebookLogin = function () {
		fbAsyncInit();
        FB.login(function (response) {
            if (response.authResponse) {
                console.log("response",response);
                FB.api('/me', { locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture' }, function (response) {
                    console.log("after fb api response",response);
                    $rootScope.userid = response.id;
                    var data = {
                        'isPopupStatus': false,
                        'userId': response.id
                    };
                    $rootScope.firstname = response.first_name;
                    $rootScope.lastname = response.last_name;

                    Service.socialLogin(data).then(function (response) {
                        if (response.data.status == 'Success' && response.data.isPopupStatus) {
                            var modalInstance = $modal.open({
                                templateUrl: 'root/views/model/registerpop.html',
                                controller: registerpop,
                                resolve: {
                                    socialdata: function () {
                                        return {
                                            userId: response.id

                                        };
                                    }
                                }

                            });

                        } else if (response.data.Status == 'Failure') {
                            toaster.pop("error", response.data.message);
                            // $state.go('login');
                        } else if (!response.data.isPopupStatus) {

                            sessionStorage.setItem('names', JSON.stringify(response.data));
                            // toaster.pop("success", response.data.message);
                            $state.go('userdashboard');

                        }

                    });

                })

            } else {
                //console.log("errorrrr else");
            }

        })

    }

})

var registerpop = function ($scope, $rootScope, $window, $state, $modalInstance, socialdata, toaster, Service) {
    toaster.clear();
    $scope.myValue=true;
    $scope.validateEmail = function () {
        $scope.value = "true";
    };
    $scope.emailfromGmail = socialdata.emailId;
    $scope.user = {
        emailId: ''
    }
    if ($scope.emailfromGmail != undefined) {
        $scope.user.emailId = $scope.emailfromGmail;
    }

    $scope.validateEmail = function (email) {
        $scope.value = "true";

    }
    $scope.password = function () {
        $scope.valuefalse = "true";

    }
    $scope.ok = function (valid, details) {
      
       // $modalInstance.close();
        toaster.clear();
        if (!valid) {
            toaster.error("error", 'Empty records');
            return false;
        }

        if (details.emailId == "" || details.walletPassword == undefined || details.conwalletPassword == undefined) {
            toaster.error("Kindly kFill all The Fields");
        }
        else {
            if (details.walletPassword == details.conwalletPassword) {
                var data = {
                    "emailId": details.emailId,
                    'userId': $rootScope.userid,
                    "isPopupStatus": true,
                    "walletPassword": details.walletPassword,
                    "walletConfirmPassword": details.conwalletPassword,
                    'firstName': $rootScope.firstname,
                    'lastName': $rootScope.lastname
                }
               
               
                if (valid) {
                    console.log( "$scope.myValue=false", $scope.myValue);
                    $scope.myValue = false;
                    Service.socialLogin(data).then(function (res) {
                        if (res.data.status == "Success") {
                            $scope.myValue = true;
                            sessionStorage.setItem('names', JSON.stringify(res.data)); //set data
                            toaster.pop("success", res.data.message);
                            $state.go('userdashboard');
                        } else if (res.data.status == "Failure") {
                            $scope.myValue = true;
                            toaster.pop("error", res.data.message);
                            // setTimeout(function () { $window.location.reload(); }, 3000);
                            // $scope.regToast = toaster.error(res.data.message);
                        }
                        $modalInstance.close();
                    })

                } else {
                    toaster.pop("error", 'Kindly Fill all The Fields');
                }
            }
            else {
                $modalInstance.close();
                toaster.pop("Please enter correct Password");
            }
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


app.controller('twofaCtrl', function ($scope, $rootScope, $state, $modalInstance, toaster) {

    $scope.verify = function (faOtp) {
        var secureKey = faOtp;

        if ($rootScope.otpNumber == secureKey) {
            $modalInstance.close(secureKey);

        } else {
            $rootScope.otpno = "";
            toaster.error("Please Enter Valid OTP");
        }

    }
    $scope.cancel= function(){
        $modalInstance.close();
    }

})

