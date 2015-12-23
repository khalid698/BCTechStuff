'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('MainCtrl', function ($log, $scope, $rootScope, Identity, Ethereum, IdentityContract, Notification) {
    var self=this;

    self.email = '';
    self.passphrase = '';
    self.requests = [];
    self.grants = [];
    self.toAddress = '';
    self.amount = '';
    // Contract
    self.identityName = '';
    self.contractMining = false;

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

    self.balance = function() {
      if ($rootScope.selectedIdentity ){
        return Ethereum.getBalance($rootScope.selectedIdentity.eth.getAddresses()[0]).toString(10);
      }
      return undefined;
    };

    self.createContract = function() {
      var selectedIdentity = $rootScope.selectedIdentity;
      self.contractMining = true;
      IdentityContract.createContract($rootScope.selectedIdentity, self.identityName)
        .then(function(contract){
             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
             Notification.success('Contract mined!');
             selectedIdentity.contractAddress = contract.address;
             Identity.store(selectedIdentity);
             self.contractMining = false;
        });
    };

    self.deleteContract = function() {
      var selectedIdentity = $rootScope.selectedIdentity;
      var callback = function(e,r){
          if (!e) {
          $log.info("Contract deleted, removing from identity");
            Notification.success("Contract deleted");
           selectedIdentity.contractAddress = undefined;
           Identity.store(selectedIdentity);
           $scope.$apply();
         } else {
          $log.warn("Could not delete contract ", e);
          Notification.error("Could not delete contract: "+e);
         }
       };
      IdentityContract.deleteContract($rootScope.selectedIdentity, callback);
    };

    self.send = function (toAddress, value) {
      var selectedIdentity = $rootScope.selectedIdentity;
      Ethereum.sendFunds(selectedIdentity, selectedIdentity.eth.getAddresses()[0], toAddress, value);
    };

    self.loadGrants = function() {
      if($rootScope.selectedIdentity){
        self.grants = IdentityContract.grants($rootScope.selectedIdentity);
      }
    };

    self.loadGrants();

    self.grant = function(request){
        IdentityContract.grant($rootScope.selectedIdentity, request);
    };

  });
