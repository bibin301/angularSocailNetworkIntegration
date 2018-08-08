var app = angular.module('routerApp.logoutcontroller', ['toaster']);
app.controller('logoutctrlr', function ($scope, $rootScope, $state, $window, $modalInstance, toaster, Service) {
    $scope.myValue = true;
    var sessionData = JSON.parse(sessionStorage.getItem("names"));
    var sessionid = sessionData.loginInfo.sessionId;

    $scope.closebutton = function () {
        var data = {
            "sessionId": sessionid
        }
        $scope.myValue = false;
        Service.logout(data).then(function (response) {
            if (response.data.status == "Success") {
                $scope.myValue = true;
                sessionStorage.removeItem('names');
                $modalInstance.close("Ok");
               // $window.location.reload();
               $scope.redir = localStorage.getItem("status");
               console.log("$scope.redir",$scope.redir);
               if($scope.redir == "redirect"){
                   console.log("jdsfhjdsh");
                //$window.location.href = 'https://shapeshift.io/#/coins';
               // $window.open('https://shapeshift.io/#/coins');

            //    /$window.open('https://www.google.com', '_blank');
             window.open("https://shapeshift.io/#/coins");
                localStorage.setItem("status","");
               }else{
                $window.location.reload();
                
                $state.go('login');
               }
                
                //toaster.success("response.data.message");
            } else if (response.data.Status == "Failure") {
              //  $modalInstance.close("Ok");
                $scope.myValue = true;
                toaster.success("errorlogout", response.data.message);
                //$state.go('login');
            }
            if(response.status=206){
                $modalInstance.close("Ok");
                $scope.myValue = true;
                toaster.success(response.data.message);
                $state.go('login');
              
            }
        }, function (error) {
            $scope.myValue = true;
            toaster.error(error.data.message);

        });


    };

    $scope.cancelbutton = function () {
        $modalInstance.close("cancel");
    }

    

})