
var app = angular.module('routerApp.forgotPasswordController', ['toaster']);
app.controller('forgotPasswordcontrol', function ($scope, $stateParams, Service,$window, $state, $http, $rootScope, toaster) {

    $scope.myValue = true;
    $scope.validateEmail = function () {
        $scope.value = "true";

    };
      $scope.ForgotPassword = function (forgotpassword) {
        if(forgotpassword==undefined||forgotpassword==""){
           // toaster.error("please fill the field");
        }
        else{
        var forgotPasswordData = {
            "emailId": forgotpassword
        }
     
        $scope.myValue = false;
        Service.forgotpassword(forgotPasswordData).then(function (response) {
            
            $scope.message = response.data;
            if (response.data.status == "Success") {
                console.log("enter sucess", response.data);
                $scope.myValue = true;
                $scope.message = response.data;
                toaster.success(response.data.message);
                $state.go('login');
               // $scope.forgotpassword="";

            }
            else if(response.data.status == "Failure"){
                $scope.myValue = true;
                toaster.error(response.data.message);
                $scope.forgotpassword="";

            }
            
        }, function (error) {
            if (error.status == 409) {
                $scope.myValue = true;
                $scope.message = error.data.message;
                toaster.error(error.data.message);


            }
            else {
                $scope.myValue = true;
                $scope.message = error.data.message;
                toaster.error(error.data.message);

            }
        });
      }
    }


    $scope.onGooleLogin = function () {
        gapi.auth2.authorize({
            client_id: '603768228037-r2kot92hfbcqd9hmsug48r826pff715g.apps.googleusercontent.com',
            immediate:false,
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

