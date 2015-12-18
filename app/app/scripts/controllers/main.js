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
    self.toAddress = '';
    self.amount = '';

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
      var callback = function(e, contract){
        console.log(e, contract);
        if(e !== null) {
          Notification.error(e);
        }
        if (typeof contract !== 'undefined' && typeof contract.address !== 'undefined') {
             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
             Notification.success('Contract mined!');
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
            Notification.success("Contract deleted");
           selectedIdentity.contractAddress = undefined;
           Identity.store(selectedIdentity);
           $scope.$apply();
         } else {
          $log.warn("Could not delete contract ", e);
          Notification.error("Could not delete contract: "+e);
         }
       }
      IdentityContract.deleteContract($rootScope.selectedIdentity, callback);
    };

    self.send = function (toAddress, value) {
      var selectedIdentity = $rootScope.selectedIdentity;
      Ethereum.sendFunds(selectedIdentity, selectedIdentity.eth.getAddresses()[0], toAddress, value);
    }

    self.loadRequests = function() {
      if($rootScope.selectedIdentity){
        return self.requests = IdentityContract.requests($rootScope.selectedIdentity);
      }
    }
    self.loadRequests();

  });
