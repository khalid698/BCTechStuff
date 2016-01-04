'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AssertCtrl
 * @description
 * # AssertCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('IdentityCtrl', function ($log, $rootScope, $scope, $state, IdentityContract, Identity, Notification, Ethereum, Verify) {
      var self = this;

      self.assertions = {};
      self.changedAssertions = {};
      self.editingAssertions = {};
      self.assertionsPending = false;

      self.grants = [];

      self.attestations = [];

      // Holds a small subset of assertions, used during request flow. overrides state given set.
      self.customDisplayAssertionTypes = undefined;
      self.postAssertionState = undefined;

      // Holds incoming grant request from bank
      self.request = {
         requestee: $state.params.requestee,
         assertionTypes: $state.params.assertionTypes,
         description: $state.params.description
      };

      // Returns assertiontypes present in request, but not asserted
      self.missingAssertionTypes = function(){
        var isMissing = function(assertion){
          return self.assertions[assertion] === undefined;
        };
        return self.request.assertionTypes.filter(isMissing);
      };

      self.presentAssertionTypes = function(){
        var isPresent = function(assertion){
          return self.assertions[assertion] !== undefined;
        };
        return self.request.assertionTypes.filter(isPresent);
      };

      self.addMissingAssertions = function(params){
        self.customDisplayAssertionTypes = self.missingAssertionTypes();
        self.postAssertionState = 'id.request';
        $state.go('id.personal');
      };

      self.login = function(email, password){
        $log.debug('Logging in',email);
        var identity = Identity.get(email);
        if(!identity){
          $log.debug('Unknown identity');
          $scope.invalidCredentials = true;
        } else if (identity && identity.passphrase == password){
          $scope.invalidCredentials = false;
          $rootScope.selectIdentity(email);
          $log.debug('Password correct, redirect to id.personal');
          self.init();
          $state.go('id.personal');
        } else {
          $log.debug('Password', password,'incorrect, expected', identity.passphrase);
          $scope.invalidCredentials = true;
        }
      };

      self.grantRequest = function() {
        $log.debug("Granting", self.request.assertionTypes,"to", grantee);
        var grantee = Identity.get(self.request.requestee);
        $rootScope.progressbar.init(self.request.assertionTypes.length,'Granting access');
        IdentityContract.grant($rootScope.selectedIdentity, grantee, self.request.assertionTypes, self.request.description, $rootScope.progressbar.bump)
          .then(function(){
            self.init();
            for(var g in self.grants){
              if ( self.grants[g].requestee === grantee){
                self.grant = self.grants[g];
              }
            }
            $state.transitionTo('id.access');
            $scope.$apply();
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
            value: self.assertions[assertionId].toString()
          }});
        $rootScope.progressbar.init(assertions.length,'Storing assertions');
        IdentityContract.assert($rootScope.selectedIdentity, assertions, $rootScope.progressbar.bump).then(function(){
          self.init().then(function(){
          if(self.postAssertionState){
              var target = self.postAssertionState;
              self.postAssertionState = undefined;
              $log.debug('Redirecting to',target);
              $state.go(target);
            }
          })
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

      self.loadProfile = function(){

      };

      self.init = function(){
        self.changedAssertions = {};
        self.customDisplayAssertionTypes = undefined;
        self.assertions = {};
        self.editingAssertions = {};
        self.assertionsPending = false;
        self.grants = [];
        self.attestations = [];

        var p = Promise.defer();
        if($rootScope.selectedIdentity){
          $rootScope.assertionTypes.map(self.read);
          IdentityContract.grants($rootScope.selectedIdentity).then(function(grants){
            self.grants = grants;
            // If there's only one grant, just select that one
            if(self.grants.length == 1 ){
              self.grant = self.grants[0];
              $log.info('Only one grant present, selected', self.selectGrant(self.grants[0]))
            };
            p.resolve();
          });
          self.attestations = IdentityContract.attestations($rootScope.selectedIdentity);
        } else {
          $state.go('id.login');
          p.resolve();
        }
        return p.promise;
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
      };

      self.displayAssertionTypes = function(){
        var res = undefined;
        if(self.customDisplayAssertionTypes){
          res = self.customDisplayAssertionTypes;
        } else {
          res = $state.current.displayAssertionTypes;
        }
        return res.map(function(id){return IdentityContract.assertionById(id)});
      };

      // Contract code

      self.deleteContract = function() {
        var selectedIdentity = $rootScope.selectedIdentity;
        $log.debug('Deleting contract');
        $rootScope.progressbar.init(1, 'Deleting contract');
        IdentityContract.deleteContract($rootScope.selectedIdentity).then(function(){
            $log.info("Contract deleted, removing from identity");
            Notification.success("Contract deleted");
            selectedIdentity.contractAddress = undefined;
            Identity.store(selectedIdentity);
            self.init();
            $rootScope.progressbar.bump();
            $scope.$apply();
        });
      };

      self.createContract = function() {
        var selectedIdentity = $rootScope.selectedIdentity;
        $rootScope.progressbar.init(1, 'Creating contract');
        IdentityContract.createContract($rootScope.selectedIdentity) // self.identityName
          .then(function(contract){
               console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
               Notification.success('Contract mined!');
               selectedIdentity.contractAddress = contract.address;
               Identity.store(selectedIdentity);
               $rootScope.progressbar.bump();
               self.init();
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

      //sign messages functions
      self.message = '';
      self.signedMessage = '';
      self.publicKey = '';

      self.signMessage = function(){
        var callback = function(data){
            //do stuff
            self.signedMessage = data;
            Notification.success("Message Signed");
          };
        Notification.primary("Signing Message");
      Verify.signMessage($rootScope.selectedIdentity.pgp, self.message, callback);
      //set the public key to the message block
      self.publicKey = $rootScope.selectedIdentity.pgp.toPublic().armor();
      };

      self.verifyMessage = function() {
        var callback = function(result){
          if(result.signatures[0].valid){
            Notification.success("Message Verified");
          } else {
            Notification.error("Message Invalid");
          }
          };
        Verify.verifyMessage(self.publicKey, self.signedMessage, callback);
      };

      self.dateConverter = function(dateString){
        return new Date(dateString);
      };



  });
