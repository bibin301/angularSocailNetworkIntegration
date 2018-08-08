var app = angular.module('routerApp.Registercontroller', ['toaster', 'ngIntlTelInput']);
app.config(function (ngIntlTelInputProvider) {
    ngIntlTelInputProvider.set({ initialCountry: 'us' });
});
app.controller('registerCtrl', function ($scope, $stateParams, Service, $window, $state, $rootScope, $http, toaster) {

    $scope.myValue = true;

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
        $scope.referralid = obj.referrallID;


    }

    $scope.reset = function () {
        $scope.name = "",
            $scope.mobileno = "",
            $scope.email = "",
            $scope.password = "",
            $scope.confirmpassword = "",
            $scope.walletpassword = ""
    }

    $scope.validateEmail = function () {
        $scope.value = "true";

    };

    $scope.Register = function (register, valid) {

        if (register && valid) {

            if (register.Password != register.CPassword) {
                toaster.error("password and confirm password must be  same");
                return;
            }
            if (register.walletPassword != register.ConfirmwalletPassword) {
                toaster.error("Wallet password and confirm wallet pass word must be same");
                return;
            }

            if (register.Password == register.CPassword && register.walletPassword == register.ConfirmwalletPassword) {

                var data = {
                    "userId": register.userid,
                    "firstName": register.firstName,
                    "lastName": register.LastName,
                    "mobileNo": register.mobileno,
                    "emailId": register.email,
                    "password": register.Password,
                    "confirmPassword": register.CPassword,
                    "walletPassword": register.walletPassword,
                    "walletConfirmPassword": register.ConfirmwalletPassword,
                    "referenceId": $scope.referralid
                }
                console.log("before send data", data);
                $scope.myValue = false;

                Service.register(data).then(function (response) {

                    $scope.message = response.data;
                    if (response.data.status == "Success") {
                        $scope.myValue = true;
                        toaster.success(response.data.message);
                        setTimeout(function(){
                            toaster.success(response.data.message);
                            },6000)
                        $scope.coinvalue = "";
                        $scope.walletpassword = "";
                    
                        $state.go('login');
                       // $window.location.reload();
                    }
                    else {
                        console.log("enter else", response.data);
                        console.log("enter else", response.data.status);
                        $scope.myValue = true;
                        
                        if(response.data.status == "Failure"){
                           
                            if(response.data.message){
                                toaster.error(response.data.message);
                            }
                            else{
                                toaster.error(response.data.status);
                            }
                        }
                        
                        if (response.data.message == "Session Expired") {
                            $state.go('login');
                        }
                        $scope.coinvalue = "";
                        $scope.walletpassword = "";
                    }

                }, function (error) {
                    $scope.myValue = true;
                    toaster.error(response.data.message);
                });


            } else {
                toaster.error("please enter Correct  Password");
                $scope.myValue = true;
            }

        }



    }


    $scope.onGooleLogin = function () {
        gapi.auth2.authorize({
            client_id: '603768228037-r2kot92hfbcqd9hmsug48r826pff715g.apps.googleusercontent.com',
            immediate: false,
            scope: 'profile email',
            response_type: 'id_token permission'
        }, function (response) {
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
            appId: '472571439807443',
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.4'
        });
    };
    $scope.facebookLogin = function () {
        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me', { locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture' }, function (response) {
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


