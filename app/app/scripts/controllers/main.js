'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('MainCtrl', function ($log, $scope, $rootScope, Identity, Ethereum, IdentityContract) {
    var self=this;

    self.email = '';
    self.passphrase = '';

    self.generateIdentity = function() {
      var callback = function(identity){
        $log.info("Created identity");
        $log.info(identity);
      };
      $log.info("Creating new identity for "+self.email);
      Identity.generateIdentity(self.email, self.passphrase, callback);
    };

    // self.deleteKey = function() {
    //   self.identity.deleteKey();
    // };

    self.balance = function() {
      if ($rootScope.selectedIdentity ){
        return Ethereum.getBalance($rootScope.selectedIdentity.eth.getAddresses()[0]).toString(10);
      }
      return undefined;
    };

    self.createContract = function() {
      var callback = function(e, contract){
        var selectedIdentity = $rootScope.selectedIdentity;
        console.log(e, contract);
        if (typeof contract !== 'undefined' && typeof contract.address !== 'undefined') {
             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
             selectedIdentity.contractAddress = contract.address;
             Identity.store(selectedIdentity);
        }
      };
      IdentityContract.createContract($rootScope.selectedIdentity, callback);
    };

    self.deleteContract = function() {
      var selectedIdentity = $rootScope.selectedIdentity;
      var callback = function(e,r){
          if (!e) {
            $log.info("Contract deleted, removing from identity");
           selectedIdentity.contractAddress = undefined;
           Identity.store(selectedIdentity);
           $scope.$apply();
         } else {
          $log.warn("Could not delete contract ", e);
         }
       }
      IdentityContract.deleteContract($rootScope.selectedIdentity, callback);
    };

  });
