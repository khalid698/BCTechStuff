'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:BankCtrl
 * @description
 * # BankCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('BankCtrl', function ($log, ngProgressFactory, $scope, Notification, Identity, IdentityContract) {
    var self = this;

    // Identities
    self.bankIdentity = undefined;
    self.clientIdentity = undefined;

    self.request = function(assertionTypes){
        $log.info("Requesting access to ",assertionTypes," from ", self.bankIdentity, "to", self.clientIdentity);
        // Load identities, self. references only contain the string names
        var callback = function(e,r){
          if(e){
            $log.warn("Failed to request access : ",e);
          }
        };
        var bankIdentity = Identity.get(self.bankIdentity);
        var clientIdentity = Identity.get(self.clientIdentity);
        IdentityContract.request(bankIdentity, clientIdentity, assertionTypes, callback);
        Notification.primary('Requested access ');

    }
  });
