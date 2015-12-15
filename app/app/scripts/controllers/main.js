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
      self.identity.GenerateKey();
    };

    self.balance = function() {
      return Ethereum.getBalance().toString(10);
    };

  });
