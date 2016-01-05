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
	    pgp.signClearMessage(decryptedPrivateKeyObject, plaintextMessage)
	    .then(function(signedMessage) {
	        $log.info(signedMessage);
	        callback(signedMessage);
	    });
	};

	self.verifyMessage = function(publicKeyArmored, signedMessage, callback) {
	    var publicKeyObject = pgp.key.readArmored(publicKeyArmored).keys[0];
    	var cleartextMessageObject = pgp.cleartext.readArmored(signedMessage);
    	pgp.verifyClearSignedMessage(publicKeyObject, cleartextMessageObject)
    	.then(function(result) {
    		$log.info(result);
    		$log.info(result.signatures[0].valid);
    		callback(result);
		});
	};


  });
