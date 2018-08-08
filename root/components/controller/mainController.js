angular.module('routerApp', ['ui.router', 'routerApp.services', 'ui.bootstrap',
    'routerApp.logincontroller',
    'routerApp.Registercontroller',
    'routerApp.userDashboard',
    'routerApp.admindashboardCtrl',
    'routerApp.forgotPasswordController',
    'routerApp.emailVerificationController',
    'routerApp.logoutcontroller',
    'routerApp.mintcontroller',
    'routerApp.usertranscationctrlr',
    'routerApp.adminTransactionctrlr',
    'routerApp.referralcontroller',
    'routerApp.forgrtresetcontroller',
    'routerApp.registeruserlist',


])
    .run(["$rootScope", "$location", 'Auth', '$window', '$state', function ($rootScope, $location, Auth, $window, $state) {
        var data = Auth.getUserInfo();


        // if (data == null || data == undefined) {
        //     // $window.location.href = '#/login';
        //     $location.path("/login");
        // }
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            var data = Auth.getUserInfo();


            // if (data == null || data == undefined) {
            //     // $state.transitionTo("login");
            //     $location.path("/login");
            // }
        })
        $rootScope.spinner = {
            active: false,
            on: function () {
                this.active = true;
            },
            off: function () {
                this.active = false;
            }
        };

        // $rootScope.$on("$stateChangeStart", function (event, current, previous, x) {
        //     $rootScope.spinner.on();

        // });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {


            $rootScope.spinner.active = false;
        });
    }])
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider

            // HOME STATES AND NESTED VIEWS ========================================

            .state('login', {
                url: '/login',
                templateUrl: 'root/views/Login/login.html',
                controller: 'loginCtrl'
            })

            .state('registernow', {
                url: '/registernow',
                templateUrl: 'root/views/Login/register.html',
                controller: 'registerCtrl'
            })
            .state('forgot-password', {
                url: '/forgot-password',
                templateUrl: 'root/views/Login/forgot-password.html',
                controller: 'loginCtrl'
            })

            .state('userdashboard', {
                url: '/userdashboard',
                templateUrl: 'root/views/user/User-dashboard.html',
                controller: 'userctrl'
            })

            .state('otpmodel', {
                url: '/otpmodel',
                templateUrl: 'root/views/Login/otpmodel.html',
                controller: 'otpCtrl'
            })

            .state('admindashboard', {
                url: '/admindashboard',
                templateUrl: 'root/views/admin/admin-dashboard.html',
                controller: 'admindashctrl'
            })

            .state('wellnessApproval', {
                url: '/wellnessApproval',
                templateUrl: 'root/views/Login/emailverification.html',
                controller: 'emailVerificationCtrl'
            })
            .state('forgotPassword', {
                url: '/forgotPassword',
                templateUrl: 'root/views/Login/forgot-password.html',
                controller: 'forgotPasswordcontrol'
            })
            .state('resetpassword', {
                url: '/resetpassword',
                templateUrl: 'root/views/user/ResetPassword.html',
                controller: 'userctrl'
            })


            .state('referral', {
                url: '/referral',
                templateUrl: 'root/views/user/referral.html',
                controller: 'referralctrl'
            })

            .state('admintransaction', {
                url: '/admintransaction',
                templateUrl: 'root/views/admin/admin-transaction.html',
                controller: 'admintransctrlr'
            })
            .state('cointransfer', {
                url: '/cointransfer',
                templateUrl: 'root/views/user/admin-dashboard.html',
                controller: 'userctrl'
            })
            .state('usertransaction', {
                url: '/usertransaction',
                templateUrl: 'root/views/user/user-transaction.html',
                controller: 'usertransctrlr'
            })
            .state('forgetreset', {
                url: '/forgetreset',
                templateUrl: 'root/views/login/forgetreset.html',
                controller: 'forgotresetctrl'
            })
            .state('userlist', {
                url: '/userlist',
                templateUrl: 'root/views/admin/userList.html',
                controller: 'userlistctrlr'
            })
           
    })

    .factory('httpInterceptor', function ($q, $rootScope, $log) {

        var numLoadings = 0;

        return {
            request: function (config) {

                numLoadings++;

                // Show loader
                $rootScope.$broadcast("loader_show");
                return config || $q.when(config)

            },
            response: function (response) {

                if ((--numLoadings) === 0) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }

                return response || $q.when(response);

            },
            responseError: function (response) {

                if (!(--numLoadings)) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }

                return $q.reject(response);
            }
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');

    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($rootScope, $q) {
            return {
                request: function (config) {
                    $rootScope.spinner.on();
                    return config
                },
                response: function (response) {
                    $rootScope.spinner.off();
                    return response
                },
                responseError: function (response) {
                    $rootScope.spinner.off();
                    return response
                },
                requestError: function (response) {
                    $rootScope.spinner.off();
                    return response
                }
            }
        })
    })

//write inside indext.html;

function onloadFunction() {
    gapi.client.setApiKey('AIzaSyDarkPv_zaiHJhc0RgNyhGaZFUJyuGzDeI');
    gapi.client.load('plus', 'vl', function () { })
    //gapi.client.load('plus', 'v1', onGapiLoaded);


}


