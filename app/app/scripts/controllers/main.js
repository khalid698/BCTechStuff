'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('MainCtrl', function ($log, Identity, Ethereum) {
    var self=this;

    self.identity = Identity;

    self.generateKey = function() {
      self.identity.generateKey();
    };

    self.deleteKey = function() {
      self.identity.deleteKey();
    };

    self.balance = function() {
      return Ethereum.getBalance(Identity.getAddress()).toString(10);
    };

    self.createIdentity = function() {
      var callback = function(e, contract){
        console.log(e, contract);
        if (typeof contract !== 'undefined' && typeof contract.address !== 'undefined') {
             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
             Identity.contractAddress = contract.address;
             Identity.storeContractAddress();
        }
      };
      Ethereum.createContract(Identity.keyStore, Identity.getAddress(), callback);
    };

    self.deleteIdentity = function() {
      Identity.deleteContract();
    };

  });
