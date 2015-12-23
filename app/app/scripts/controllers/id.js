'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AssertCtrl
 * @description
 * # AssertCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IdentityCtrl', function ($log, $rootScope, $scope, $state, IdentityContract, Identity, Notification) {
      var self = this;

      self.assertions = {};
      self.changedAssertions = {};
      self.editingAssertions = {};
      self.assertionsPending = false;

      self.request = {
         requestee: $state.params.requestee,
         assertionTypes: $state.params.assertionTypes,
      };

      self.grantRequest = function() {
        var grantee = Identity.get(self.request.requestee);
         IdentityContract.grant($rootScope.selectedIdentity, grantee, self.request.assertionTypes);
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


  });
