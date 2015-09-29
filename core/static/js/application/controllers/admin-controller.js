(function() {
    "use strict";
    angular.module('admin',[])
    .controller('dashboard', function($scope,$sce){
        $scope.clientSocket = $sce.trustAsResourceUrl("http://localhost:3001/socket.io/socket.io.js");
    });

})()
