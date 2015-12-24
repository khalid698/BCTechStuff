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
