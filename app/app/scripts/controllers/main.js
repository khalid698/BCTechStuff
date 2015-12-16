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
      Ethereum.createContract(Identity.keyStore);
    };

  });
