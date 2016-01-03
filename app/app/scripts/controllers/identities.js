'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:IdentitiesCtrl
 * @description
 * # IdentitiesCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IdentitiesCtrl', function ($log, $rootScope, Identity, Notification) {
    var self = this;

    self.selected = undefined;
    self.bank = undefined;
    self.attestation = undefined;
    self.email = '';
    self.passphrase = '';

    self.getIdentities = Identity.getIdentities;

    self.selectIdentity = function(){
      $rootScope.selectIdentity(self.selected);
    };
    self.selectBankIdentity = function(){
      $rootScope.selectBankIdentity(self.bank);
    };

    self.selectAttestationIdentity = function(){
      $rootScope.selectAttestationIdentity(self.attestation);
    };


    self.init = function() {
      if ( $rootScope.selectedIdentity){
        self.selected = $rootScope.selectedIdentity.email;
      }
      if ( $rootScope.bankIdentity){
        self.bank = $rootScope.bankIdentity.email;
      }
      if ( $rootScope.attestationIdentity){
        self.attestation = $rootScope.attestationIdentity.email;
      }
    };

    self.init();

    self.generateIdentity = function() {
      var callback = function(identity){
        $log.info("Created identity");
        Notification.success("Created identity");
        $log.info(identity);
      };
      $log.info("Creating new identity for "+self.email);
      Notification.primary("Creating new identity for "+self.email);
      Identity.generateIdentity(self.email, self.passphrase, callback);
    };

  });