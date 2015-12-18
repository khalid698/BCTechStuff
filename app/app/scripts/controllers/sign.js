'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:SignCtrl
 * @description
 * # SignCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('SignCtrl', function (Verify, $rootScope, $log, $scope, Notification) {

  var self = this;

  self.message = '';
  var identity = $rootScope.selectedIdentity;
  
  self.signMessage = function(){
  	var callback = function(data){
        //do stuff
        self.signedMessage = data;
        Notification.success("Message Signed");
      };
    Notification.primary("Signing Message");
	Verify.signMessage($rootScope.selectedIdentity.pgp, self.message, callback);
  };


  });
