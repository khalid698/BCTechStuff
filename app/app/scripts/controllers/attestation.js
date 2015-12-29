'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AttestationCtrl
 * @description
 * # AttestationCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('AttestationCtrl', function ($log, $rootScope, $scope, IdentityContract) {

    var self = this;
    self.assertionTypes = [1,2,3].map(function(i){ return IdentityContract.assertionById(i)});
    self.pendingAttestation = false;


    self.create = function(){
      $log.info("Creating attestation", self.assertionTypes);
      self.pendingAttestation = true;
      $rootScope.progressbar.steps = self.assertionTypes.length;
      $rootScope.progressbar.progress = 0;
      // var callback = function(){
      //   self.bar.progress++;
      //   $scope.$apply();
      // };
      IdentityContract.attest($rootScope.attestationIdentity, $rootScope.selectedIdentity, self.assertionTypes, $rootScope.progressbar.bump)
        .then(function(){
            self.pendingAttestation = false;
            $scope.$apply();
        });
    };


  });
