'use strict';

/**
 * @ngdoc service
 * @name angularApp.sign
 * @description
 * # sign
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('Verify', function (pgp, Notification, $log) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var self = this;

    self.signMessage = function(decryptedPrivateKeyObject, plaintextMessage, callback) {
	    openpgp.signClearMessage(decryptedPrivateKeyObject, plaintextMessage)
	    .then(function(signedMessage) {
	        $log.info(signedMessage);
	        callback(signedMessage);
	    });
	};

	self.verifyMessage = function(publicKeyArmored, signedMessage, callback) {
	    var publicKeyObject = openpgp.key.readArmored(publicKeyArmored).keys[0];
    	var cleartextMessageObject = openpgp.cleartext.readArmored(signedMessage);
    	openpgp.verifyClearSignedMessage(publicKeyObject, cleartextMessageObject)
    	.then(function(result) {
    		$log.info(result);
    		$log.info(result.signatures[0].valid)
    		callback(result);
		});
	};


  });
