'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AssertCtrl
 * @description
 * # AssertCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IdentityCtrl', function ($log, $rootScope, $scope, $state, IdentityContract, Identity, Notification, Ethereum) {
      var self = this;

      self.assertions = {};
      self.changedAssertions = {};
      self.editingAssertions = {};
      self.assertionsPending = false;

      self.grants = [];
      self.grantsPending = false;

      // Holds incoming grant request from bank
      self.request = {
         requestee: $state.params.requestee,
         assertionTypes: $state.params.assertionTypes,
         description: $state.params.description
      };

      self.grantRequest = function() {
        $log.debug("Granting", self.request.assertionTypes,"to", grantee);
        var grantee = Identity.get(self.request.requestee);
        self.grantsPending = true;
        IdentityContract.grant($rootScope.selectedIdentity, grantee, self.request.assertionTypes, self.request.description)
          .then(function(){
            self.grantsPending = false;
            $scope.$apply();
            $state.transitionTo('id.access');
          });
      };

      self.revokeGrant = function(grant){
        $log.debug("Revoking grant", grant);
        self.grantsPending = true;
        var grantee = Identity.getByAddress(grant.requestee);
        IdentityContract.revoke($rootScope.selectedIdentity, grantee).then(function(){
          self.grantsPending = false;
        });
      };

      self.assert = function() {
        $log.info('Storing changed assertions ', self.changedKeys());
        var assertions = self.changedKeys().map(function(assertionId){
          return {
            assertionId: assertionId,
            value: self.assertions[assertionId]
          }});
        self.assertionsPending = true;
        IdentityContract.assert($rootScope.selectedIdentity, assertions).then(function(){
          self.assertionsPending = false;
          $scope.$apply();
          self.init();
        });
      };

      self.read = function(assertionType) {
        $log.info('Reading '+assertionType.label+' from contract');
        IdentityContract.readAssertion($rootScope.selectedIdentity, $rootScope.selectedIdentity.contractAddress, assertionType.id)
          .then(function(decryptedAssertion){
              // Notification.success('Got assertion value : '+decryptedAssertion);
              self.assertions[assertionType.id] = decryptedAssertion;
              delete self.changedAssertions[assertionType.id];
              $scope.$apply();
          });
        // Notification.primary('Reading '+assertionType.label+' from contract');
      };

      self.init = function(){
        $rootScope.assertionTypes.map(self.read);
        self.changedAssertions = {};
        IdentityContract.grants($rootScope.selectedIdentity).then(function(grants){
          self.grants = grants;
        });
      };
      self.init();

      // Changed tracking
      self.changedKeys = function(){
        var keys = [];
        for(var k in self.changedAssertions){
          keys.push(k);
        };
        return keys;
      };

      self.hasChangedKeys = function(){
        return self.changedKeys().length > 0;
      };

      self.changed = function(assertionType) {
        self.changedAssertions[assertionType.id] = true;
        // $log.debug("Currently changed assetions", self.changedAssertions);
      };

      self.isChanged = function(assertionType){
        return  self.changedKeys().lastIndexOf(''+assertionType.id) > -1;
      };

      // Editign tracking
      self.edit  = function(assertionType){
        self.editingAssertions[assertionType.id] = true;
      };

      self.editingKeys = function(){
        var keys = [];
        for(var k in self.editingAssertions){
          keys.push(k);
        };
        return keys;
      };

      self.isEditing = function(assertionType){
        return self.editingKeys().lastIndexOf(''+assertionType.id) > -1;
      };

      self.cancelEdit = function(assertionType){
        delete self.editingAssertions[assertionType.id];
        self.read(assertionType);
      };
      self.finishEdit = function(assertionType){
        delete self.editingAssertions[assertionType.id];
      }

      self.displayAssertionTypes = function(){
        return $state.current.displayAssertionTypes.map(function(id){return IdentityContract.assertionById(id)})
      }

      // Contract code
      // self.identityName = '';
      self.contractMining = false;

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
        $log.debug('Deleting contract');
        IdentityContract.deleteContract($rootScope.selectedIdentity, callback);
      };

      self.createContract = function() {
        var selectedIdentity = $rootScope.selectedIdentity;
        self.contractMining = true;
        IdentityContract.createContract($rootScope.selectedIdentity) // self.identityName
          .then(function(contract){
               console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
               Notification.success('Contract mined!');
               selectedIdentity.contractAddress = contract.address;
               Identity.store(selectedIdentity);
               self.contractMining = false;
          });
      };

      self.balance = function() {
        if ($rootScope.selectedIdentity ){
          return Ethereum.getBalance($rootScope.selectedIdentity.eth.getAddresses()[0]).toString(10);
        }
        return undefined;
      };

      // Grant display code
      self.grant = undefined; // Selected grant to display
      self.selectGrant = function(grant){
        self.grant = grant;
      };


  });
