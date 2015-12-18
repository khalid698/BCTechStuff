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
  self.signedMessage = '';
  self.publicKey = '';
  
  self.signMessage = function(){
  	var callback = function(data){
        //do stuff
        self.signedMessage = data;
        Notification.success("Message Signed");
      };
    Notification.primary("Signing Message");
	Verify.signMessage($rootScope.selectedIdentity.pgp, self.message, callback);
	//set the public key to the message block
	self.publicKey = $rootScope.selectedIdentity.pgp.toPublic().armor();
  };

  self.verifyMessage = function() {
  	var callback = function(result){
  		if(result.signatures[0].valid){
  			Notification.success("Message Verified");
  		} else {
  			Notification.error("Message Invalid");
  		}
      };
   	Verify.verifyMessage(self.publicKey, self.signedMessage, callback);
  };


  });
