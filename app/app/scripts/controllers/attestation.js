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

    self.assertionTypes = [1,2,3,4,5,6].map(function(i){ return IdentityContract.assertionById(i);});

    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(assertionType) {
      var idx = $scope.selection.indexOf(assertionType);
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.selection.push(assertionType);
      }
    };

    self.create = function(){
      $log.info("Creating attestation", $scope.selection);
      self.pendingAttestation = true;
      $rootScope.progressbar.init(1,'Storing attestations');
      IdentityContract
        .attest($rootScope.attestationIdentity, $rootScope.selectedIdentity, $scope.selection)
        .then($rootScope.progressbar.bump)
        .then(function(){
          $scope.$apply();
        })
    };


  });
