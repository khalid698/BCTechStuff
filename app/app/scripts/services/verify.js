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

    
  });
